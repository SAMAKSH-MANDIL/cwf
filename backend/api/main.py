"""
Decentralized Verifiable AI Network - FastAPI Backend Server
Provides comprehensive REST endpoints for:
- Main Dashboard Telemetry
- Models Registry & Provenance Lineage
- Training Rounds & Coordinator Dispatch
- Contributions & Cryptographic Updates
- zkML Proofs & Constraint Verification
- Solana Rewards & Tokenomics
- AI Contributor Passport
- Compute Providers
- Interactive Live Training Round Demo
"""

import os
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.session import get_db, init_db
from backend.database.models import (
    ModelRecord,
    TrainingRoundRecord,
    ContributionRecord,
    ProofRecord,
    ComputeProviderRecord,
    PassportRecord,
    BlockchainTransactionRecord,
)
from backend.services.orchestrator import orchestrator

app = FastAPI(
    title="Decentralized Verifiable AI Network API",
    description="Decentralized Federated Learning with Zero-Knowledge ML Proofs and Multi-Chain Infrastructure (Arbitrum, Solana, Zcash Pavilion).",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


# -------------------------------------------------------------
# Main Dashboard & Network Status
# -------------------------------------------------------------
@app.get("/api/network/stats")
def get_network_stats():
    """Returns aggregated high-level network statistics and chain status."""
    return orchestrator.get_network_dashboard_stats()


# -------------------------------------------------------------
# Models
# -------------------------------------------------------------
@app.get("/api/models")
def get_models(db: Session = Depends(get_db)):
    """Returns catalog of registered AI models and versions."""
    models = db.query(ModelRecord).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "description": m.description,
            "version": m.current_version,
            "model_hash": m.current_hash,
            "storage_cid": m.storage_cid,
            "architecture": m.architecture,
            "parameters_count": m.parameters_count,
            "benchmark_accuracy": round(m.benchmark_accuracy * 100, 2),
            "benchmark_loss": round(m.benchmark_loss, 4),
            "created_at": m.created_at,
        }
        for m in models
    ]


@app.get("/api/models/{model_id}")
def get_model_detail(model_id: str, db: Session = Depends(get_db)):
    """Returns detailed model record with complete training round lineage."""
    m = db.query(ModelRecord).filter_by(id=model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")

    rounds = (
        db.query(TrainingRoundRecord)
        .filter_by(model_id=model_id)
        .order_by(TrainingRoundRecord.round_number.asc())
        .all()
    )

    return {
        "id": m.id,
        "name": m.name,
        "description": m.description,
        "version": m.current_version,
        "model_hash": m.current_hash,
        "storage_cid": m.storage_cid,
        "architecture": m.architecture,
        "parameters_count": m.parameters_count,
        "benchmark_accuracy": round(m.benchmark_accuracy * 100, 2),
        "benchmark_loss": round(m.benchmark_loss, 4),
        "rounds_history": [
            {
                "round_number": r.round_number,
                "base_model_hash": r.base_model_hash,
                "new_model_hash": r.new_model_hash,
                "storage_cid": r.storage_cid,
                "accuracy_after": round(r.accuracy_after * 100, 2),
                "loss_after": round(r.loss_after, 4),
                "arbitrum_tx": r.arbitrum_tx_hash,
                "participating_nodes": r.participating_nodes,
                "created_at": r.created_at,
            }
            for r in rounds
        ],
    }


class UpdateArchitectureRequest(BaseModel):
    hidden_layers: List[int]


@app.get("/api/model/architecture")
def get_model_architecture():
    """Returns current neural network architecture and hidden layer specifications."""
    return orchestrator.get_model_architecture()


@app.post("/api/model/architecture")
def update_model_architecture(payload: UpdateArchitectureRequest):
    """Dynamically reconfigures neural network hidden layers and synchronizes edge nodes."""
    try:
        return orchestrator.update_model_architecture(payload.hidden_layers)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -------------------------------------------------------------
# Training & Rounds
# -------------------------------------------------------------
@app.get("/api/training/rounds")
def get_training_rounds(db: Session = Depends(get_db)):
    """Returns history of federated learning rounds."""
    rounds = (
        db.query(TrainingRoundRecord)
        .order_by(TrainingRoundRecord.round_number.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "model_id": r.model_id,
            "round_number": r.round_number,
            "base_model_hash": r.base_model_hash,
            "new_model_hash": r.new_model_hash,
            "storage_cid": r.storage_cid,
            "arbitrum_tx_hash": r.arbitrum_tx_hash,
            "accuracy_before": round(r.accuracy_before * 100, 2),
            "accuracy_after": round(r.accuracy_after * 100, 2),
            "accuracy_delta": round((r.accuracy_after - r.accuracy_before) * 100, 2),
            "loss_before": round(r.loss_before, 4),
            "loss_after": round(r.loss_after, 4),
            "participating_nodes": r.participating_nodes,
            "accepted_nodes": r.accepted_nodes,
            "created_at": r.created_at,
        }
        for r in rounds
    ]


class RunRoundRequest(BaseModel):
    epochs: int = 4
    learning_rate: float = 0.03
    simulate_corrupted_proof: Optional[str] = None
    active_node_ids: Optional[List[str]] = None


@app.post("/api/training/run-round")
@app.post("/api/demo/run-round")
def run_live_round(payload: RunRoundRequest = RunRoundRequest()):
    """
    Executes a live end-to-end federated round:
    Local Training -> zkML Proof -> Arbitrum Verify -> Relayer -> Solana Reward -> FedAvg.
    """
    result = orchestrator.execute_live_round(
        local_epochs=payload.epochs,
        learning_rate=payload.learning_rate,
        simulate_corrupt_proof_node=payload.simulate_corrupted_proof,
        active_node_ids=payload.active_node_ids,
    )
    return result


@app.get("/api/training/latest-round-logs")
def get_latest_round_logs():
    """Returns the most recent round's live node execution logs for multi-device sync."""
    return {
        "round_number": getattr(orchestrator, "last_round_number", 0),
        "node_logs": getattr(orchestrator, "last_round_logs", {}),
    }


# -------------------------------------------------------------
# Contributions
# -------------------------------------------------------------
@app.get("/api/contributions")
def get_contributions(limit: int = 50, db: Session = Depends(get_db)):
    """Returns list of client contributions, hashes, and dual-chain verification states."""
    contribs = (
        db.query(ContributionRecord)
        .order_by(ContributionRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": c.id,
            "contributor_address": c.contributor_address,
            "contributor_name": c.contributor_name,
            "model_id": c.model_id,
            "round_id": c.round_id,
            "update_hash": c.update_hash,
            "proof_hash": c.proof_hash,
            "delta_norm": round(c.delta_norm, 4) if c.delta_norm is not None else 0.0,
            "samples_count": c.samples_count or 0,
            "accuracy_gain": round((c.accuracy_gain or 0.0) * 100, 2),
            "loss_reduction": round(c.loss_reduction or 0.0, 4),
            "verification_status": c.verification_status or "VERIFIED",
            "arbitrum_tx_hash": c.arbitrum_tx_hash,
            "solana_tx_signature": c.solana_tx_signature,
            "reward_tokens": c.reward_tokens or 0.0,
            "created_at": c.created_at,
        }
        for c in contribs
    ]


# -------------------------------------------------------------
# ZK Proofs
# -------------------------------------------------------------
@app.get("/api/proofs")
def get_zk_proofs(limit: int = 50, db: Session = Depends(get_db)):
    """Returns cryptographic zero-knowledge ML proofs and public input commitments."""
    proofs = db.query(ProofRecord).order_by(ProofRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": p.id,
            "contribution_id": p.contribution_id,
            "circuit_name": p.circuit_name,
            "proof_hash": p.proof_hash,
            "proof_hex_truncated": p.proof_hex,
            "public_inputs": p.public_inputs,
            "constraints_count": p.constraints_count,
            "proving_scheme": p.proving_scheme,
            "is_valid": p.is_valid,
            "verification_message": p.verification_message,
            "created_at": p.created_at,
        }
        for p in proofs
    ]


class VerifyProofRequest(BaseModel):
    proof_hex: str
    public_inputs: List[int]
    expected_model_hash: str
    expected_update_hash: str
    expected_round_id: int


@app.post("/api/verification/verify")
def verify_proof_endpoint(req: VerifyProofRequest):
    """Manually test zkML proof verification against circuit constraints."""
    is_valid, msg = orchestrator.zkml_engine.verify_proof(
        proof_hex=req.proof_hex,
        public_inputs=req.public_inputs,
        expected_model_hash=req.expected_model_hash,
        expected_update_hash=req.expected_update_hash,
        expected_round_id=req.expected_round_id,
    )
    return {
        "valid": is_valid,
        "message": msg,
        "circuit_fingerprint": orchestrator.zkml_engine.circuit_hash,
        "proving_scheme": "KZG-Halo2/EZKL-BN254",
    }


# -------------------------------------------------------------
# Solana Rewards & Tokenomics
# -------------------------------------------------------------
@app.get("/api/rewards")
def get_rewards(limit: int = 50):
    """Returns Solana incentive token payouts and transaction signatures."""
    return orchestrator.solana.get_recent_rewards(limit)


# -------------------------------------------------------------
# AI Contributor Passport
# -------------------------------------------------------------
@app.get("/api/passport")
@app.get("/api/passport/{wallet_address}")
def get_passport(wallet_address: Optional[str] = None):
    """Returns Soulbound AI Contributor Passport and reputation achievements."""
    if not wallet_address:
        # Default to benchmark contributor
        wallet_address = "0x71C66336071ffd4e773E34dac3Ca0A6688211eef"
    passport = orchestrator.arbitrum.get_passport(wallet_address)
    sol_prof = orchestrator.solana.get_provider_profile(wallet_address) or {}
    passport["total_rewards_earned"] = sol_prof.get("total_rewards_earned", 0.0)
    passport["hardware_tier"] = sol_prof.get("hardware_tier", "T4")
    return passport


# -------------------------------------------------------------
# Compute Providers & Dynamic Device Registration (Level 1)
# -------------------------------------------------------------
@app.get("/api/providers")
def get_providers():
    """Returns registered decentralized compute nodes and hardware telemetry."""
    return orchestrator.solana.get_all_providers()


class RegisterDeviceRequest(BaseModel):
    name: str
    hardware_tier: str = "RTX4090"
    vram_gb: int = 16
    samples_count: int = 220
    wallet_address: Optional[str] = None


@app.post("/api/devices/register")
@app.post("/api/providers/register")
def register_device(payload: RegisterDeviceRequest):
    """
    Dynamically registers a new virtualized edge device (Hospital/Laptop/Phone)
    into the active federated network for multi-device simulation.
    """
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Device name cannot be blank")

    result = orchestrator.register_new_device(
        name=payload.name,
        hardware_tier=payload.hardware_tier,
        vram_gb=payload.vram_gb,
        samples_count=payload.samples_count,
        wallet_address=payload.wallet_address,
    )
    return result


class DeleteDeviceRequest(BaseModel):
    identifier: str


@app.post("/api/devices/delete")
@app.delete("/api/providers/{identifier}")
def delete_device(identifier: Optional[str] = None, payload: Optional[DeleteDeviceRequest] = None):
    """
    Deactivates and removes an edge node/device from the network,
    coordinator client list, Solana registry, and persistent DB.
    """
    target = identifier or (payload.identifier if payload else None)
    if not target or not target.strip():
        raise HTTPException(status_code=400, detail="Device identifier required")

    orchestrator.remove_device(target)
    return {"success": True, "deleted": target}


# -------------------------------------------------------------
# Auth / Mock Session
# -------------------------------------------------------------
@app.get("/api/auth/me")
def get_current_user():
    """Returns active demo wallet and identity context."""
    return {
        "wallet_address": "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
        "name": "Hospital Alpha (Lead Contributor)",
        "role": "Healthcare Node Operator",
        "chains": ["Arbitrum Sepolia", "Solana Devnet", "Zcash Reference Pavilion"],
    }


# -------------------------------------------------------------
# AutoML Dataset Ingestion, Profiling & Dynamic Edge Deploy
# -------------------------------------------------------------

class ProfileDatasetRequest(BaseModel):
    csv_text: str

class LoadPresetRequest(BaseModel):
    preset_key: str

class DeployDatasetRequest(BaseModel):
    csv_text: str
    target_col: str
    feature_configs: Dict[str, Dict[str, Any]]
    problem_type: str = "logistic_regression"  # "logistic_regression" | "linear_regression"
    model_name: Optional[str] = None
    hidden_layers: Optional[List[int]] = []


@app.get("/api/datasets/presets")
def get_dataset_presets():
    """Returns curated Kaggle / Hugging Face medical and benchmark datasets."""
    return orchestrator.get_dataset_presets()


@app.post("/api/datasets/load-preset")
def load_preset_dataset(payload: LoadPresetRequest):
    """Loads a preset dataset and generates schema profile."""
    try:
        return orchestrator.load_preset_csv(payload.preset_key)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/datasets/profile")
def profile_custom_dataset(payload: ProfileDatasetRequest):
    """Profiles raw CSV content, infers data types, and recommends encodings."""
    if not payload.csv_text.strip():
        raise HTTPException(status_code=400, detail="CSV text cannot be empty.")
    try:
        return orchestrator.profile_dataset(payload.csv_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/datasets/deploy")
def deploy_dataset(payload: DeployDatasetRequest):
    """
    Applies user-selected feature encodings (binary / one-hot / numeric),
    partitions data across all edge devices, and initializes the dynamic model.
    """
    try:
        result = orchestrator.deploy_dataset(
            csv_text=payload.csv_text,
            target_col=payload.target_col,
            feature_configs=payload.feature_configs,
            problem_type=payload.problem_type,
            model_name=payload.model_name,
            hidden_layers=payload.hidden_layers,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

