"""
Decentralized Verifiable AI Network - Model Architecture
Medical Diagnostic Neural Network optimized for Federated Learning and zkML export.
Architecture: 16 inputs -> 32 -> 16 -> 2 classes (Normal vs Elevated Diagnostic Risk).
"""

import hashlib
import json
from typing import Dict, List, Tuple, Union
import numpy as np


class DiagnosticNetPure:
    """
    Pure NumPy implementation of the DiagnosticNet architecture.
    Provides mathematically exact forward and backward propagation,
    parameter extraction, and weight serialization without requiring external heavy runtimes.
    Fully compatible with PyTorch weights and ONNX-compatible tensor shapes.
    """

    def __init__(self, seed: int = 42):
        self.rng = np.random.RandomState(seed)
        # Layer 1: 16 -> 32
        self.W1 = (self.rng.randn(16, 32) * np.sqrt(2.0 / 16)).astype(np.float32)
        self.b1 = np.zeros(32, dtype=np.float32)
        # Layer 2: 32 -> 16
        self.W2 = (self.rng.randn(32, 16) * np.sqrt(2.0 / 32)).astype(np.float32)
        self.b2 = np.zeros(16, dtype=np.float32)
        # Layer 3: 16 -> 2
        self.W3 = (self.rng.randn(16, 2) * np.sqrt(2.0 / 16)).astype(np.float32)
        self.b3 = np.zeros(2, dtype=np.float32)

    def forward(self, X: np.ndarray) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
        """
        Forward pass with ReLU activations and linear logits output.
        Returns logits and cache for backprop / witness trace.
        """
        z1 = np.dot(X, self.W1) + self.b1
        a1 = np.maximum(0, z1)  # ReLU
        z2 = np.dot(a1, self.W2) + self.b2
        a2 = np.maximum(0, z2)  # ReLU
        z3 = np.dot(a2, self.W3) + self.b3  # Logits

        cache = {
            "X": X,
            "z1": z1,
            "a1": a1,
            "z2": z2,
            "a2": a2,
            "z3": z3,
        }
        return z3, cache

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Computes softmax probabilities."""
        logits, _ = self.forward(X)
        exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
        return exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)

    def evaluate(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """Calculates cross-entropy loss, accuracy, and F1-score."""
        logits, _ = self.forward(X)
        probs = self.predict_proba(X)
        preds = np.argmax(probs, axis=-1)

        # Cross-entropy loss
        eps = 1e-12
        loss = -np.mean(np.log(probs[np.arange(len(y)), y] + eps))
        accuracy = float(np.mean(preds == y))

        tp = np.sum((preds == 1) & (y == 1))
        fp = np.sum((preds == 1) & (y == 0))
        fn = np.sum((preds == 0) & (y == 1))
        precision = float(tp / (tp + fp + eps))
        recall = float(tp / (tp + fn + eps))
        f1 = float(2 * precision * recall / (precision + recall + eps))

        return {
            "loss": float(loss),
            "accuracy": float(accuracy),
            "precision": precision,
            "recall": recall,
            "f1": f1,
        }

    def train_step(
        self,
        X_batch: np.ndarray,
        y_batch: np.ndarray,
        lr: float = 0.01,
        weight_decay: float = 1e-4,
    ) -> float:
        """
        Executes one gradient descent step with analytical backpropagation.
        Returns the batch loss.
        """
        batch_size = len(y_batch)
        logits, cache = self.forward(X_batch)
        probs = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
        probs /= np.sum(probs, axis=-1, keepdims=True)

        loss = -np.mean(np.log(probs[np.arange(batch_size), y_batch] + 1e-12))

        # Backward pass (Cross-Entropy derivative w.r.t logits)
        dz3 = probs.copy()
        dz3[np.arange(batch_size), y_batch] -= 1.0
        dz3 /= batch_size

        da2 = np.dot(dz3, self.W3.T)
        dW3 = np.dot(cache["a2"].T, dz3) + weight_decay * self.W3
        db3 = np.sum(dz3, axis=0)

        # ReLU derivative
        dz2 = da2 * (cache["z2"] > 0)
        da1 = np.dot(dz2, self.W2.T)
        dW2 = np.dot(cache["a1"].T, dz2) + weight_decay * self.W2
        db2 = np.sum(dz2, axis=0)

        dz1 = da1 * (cache["z1"] > 0)
        dW1 = np.dot(cache["X"].T, dz1) + weight_decay * self.W1
        db1 = np.sum(dz1, axis=0)

        # Parameter updates
        self.W1 -= lr * dW1
        self.b1 -= lr * db1
        self.W2 -= lr * dW2
        self.b2 -= lr * db2
        self.W3 -= lr * dW3
        self.b3 -= lr * db3

        return float(loss)

    def get_weights_flat(self) -> np.ndarray:
        """Returns all parameters flattened into a single 1D vector."""
        return np.concatenate([
            self.W1.flatten(),
            self.b1.flatten(),
            self.W2.flatten(),
            self.b2.flatten(),
            self.W3.flatten(),
            self.b3.flatten(),
        ])

    def set_weights_flat(self, flat_weights: np.ndarray):
        """Loads flattened 1D parameters into model matrices."""
        idx = 0
        w1_size = 16 * 32
        self.W1 = flat_weights[idx : idx + w1_size].reshape(16, 32).astype(np.float32)
        idx += w1_size

        b1_size = 32
        self.b1 = flat_weights[idx : idx + b1_size].reshape(32).astype(np.float32)
        idx += b1_size

        w2_size = 32 * 16
        self.W2 = flat_weights[idx : idx + w2_size].reshape(32, 16).astype(np.float32)
        idx += w2_size

        b2_size = 16
        self.b2 = flat_weights[idx : idx + b2_size].reshape(16).astype(np.float32)
        idx += b2_size

        w3_size = 16 * 2
        self.W3 = flat_weights[idx : idx + w3_size].reshape(16, 2).astype(np.float32)
        idx += w3_size

        b3_size = 2
        self.b3 = flat_weights[idx : idx + b3_size].reshape(2).astype(np.float32)

    def compute_hash(self) -> str:
        """Computes deterministic SHA-256 cryptographic hash of model parameters."""
        flat = self.get_weights_flat()
        # Round slightly to ensure float representation consistency
        rounded_bytes = np.round(flat, decimals=6).tobytes()
        return hashlib.sha256(rounded_bytes).hexdigest()

    def total_parameters(self) -> int:
        """Total trainable parameters."""
        return len(self.get_weights_flat())


try:
    import torch
    import torch.nn as nn

    class DiagnosticNetPyTorch(nn.Module):
        """PyTorch equivalent for ONNX export and GPU training."""

        def __init__(self):
            super().__init__()
            self.fc1 = nn.Linear(16, 32)
            self.relu1 = nn.ReLU()
            self.fc2 = nn.Linear(32, 16)
            self.relu2 = nn.ReLU()
            self.fc3 = nn.Linear(16, 2)

        def forward(self, x):
            x = self.relu1(self.fc1(x))
            x = self.relu2(self.fc2(x))
            x = self.fc3(x)
            return x

        def load_from_pure(self, pure_model: DiagnosticNetPure):
            """Synchronizes PyTorch weights from DiagnosticNetPure."""
            with torch.no_grad():
                self.fc1.weight.copy_(torch.from_numpy(pure_model.W1.T))
                self.fc1.bias.copy_(torch.from_numpy(pure_model.b1))
                self.fc2.weight.copy_(torch.from_numpy(pure_model.W2.T))
                self.fc2.bias.copy_(torch.from_numpy(pure_model.b2))
                self.fc3.weight.copy_(torch.from_numpy(pure_model.W3.T))
                self.fc3.bias.copy_(torch.from_numpy(pure_model.b3))

        def export_onnx(self, filepath: str):
            """Exports computation graph to standard ONNX format for zkML synthesis."""
            dummy_input = torch.randn(1, 16, dtype=torch.float32)
            torch.onnx.export(
                self,
                dummy_input,
                filepath,
                input_names=["biomarkers"],
                output_names=["risk_logits"],
                dynamic_axes={"biomarkers": {0: "batch_size"}, "risk_logits": {0: "batch_size"}},
                opset_version=14,
            )

except ImportError:
    DiagnosticNetPyTorch = None
