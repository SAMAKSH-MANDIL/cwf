
# Architecture Specification: Decentralized Verifiable AI Network

## 1. Executive Summary

Traditional collaborative machine learning forces participating organizations (e.g., hospitals, research institutes, enterprise data silos) to surrender data sovereignty by transmitting raw training records to a centralized compute cluster. This creates severe regulatory non-compliance (HIPAA, GDPR), data theft vulnerabilities, and single points of failure.

The **Decentralized Verifiable AI Network** resolves this trilemma by coupling:
1. **Federated Learning (FL)**: Keeps raw data localized on edge nodes; only model parameter updates ($\Delta W$) are shared.
2. **Zero-Knowledge Machine Learning (zkML)**: Produces succinct cryptographic proofs that local gradient updates were derived from valid forward-backward passes on agreed model architectures without leaking input samples.
3. **Multi-Chain Blockchain Infrastructure**:
   - **Arbitrum**: High-assurance verification layer for zk-SNARK proofs, model lineage hashes, and Soulbound AI Contributor Passports.
   - **Solana**: High-throughput layer for decentralized compute registry, real-time contribution tracking, anti-Sybil protection, and micro-incentive disbursement.
   - **Zcash**: The cryptographic and privacy pavilion demonstrating zero-knowledge proofs for shielded transactions, providing the foundational cryptographic reference for zero-knowledge ML verification.

---

## 2. High-Level Component Diagram

```text
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                             PARTICIPANT NODES                               │
 │                                                                             │
 │  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
 │  │ Hospital A (Node 1)   │ │ Hospital B (Node 2)   │ │ Clinic C (Node 3)  │ │
 │  │ - Private Patient EHR │ │ - Private Patient EHR │ │ - Medical Telemetry│ │
 │  │ - Local PyTorch Train │ │ - Local PyTorch Train │ │ - Local Train      │ │
 │  │ - ONNX & zkML Prover  │ │ - ONNX & zkML Prover  │ │ - ONNX & Prover    │ │
 │  └───────────┬───────────┘ └───────────┬───────────┘ └──────────┬─────────┘ │
 └──────────────┼─────────────────────────┼────────────────────────┼───────────┘
                │                         │                        │
       Model Update + Proof      Model Update + Proof     Model Update + Proof
                │                         │                        │
                ▼                         ▼                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                      ARBITRUM ONE / ARBITRUM SEPOLIA                        │
 │                                                                             │
 │  ┌─────────────────────────┐                 ┌───────────────────────────┐  │
 │  │    ZKVerifier.sol       │                 │     ModelRegistry.sol     │  │
 │  │ - Verifies Groth16/EZKL │                 │ - Global Model ID & CID   │  │
 │  │ - Validates Public Hash │                 │ - Version Lineage History │  │
 │  └───────────┬─────────────┘                 └─────────────┬─────────────┘  │
 │              │                                             │                │
 │              ▼                                             │                │
 │  ┌─────────────────────────┐                 ┌─────────────▼─────────────┐  │
 │  │ ContributionRegistry.sol│                 │      AIPassport.sol       │  │
 │  │ - Records Verified Hash │                 │ - Soulbound Reputation    │  │
 │  │ - Prevents Double-Spend │                 │ - Contributor Badges      │  │
 │  └───────────┬─────────────┘                 └───────────────────────────┘  │
 └──────────────┼──────────────────────────────────────────────────────────────┘
                │
         Verification Event
                │
                ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         FASTAPI BACKEND & RELAYER                           │
 │                                                                             │
 │  ┌─────────────────────────┐                 ┌───────────────────────────┐  │
 │  │   FL Coordinator &      │                 │    Cross-Chain Relayer    │  │
 │  │   FedAvg Aggregator     │                 │ - Listens to Arbitrum Evt │  │
 │  │ - Poisoning Filter      │                 │ - Dispatches to Solana    │  │
 │  │ - Norm Clipping         │                 │                           │  │
 │  └───────────┬─────────────┘                 └─────────────┬─────────────┘  │
 └──────────────┼─────────────────────────────────────────────┼────────────────┘
                │                                             │
      Aggregated New Model                               Reward Call
                │                                             │
                ▼                                             ▼
 ┌────────────────────────────┐                 ┌──────────────────────────────┐
 │    STORAGE LAYER           │                 │       SOLANA NETWORK         │
 │ - IPFS / Decentralized S3  │                 │                              │
 │ - Global Model Checkpoints │                 │ ┌──────────────────────────┐ │
 │ - Proof Artifacts Archive  │                 │ │  Compute Registry        │ │
 └────────────────────────────┘                 │ │  - Device Spec & Tiers   │ │
                                                │ └──────────────────────────┘ │
                                                │ ┌──────────────────────────┐ │
                                                │ │  Reward Engine           │ │
                                                │ │  - Dynamic Score Formula │ │
                                                │ │  - Token Disbursement    │ │
                                                │ └──────────────────────────┘ │
                                                └──────────────────────────────┘
```

---

## 3. Data Flow & Cryptographic Invariants

1. **Local Privacy Invariant**: $\mathcal{D}_i$ (the private dataset of node $i$) never crosses the boundary of the client node. No network socket, log, or checkpoint contains unencrypted patient or raw sensor records.
2. **Computational Integrity Invariant**: The zkML proof $\pi_i$ guarantees that:
   $$\text{Verify}(\text{vk}, \pi_i, \vec{x}_{\text{pub}}) = 1 \iff \Delta W_i = \mathcal{M}(W_0, \mathcal{D}_i)$$
   where $\vec{x}_{\text{pub}}$ binds the global baseline model hash $\mathcal{H}(W_0)$, the update hash $\mathcal{H}(\Delta W_i)$, and client nonces.
3. **Dual-Chain Partition of Concerns**:
   - Arbitrum guarantees EVM-compatible formal proof verification, immutable model history, and cryptographic identity.
   - Solana provides ultra-low latency, high-throughput coordination for compute heartbeats, multi-node telemetry, and real-time incentive token distributions.
   - Zcash serves as the foundational privacy and zero-knowledge reference pavilion, demonstrating production zk-SNARK execution.
