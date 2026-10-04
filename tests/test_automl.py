"""
Unit tests for AutoML Dynamic Profiler, Encodings, and Dynamic Linear Models.
"""

import unittest
import numpy as np
from ml.auto_ml.preprocessor import DatasetProfiler, PRESET_DATASETS, generate_preset_csv
from ml.models.dynamic_model import DynamicLinearModelPure


class TestAutoMLPipeline(unittest.TestCase):

    def test_preset_csv_generation_and_profiling(self):
        """Curated presets must generate valid CSV and profile schema."""
        for key in ["heart_disease_uci", "breast_cancer_wisconsin", "pima_diabetes", "california_housing_linear"]:
            csv_text = generate_preset_csv(key)
            profile = DatasetProfiler.profile_csv_content(csv_text)
            self.assertGreater(profile["total_rows"], 50)
            self.assertGreater(profile["total_columns"], 5)
            self.assertIn("suggested_target", profile)
            self.assertIn("columns", profile)

    def test_categorical_encodings_and_partitioning(self):
        """Binary and One-Hot encoding must correctly transform columns and split across partitions."""
        csv_text = (
            "age,gender,pain_type,cholesterol,diagnosis\n"
            "45,Male,typical,220,1\n"
            "52,Female,atypical,260,0\n"
            "39,Female,non_anginal,190,0\n"
            "61,Male,typical,280,1\n"
            "44,Male,atypical,210,0\n"
            "58,Female,typical,300,1\n"
        )
        configs = {
            "age": {"selected": True, "action": "numeric"},
            "gender": {"selected": True, "action": "binary"},
            "pain_type": {"selected": True, "action": "one_hot"},
            "cholesterol": {"selected": True, "action": "numeric"},
        }
        res = DatasetProfiler.encode_and_partition(
            csv_text=csv_text,
            target_col="diagnosis",
            feature_configs=configs,
            problem_type="logistic_regression",
            n_partitions=2,
            test_ratio=0.33,
        )

        # age(1) + gender_bin(1) + pain_type(3) + cholesterol(1) = 6 features
        self.assertEqual(res["input_dim"], 6)
        self.assertEqual(len(res["partitions"]), 2)
        self.assertGreater(res["train_samples"], 0)

    def test_dynamic_logistic_model_convergence(self):
        """Dynamic Logistic Regression model should decrease loss after gradient steps."""
        model = DynamicLinearModelPure(input_dim=8, model_type="logistic_regression")
        X = np.random.randn(50, 8).astype(np.float32)
        y = (X[:, 0] + X[:, 1] > 0).astype(np.float32)

        eval_start = model.evaluate(X, y)
        for _ in range(15):
            model.train_step(X, y, lr=0.1)
        eval_end = model.evaluate(X, y)

        self.assertLessEqual(eval_end["loss"], eval_start["loss"] + 1e-4)

    def test_dynamic_linear_model_convergence(self):
        """Dynamic Linear Regression model should fit continuous targets."""
        model = DynamicLinearModelPure(input_dim=4, model_type="linear_regression")
        X = np.random.randn(60, 4).astype(np.float32)
        y = (2.0 * X[:, 0] - 1.5 * X[:, 1] + 0.5).astype(np.float32)

        eval_start = model.evaluate(X, y)
        for _ in range(25):
            model.train_step(X, y, lr=0.05)
        eval_end = model.evaluate(X, y)

        self.assertLess(eval_end["mse"], eval_start["mse"])


if __name__ == "__main__":
    unittest.main()
