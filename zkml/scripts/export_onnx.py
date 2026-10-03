"""
Decentralized Verifiable AI Network - ONNX Model Exporter for zkML
Exports DiagnosticNet to standard ONNX computation graph with fixed shapes and opset 14.
"""

import os
import torch
from ml.models.diagnostic_net import DiagnosticNetPure, DiagnosticNetPyTorch


def export_model_to_onnx(output_path: str = "./zkml/circuits/diagnostic_net.onnx"):
    """Exports DiagnosticNet to ONNX format."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pure_model = DiagnosticNetPure(seed=42)
    pytorch_model = DiagnosticNetPyTorch()
    pytorch_model.load_from_pure(pure_model)
    pytorch_model.eval()

    pytorch_model.export_onnx(output_path)
    print(f"[zkML] Exported ONNX model to: {output_path}")
    return output_path


if __name__ == "__main__":
    export_model_to_onnx()
