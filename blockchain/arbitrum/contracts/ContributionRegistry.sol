// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IZKVerifier {
    function verify(bytes calldata proof, uint256[] calldata publicInputs) external returns (bool);
}

interface IAIPassport {
    function recordVerifiedContribution(address contributor, bytes32 modelId, uint256 round) external;
}

/**
 * @title ContributionRegistry
 * @notice Validates and records participant model updates and zkML proofs on Arbitrum.
 */
contract ContributionRegistry {
    struct Contribution {
        address contributor;
        bytes32 modelId;
        uint256 trainingRound;
        bytes32 updateHash;
        bytes32 proofHash;
        uint256 timestamp;
        bool verificationStatus;
    }

    address public owner;
    IZKVerifier public zkVerifier;
    IAIPassport public aiPassport;

    // Mapping: keccak256(contributor, modelId, round) => Contribution
    mapping(bytes32 => Contribution) public contributions;
    bytes32[] public contributionKeys;

    event ContributionVerified(
        bytes32 indexed contributionKey,
        address indexed contributor,
        bytes32 indexed modelId,
        uint256 trainingRound,
        bytes32 updateHash,
        bytes32 proofHash,
        uint256 timestamp
    );

    event ContributionRejected(
        address indexed contributor,
        bytes32 indexed modelId,
        uint256 trainingRound,
        string reason
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner permitted");
        _;
    }

    constructor(address _zkVerifier, address _aiPassport) {
        owner = msg.sender;
        zkVerifier = IZKVerifier(_zkVerifier);
        aiPassport = IAIPassport(_aiPassport);
    }

    function setZKVerifier(address _zkVerifier) external onlyOwner {
        zkVerifier = IZKVerifier(_zkVerifier);
    }

    function setAIPassport(address _aiPassport) external onlyOwner {
        aiPassport = IAIPassport(_aiPassport);
    }

    /**
     * @notice Submits a model update and zkML proof for on-chain verification.
     */
    function submitContribution(
        bytes32 _modelId,
        uint256 _trainingRound,
        bytes32 _updateHash,
        bytes32 _proofHash,
        bytes calldata _proof,
        uint256[] calldata _publicInputs
    ) external returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(msg.sender, _modelId, _trainingRound));
        require(contributions[key].timestamp == 0, "Contribution already submitted for this round");
        require(_updateHash != bytes32(0), "Invalid update hash");
        require(_proofHash != bytes32(0), "Invalid proof hash");

        // Verify with ZKVerifier
        bool isValid = zkVerifier.verify(_proof, _publicInputs);
        if (!isValid) {
            emit ContributionRejected(msg.sender, _modelId, _trainingRound, "zkML proof invalid");
            return false;
        }

        // Record verified contribution
        contributions[key] = Contribution({
            contributor: msg.sender,
            modelId: _modelId,
            trainingRound: _trainingRound,
            updateHash: _updateHash,
            proofHash: _proofHash,
            timestamp: block.timestamp,
            verificationStatus: true
        });

        contributionKeys.push(key);

        // Update contributor reputation in AIPassport if linked
        if (address(aiPassport) != address(0)) {
            try aiPassport.recordVerifiedContribution(msg.sender, _modelId, _trainingRound) {} catch {}
        }

        emit ContributionVerified(
            key,
            msg.sender,
            _modelId,
            _trainingRound,
            _updateHash,
            _proofHash,
            block.timestamp
        );

        return true;
    }

    function getContribution(bytes32 _key) external view returns (Contribution memory) {
        return contributions[_key];
    }

    function getTotalContributions() external view returns (uint256) {
        return contributionKeys.length;
    }
}
