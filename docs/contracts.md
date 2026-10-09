# Smart Contracts & On-Chain Programs Documentation

## 1. Arbitrum EVM Smart Contracts (`blockchain/arbitrum/contracts/`)

### A. `ZKVerifier.sol`
- **Purpose**: Verifies zkML SNARK proofs on-chain.
- **Key Method**: `verify(bytes calldata proof, uint256[] calldata publicInputs) external returns (bool)`
- **Gas Invariant**: Constant gas pairing check via BN254 scalar field arithmetic.
- **Public Inputs**:
  - `publicInputs[0]`: Model base hash scalar.
  - `publicInputs[1]`: Update delta hash scalar.
  - `publicInputs[2]`: Training round integer.
  - `publicInputs[3]`: Contributor wallet scalar.
  - `publicInputs[4]`: Input witness batch polynomial commitment.
  - `publicInputs[5]`: Output logits polynomial commitment.

### B. `ModelRegistry.sol`
- **Purpose**: Immutable registry of AI model versions and decentralized storage CIDs.
- **Storage Invariant**: Weights are NEVER stored on-chain. Only SHA-256 hashes and IPFS/S3 URIs are recorded.
- **Methods**:
  - `registerModel(bytes32 _modelId, bytes32 _initialModelHash, string calldata _storageCID)`
  - `recordRoundCompletion(bytes32 _modelId, uint256 _roundId, bytes32 _baseHash, bytes32 _newHash, string calldata _storageCID, uint256 _totalContributions)`

### C. `ContributionRegistry.sol`
- **Purpose**: Verifies participant updates and prevents replay attacks.
- **Methods**:
  - `submitContribution(bytes32 _modelId, uint256 _round, bytes32 _updateHash, bytes32 _proofHash, bytes calldata _proof, uint256[] calldata _publicInputs)`
- **Events**: `ContributionVerified(bytes32 key, address contributor, bytes32 modelId, uint256 round, bytes32 updateHash, bytes32 proofHash, uint256 timestamp)`

### D. `AIPassport.sol`
- **Purpose**: Soulbound ERC-721-style reputation ledger.
- **Privacy Guarantee**: Zero PII. Tracks only wallet address, verified rounds count, models count, and dynamic reputation score (0 - 100).
- **Tiers**: Novice, Bronze (25+), Silver (50+), Gold (75+), Platinum (90+).

---

## 2. Solana Program (`blockchain/solana/programs/decentralized_ai/src/lib.rs`)

### A. Program Accounts & PDAs
1. `NetworkState`: Authority, base reward rate, total contributions counter, total rewards disbursed.
2. `ComputeProvider`: PDA derived from `[b"provider", owner.key()]`. Tracks device name, hardware tier, VRAM, and reputation score.
3. `ContributionRecord`: PDA derived from `[b"contribution", provider, model_id, round_id]`. Prevents double-spend of rewards.

### B. Incentive Distribution
Formula:
$$\text{Reward} = \text{Base} \times \frac{\text{Quality}}{10000} \times \frac{\text{ProofValidity}}{10000} \times \frac{\text{ComputeWeight}}{10000} \times \frac{\text{ModelUtility}}{10000}$$
