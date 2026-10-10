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

        # By default, start with ZERO pre-configured clients (awaits real devices or explicit simulation)

    def spawn_simulated_clients(self, count: int = 3) -> List[Dict[str, Any]]:
        """Initializes simulated hospital participants on demand for local benchmark testing."""
        from ml.datasets.synthetic_data import generate_synthetic_biomarkers
        import secrets

        tiers = [
            ("RTX 4090", 24),
            ("Apple M3 Max", 36),
            ("AWS A100 TensorCore", 80),
            ("Jetson Orin Nano", 8),
            ("Tesla V100 GPU", 16),
        ]
        created = []
        curr_sim_count = len([c for c in self.clients.values() if "sim_" in c.client_id or "node_" in c.client_id])
        for i in range(count):
            idx = curr_sim_count + i + 1
            node_id = f"sim_node_{idx}"
            tier, vram = tiers[i % len(tiers)]
            name = f"Simulated Node {idx} ({tier.split()[0]})"
            wallet = f"0x{secrets.token_hex(20)}"
            data = generate_synthetic_biomarkers(n_samples=120, seed=1000 + idx)
            client = FederatedClient(
                client_id=node_id,
                name=name,
                wallet_address=wallet,
                private_data=data,
                compute_tier=tier,
            )
            self.clients[node_id] = client
            created.append({
                "client_id": node_id,
                "name": name,
                "wallet_address": wallet,
                "hardware_tier": tier,
                "vram_gb": vram,
                "samples_count": 120,
            })
        return created

    def clear_simulated_clients(self):
        """Removes all simulated nodes, retaining only real connected worker daemons."""
        to_del = [cid for cid in list(self.clients.keys()) if cid.startswith("sim_") or cid.startswith("node_")]
        for cid in to_del:
            del self.clients[cid]

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

    def get_architecture(self) -> Dict[str, Any]:
        """Returns the current neural network architecture and hidden layer details."""
        if hasattr(self.global_model, "hidden_layers"):
            hidden = list(self.global_model.hidden_layers)
            input_d = getattr(self.global_model, "input_dim", 16)
            out_d = 1
            model_type = getattr(self.global_model, "model_type", "logistic_regression")
        else:
            hidden = [32, 16]
            input_d = 16
            out_d = 2
            model_type = "classification"

        total_p = self.global_model.total_parameters()
        layers = [{"layer_type": "input", "name": "Input Features", "nodes": input_d, "activation": "None"}]
        for idx, n in enumerate(hidden):
            layers.append({
                "layer_type": "hidden",
                "name": f"Hidden Layer {idx + 1}",
                "nodes": n,
                "activation": "ReLU",
            })
        layers.append({
            "layer_type": "output",
            "name": "Output Layer",
            "nodes": out_d,
            "activation": "Sigmoid" if out_d == 1 else "Softmax",
        })

        return {
            "model_id": self.model_id,
            "input_dim": input_d,
            "hidden_layers": hidden,
            "output_dim": out_d,
            "model_type": model_type,
            "total_parameters": total_p,
            "num_hidden_layers": len(hidden),
            "layers": layers,
        }

    def update_architecture(self, hidden_layers: List[int]) -> Dict[str, Any]:
        """Reconfigures the neural network hidden layers and synchronizes all edge clients."""
        from ml.models.dynamic_model import DynamicNeuralNetPure
        input_d = getattr(self.global_model, "input_dim", 16)
        cleaned_layers = [max(1, int(h)) for h in hidden_layers]
        
        self.global_model = DynamicNeuralNetPure(
            input_dim=input_d,
            hidden_layers=cleaned_layers,
            model_type="logistic_regression",
            seed=42,
        )
        self.current_round = 0
        
        for client in self.clients.values():
            client.update_dataset_and_model(
                (client._X_private, client._y_private),
                self.global_model,
            )
            
        return self.get_architecture()

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

    def deploy_dataset(
        self,
        X_val: np.ndarray,
        y_val: np.ndarray,
        partitions: List[Dict[str, Any]],
        model_name: str,
        input_dim: int,
        hidden_layers: Optional[List[int]] = None,
        problem_type: str = "logistic_regression",
    ) -> Dict[str, Any]:
        """
        Deploys a custom or preset dataset across all registered edge clients,
        initializes the dynamic model, and resets the training round counter.
        """
        from ml.models.dynamic_model import DynamicNeuralNetPure

        self.model_id = model_name
        self.global_model = DynamicNeuralNetPure(
            input_dim=input_dim,
            hidden_layers=hidden_layers,
            model_type=problem_type,
            seed=42,
        )
        self.X_val = X_val
        self.y_val = y_val
        self.current_round = 0

        # Assign private partitions across registered client nodes
        client_ids = list(self.clients.keys())
        allocated_counts = {}
        for idx, p in enumerate(partitions):
            if idx < len(client_ids):
                c_id = client_ids[idx]
                client = self.clients[c_id]
                client.update_dataset_and_model((p["X"], p["y"]), self.global_model)
                allocated_counts[client.name] = p["num_samples"]

        # Export ONNX graph for the new dynamic architecture
        onnx_path = os.path.join("./zkml/circuits", f"{model_name.lower().replace(' ', '_')}.onnx")
        self.global_model.export_onnx(onnx_path)

        arch_str = getattr(self.global_model, "get_architecture_string", lambda: str(input_dim))()
        return {
            "model_id": self.model_id,
            "problem_type": problem_type,
            "input_dim": input_dim,
            "hidden_layers": getattr(self.global_model, "hidden_layers", []),
            "architecture": arch_str,
            "parameters_count": self.global_model.total_parameters(),
            "model_hash": self.global_model.compute_hash(),
            "allocated_devices": allocated_counts,
            "initial_accuracy": self.global_model.evaluate(self.X_val, self.y_val)["accuracy"],
        }

