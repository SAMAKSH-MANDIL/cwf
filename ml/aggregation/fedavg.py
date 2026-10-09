"""
Decentralized Verifiable AI Network - Robust Federated Aggregation Engine
Implements FedAvg with Byzantine resilience: Norm Clipping and Statistical Outlier Filtering.
"""

from typing import Dict, List, Optional, Tuple
import numpy as np


class RobustFedAvgAggregator:
    """
    Implements Federated Averaging (FedAvg) with Byzantine resilience.
    Protects against model poisoning attacks via:
    1. L2 Norm Clipping: Constrains magnitude of weight updates.
    2. Outlier Rejection: Filters out updates that deviate significantly from consensus.
    """

    def __init__(
        self,
        clip_norm: float = 5.0,
        outlier_threshold_sigma: float = 2.5,
        aggregation_rule: str = "fedavg",  # "fedavg", "coordinate_median", "trimmed_mean"
    ):
        self.clip_norm = clip_norm
        self.outlier_threshold_sigma = outlier_threshold_sigma
        self.aggregation_rule = aggregation_rule

    def clip_update(self, delta_w: np.ndarray) -> Tuple[np.ndarray, bool]:
        """
        Clips the L2 norm of a parameter update vector:
        delta_w' = delta_w * min(1, clip_norm / ||delta_w||_2)
        """
        l2_norm = float(np.linalg.norm(delta_w))
        if l2_norm > self.clip_norm:
            scaling = self.clip_norm / (l2_norm + 1e-12)
            return delta_w * scaling, True
        return delta_w, False

    def detect_outliers(
        self, updates: List[np.ndarray]
    ) -> Tuple[List[int], List[float]]:
        """
        Computes pairwise Euclidean distances between updates.
        Returns indices of accepted updates and distance scores.
        """
        num_updates = len(updates)
        if num_updates <= 2:
            return list(range(num_updates)), [0.0] * num_updates

        # Compute pairwise distance matrix
        dist_matrix = np.zeros((num_updates, num_updates), dtype=np.float32)
        for i in range(num_updates):
            for j in range(i + 1, num_updates):
                d = float(np.linalg.norm(updates[i] - updates[j]))
                dist_matrix[i, j] = d
                dist_matrix[j, i] = d

        # Cumulative distance to all other peers
        cum_distances = np.sum(dist_matrix, axis=1)
        median_dist = float(np.median(cum_distances))
        mad = float(np.median(np.abs(cum_distances - median_dist))) + 1e-7

        accepted_indices = []
        for idx, dist in enumerate(cum_distances):
            # Check Z-score like dispersion
            if (dist - median_dist) <= self.outlier_threshold_sigma * mad * 1.4826:
                accepted_indices.append(idx)

        # Fallback to keep at least majority if over-filtered
        if len(accepted_indices) == 0:
            accepted_indices = list(range(num_updates))

        return accepted_indices, cum_distances.tolist()

    def aggregate(
        self,
        base_weights: np.ndarray,
        client_updates: List[Dict[str, any]],
    ) -> Dict[str, any]:
        """
        Aggregates client model updates into an updated global parameter vector.

        client_updates schema:
        [
            {
                "client_id": str,
                "delta_w": np.ndarray (or list of floats),
                "num_samples": int,
                "proof_valid": bool,
            }, ...
        ]
        """
        if not client_updates:
            raise ValueError("Cannot aggregate empty client updates list.")

        # 1. Filter only cryptographically verified updates
        valid_candidates = [
            u for u in client_updates if u.get("proof_valid", False) is True
        ]
        if not valid_candidates:
            raise ValueError(
                "No updates passed zkML cryptographic verification. Aggregation aborted."
            )

        # 2. Extract arrays and apply Norm Clipping
        clipped_deltas = []
        sample_counts = []
        clip_flags = []

        for c in valid_candidates:
            delta = np.array(c["delta_w"], dtype=np.float32)
            clipped, was_clipped = self.clip_update(delta)
            clipped_deltas.append(clipped)
            sample_counts.append(int(c.get("num_samples", 1)))
            clip_flags.append(was_clipped)

        # 3. Byzantine Outlier Filtering
        accepted_idx, dist_scores = self.detect_outliers(clipped_deltas)
        filtered_deltas = [clipped_deltas[i] for i in accepted_idx]
        filtered_samples = [sample_counts[i] for i in accepted_idx]
        filtered_clients = [valid_candidates[i]["client_id"] for i in accepted_idx]

        total_samples = sum(filtered_samples)

        # 4. Aggregation rule
        if self.aggregation_rule == "fedavg":
            # Weighted average of delta updates
            aggregated_delta = np.zeros_like(base_weights, dtype=np.float32)
            for delta, n_k in zip(filtered_deltas, filtered_samples):
                weight = n_k / total_samples
                aggregated_delta += weight * delta

        elif self.aggregation_rule == "coordinate_median":
            # Robust coordinate-wise median
            stacked = np.stack(filtered_deltas, axis=0)
            aggregated_delta = np.median(stacked, axis=0).astype(np.float32)

        elif self.aggregation_rule == "trimmed_mean":
            # Trim 10% extreme coordinates
            stacked = np.stack(filtered_deltas, axis=0)
            sorted_stacked = np.sort(stacked, axis=0)
            trim_k = max(1, int(len(filtered_deltas) * 0.1))
            if 2 * trim_k < len(filtered_deltas):
                aggregated_delta = np.mean(
                    sorted_stacked[trim_k:-trim_k], axis=0
                ).astype(np.float32)
            else:
                aggregated_delta = np.mean(sorted_stacked, axis=0).astype(np.float32)
        else:
            raise ValueError(f"Unknown aggregation rule: {self.aggregation_rule}")

        # 5. Compute new global weights
        new_global_weights = base_weights + aggregated_delta

        return {
            "new_weights": new_global_weights,
            "aggregated_delta": aggregated_delta,
            "participating_clients": [c["client_id"] for c in valid_candidates],
            "accepted_clients": filtered_clients,
            "rejected_clients": [
                valid_candidates[i]["client_id"]
                for i in range(len(valid_candidates))
                if i not in accepted_idx
            ],
            "clip_flags": clip_flags,
            "total_samples": total_samples,
        }
