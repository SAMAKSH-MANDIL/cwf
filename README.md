# Decentralized Verifiable AI Network

> A decentralized AI network where devices and organizations collaboratively train machine-learning models through Federated Learning without sharing private data. Zero-Knowledge proofs verify that specified ML computations were performed correctly, while blockchain infrastructure provides verifiable provenance, contributor identity, coordination, and incentives.

---

## 🏛️ Tripartite Architecture

- **Arbitrum (EVM Layer 2)**: ZK proof verification (`ZKVerifier.sol`), model version lineage registry (`ModelRegistry.sol`), tamper-proof training round ledger (`ContributionRegistry.sol`), and Soulbound reputation badges (`AIPassport.sol`).
- **Solana (High-Throughput State Machine)**: Compute provider registry, dynamic reward engine scoring $\text{Reward} = \text{Quality} \times \text{Validity} \times \text{ComputeTier} \times \text{Utility}$, anti-Sybil protection, and token incentives.
- **Zcash (Cryptographic Reference Pavilion)**: Foundational reference proving the validity of zero-knowledge privacy in production-grade decentralized systems. Raw data stays shielded at the client edge, while cryptographic validity is verified network-wide.

---

## ⚡ Key Highlights

1. **Zero Data Leakage**: Raw datasets ($\mathcal{D}_i$) never leave participant hardware. Only model updates ($\Delta W$) and cryptographic proofs ($\pi$) are broadcast.
2. **Computational Integrity (zkML)**: Validates model architecture execution, quantization parameters, and gradient updates through ONNX and EZKL / Halo2 principles.
3. **Poisoning-Resistant Aggregator**: Built-in norm clipping and distance-based outlier rejection defend the global model against adversarial attacks.
4. **Cross-Chain Relay**: Seamlessly bridges verified Arbitrum computation events to Solana reward distributions.
5. **Next.js & Glassmorphic Dashboard**: Real-time telemetry, interactive training round visualizer, passport explorer, and multi-chain status indicators.

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+ (PyTorch, FastAPI, ONNX, NumPy)
- Node.js 18+ (Next.js 14, Tailwind CSS)
- Optional: Docker & Docker Compose

### 2. Run the End-to-End Demo
```bash
# 1. Start the FastAPI coordinator & backend
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload

# 2. Run the simulated 3-node federated learning + zkML pipeline
python -m ml.federated.demo_runner

# 3. Start the Next.js Frontend
cd apps/web && npm install && npm run dev
```

Visit `http://localhost:3000` to interact with the live network dashboard.
