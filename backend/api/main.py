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
import json
import time
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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
from backend.services.websocket_manager import ws_manager
from backend.services.pipeline_manager import pipeline_manager

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
async def on_startup():
    import asyncio
    init_db()
    try:
        ws_manager.set_loop(asyncio.get_running_loop())
    except Exception:
        pass


# -------------------------------------------------------------
# Main Dashboard & Network Status
# -------------------------------------------------------------
@app.get("/api/network/stats")
def get_network_stats():
    """Returns aggregated high-level network statistics and chain status."""
    return orchestrator.get_network_dashboard_stats()


# -------------------------------------------------------------
def safe_percent(val: Optional[float]) -> float:
    if val is None:
        return 0.0
    v = float(val)
    if v > 100.0:
        v = v / 100.0
    elif v <= 1.0 and v > 0.0:
        v = v * 100.0
    return round(max(0.0, min(100.0, v)), 2)


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
            "benchmark_accuracy": safe_percent(m.benchmark_accuracy),
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
        "benchmark_accuracy": safe_percent(m.benchmark_accuracy),
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
    partition_mode: Optional[str] = "equal"
    row_slices: Optional[List[Dict[str, Any]]] = None
    duration_mode: Optional[str] = "fast"
    target_duration_sec: Optional[float] = None


@app.post("/api/training/stop-round")
def stop_live_round():
    """Gracefully halts ongoing training round and proceeds directly to Byzantine FedAvg aggregation."""
    return orchestrator.stop_current_round()


@app.post("/api/training/run-round")
@app.post("/api/demo/run-round")
def run_live_round(payload: RunRoundRequest = RunRoundRequest()):
    """
    Executes a live end-to-end federated round:
    Local Training -> zkML Proof -> Arbitrum Verify -> Relayer -> Solana Reward -> FedAvg.
    """
    if payload.duration_mode == "deep_10min" or (payload.target_duration_sec and payload.target_duration_sec >= 300):
        import threading
        threading.Thread(
            target=orchestrator.execute_live_round,
            args=(
                payload.epochs,
                payload.learning_rate,
                payload.simulate_corrupted_proof,
                payload.active_node_ids,
                payload.partition_mode,
                payload.row_slices,
                payload.duration_mode,
                payload.target_duration_sec,
            ),
            daemon=True,
        ).start()
        return {
            "status": "STARTED",
            "round_id": orchestrator.fl_coordinator.current_round + 1,
            "duration_mode": "deep_10min",
            "message": "Round launched in deep mode (7-10 min). Telemetry streaming on WebSocket.",
        }

    result = orchestrator.execute_live_round(
        local_epochs=payload.epochs,
        learning_rate=payload.learning_rate,
        simulate_corrupt_proof_node=payload.simulate_corrupted_proof,
        active_node_ids=payload.active_node_ids,
        partition_mode=payload.partition_mode,
        row_slices=payload.row_slices,
        duration_mode=payload.duration_mode,
        target_duration_sec=payload.target_duration_sec,
    )
    return result


@app.get("/api/training/latest-round-logs")
def get_latest_round_logs():
    """Returns the most recent round's live node execution logs for multi-device sync."""
    return {
        "round_number": getattr(orchestrator, "last_round_number", 0),
        "node_logs": getattr(orchestrator, "last_round_logs", {}),
    }


@app.websocket("/ws/training")
async def websocket_training_stream(websocket: WebSocket):
    """
    Real-time bidirectional WebSocket stream for training rounds:
    - Broadcasts live per-epoch loss, gradient delta norms, and node logs
    - Emits zkML constraint synthesis and cryptographic commitments
    - Streams Arbitrum EVM verification and Solana token reward payouts
    - Accepts control commands: {"action": "START_ROUND", "epochs": 4, "learning_rate": 0.03}
    """
    await ws_manager.connect(websocket)
    try:
        while True:
            raw_msg = await websocket.receive_text()
            try:
                cmd = json.loads(raw_msg)
                action = str(cmd.get("action", "")).upper()
                if action == "PING":
                    await websocket.send_json({"event": "PONG", "timestamp": time.time()})
                elif action in ("STOP_ROUND", "CANCEL_ROUND"):
                    orchestrator.stop_current_round()
                elif action in ("START_ROUND", "RUN_ROUND"):
                    epochs = int(cmd.get("epochs", 4))
                    lr = float(cmd.get("learning_rate", 0.03))
                    nodes = cmd.get("active_node_ids")
                    part_mode = cmd.get("partition_mode", "equal")
                    slices = cmd.get("row_slices")
                    duration_mode = str(cmd.get("duration_mode", "fast"))
                    target_duration_sec = cmd.get("target_duration_sec")
                    import asyncio
                    loop = asyncio.get_running_loop()
                    loop.run_in_executor(
                        None,
                        orchestrator.execute_live_round,
                        epochs,
                        lr,
                        None,
                        nodes,
                        part_mode,
                        slices,
                        duration_mode,
                        target_duration_sec,
                    )
            except Exception as e:
                await websocket.send_json({"event": "ERROR", "message": str(e)})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)



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
@app.get("/api/rewards")
def get_rewards(limit: int = 50, db: Session = Depends(get_db)):
    """Returns Solana incentive token payouts and transaction signatures."""
    recent = orchestrator.solana.get_recent_rewards(limit)
    if recent:
        return recent
    # Fallback to persistent ContributionRecord history in database
    contribs = (
        db.query(ContributionRecord)
        .filter(ContributionRecord.reward_tokens > 0)
        .order_by(ContributionRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "contributor": c.contributor_address,
            "contributor_name": c.contributor_name,
            "hardware_tier": "RTX 4090",
            "round_id": c.round_id,
            "reward_amount": str(round(c.reward_tokens, 2)),
            "tx_signature": c.solana_tx_signature or f"sol_{c.id[:16]}1111sol",
            "status": "CONFIRMED",
            "timestamp": c.created_at,
        }
        for c in contribs
    ]


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
    cpu_name: Optional[str] = None
    os_name: Optional[str] = None
    system_ram_gb: Optional[int] = None
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
        cpu_name=payload.cpu_name,
        os_name=payload.os_name,
        system_ram_gb=payload.system_ram_gb,
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


class SpawnSimulatedNodesRequest(BaseModel):
    count: int = 3


@app.post("/api/nodes/spawn-simulated")
def spawn_simulated_nodes(payload: SpawnSimulatedNodesRequest):
    """Spawns specified number of simulated nodes on demand for testing on root node."""
    nodes = orchestrator.spawn_simulated_nodes(count=payload.count)
    return {"success": True, "count": len(nodes), "nodes": nodes}


@app.post("/api/nodes/clear-simulated")
def clear_simulated_nodes():
    """Clears all simulated nodes on root node."""
    result = orchestrator.clear_simulated_nodes()
    return {"success": True, "result": result}


# -------------------------------------------------------------
# Native Edge Worker Daemon APIs (Cross-Platform Distributed Compute)
# -------------------------------------------------------------
class WorkerRegisterRequest(BaseModel):
    name: str
    hardware_tier: Optional[str] = "Auto-Detected"
    vram_gb: Optional[Any] = 6
    cpu_name: Optional[str] = None
    os_name: Optional[str] = None
    system_ram_gb: Optional[Any] = 16
    samples_count: Optional[Any] = 120
    wallet_address: Optional[str] = None


@app.post("/api/worker/register")
def register_worker(payload: WorkerRegisterRequest):
    """Registers a real external worker daemon (Laptop 2 / Mac / Linux)."""
    vram_val = 6
    try:
        if payload.vram_gb is not None:
            vram_val = int(round(float(payload.vram_gb)))
    except Exception:
        pass

    ram_val = 16
    try:
        if payload.system_ram_gb is not None:
            ram_val = int(round(float(payload.system_ram_gb)))
    except Exception:
        pass

    samples_val = 120
    try:
        if payload.samples_count is not None:
            samples_val = int(payload.samples_count)
    except Exception:
        pass

    return orchestrator.register_worker_daemon(
        node_name=payload.name,
        hardware_tier=payload.hardware_tier or "Auto-Detected",
        vram_gb=vram_val,
        samples_count=samples_val,
        wallet_address=payload.wallet_address,
        cpu_name=payload.cpu_name,
        os_name=payload.os_name,
        system_ram_gb=ram_val,
    )


class UpdateHardwareRequest(BaseModel):
    identifier: str
    wallet_address: Optional[str] = None
    cpu_name: Optional[str] = None
    system_ram_gb: Optional[Any] = None
    os_name: Optional[str] = None
    hardware_tier: Optional[str] = None


@app.post("/api/nodes/update-hardware")
def update_node_hardware(payload: UpdateHardwareRequest):
    """Dynamically updates telemetry / hardware information for an edge node."""
    return orchestrator.update_node_hardware(
        identifier=payload.identifier,
        wallet_address=payload.wallet_address,
        cpu_name=payload.cpu_name,
        system_ram_gb=int(round(float(payload.system_ram_gb))) if payload.system_ram_gb else None,
        os_name=payload.os_name,
        hardware_tier=payload.hardware_tier,
    )


@app.get("/api/worker/poll-job")
def poll_worker_job(
    identifier: str = "LOQ_Vinu",
    wallet: Optional[str] = None,
    cpu_name: Optional[str] = None,
    system_ram_gb: Optional[Any] = None,
    os_name: Optional[str] = None,
    hardware_tier: Optional[str] = None,
    vram_gb: Optional[Any] = None,
):
    """Polls for pending federated round training jobs for a worker node."""
    return orchestrator.get_worker_job(
        identifier=identifier,
        wallet=wallet,
        cpu_name=cpu_name,
        system_ram_gb=system_ram_gb,
        os_name=os_name,
        hardware_tier=hardware_tier,
        vram_gb=vram_gb,
    )


@app.post("/api/worker/submit-update")
def submit_worker_update(payload: Dict[str, Any]):
    """Receives locally computed weight updates and loss metrics from external worker."""
    return orchestrator.submit_worker_update(payload)


class WorkerLogRequest(BaseModel):
    node_name: str
    message: str
    wallet_address: Optional[str] = None
    level: Optional[str] = "INFO"


@app.post("/api/worker/log")
def receive_worker_log(payload: WorkerLogRequest):
    """Streams real-time console/telemetry log from an external worker to coordinator and WebSocket."""
    orchestrator.record_worker_log(
        node_name=payload.node_name,
        message=payload.message,
        wallet=payload.wallet_address,
    )
    return {"status": "LOG_BROADCASTED"}


class WorkerEpochRequest(BaseModel):
    node_name: str
    epoch: int
    total_epochs: int
    loss: float
    accuracy: Optional[float] = 0.0
    learning_rate: Optional[float] = 0.03
    delta_norm: Optional[float] = 0.0
    sample_weights: Optional[List[float]] = []
    wallet_address: Optional[str] = None
    round_id: Optional[int] = None


@app.post("/api/worker/epoch-progress")
def receive_worker_epoch(payload: WorkerEpochRequest):
    """Streams per-epoch local SGD loss, accuracy, and sample weights from external device to frontend WebSocket."""
    orchestrator.record_worker_epoch(
        node_name=payload.node_name,
        epoch=payload.epoch,
        total_epochs=payload.total_epochs,
        loss=payload.loss,
        accuracy=payload.accuracy,
        learning_rate=payload.learning_rate,
        delta_norm=payload.delta_norm,
        sample_weights=payload.sample_weights,
        wallet=payload.wallet_address,
        round_id=payload.round_id,
    )
    return {"status": "EPOCH_STREAMED"}


@app.get("/api/worker/download")

def download_worker_script():
    """Serves the standalone fedzero_worker.py for external client download."""
    script_path = os.path.abspath("fedzero_worker.py")
    if not os.path.exists(script_path):
        raise HTTPException(status_code=404, detail="fedzero_worker.py not found on coordinator")
    return FileResponse(
        path=script_path,
        filename="fedzero_worker.py",
        media_type="text/x-python",
    )


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


# -------------------------------------------------------------
# Large File Upload API (Multipart Stream with Chunked Storage)
# -------------------------------------------------------------
@app.post("/api/datasets/upload")
async def upload_dataset_file(file: UploadFile = File(...)):
    """
    Accepts large CSV / dataset file uploads via multipart stream.
    Saves to storage/datasets, profiles structure, and returns metadata with row counts.
    """
    os.makedirs("storage/datasets", exist_ok=True)
    clean_name = os.path.basename(file.filename or "dataset.csv").replace(" ", "_")
    target_path = os.path.join("storage", "datasets", clean_name)

    total_bytes = 0
    chunk_size = 1024 * 1024  # 1MB chunk

    with open(target_path, "wb") as f_out:
        while chunk := await file.read(chunk_size):
            total_bytes += len(chunk)
            f_out.write(chunk)

    total_rows = 0
    headers = []
    preview_rows = []
    first_lines = []
    try:
        with open(target_path, "r", encoding="utf-8", errors="ignore") as f_in:
            first_line = f_in.readline()
            if first_line:
                first_lines.append(first_line)
                headers = [h.strip().replace('"', '').replace("'", "") for h in first_line.split(",") if h.strip()]
            for line in f_in:
                total_rows += 1
                if len(preview_rows) < 8:
                    first_lines.append(line)
                    vals = [v.strip().replace('"', '').replace("'", "") for v in line.split(",")]
                    preview_rows.append(vals)
    except Exception:
        pass

    # Read preview text for profiler
    preview_text = "".join(first_lines)

    return {
        "success": True,
        "filename": clean_name,
        "size_bytes": total_bytes,
        "size_formatted": f"{total_bytes / (1024 * 1024):.2f} MB" if total_bytes >= 1024*1024 else f"{total_bytes / 1024:.1f} KB",
        "total_rows": total_rows,
        "headers": headers,
        "preview_rows": preview_rows,
        "preview_text": preview_text,
        "storage_path": target_path,
    }


@app.get("/api/datasets/current-upload")
def get_current_uploaded_dataset():
    """
    Returns metadata for the most recently uploaded dataset file so UI seamlessly
    retains total rows, columns, and previews across reloads.
    """
    storage_dir = os.path.join("storage", "datasets")
    if not os.path.exists(storage_dir):
        return {"has_upload": False}
    files = [
        f for f in os.listdir(storage_dir)
        if not f.startswith(".") and os.path.isfile(os.path.join(storage_dir, f))
    ]
    if not files:
        return {"has_upload": False}
    # Pick the most recently modified file
    files.sort(key=lambda f: os.path.getmtime(os.path.join(storage_dir, f)), reverse=True)
    latest_file = files[0]
    target_path = os.path.join(storage_dir, latest_file)
    size_bytes = os.path.getsize(target_path)

    total_rows = 0
    headers = []
    preview_rows = []
    first_lines = []
    try:
        with open(target_path, "r", encoding="utf-8", errors="ignore") as f_in:
            first_line = f_in.readline()
            if first_line:
                first_lines.append(first_line)
                headers = [h.strip().replace('"', '').replace("'", "") for h in first_line.split(",") if h.strip()]
            for line in f_in:
                total_rows += 1
                if len(preview_rows) < 8:
                    first_lines.append(line)
                    vals = [v.strip().replace('"', '').replace("'", "") for v in line.split(",")]
                    preview_rows.append(vals)
    except Exception:
        pass

    preview_text = "".join(first_lines)
    return {
        "has_upload": True,
        "filename": latest_file,
        "size_bytes": size_bytes,
        "size_formatted": f"{size_bytes / (1024 * 1024):.2f} MB" if size_bytes >= 1024*1024 else f"{size_bytes / 1024:.1f} KB",
        "total_rows": total_rows,
        "headers": headers,
        "preview_rows": preview_rows,
        "preview_text": preview_text,
        "storage_path": target_path,
    }


# -------------------------------------------------------------
# Python Training Pipeline Studio APIs
# -------------------------------------------------------------
class DeployPipelineRequest(BaseModel):
    code: str
    template_key: Optional[str] = "custom"
    model_name: Optional[str] = None


@app.get("/api/pipeline/current")
def get_current_pipeline():
    """Returns currently deployed Python pipeline code for edge nodes."""
    return pipeline_manager.get_active_pipeline()


@app.get("/api/pipeline/templates")
def get_pipeline_templates():
    """Returns preset Python pipeline templates (Tabular, Vision CNN, PyTorch)."""
    return pipeline_manager.get_templates()


@app.post("/api/pipeline/deploy")
def deploy_pipeline(payload: DeployPipelineRequest):
    """Deploys a custom Python pipeline script to all edge nodes in the network."""
    result = pipeline_manager.save_pipeline(payload.code, payload.template_key)
    ws_manager.broadcast_sync("PIPELINE_UPDATED", {
        "template_key": payload.template_key,
        "model_name": payload.model_name or "CustomFederatedPipeline",
        "updated_at": result["updated_at"],
    })
    return result


@app.get("/api/pipeline/download")
def download_pipeline_file():
    """Serves pipeline.py for edge worker daemons."""
    p_path = os.path.abspath(pipeline_manager.pipeline_file)
    if not os.path.exists(p_path):
        raise HTTPException(status_code=404, detail="pipeline.py not found on coordinator")
    return FileResponse(path=p_path, filename="pipeline.py", media_type="text/x-python")


@app.get("/api/worker/download")
def download_worker_script():
    """Serves fedzero_worker.py directly for edge nodes downloading from the web dashboard."""
    worker_path = os.path.abspath("fedzero_worker.py")
    if not os.path.exists(worker_path):
        raise HTTPException(status_code=404, detail="fedzero_worker.py not found on coordinator")
    return FileResponse(path=worker_path, filename="fedzero_worker.py", media_type="text/x-python")



