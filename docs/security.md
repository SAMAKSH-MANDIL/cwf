# Security Model & Threat Matrix

## 1. Threat Matrix & Mitigations

| Threat Vector | Attack Mechanism | Mitigation in Decentralized AI Network |
| :--- | :--- | :--- |
| **Data Leakage** | Eavesdropping, central database breach, untrusted aggregator | Raw datasets **never leave the client device**. Only cryptographic parameter gradients are shared. |
| **Free-Riding** | Submitting dummy/reused model weights to farm rewards | zkML proofs require a valid execution trace over input batches matching the commitment hash. |
| **Model Poisoning** | Malicious nodes submitting extreme gradients to invert weights | **Robust FedAvg Aggregation**: Norm clipping ($\|\Delta W\| \le \tau$) and statistical outlier rejection (coordinate-wise median / trimmed mean). |
| **Replay Attacks** | Re-submitting an older valid proof in future rounds | Public inputs bind `modelId`, `roundId`, `contributorAddress`, and `nonce`. Contracts reject reused round submissions. |
| **Sybil Attack** | Spawning hundreds of fake identities to manipulate consensus | Solana Compute Registry requires staking or minimum reputation threshold in AI Passport before eligibility. |
| **Smart Contract Reentrancy** | Malicious contracts intercepting payouts or registry calls | Usage of OpenZeppelin `ReentrancyGuard`, checks-effects-interactions pattern, and `Pausable` emergency stops. |
| **Cross-Chain Relay Tampering** | Forging false Arbitrum verification events on Solana | Relayer cryptographic signature verification and dual-anchoring of Arbitrum transaction receipts on Solana. |

---

## 2. Robust Federated Aggregation Design

To protect the global model against adversarial updates, the aggregation engine implements two defenses:

1. **Norm Clipping**:
   $$\Delta W_i' = \Delta W_i \cdot \min\left(1, \frac{C}{\|\Delta W_i\|_2}\right)$$
   Ensures no single participant can disproportionately bias the global model.

2. **Distance-Based Outlier Filtering**:
   For all submitted updates $\{\Delta W_1, \dots, \Delta W_k\}$, compute pairwise Euclidean distances:
   $$s_i = \sum_{j \neq i} \|\Delta W_i - \Delta W_j\|_2$$
   Filter out updates whose distance metric deviates by more than $2\sigma$ from the median score.
