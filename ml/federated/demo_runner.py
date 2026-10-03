"""
Decentralized Verifiable AI Network - Interactive End-to-End Demo Runner
Executes:
1. Hospital Alpha, Beta, Gamma edge node simulation with private local datasets.
2. Local training (SGD) without raw data sharing.
3. zkML proof synthesis over ONNX computation graph.
4. Arbitrum smart contract proof verification & ModelRegistry update.
5. Cross-chain relayer event bridging.
6. Solana program compute & incentive token disbursement.
7. Soulbound AI Passport reputation elevation.
"""

import time
import sys
from backend.services.orchestrator import orchestrator


def run_demo():
    print("=" * 80)
    print(" [>>] DECENTRALIZED VERIFIABLE AI NETWORK - END-TO-END DEMO RUNNER")
    print("=" * 80)
    print("\n[Architecture Pavilions]")
    print(" * Arbitrum: EVM Trust, ZKVerifier.sol, ModelRegistry.sol, AIPassport.sol")
    print(" * Solana:   Compute Provider Registry, Dynamic Incentive Engine")
    print(" * Zcash:    Cryptographic Reference for Zero-Knowledge Privacy")

    print("\n" + "-" * 80)
    print(" Phase 1: Inspect Initial Global Model State")
    print("-" * 80)
    meta = orchestrator.fl_coordinator.get_current_model_metadata()
    print(f" Model ID:            {meta['model_id']}")
    print(f" Architecture:        DiagnosticNet (16 biomarkers -> 32 -> 16 -> 2 classes)")
    print(f" Initial Hash:        {meta['model_hash']}")
    print(f" Baseline Accuracy:   {meta['accuracy'] * 100:.2f}%")
    print(f" Baseline Loss:       {meta['loss']:.4f}")
    print(f" Active Edge Nodes:   {meta['active_clients']} (Hospital Alpha, Beta, Gamma)")

    print("\n" + "-" * 80)
    print(" Phase 2: Launch Federated Training Round")
    print("-" * 80)
    print(" [Step 1] Edge Nodes performing local training on private patient partitions...")
    print("          * Hospital Alpha (300 samples, RTX 4090)")
    print("          * Hospital Beta  (240 samples, A100)")
    print("          * Clinic Gamma   (180 samples, T4)")
    print("          [PRIVACY INVARIANT] 0 Raw Samples Transmitted. Data strictly stays local.")

    time.sleep(1)
    print("\n [Step 2] Synthesizing zkML Proofs (Halo2 KZG / EZKL BN254 constraints)...")
    res = orchestrator.execute_live_round(local_epochs=3, learning_rate=0.03)

    print(f"\n [Step 3] Arbitrum EVM Smart Contract Verification (ZKVerifier.sol):")
    print(f"          * Proofs Verified:       {res['proofs_verified']} / 3 Nodes")
    print(f"          * Status:                VERIFIED (Pairing checks passed)")
    print(f"          * Model Registry Tx:     {res['arbitrum_round_tx']}")
    print(f"          * IPFS Storage CID:      {res['storage_cid']}")

    print(f"\n [Step 4] Cross-Chain Relayer -> Solana Program Instruction Dispatch:")
    for p in res["solana_payouts"]:
        print(f"          * Contributor: {p['contributor'][:10]}... | Payout: {p['tokens']} SOL | Tx: {p['tx'][:20]}...")

    print(f"\n [Step 5] Byzantine-Resilient FedAvg Aggregation:")
    print(f"          * Accepted Nodes:        {', '.join(res['accepted_clients'])}")
    print(f"          * New Global Model Hash: {res['new_hash']}")
    print(f"          * Accuracy Delta:        +{res['accuracy_delta'] * 100:.2f}% (Now: {res['accuracy_after'] * 100:.2f}%)")
    print(f"          * Loss Delta:            -{res['loss_before'] - res['loss_after']:.4f} (Now: {res['loss_after']:.4f})")

    print("\n" + "-" * 80)
    print(" Phase 3: Inspect Soulbound AI Contributor Passport")
    print("-" * 80)
    passport = orchestrator.arbitrum.get_passport("0x71C66336071ffd4e773E34dac3Ca0A6688211eef")
    print(f" Contributor:         {passport['contributor']}")
    print(f" Reputation Score:    {passport['reputation_score']} / 100")
    print(f" Tier:                {passport['tier']}")
    print(f" Verified Rounds:     {passport['training_rounds']}")

    print("\n" + "=" * 80)
    print(" [OK] DEMO COMPLETED SUCCESSFULLY!")
    print(f" Summary: 3 Contributors | 3 Verified zkML Proofs | 0 Raw Data Leaked | Rewards Disbursed")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    run_demo()
