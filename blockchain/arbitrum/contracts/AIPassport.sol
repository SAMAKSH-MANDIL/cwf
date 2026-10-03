// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AIPassport
 * @notice Soulbound Contributor Reputation & Achievement Registry on Arbitrum.
 * Privacy Invariant: NEVER stores personal identifiable information (PII).
 * Tracks verified cryptographic contributions, rounds, models, and reputation score.
 */
contract AIPassport {
    enum ContributorTier { Novice, Bronze, Silver, Gold, Platinum }

    struct PassportData {
        address contributor;
        uint256 verifiedContributions;
        uint256 trainingRounds;
        uint256 modelsContributed;
        uint256 reputationScore; // Scaled 0 to 100
        ContributorTier tier;
        uint256 registeredAt;
        uint256 lastActiveAt;
    }

    address public owner;
    address public contributionRegistry;

    mapping(address => PassportData) public passports;
    mapping(address => mapping(bytes32 => bool)) public contributedModels;
    address[] public contributorList;

    event PassportCreated(address indexed contributor, uint256 timestamp);
    event ReputationUpdated(
        address indexed contributor,
        uint256 newScore,
        uint256 totalContributions,
        ContributorTier tier
    );

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || msg.sender == contributionRegistry,
            "Unauthorized caller"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setContributionRegistry(address _registry) external {
        require(msg.sender == owner, "Only owner permitted");
        contributionRegistry = _registry;
    }

    function registerContributor(address _contributor) public returns (bool) {
        if (passports[_contributor].registeredAt != 0) {
            return false;
        }

        passports[_contributor] = PassportData({
            contributor: _contributor,
            verifiedContributions: 0,
            trainingRounds: 0,
            modelsContributed: 0,
            reputationScore: 10, // Starting baseline
            tier: ContributorTier.Novice,
            registeredAt: block.timestamp,
            lastActiveAt: block.timestamp
        });

        contributorList.push(_contributor);
        emit PassportCreated(_contributor, block.timestamp);
        return true;
    }

    function recordVerifiedContribution(
        address _contributor,
        bytes32 _modelId,
        uint256 _round
    ) external onlyAuthorized {
        if (passports[_contributor].registeredAt == 0) {
            registerContributor(_contributor);
        }

        PassportData storage p = passports[_contributor];
        p.verifiedContributions += 1;
        p.trainingRounds += 1;
        p.lastActiveAt = block.timestamp;

        if (!contributedModels[_contributor][_modelId]) {
            contributedModels[_contributor][_modelId] = true;
            p.modelsContributed += 1;
        }

        // Dynamic reputation scoring formula
        // Score = min(100, 10 + (verified * 3) + (models * 5))
        uint256 calculated = 10 + (p.verifiedContributions * 3) + (p.modelsContributed * 5);
        if (calculated > 100) {
            p.reputationScore = 100;
        } else {
            p.reputationScore = calculated;
        }

        // Determine tier
        if (p.reputationScore >= 90) {
            p.tier = ContributorTier.Platinum;
        } else if (p.reputationScore >= 75) {
            p.tier = ContributorTier.Gold;
        } else if (p.reputationScore >= 50) {
            p.tier = ContributorTier.Silver;
        } else if (p.reputationScore >= 25) {
            p.tier = ContributorTier.Bronze;
        } else {
            p.tier = ContributorTier.Novice;
        }

        emit ReputationUpdated(_contributor, p.reputationScore, p.verifiedContributions, p.tier);
    }

    function getPassport(address _contributor) external view returns (PassportData memory) {
        return passports[_contributor];
    }

    function getTotalContributors() external view returns (uint256) {
        return contributorList.length;
    }
}
