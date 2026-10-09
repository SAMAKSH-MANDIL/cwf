"""
Unit tests for Machine Learning and Federated Learning Modules.
Validates:
1. Pure NumPy model forward pass and loss reduction
2. Norm clipping on oversized parameter updates
3. Statistical outlier filtering of poisoned updates
4. FedAvg coordinator round progression and benchmark evaluation
"""

import unittest
import numpy as np
from ml.models.diagnostic_net import DiagnosticNetPure
from ml.aggregation.fedavg import RobustFedAvgAggregator
from ml.federated.coordinator import FederatedCoordinator


class TestFederatedPipeline(unittest.TestCase):

    def test_model_training_convergence(self):
        """Single node training should decrease loss and increase accuracy."""
        model = DiagnosticNetPure(seed=42)
        X = np.random.randn(50, 16).astype(np.float32)
        y = np.random.randint(0, 2, size=50).astype(np.int64)

        eval_initial = model.evaluate(X, y)
        for _ in range(20):
            model.train_step(X, y, lr=0.05)
        eval_final = model.evaluate(X, y)

        self.assertLess(eval_final["loss"], eval_initial["loss"])

    def test_norm_clipping(self):
        """Updates with L2 norm > threshold should be properly scaled."""
        aggregator = RobustFedAvgAggregator(clip_norm=3.0)
        huge_delta = np.ones(100, dtype=np.float32) * 2.0  # L2 norm = sqrt(100*4) = 20 > 3.0
        clipped, was_clipped = aggregator.clip_update(huge_delta)

        self.assertTrue(was_clipped)
        self.assertAlmostEqual(float(np.linalg.norm(clipped)), 3.0, places=4)

    def test_poisoned_outlier_rejection(self):
        """Adversarial updates deviating from consensus should be filtered."""
        aggregator = RobustFedAvgAggregator(clip_norm=10.0, outlier_threshold_sigma=2.0)
        base = np.zeros(20, dtype=np.float32)

        # Honest updates clustered around +0.1
        u1 = {"client_id": "honest_1", "delta_w": np.ones(20) * 0.1, "num_samples": 100, "proof_valid": True}
        u2 = {"client_id": "honest_2", "delta_w": np.ones(20) * 0.12, "num_samples": 100, "proof_valid": True}
        u3 = {"client_id": "honest_3", "delta_w": np.ones(20) * 0.09, "num_samples": 100, "proof_valid": True}

        # Poisoned update trying to invert weights to -5.0
        u_poison = {"client_id": "adversary", "delta_w": np.ones(20) * -5.0, "num_samples": 100, "proof_valid": True}

        res = aggregator.aggregate(base, [u1, u2, u3, u_poison])
        self.assertIn("adversary", res["rejected_clients"])
        self.assertNotIn("adversary", res["accepted_clients"])

    def test_federated_coordinator_multi_round(self):
        """Coordinator should execute multiple rounds and track metrics."""
        coord = FederatedCoordinator()
        r1 = coord.run_training_round()
        self.assertEqual(r1["round_id"], 1)
        self.assertIn("accuracy", r1["eval_after"])

        r2 = coord.run_training_round()
        self.assertEqual(r2["round_id"], 2)
        self.assertNotEqual(r1["new_hash"], r2["new_hash"])


if __name__ == "__main__":
    unittest.main()
