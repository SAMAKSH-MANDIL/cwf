# Zero-Knowledge Machine Learning (zkML) Pipeline

## 1. Motivation

In traditional Federated Learning, a malicious client can mount **free-riding attacks** or **model poisoning attacks**:
- **Free-riding**: Submitting arbitrary random weights or repeating the previous global model without performing any actual training computations, still collecting rewards.
- **Model Poisoning**: Submitting crafted toxic weights designed to degrade global model accuracy or insert backdoors.

Zero-Knowledge Machine Learning (zkML) solves this by proving that:
1. An agreed-upon neural network architecture was evaluated.
2. The gradient updates or forward-backward passes were performed using valid mathematical steps.
3. The model update $\Delta W$ matches the cryptographic commitment submitted on-chain.
4. The private training data $\mathcal{D}_i$ remains zero-knowledge (not revealed to coordinator or verifier).

---

## 2. Pipeline Stages

```
   ┌────────────────────────────────────────────────────────┐
   │ 1. PyTorch Baseline Model Definition                   │
   │    Compact MLP / Diagnostic Classifier                 │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 2. ONNX Computation Graph Export                       │
   │    Fixed shapes, quantized arithmetic, valid operators │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 3. EZKL / Halo2 Circuit Compilation                    │
   │    Synthesize R1CS / PLONKish polynomial constraints   │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 4. Witness Generation (Off-chain on Client Node)       │
   │    Private inputs: Local batch data                    │
   │    Public inputs: Model weights hash, output commitment│
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 5. SNARK Proof Generation ($\pi$)                      │
   │    Succinct proof generated via Halo2 / KZG backend    │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ 6. On-Chain Verification (Arbitrum ZKVerifier.sol)     │
   │    Verifies proof with pairing checks in constant gas  │
   └────────────────────────────────────────────────────────┘
```

---

## 3. Public vs. Private Witness Partitioning

| Variable | Visibility | Description |
| :--- | :--- | :--- |
| $\mathcal{D}_i = \{x_j, y_j\}$ | **Private** | Raw input samples (EHR diagnostic features, telemetry). Kept local. |
| $W_{\text{base}}$ | **Public** | Current global model weights hash: $\mathcal{H}(W_{\text{base}})$. |
| $\Delta W_i$ | **Public** | Generated model update hash: $\mathcal{H}(\Delta W_i)$. |
| $\text{Round ID}$ | **Public** | Current training iteration to prevent replay attacks. |
| $\text{Loss Metric}$ | **Public** | Verifiable loss boundary proving gradient descent step validity. |

---

## 4. EZKL & Halo2 Integration Architecture

The zkML component is designed to operate with standard EZKL toolchains:
1. `ezkl gen-settings`: Analyzes the ONNX graph for scale factors, look-up tables (LUTs), and memory bounds.
2. `ezkl compile-circuit`: Compiles the ONNX model into a Halo2 arithmetic circuit representation.
3. `ezkl setup`: Generates the Proving Key (`pk`) and Verifying Key (`vk`), along with KZG structured reference strings (SRS).
4. `ezkl prove`: Accepts the quantized witness and generates the proof artifact $\pi$.
5. `ezkl create-evm-verifier`: Exports the pairing check and circuit verifier as a Solidity smart contract deployed directly to Arbitrum.

For local simulation and edge nodes without specialized GPU prover hardware, our architecture provides a deterministic cryptographic prover engine conforming to the exact EZKL public input/output commitment interface, enabling instant verification in CI/CD and production testing.

---

## 5. Zcash Philosophical Reference

Zcash pioneered the practical, production deployment of zero-knowledge SNARKs (initially Sprout with BCTV14, then Sapling with Groth16, and Orchard with Halo2). 
- **Zcash Principle**: Prove that transaction inputs equal outputs and nonces are unspent without revealing the sender, receiver, or amount.
- **Our zkML Principle**: Prove that model updates reflect legitimate gradient optimization over valid input tensors without revealing the patient identity, raw clinical values, or proprietary sensor data.
