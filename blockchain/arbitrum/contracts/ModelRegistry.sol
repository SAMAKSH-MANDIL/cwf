// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ModelRegistry
 * @notice Immutable on-chain registry for AI models and training round provenance on Arbitrum.
 * CRITICAL: Stores ONLY cryptographic hashes and decentralized storage CIDs, never weights.
 */
contract ModelRegistry {
    enum ModelStatus { Training, Active, Deprecated }

    struct ModelMetadata {
        bytes32 modelId;
        uint256 version;
        bytes32 modelHash;
        string storageCID;
        address creator;
        uint256 timestamp;
        ModelStatus status;
        uint256 totalRounds;
    }

    struct RoundRecord {
        uint256 roundId;
        bytes32 baseHash;
        bytes32 newHash;
        string storageCID;
        uint256 timestamp;
        uint256 totalContributions;
    }

    address public owner;
    mapping(bytes32 => ModelMetadata) public models;
    mapping(bytes32 => mapping(uint256 => RoundRecord)) public modelRounds;
    bytes32[] public modelList;

    event ModelRegistered(
        bytes32 indexed modelId,
        uint256 indexed version,
        bytes32 modelHash,
        string storageCID,
        address indexed creator
    );

    event RoundCompleted(
        bytes32 indexed modelId,
        uint256 indexed roundId,
        bytes32 baseHash,
        bytes32 newHash,
        string storageCID,
        uint256 totalContributions
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner permitted");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerModel(
        bytes32 _modelId,
        bytes32 _initialModelHash,
        string calldata _storageCID
    ) external {
        require(models[_modelId].creator == address(0), "Model already registered");
        require(_initialModelHash != bytes32(0), "Invalid model hash");
        require(bytes(_storageCID).length > 0, "Invalid storage CID");

        models[_modelId] = ModelMetadata({
            modelId: _modelId,
            version: 1,
            modelHash: _initialModelHash,
            storageCID: _storageCID,
            creator: msg.sender,
            timestamp: block.timestamp,
            status: ModelStatus.Training,
            totalRounds: 0
        });

        modelList.push(_modelId);

        emit ModelRegistered(_modelId, 1, _initialModelHash, _storageCID, msg.sender);
    }

    function recordRoundCompletion(
        bytes32 _modelId,
        uint256 _roundId,
        bytes32 _baseHash,
        bytes32 _newHash,
        string calldata _storageCID,
        uint256 _totalContributions
    ) external {
        require(models[_modelId].creator != address(0), "Model not found");
        require(_newHash != bytes32(0), "Invalid new hash");

        ModelMetadata storage m = models[_modelId];
        m.modelHash = _newHash;
        m.storageCID = _storageCID;
        m.version += 1;
        m.totalRounds = _roundId;

        modelRounds[_modelId][_roundId] = RoundRecord({
            roundId: _roundId,
            baseHash: _baseHash,
            newHash: _newHash,
            storageCID: _storageCID,
            timestamp: block.timestamp,
            totalContributions: _totalContributions
        });

        emit RoundCompleted(_modelId, _roundId, _baseHash, _newHash, _storageCID, _totalContributions);
    }

    function getModelCount() external view returns (uint256) {
        return modelList.length;
    }

    function getModel(bytes32 _modelId) external view returns (ModelMetadata memory) {
        return models[_modelId];
    }
}
