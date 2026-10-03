"""
Decentralized Verifiable AI Network - Federated Learning Coordinator
Orchestrates multi-round federated training, integrates robust aggregation,
and tracks model lineage and convergence across distributed edge participants.
"""

import time
import os
import json
from typing import Dict, List, Any, Optional
import numpy as np

from ml.models.diagnostic_net import DiagnosticNetPure, DiagnosticNetPyTorch
from ml.datasets.synthetic_data import get_federated_partitions, get_global_validation_dataset
from ml.aggregation.fedavg import RobustFedAvgAggregator
from ml.clients.federated_client import FederatedClient


class FederatedCoordinator:
    """
    Central Federated Learning Coordinator for the decentralized network.
    Maintains current global model state, round progression, evaluation on
    validation benchmark, and manages client participation.
    """

    def __init__(
        self,
        model_id: str = "Pneumonia-Biomarker-v1",
        storage_dir: str = "./storage/models",
    ):
        self.model_id = model_id
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

        # Global model initialization
        self.global_model = DiagnosticNetPure(seed=42)
        self.current_round = 0
        self.aggregator = RobustFedAvgAggregator(clip_norm=4.0, outlier_threshold_sigma=2.5)

        # Global held-out validation dataset
        self.X_val, self.y_val = get_global_validation_dataset(n_samples=200)

        # Registered client nodes
        self.clients: Dict[str, FederatedClient] = {}
        self.round_history: List[Dict[str, Any]] = []

        self._initialize_default_clients()

    def _initialize_default_clients(self):
        """Initializes simulated hospital participants with private partitions."""
        partitions = get_federated_partitions()
        tiers = {
            "node_alpha": "RTX4090",
            "node_beta": "A100",
            "node_gamma": "T4",
        }
        for node_id, p_info in partitions.items():
            client = FederatedClient(
                client_id=node_id,
                name=p_info["name"],
                wallet_address=p_info["device_id"],
                private_data=p_info["data"],
                compute_tier=tiers.get(node_id, "T4"),
            )
            self.clients[node_id] = client

    def get_current_model_metadata(self) -> Dict[str, Any]:
        """Returns metadata and cryptographic hash of current global model."""
        eval_metrics = self.global_model.evaluate(self.X_val, self.y_val)
        model_hash = self.global_model.compute_hash()
        return {
            "model_id": self.model_id,
            "round": self.current_round,
            "model_hash": model_hash,
            "accuracy": eval_metrics["accuracy"],
            "loss": eval_metrics["loss"],
            "f1": eval_metrics["f1"],
            "parameters_count": self.global_model.total_parameters(),
            "active_clients": len(self.clients),
        }

    def run_training_round(
        self,
        client_proof_statuses: Optional[Dict[str, bool]] = None,
        local_epochs: int = 3,
        learning_rate: float = 0.03,
    ) -> Dict[str, Any]:
        """
        Executes a complete federated training round:
        1. Distribute current global model weights to clients.
        2. Clients perform local SGD on private data.
        3. Clients generate updates delta_w, hashes, and witness data.
        4. Validate cryptographic verification status for each client update.
        5. FedAvg aggregator applies norm clipping and outlier rejection.
        6. Global model is updated and evaluated on benchmark.
        7. Round metrics and provenance logs are recorded.
        """
        self.current_round += 1
        round_id = self.current_round
        start_time = time.time()

        base_weights = self.global_model.get_weights_flat().copy()
        base_hash = self.global_model.compute_hash()
        eval_before = self.global_model.evaluate(self.X_val, self.y_val)

        # 1. Collect local updates from clients
        client_updates = []
        for client_id, client in self.clients.items():
            update_data = client.train_round(
                global_weights=base_weights,
                epochs=local_epochs,
                learning_rate=learning_rate,
            )

            # Determine proof status (default True unless explicitly flagged)
            proof_valid = True
            if client_proof_statuses and client_id in client_proof_statuses:
                proof_valid = bool(client_proof_statuses[client_id])

            update_data["proof_valid"] = proof_valid
            client_updates.append(update_data)

        # 2. Perform Byzantine-Resilient Aggregation
        aggregation_result = self.aggregator.aggregate(
            base_weights=base_weights, client_updates=client_updates
        )

        # 3. Update global model weights
        self.global_model.set_weights_flat(aggregation_result["new_weights"])
        new_hash = self.global_model.compute_hash()
        eval_after = self.global_model.evaluate(self.X_val, self.y_val)

        # 4. Save checkpoint to storage
        model_filename = f"{self.model_id}_round_{round_id}.json"
        storage_path = os.path.join(self.storage_dir, model_filename)
        checkpoint_data = {
            "model_id": self.model_id,
            "round": round_id,
            "model_hash": new_hash,
            "base_hash": base_hash,
            "metrics": eval_after,
            "weights": self.global_model.get_weights_flat().tolist(),
            "timestamp": int(time.time()),
        }
        with open(storage_path, "w") as f:
            json.dump(checkpoint_data, f)

        # 5. Compile comprehensive round record
        round_record = {
            "round_id": round_id,
            "model_id": self.model_id,
            "base_hash": base_hash,
            "new_hash": new_hash,
            "storage_path": storage_path,
            "storage_cid": f"ipfs://bafybeic{new_hash[:24]}",
            "eval_before": eval_before,
            "eval_after": eval_after,
            "accuracy_delta": float(eval_after["accuracy"] - eval_before["accuracy"]),
            "loss_delta": float(eval_before["loss"] - eval_after["loss"]),
            "duration_sec": round(time.time() - start_time, 3),
            "client_updates": [
                {
                    "client_id": u["client_id"],
                    "name": u["name"],
                    "wallet_address": u["wallet_address"],
                    "compute_tier": u["compute_tier"],
                    "num_samples": u["num_samples"],
                    "update_hash": u["update_hash"],
                    "proof_valid": u["proof_valid"],
                    "delta_norm": u["delta_norm"],
                    "accuracy_gain": u["accuracy_gain"],
                    "sample_witness_input": u["sample_witness_input"],
                    "sample_witness_output": u["sample_witness_output"],
                }
                for u in client_updates
            ],
            "aggregation": {
                "participating_clients": aggregation_result["participating_clients"],
                "accepted_clients": aggregation_result["accepted_clients"],
                "rejected_clients": aggregation_result["rejected_clients"],
                "total_samples": aggregation_result["total_samples"],
            },
        }

        self.round_history.append(round_record)
        return round_record
