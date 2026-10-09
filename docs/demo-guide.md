# End-to-End Walkthrough & Demo Guide

## 1. Quick Launch

### Terminal 1: Launch FastAPI Backend Server
```bash
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation is accessible at `http://localhost:8000/docs`.

### Terminal 2: Launch Next.js Web Dashboard
```bash
cd apps/web
npm run dev
```
The web application is live at `http://localhost:3000`.

---

## 2. Interactive CLI Demonstration

To run an automated command-line demonstration of a full multi-node training round:
```bash
python -m ml.federated.demo_runner
```

### Expected Output Sequence:
1. **Model Baseline**: Displays initial `Pneumonia-Biomarker-v1` weights hash and baseline accuracy.
2. **Local Edge Training**:
   - Hospital Alpha (300 samples, RTX 4090)
   - Hospital Beta (240 samples, A100)
   - Clinic Gamma (180 samples, T4)
   - Invariant: Zero raw samples leave client memory.
3. **zkML Proof Generation**: ONNX model witness trace synthesized into Halo2/KZG SNARK proofs over BN254 scalar field.
4. **Arbitrum Verification**: ZKVerifier.sol executes pairing check; ModelRegistry.sol records new hash CID.
5. **Cross-Chain Relayer**: Verification event routed to Solana program.
6. **Solana Settlement**: Dynamic rewards computed and deposited into contributor wallets.
7. **FedAvg Aggregation**: Norm clipping & statistical outlier filtering updates global baseline model.
8. **AI Passport**: Contributor reputation score increases and tier advances.

---

## 3. UI Dashboard Walkthrough

1. Open `http://localhost:3000` in your browser.
2. **Main Dashboard (`/`)**:
   - Observe real-time stats: Active Contributors, Global Accuracy, Total Rewards, and Arbitrum/Solana/Zcash status badges.
   - Click **Run Training Round** to trigger an on-demand federated cycle.
3. **Training Page (`/training`)**:
   - Watch the live 6-step visual execution pipeline.
   - Inspect the training round history table with loss and accuracy gains.
4. **Contributions Page (`/contributions`)**:
   - Examine submitted parameter update hashes, proof hashes, and dual-chain transaction IDs.
5. **ZK Proofs Page (`/proofs`)**:
   - Select any generated proof to inspect the 14,208 circuit constraints and BN254 scalar field public input commitments.
6. **Rewards Page (`/rewards`)**:
   - Test the interactive formula simulator to see how hardware tier, loss reduction, and proof validity affect token payouts.
7. **AI Passport Page (`/passport`)**:
   - View the Soulbound Web3 reputation card, verified round counters, and tier badges.
8. **Network Architecture (`/network`)**:
   - Review the multi-chain tripartite architecture separating trust (Arbitrum), compute/incentives (Solana), and zero-knowledge privacy (Zcash reference).
9. **Compute Providers (`/providers`)**:
   - Check registered edge nodes, VRAM specifications, and status.
