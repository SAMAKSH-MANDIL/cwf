"""
Unit tests for Solana Program Service Layer.
Validates:
1. Compute provider registration
2. Dynamic reward calculation formula
3. Duplicate reward / double-claim prevention (Anti-Sybil)
4. Proof-validity gating (unverified contributions receive 0 reward)
"""

import unittest
from blockchain.solana.solana_service import SolanaRewardService


class TestSolanaService(unittest.TestCase):

    def setUp(self):
        self.service = SolanaRewardService()
        self.contributor = "0x71C66336071ffd4e773E34dac3Ca0A6688211eef"
        self.model_id = "Pneumonia-v1"

    def test_provider_registration(self):
        """Provider must be properly registered with hardware tier."""
        p = self.service.get_provider_profile(self.contributor)
        self.assertIsNotNone(p)
        self.assertEqual(p["hardware_tier"], "RTX4090")

    def test_dynamic_reward_calculation(self):
        """Valid proof must trigger positive token disbursement scaled by compute tier."""
        res = self.service.process_arbitrum_verified_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=1,
            loss_reduction=0.45,
            proof_valid=True,
        )
        self.assertTrue(res["success"])
        self.assertGreater(res["reward_amount"], 0.0)
        self.assertTrue(res["tx_signature"].endswith("1111sol"))

    def test_anti_sybil_duplicate_rejection(self):
        """Double-claiming rewards in same round must be rejected."""
        self.service.process_arbitrum_verified_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=2,
            loss_reduction=0.2,
            proof_valid=True,
        )
        dup = self.service.process_arbitrum_verified_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=2,
            loss_reduction=0.2,
            proof_valid=True,
        )
        self.assertFalse(dup["success"])
        self.assertIn("duplicate", dup["error"].lower())

    def test_invalid_proof_zero_reward(self):
        """Invalid proofs must result in 0 reward."""
        reward = self.service.calculate_reward(
            quality_score=1.0,
            proof_valid=False,
            hardware_tier="A100",
        )
        self.assertEqual(reward, 0.0)


if __name__ == "__main__":
    unittest.main()
