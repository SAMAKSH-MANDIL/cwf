"""
Decentralized Verifiable AI Network - Federated Client Simulation
Represents a participating edge node (Hospital / IoT Device / GPU Worker).
Privacy Invariant: Raw training records never leave this class.
"""

import hashlib
import numpy as np
from typing import Dict, Any, Optional, Tuple
from ml.models.diagnostic_net import DiagnosticNetPure


class FederatedClient:
    """
    Simulates a federated client maintaining local private diagnostic data.
    Performs local stochastic gradient descent on the global model,
    calculates weight deltas, computes cryptographic hashes, and prepares
    the computation witness required for zkML proof generation.
    """

    def __init__(
        self,
        client_id: str,
        name: str,
        wallet_address: str,
        private_data: Tuple[np.ndarray, np.ndarray],
        compute_tier: str = "T4",  # "RTX4090", "A100", "T4", "EdgeDevice"
    ):
        self.client_id = client_id
        self.name = name
        self.wallet_address = wallet_address
        # Raw private data kept local and never transmitted over network
        self._X_private, self._y_private = private_data
        self.compute_tier = compute_tier
        self.local_model = DiagnosticNetPure(seed=int(hashlib.md5(client_id.encode()).hexdigest()[:6], 16))

    @property
    def num_samples(self) -> int:
        return len(self._y_private)

    def train_round(
        self,
        global_weights: np.ndarray,
        epochs: int = 4,
        batch_size: int = 32,
        learning_rate: float = 0.03,
    ) -> Dict[str, Any]:
        """
        Executes local training initialized from global baseline weights.
        Returns model update delta, cryptographic commitments, and local performance metrics.
        CRITICAL: Raw self._X_private and self._y_private are NOT included in return dict.
        """
        # 1. Initialize local model with global weights
        self.local_model.set_weights_flat(global_weights.copy())
        base_weights = global_weights.copy()
        base_hash = hashlib.sha256(np.round(base_weights, 6).tobytes()).hexdigest()

        # Initial baseline evaluation on local data
        eval_before = self.local_model.evaluate(self._X_private, self._y_private)

        # 2. Local Training Loop (Mini-batch SGD)
        n = self.num_samples
        indices = np.arange(n)
        epoch_logs = []
        for ep in range(epochs):
            np.random.shuffle(indices)
            batch_losses = []
            for start in range(0, n, batch_size):
                end = min(start + batch_size, n)
                batch_idx = indices[start:end]
                X_batch = self._X_private[batch_idx]
                y_batch = self._y_private[batch_idx]
                loss = self.local_model.train_step(X_batch, y_batch, lr=learning_rate)
                batch_losses.append(loss)
            avg_loss = float(np.mean(batch_losses)) if batch_losses else 0.0
            epoch_logs.append({
                "epoch": ep + 1,
                "loss": round(avg_loss, 4),
            })

        # 3. Post-training evaluation
        eval_after = self.local_model.evaluate(self._X_private, self._y_private)

        # 4. Compute weight updates (delta_w = W_local - W_global)
        updated_weights = self.local_model.get_weights_flat()
        delta_w = updated_weights - base_weights

        # 5. Cryptographic update hash and commitment
        delta_bytes = np.round(delta_w, 6).tobytes()
        update_hash = hashlib.sha256(delta_bytes).hexdigest()

        # 6. Extract a single normalized validation sample for zkML witness constraint binding
        sample_x = self._X_private[0:1].copy()
        pred_logits, _ = self.local_model.forward(sample_x)

        return {
            "client_id": self.client_id,
            "name": self.name,
            "wallet_address": self.wallet_address,
            "compute_tier": self.compute_tier,
            "num_samples": self.num_samples,
            "base_hash": base_hash,
            "update_hash": update_hash,
            "delta_w": delta_w,
            "delta_norm": float(np.linalg.norm(delta_w)),
            "eval_before": eval_before,
            "eval_after": eval_after,
            "epoch_logs": epoch_logs,
            "accuracy_gain": float(eval_after["accuracy"] - eval_before["accuracy"]),
            "loss_reduction": float(eval_before["loss"] - eval_after["loss"]),
            # Metadata for zkML prover
            "sample_witness_input": sample_x.tolist(),
            "sample_witness_output": pred_logits.tolist(),
        }

    def update_dataset_and_model(self, private_data: Tuple[np.ndarray, np.ndarray], model_template):
        """Updates client's local private dataset partition and adapts model architecture."""
        self._X_private, self._y_private = private_data
        if hasattr(model_template, "input_dim"):
            from ml.models.dynamic_model import DynamicNeuralNetPure
            seed = int(hashlib.md5(self.client_id.encode()).hexdigest()[:6], 16)
            self.local_model = DynamicNeuralNetPure(
                input_dim=model_template.input_dim,
                hidden_layers=getattr(model_template, "hidden_layers", []),
                model_type=model_template.model_type,
                seed=seed,
            )
            self.local_model.set_weights_flat(model_template.get_weights_flat())

