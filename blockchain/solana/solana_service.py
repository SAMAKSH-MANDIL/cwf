"""
Decentralized Verifiable AI Network - Solana Program Service Layer
Handles:
- Compute Provider Registry (GPU / Edge Node registration)
- Dynamic Incentive Scoring & Token Reward Disbursement
- Anti-Sybil Rate Limiting & Staking Validation
- Cross-Chain Bridge Ingestion from Arbitrum
"""

import time
import hashlib
from typing import Dict, List, Any, Optional, Tuple


class SolanaRewardService:
    """
    Solana Program Client and High-Throughput State Machine.
    Simulates Anchor Program PDAs, instruction processing, and transaction execution.
    """

    def __init__(
        self,
        rpc_url: str = "http://localhost:8899",
        program_id: str = "Compute111111111111111111111111111111111111",
        base_reward_tokens: float = 10.0,
    ):
        self.rpc_url = rpc_url
        self.program_id = program_id
        self.base_reward_tokens = base_reward_tokens

        # Hardware tier multipliers
        self.tier_multipliers = {
            "H100": 2.5,
            "A100": 2.0,
            "RTX4090": 1.5,
            "T4": 1.0,
            "EdgeDevice": 0.8,
        }

        # Simulated on-chain PDAs
        self.providers: Dict[str, Dict[str, Any]] = {}
        self.contributions: Dict[str, Dict[str, Any]] = {}
        self.total_rewards_paid = 0.0
        self.transaction_history: List[Dict[str, Any]] = []

        self._initialize_default_providers()

    def _initialize_default_providers(self):
        """Pre-registers the benchmark simulated hospital/edge nodes."""
        nodes = [
            ("0x71C66336071ffd4e773E34dac3Ca0A6688211eef", "Hospital Alpha Edge Node", "RTX4090", 24),
            ("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "Hospital Beta GPU Cluster", "A100", 80),
            ("0x90F79bf6EB2c4f870365E785982E1f101E93b906", "Clinic Gamma Micro-Server", "T4", 16),
        ]
        for wallet, name, tier, vram in nodes:
            self.register_provider(
                wallet_address=wallet,
                device_name=name,
                hardware_tier=tier,
                declared_vram_gb=vram,
            )

    def register_provider(
        self,
        wallet_address: str,
        device_name: str,
        hardware_tier: str = "T4",
        declared_vram_gb: int = 16,
    ) -> Dict[str, Any]:
        """Registers a device in the Solana Compute Provider PDA."""
        norm_addr = wallet_address.lower()
        provider_pda = f"pda_provider_{hashlib.sha256(norm_addr.encode()).hexdigest()[:16]}"

        record = {
            "provider_pda": provider_pda,
            "wallet_address": wallet_address,
            "device_name": device_name,
            "hardware_tier": hardware_tier,
            "declared_vram_gb": declared_vram_gb,
            "reputation_score": 10,
            "total_contributions": 0,
            "total_rewards_earned": 0.0,
            "active": True,
            "last_active": int(time.time()),
        }
        self.providers[norm_addr] = record
        return record

    def calculate_reward(
        self,
        quality_score: float,       # 0.0 to 1.0 (loss reduction metric)
        proof_valid: bool,          # True = 1.0, False = 0.0
        hardware_tier: str,
        model_utility: float = 1.2, # Priority task community utility
    ) -> float:
        """
        Solana dynamic reward equation:
        reward = baseReward * quality * proofValidity * computeContribution * modelUtility
        """
        validity_factor = 1.0 if proof_valid else 0.0
        tier_factor = self.tier_multipliers.get(hardware_tier, 1.0)
        clamped_quality = max(0.1, min(1.5, quality_score))

        raw_reward = (
            self.base_reward_tokens
            * clamped_quality
            * validity_factor
            * tier_factor
            * model_utility
        )
        return round(raw_reward, 4)

    def process_arbitrum_verified_contribution(
        self,
        contributor: str,
        model_id: str,
        round_id: int,
        loss_reduction: float,
        proof_valid: bool,
    ) -> Dict[str, Any]:
        """
        Invoked by the Cross-Chain Relayer when Arbitrum emits `ContributionVerified`.
        Dispatches Solana transaction, computes incentive reward, and updates provider state.
        """
        norm_addr = contributor.lower()
        if norm_addr not in self.providers:
            # Auto-register if first time
            self.register_provider(contributor, f"Device {contributor[:8]}", "T4", 16)

        provider = self.providers[norm_addr]
        tier = provider["hardware_tier"]

        # Anti-Sybil rate limit check: Ensure unique contribution per round
        contrib_key = f"{norm_addr}_{model_id}_{round_id}"
        if contrib_key in self.contributions:
            return {
                "success": False,
                "error": "Solana Anti-Sybil rejection: duplicate contribution for round.",
            }

        # Quality calculation from loss reduction
        quality = 1.0 + max(0.0, loss_reduction * 2.0)
        reward_amount = self.calculate_reward(
            quality_score=quality,
            proof_valid=proof_valid,
            hardware_tier=tier,
            model_utility=1.25,
        )

        # Generate realistic Solana transaction signature
        sig_data = f"sol_{norm_addr}_{model_id}_{round_id}_{time.time()}".encode()
        tx_signature = hashlib.sha256(sig_data).hexdigest() + "1111sol"

        # Update state
        provider["total_contributions"] += 1
        provider["total_rewards_earned"] += reward_amount
        provider["last_active"] = int(time.time())
        if proof_valid and provider["reputation_score"] < 100:
            provider["reputation_score"] += 2

        self.total_rewards_paid += reward_amount

        contrib_pda = f"pda_contrib_{hashlib.sha256(contrib_key.encode()).hexdigest()[:16]}"
        record = {
            "contribution_pda": contrib_pda,
            "contributor": contributor,
            "model_id": model_id,
            "round_id": round_id,
            "hardware_tier": tier,
            "reward_amount": reward_amount,
            "proof_valid": proof_valid,
            "tx_signature": tx_signature,
            "timestamp": int(time.time()),
            "status": "CONFIRMED",
        }
        self.contributions[contrib_key] = record
        self.transaction_history.append(record)

        return {
            "success": True,
            "reward_amount": reward_amount,
            "tx_signature": tx_signature,
            "provider_reputation": provider["reputation_score"],
            "total_rewards_paid": self.total_rewards_paid,
        }

    def get_provider_profile(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        return self.providers.get(wallet_address.lower())

    def get_all_providers(self) -> List[Dict[str, Any]]:
        return list(self.providers.values())

    def get_recent_rewards(self, limit: int = 15) -> List[Dict[str, Any]]:
        return list(reversed(self.transaction_history[-limit:]))
