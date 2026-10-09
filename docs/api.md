# FastAPI Backend API Documentation

## 1. Overview
The FastAPI backend server acts as the network coordinator and state indexing layer. It manages federated rounds, records proof metadata, interfaces with Arbitrum and Solana, and provides REST telemetry for the dashboard.

Base URL: `http://localhost:8000`

---

## 2. Endpoints Reference

### Dashboard & Status
- `GET /api/network/stats`
  - Returns high-level network KPIs: active contributors, total rounds, verified zkML proofs, global accuracy, total Solana rewards, and dual-chain connection statuses.

### Models
- `GET /api/models`
  - Returns list of registered AI models, current versions, and IPFS storage hashes.
- `GET /api/models/{model_id}`
  - Returns complete round history and parameter lineage for a given model.

### Training & Orchestration
- `GET /api/training/rounds`
  - Returns round-by-round metrics (loss before/after, accuracy deltas, participating nodes).
- `POST /api/training/run-round` or `POST /api/demo/run-round`
  - Dispatches an automated end-to-end federated training round:
    1. Local edge training
    2. zkML proof generation
    3. Arbitrum EVM smart contract verification
    4. Cross-chain relayer event bridging
    5. Solana reward token disbursement
    6. Robust FedAvg aggregation

### Contributions & Proofs
- `GET /api/contributions`
  - Returns ledger of model update hashes, delta norms, verification badges, and dual-chain transaction IDs.
- `GET /api/proofs`
  - Returns cryptographic zkML proofs, circuit constraint counts, and BN254 scalar field public input commitments.
- `POST /api/verification/verify`
  - Manually tests a proof payload against public inputs.

### Solana Rewards
- `GET /api/rewards`
  - Returns recent confirmed token disbursements and transaction signatures on Solana.

### AI Contributor Passport
- `GET /api/passport` or `GET /api/passport/{wallet_address}`
  - Returns Soulbound reputation score, tier (Platinum/Gold/Silver/Bronze/Novice), verified rounds, and active model count.

### Compute Providers
- `GET /api/providers`
  - Returns hardware tiers (RTX 4090, A100, T4, EdgeDevice), VRAM, and status.
