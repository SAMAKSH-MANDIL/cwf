"""
Decentralized Verifiable AI Network - Federated Dataset Partitioning
Generates realistic non-IID private medical diagnostic datasets for distributed clients.
Raw training data strictly remains localized on client nodes.
"""

import numpy as np
from typing import Dict, Tuple, List


def generate_synthetic_biomarkers(
    n_samples: int,
    class_ratio: float = 0.5,
    noise_level: float = 0.15,
    bias_shift: float = 0.0,
    seed: int = 42,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates synthetic medical diagnostic features (16 biomarker indicators).
    Features include simulated biomarkers:
    - Feature 0: Lung opacity index
    - Feature 1: C-reactive protein (CRP) level
    - Feature 2: White blood cell (WBC) count
    - Feature 3: Serum ferritin
    - Feature 4: Oxygen saturation deficit
    - Features 5-15: Additional radiomic & metabolic indicators
    """
    rng = np.random.RandomState(seed)
    n_pos = int(n_samples * class_ratio)
    n_neg = n_samples - n_pos

    # Positive class (e.g., Pneumonia / Elevated Risk)
    pos_features = rng.normal(
        loc=1.2 + bias_shift, scale=1.0 + noise_level, size=(n_pos, 16)
    )
    # Give non-linear correlations to specific biomarker indices
    pos_features[:, 0] += 0.8  # lung opacity
    pos_features[:, 1] += 0.7  # CRP
    pos_features[:, 4] += 0.9  # SpO2 deficit
    pos_labels = np.ones(n_pos, dtype=np.int64)

    # Negative class (Normal / Healthy)
    neg_features = rng.normal(
        loc=-0.8 + bias_shift, scale=1.0 + noise_level, size=(n_neg, 16)
    )
    neg_features[:, 0] -= 0.5
    neg_features[:, 1] -= 0.4
    neg_features[:, 4] -= 0.6
    neg_labels = np.zeros(n_neg, dtype=np.int64)

    # Combine and shuffle
    X = np.vstack([pos_features, neg_features]).astype(np.float32)
    y = np.concatenate([pos_labels, neg_labels]).astype(np.int64)

    # Normalize across features (z-score)
    mean = np.mean(X, axis=0, keepdims=True)
    std = np.std(X, axis=0, keepdims=True) + 1e-7
    X = (X - mean) / std

    indices = rng.permutation(len(y))
    return X[indices], y[indices]


def get_federated_partitions() -> Dict[str, Dict[str, np.ndarray]]:
    """
    Creates non-IID datasets partitioned across 3 hospital edge nodes.
    Each client has unique sample size, slight sensor bias, and class distribution.
    """
    partitions = {
        "node_alpha": {
            "name": "Hospital Alpha (Metro Center)",
            "device_id": "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
            "samples": 300,
            "data": generate_synthetic_biomarkers(
                n_samples=300, class_ratio=0.65, noise_level=0.10, bias_shift=0.1, seed=101
            ),
        },
        "node_beta": {
            "name": "Hospital Beta (Regional Medical)",
            "device_id": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "samples": 240,
            "data": generate_synthetic_biomarkers(
                n_samples=240, class_ratio=0.45, noise_level=0.12, bias_shift=-0.05, seed=202
            ),
        },
        "node_gamma": {
            "name": "Clinic Gamma (Community Health)",
            "device_id": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
            "samples": 180,
            "data": generate_synthetic_biomarkers(
                n_samples=180, class_ratio=0.50, noise_level=0.15, bias_shift=0.0, seed=303
            ),
        },
    }
    return partitions


def get_global_validation_dataset(n_samples: int = 150) -> Tuple[np.ndarray, np.ndarray]:
    """
    Held-out global validation dataset representing network-wide diagnostic standard.
    Used exclusively by coordinator for global model metric tracking.
    """
    return generate_synthetic_biomarkers(
        n_samples=n_samples, class_ratio=0.50, noise_level=0.08, seed=999
    )
