"""
Decentralized Verifiable AI Network - AutoML Dataset Profiler & Preprocessor
Inspects tabular CSV data, infers column schemas, supports user-driven
binary & one-hot encoding, and securely partitions datasets across federated edge nodes.
"""

import io
import csv
import json
from typing import Dict, List, Any, Tuple, Optional
import numpy as np


class DatasetProfiler:
    """
    Parses and profiles raw tabular datasets (CSV format).
    Identifies column types, unique values, missing values,
    and generates automated encoding recommendations.
    """

    @staticmethod
    def profile_csv_content(csv_text: str) -> Dict[str, Any]:
        """
        Parses CSV string and returns detailed column profile metadata.
        """
        reader = csv.reader(io.StringIO(csv_text.strip()))
        rows = list(reader)
        if not rows:
            raise ValueError("CSV content is empty.")

        header = [col.strip() for col in rows[0]]
        data_rows = rows[1:]

        if not data_rows:
            raise ValueError("CSV contains header but no data rows.")

        total_rows = len(data_rows)
        columns_meta = []

        # Analyze each column
        for col_idx, col_name in enumerate(header):
            raw_vals = [r[col_idx].strip() for r in data_rows if col_idx < len(r)]
            non_empty_vals = [v for v in raw_vals if v != "" and v.lower() != "nan" and v.lower() != "null"]
            empty_count = total_rows - len(non_empty_vals)

            # Check if numeric
            is_numeric = False
            numeric_vals = []
            try:
                numeric_vals = [float(v) for v in non_empty_vals]
                is_numeric = True
            except ValueError:
                is_numeric = False

            unique_set = list(dict.fromkeys(non_empty_vals))
            unique_count = len(unique_set)

            # Detect column intent and suggested encoding
            col_lower = col_name.lower()
            is_id = any(term in col_lower for term in ["id", "unnamed", "index", "patient_id", "row_num"])
            is_target_candidate = any(term in col_lower for term in ["target", "label", "class", "diagnosis", "outcome", "survived", "status", "price", "medv", "y"])

            if is_numeric:
                inferred_type = "numeric"
                if unique_count <= 2:
                    suggested_action = "binary"
                else:
                    suggested_action = "numeric"
            else:
                inferred_type = "categorical"
                if unique_count <= 2:
                    suggested_action = "binary"
                elif unique_count <= 12:
                    suggested_action = "one_hot"
                else:
                    suggested_action = "drop" if is_id else "one_hot"

            if is_id and unique_count > (total_rows * 0.8):
                suggested_action = "drop"

            columns_meta.append({
                "name": col_name,
                "inferred_type": inferred_type,
                "sample_values": unique_set[:5],
                "unique_count": unique_count,
                "missing_count": empty_count,
                "is_numeric": is_numeric,
                "is_id": is_id,
                "is_target_candidate": is_target_candidate,
                "suggested_action": suggested_action,
                "selected": not is_id,
            })

        # Suggest default target
        target_candidates = [c for c in columns_meta if c["is_target_candidate"]]
        if target_candidates:
            default_target = target_candidates[-1]["name"]
        else:
            default_target = header[-1]  # Default to last column

        # Suggest default problem type
        target_meta = next((c for c in columns_meta if c["name"] == default_target), None)
        if target_meta and target_meta["unique_count"] == 2:
            suggested_problem = "logistic_regression"
        elif target_meta and target_meta["is_numeric"] and target_meta["unique_count"] > 10:
            suggested_problem = "linear_regression"
        else:
            suggested_problem = "logistic_regression"

        return {
            "total_rows": total_rows,
            "total_columns": len(header),
            "columns": columns_meta,
            "suggested_target": default_target,
            "suggested_problem_type": suggested_problem,
            "preview_rows": [dict(zip(header, r)) for r in data_rows[:5]],
        }

    @staticmethod
    def encode_and_partition(
        csv_text: str,
        target_col: str,
        feature_configs: Dict[str, Dict[str, Any]],
        problem_type: str = "logistic_regression",
        n_partitions: int = 3,
        test_ratio: float = 0.2,
    ) -> Dict[str, Any]:
        """
        Processes dataset according to user-selected feature configs,
        encodes categorical variables (binary or one-hot), standardizes numeric values,
        and splits data across N edge device partitions and a global test set.
        """
        reader = csv.reader(io.StringIO(csv_text.strip()))
        rows = list(reader)
        header = [col.strip() for col in rows[0]]
        data_rows = rows[1:]

        if target_col not in header:
            raise ValueError(f"Target column '{target_col}' not found in header.")

        target_idx = header.index(target_col)

        # 1. Process Target Variable (y)
        raw_y = [r[target_idx].strip() for r in data_rows]
        if problem_type == "logistic_regression":
            # Map unique 2 values to 0.0 and 1.0
            unique_targets = list(dict.fromkeys(raw_y))
            if len(unique_targets) != 2:
                # If numeric values, binarize by median or threshold
                try:
                    num_y = np.array([float(v) for v in raw_y])
                    median_val = np.median(num_y)
                    y = (num_y > median_val).astype(np.float32)
                except ValueError:
                    # Pick top 2 most common
                    y = np.array([1.0 if v == unique_targets[0] else 0.0 for v in raw_y], dtype=np.float32)
            else:
                # Map positive class to 1.0
                pos_class = unique_targets[0]
                if any(v.lower() in ["1", "true", "yes", "m", "malignant", "disease", "positive"] for v in [unique_targets[0]]):
                    pos_class = unique_targets[0]
                elif any(v.lower() in ["1", "true", "yes", "m", "malignant", "disease", "positive"] for v in [unique_targets[1]]):
                    pos_class = unique_targets[1]

                y = np.array([1.0 if v == pos_class else 0.0 for v in raw_y], dtype=np.float32)
        else:
            # Linear Regression continuous target
            try:
                y = np.array([float(v) if v != "" else 0.0 for v in raw_y], dtype=np.float32)
            except ValueError:
                raise ValueError("Target column must contain numeric values for Linear Regression.")

        # 2. Process Features (X)
        final_feature_columns = []
        final_feature_names = []

        for col_name, config in feature_configs.items():
            if col_name == target_col:
                continue
            if not config.get("selected", True):
                continue

            action = config.get("action", "numeric").lower()
            if action == "drop":
                continue

            col_idx = header.index(col_name)
            raw_col_vals = [r[col_idx].strip() for r in data_rows]

            if action == "binary":
                # Convert to 0 / 1 binary column
                unique_vals = list(dict.fromkeys([v for v in raw_col_vals if v != ""]))
                pos_val = unique_vals[0] if unique_vals else ""
                col_vec = np.array([1.0 if v == pos_val else 0.0 for v in raw_col_vals], dtype=np.float32)
                final_feature_columns.append(col_vec.reshape(-1, 1))
                final_feature_names.append(f"{col_name}_bin")

            elif action == "one_hot":
                # Expand into one-hot dummy columns
                unique_vals = sorted(list(dict.fromkeys([v for v in raw_col_vals if v != ""])))
                for u in unique_vals:
                    dummy_vec = np.array([1.0 if v == u else 0.0 for v in raw_col_vals], dtype=np.float32)
                    final_feature_columns.append(dummy_vec.reshape(-1, 1))
                    final_feature_names.append(f"{col_name}_{u}")

            elif action == "numeric":
                # Parse as float with mean imputation and z-score scaling
                clean_vals = []
                for v in raw_col_vals:
                    try:
                        clean_vals.append(float(v))
                    except ValueError:
                        clean_vals.append(np.nan)

                arr = np.array(clean_vals, dtype=np.float32)
                mean_val = np.nanmean(arr) if not np.all(np.isnan(arr)) else 0.0
                arr[np.isnan(arr)] = mean_val
                std_val = np.std(arr)
                if std_val > 1e-6:
                    arr = (arr - mean_val) / std_val
                else:
                    arr = arr - mean_val

                final_feature_columns.append(arr.reshape(-1, 1))
                final_feature_names.append(col_name)

        if not final_feature_columns:
            raise ValueError("No features selected for model training.")

        X = np.hstack(final_feature_columns).astype(np.float32)
        total_samples = len(y)
        dim = X.shape[1]

        # 3. Shuffle and Train/Test Split
        indices = np.arange(total_samples)
        np.random.seed(42)
        np.random.shuffle(indices)

        n_test = max(1, int(total_samples * test_ratio))
        if n_test >= total_samples:
            n_test = max(1, total_samples - 1)
        test_idx = indices[:n_test]
        train_idx = indices[n_test:]

        X_val = X[test_idx]
        y_val = y[test_idx]

        X_train_full = X[train_idx]
        y_train_full = y[train_idx]

        # 4. Partition X_train across N devices
        n_train = len(train_idx)
        partition_size = max(1, n_train // n_partitions)
        device_partitions = []

        for p_idx in range(n_partitions):
            start = p_idx * partition_size
            end = n_train if p_idx == n_partitions - 1 else (p_idx + 1) * partition_size
            part_slice = train_idx[start:end]

            device_partitions.append({
                "partition_index": p_idx,
                "num_samples": len(part_slice),
                "X": X[part_slice],
                "y": y[part_slice],
            })

        return {
            "input_dim": dim,
            "feature_names": final_feature_names,
            "total_samples": total_samples,
            "train_samples": n_train,
            "val_samples": len(y_val),
            "problem_type": problem_type,
            "target_col": target_col,
            "X_val": X_val,
            "y_val": y_val,
            "partitions": device_partitions,
        }


# ==========================================
# Popular Kaggle & Hugging Face Curated Presets
# ==========================================

PRESET_DATASETS: Dict[str, Dict[str, Any]] = {
    "breast_cancer_wisconsin": {
        "name": "Breast Cancer Wisconsin Diagnostic (UCI / Kaggle)",
        "problem_type": "logistic_regression",
        "description": "30 numeric cell nucleus biomarkers predicting Malignant vs Benign tumors.",
        "target_col": "diagnosis",
        "features_count": 30,
        "default_model": "Logistic Regression (Binary Classifier)",
    },
    "heart_disease_uci": {
        "name": "Heart Disease UCI (Cleveland / Kaggle)",
        "problem_type": "logistic_regression",
        "description": "13 clinical patient biomarkers (age, sex, chest pain, chol, resting bp) predicting cardiac presence.",
        "target_col": "target",
        "features_count": 13,
        "default_model": "Logistic Regression (Binary Classifier)",
    },
    "pima_diabetes": {
        "name": "Pima Indians Diabetes (NIH / Kaggle)",
        "problem_type": "logistic_regression",
        "description": "8 diagnostic health indicators predicting diabetic outcome.",
        "target_col": "Outcome",
        "features_count": 8,
        "default_model": "Logistic Regression (Binary Classifier)",
    },
    "california_housing_linear": {
        "name": "California Housing Value (Linear Regression)",
        "problem_type": "linear_regression",
        "description": "6 neighborhood economic features predicting median house value.",
        "target_col": "MedHouseVal",
        "features_count": 6,
        "default_model": "Linear Regression (Continuous Target)",
    },
}


def generate_preset_csv(preset_key: str) -> str:
    """Generates synthetic high-fidelity data matching the schema of popular Kaggle/UCI datasets."""
    np.random.seed(42)
    n_samples = 300

    if preset_key == "heart_disease_uci":
        header = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"]
        rows = []
        for _ in range(n_samples):
            age = int(np.random.normal(54, 9))
            sex = "Male" if np.random.rand() > 0.3 else "Female"
            cp = np.random.choice(["typical_angina", "atypical_angina", "non_anginal", "asymptomatic"])
            trestbps = int(np.random.normal(131, 17))
            chol = int(np.random.normal(246, 51))
            fbs = "true" if np.random.rand() > 0.85 else "false"
            restecg = np.random.choice(["normal", "st_t_wave", "left_ventricular"])
            thalach = int(np.random.normal(149, 22))
            exang = "yes" if np.random.rand() > 0.6 else "no"
            oldpeak = round(float(np.random.exponential(1.0)), 2)
            slope = np.random.choice(["upsloping", "flat", "downsloping"])
            ca = np.random.choice([0, 1, 2, 3])
            thal = np.random.choice(["normal", "fixed_defect", "reversable_defect"])

            # Ground truth latent risk
            risk = 0.03 * (age - 50) + (0.5 if sex == "Male" else -0.2) + (0.8 if cp == "asymptomatic" else -0.4) - 0.02 * (thalach - 150)
            target = 1 if (risk + np.random.normal(0, 0.5)) > 0 else 0
            rows.append([age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, target])

    elif preset_key == "pima_diabetes":
        header = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigree", "Age", "Outcome"]
        rows = []
        for _ in range(n_samples):
            preg = np.random.randint(0, 12)
            gluc = int(np.random.normal(120, 31))
            bp = int(np.random.normal(69, 19))
            skin = int(np.random.normal(20, 15))
            ins = int(np.random.exponential(80))
            bmi = round(float(np.random.normal(32, 7)), 1)
            ped = round(float(np.random.exponential(0.47)), 3)
            age = int(np.random.normal(33, 11))
            risk = 0.03 * (gluc - 120) + 0.05 * (bmi - 30) + 0.02 * (age - 30)
            outcome = 1 if (risk + np.random.normal(0, 0.6)) > 0 else 0
            rows.append([preg, gluc, bp, skin, ins, bmi, ped, age, outcome])

    elif preset_key == "california_housing_linear":
        header = ["MedInc", "HouseAge", "AveRooms", "AveBedrms", "Population", "AveOccup", "MedHouseVal"]
        rows = []
        for _ in range(n_samples):
            med_inc = round(float(np.random.normal(3.8, 1.8)), 3)
            age = int(np.random.normal(28, 12))
            rooms = round(float(np.random.normal(5.4, 2.1)), 2)
            bedrms = round(float(np.random.normal(1.1, 0.4)), 2)
            pop = int(np.random.normal(1400, 1000))
            occup = round(float(np.random.normal(3.0, 1.0)), 2)
            # Continuous price target (in $100k)
            price = round(float(max(0.5, 0.6 * med_inc + 0.01 * age + 0.1 * rooms + np.random.normal(0, 0.4))), 3)
            rows.append([med_inc, age, rooms, bedrms, pop, occup, price])

    else:
        # Default Breast Cancer Wisconsin
        header = ["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean",
                  "compactness_mean", "concavity_mean", "concave_points_mean", "symmetry_mean", "fractal_dimension_mean", "diagnosis"]
        rows = []
        for _ in range(n_samples):
            is_mal = np.random.rand() > 0.6
            diag = "M" if is_mal else "B"
            rad = round(float(np.random.normal(17.4 if is_mal else 12.1, 3.2)), 2)
            tex = round(float(np.random.normal(21.6 if is_mal else 17.9, 4.3)), 2)
            per = round(float(rad * 6.28), 2)
            area = round(float(3.14 * (rad ** 2)), 1)
            sm = round(float(np.random.normal(0.10, 0.01)), 4)
            comp = round(float(np.random.normal(0.14 if is_mal else 0.08, 0.05)), 4)
            conc = round(float(np.random.normal(0.16 if is_mal else 0.04, 0.07)), 4)
            cp = round(float(np.random.normal(0.08 if is_mal else 0.02, 0.03)), 4)
            sym = round(float(np.random.normal(0.18, 0.02)), 4)
            frac = round(float(np.random.normal(0.06, 0.007)), 4)
            rows.append([rad, tex, per, area, sm, comp, conc, cp, sym, frac, diag])

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(header)
    writer.writerows(rows)
    return output.getvalue()
