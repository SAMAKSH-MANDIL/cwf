"""
Decentralized Verifiable AI Network - SQLAlchemy Database Schema
Tracks off-chain state, model lineage, contributions, proofs, and cross-chain events.
Blockchain is used for trust-critical events and provenance; database stores indexing metadata.
"""

import time
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class ModelRecord(Base):
    __tablename__ = "models"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    current_version = Column(Integer, default=1)
    current_hash = Column(String(66), nullable=False)
    storage_cid = Column(String(128), nullable=False)
    architecture = Column(String(64), default="DiagnosticNet-MLP-16x32x16x2")
    parameters_count = Column(Integer, default=1106)
    benchmark_accuracy = Column(Float, default=0.0)
    benchmark_loss = Column(Float, default=0.0)
    created_at = Column(Integer, default=lambda: int(time.time()))
    updated_at = Column(Integer, default=lambda: int(time.time()))

    rounds = relationship("TrainingRoundRecord", back_populates="model")


class TrainingRoundRecord(Base):
    __tablename__ = "training_rounds"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_id = Column(String(64), ForeignKey("models.id"), nullable=False)
    round_number = Column(Integer, nullable=False)
    base_model_hash = Column(String(66), nullable=False)
    new_model_hash = Column(String(66), nullable=False)
    storage_cid = Column(String(128), nullable=False)
    arbitrum_tx_hash = Column(String(66), nullable=True)
    accuracy_before = Column(Float, default=0.0)
    accuracy_after = Column(Float, default=0.0)
    loss_before = Column(Float, default=0.0)
    loss_after = Column(Float, default=0.0)
    participating_nodes = Column(Integer, default=0)
    accepted_nodes = Column(Integer, default=0)
    duration_sec = Column(Float, default=0.0)
    created_at = Column(Integer, default=lambda: int(time.time()))

    model = relationship("ModelRecord", back_populates="rounds")
    contributions = relationship("ContributionRecord", back_populates="training_round")


class ContributionRecord(Base):
    __tablename__ = "contributions"

    id = Column(String(64), primary_key=True)
    contributor_address = Column(String(42), nullable=False)
    contributor_name = Column(String(128), nullable=False)
    model_id = Column(String(64), nullable=False)
    round_id = Column(Integer, ForeignKey("training_rounds.id"), nullable=False)
    update_hash = Column(String(66), nullable=False)
    proof_hash = Column(String(66), nullable=False)
    delta_norm = Column(Float, default=0.0)
    samples_count = Column(Integer, default=0)
    accuracy_gain = Column(Float, default=0.0)
    loss_reduction = Column(Float, default=0.0)
    verification_status = Column(String(32), default="PENDING")  # VERIFIED, REJECTED, PENDING
    arbitrum_tx_hash = Column(String(66), nullable=True)
    solana_tx_signature = Column(String(90), nullable=True)
    reward_tokens = Column(Float, default=0.0)
    created_at = Column(Integer, default=lambda: int(time.time()))

    training_round = relationship("TrainingRoundRecord", back_populates="contributions")
    proof = relationship("ProofRecord", back_populates="contribution", uselist=False)


class ProofRecord(Base):
    __tablename__ = "proofs"

    id = Column(String(64), primary_key=True)
    contribution_id = Column(String(64), ForeignKey("contributions.id"), nullable=False)
    circuit_name = Column(String(64), default="DiagnosticNet-ONNX-Halo2")
    proof_hash = Column(String(66), nullable=False)
    proof_hex = Column(Text, nullable=False)
    public_inputs = Column(JSON, nullable=False)
    constraints_count = Column(Integer, default=14208)
    proving_scheme = Column(String(64), default="KZG-Halo2/EZKL")
    duration_sec = Column(Float, default=0.0)
    is_valid = Column(Boolean, default=True)
    verification_message = Column(String(256), nullable=True)
    created_at = Column(Integer, default=lambda: int(time.time()))

    contribution = relationship("ContributionRecord", back_populates="proof")


class ComputeProviderRecord(Base):
    __tablename__ = "compute_providers"

    wallet_address = Column(String(42), primary_key=True)
    device_name = Column(String(128), nullable=False)
    hardware_tier = Column(String(32), default="T4")
    vram_gb = Column(Integer, default=16)
    reputation_score = Column(Integer, default=10)
    total_contributions = Column(Integer, default=0)
    total_rewards_earned = Column(Float, default=0.0)
    active = Column(Boolean, default=True)
    last_heartbeat = Column(Integer, default=lambda: int(time.time()))


class PassportRecord(Base):
    __tablename__ = "passport_records"

    wallet_address = Column(String(42), primary_key=True)
    tier = Column(String(32), default="Novice")  # Novice, Bronze, Silver, Gold, Platinum
    reputation_score = Column(Integer, default=10)
    verified_contributions = Column(Integer, default=0)
    training_rounds = Column(Integer, default=0)
    models_contributed = Column(Integer, default=0)
    total_rewards = Column(Float, default=0.0)
    registered_at = Column(Integer, default=lambda: int(time.time()))
    last_active = Column(Integer, default=lambda: int(time.time()))


class BlockchainTransactionRecord(Base):
    __tablename__ = "blockchain_transactions"

    id = Column(String(90), primary_key=True)
    chain = Column(String(32), nullable=False)  # ARBITRUM, SOLANA
    tx_type = Column(String(64), nullable=False)  # ZK_VERIFY, REWARD_DISBURSED, MODEL_REGISTRY
    from_address = Column(String(64), nullable=True)
    to_address = Column(String(64), nullable=True)
    block_or_slot = Column(Integer, default=0)
    status = Column(String(32), default="CONFIRMED")
    payload = Column(JSON, nullable=True)
    created_at = Column(Integer, default=lambda: int(time.time()))
