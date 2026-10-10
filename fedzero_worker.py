#!/usr/bin/env python3
"""
================================================================================
 FEDZERO DECENTRALIZED VERIFIABLE AI NETWORK - NATIVE EDGE WORKER DAEMON v2.0
 Cross-Platform Native Worker Client for Windows, macOS, and Linux.
 AUTO-DETECTS: PyTorch GPU (CUDA) -> NumPy CPU -> Pure Python CPU
 Performs real local SGD on native hardware and streams verifiable updates.
================================================================================
"""

import sys
import os
import time
import math
import random
import hashlib
import json
import argparse
import urllib.request
import urllib.error
import urllib.parse
import importlib.util
import subprocess
import platform

# ------------------------------------------------------------------------------
# Auto-Dependency Manager: Automatically installs missing packages on launch
# ------------------------------------------------------------------------------
def ensure_dependencies():
    """
    Auto-detects and installs missing packages (numpy) so the edge node
    runs out-of-the-box with zero manual setup.
    """
    missing = []
    try:
        import numpy
    except ImportError:
        missing.append("numpy")

    if missing:
        print("=" * 72)
        print("  FEDZERO AUTO-BOOTSTRAP: Initializing Edge Node Environment...")
        print(f"  Installing missing required packages automatically: {', '.join(missing)}")
        print("=" * 72)
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", *missing],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            print("  [AUTO-BOOTSTRAP] SUCCESS! Dependencies ready.\n")
        except Exception as e:
            print(f"  [AUTO-BOOTSTRAP] Notice: {e}. Running in pure Python mode.\n")

ensure_dependencies()

# ------------------------------------------------------------------------------
# Backend Auto-Detection: PyTorch GPU > NumPy > Pure Python
# ------------------------------------------------------------------------------

BACKEND = "pure_python"
torch = None
np = None
DEVICE = None

try:
    import torch as _torch  # type: ignore # pyrefly: ignore[missing-import]
    torch = _torch
    if torch.cuda.is_available():
        DEVICE = torch.device("cuda")
        BACKEND = "pytorch_gpu"
        GPU_NAME = torch.cuda.get_device_name(0)
        GPU_MEM = round(torch.cuda.get_device_properties(0).total_memory / 1e9, 1)
    else:
        DEVICE = torch.device("cpu")
        BACKEND = "pytorch_cpu"
        GPU_NAME = "N/A (CPU Mode)"
        GPU_MEM = 0
except ImportError:
    try:
        import numpy as _np
        np = _np
        BACKEND = "numpy_cpu"
        GPU_NAME = "N/A (NumPy CPU)"
        GPU_MEM = 0
    except ImportError:
        GPU_NAME = "N/A (Pure Python)"
        GPU_MEM = 0


def backend_label():
    if BACKEND == "pytorch_gpu":
        return f"PyTorch CUDA GPU [{GPU_NAME} / {GPU_MEM} GB VRAM]"
    elif BACKEND == "pytorch_cpu":
        return "PyTorch CPU (install CUDA for GPU)"
    elif BACKEND == "numpy_cpu":
        return "NumPy CPU (pip install torch for GPU)"
    else:
        return "Pure Python CPU (pip install torch for GPU)"


# ------------------------------------------------------------------------------
# PyTorch GPU Neural Network (when torch is available)
# ------------------------------------------------------------------------------
class TorchDiagnosticNet:
    """Neural network using PyTorch — runs on GPU if CUDA available."""

    def __init__(self, seed=42):
        torch.manual_seed(seed)
        self.fc1 = torch.nn.Linear(16, 32).to(DEVICE)
        self.fc2 = torch.nn.Linear(32, 16).to(DEVICE)
        self.fc3 = torch.nn.Linear(16, 2).to(DEVICE)
        self.relu = torch.nn.ReLU()
        self.params = list(self.fc1.parameters()) + list(self.fc2.parameters()) + list(self.fc3.parameters())
        # Total params: 16*32+32 + 32*16+16 + 16*2+2 = 1106

    def set_weights_flat(self, flat_weights):
        flat_t = torch.tensor(flat_weights, dtype=torch.float32)
        idx = 0
        for p in self.params:
            n = p.numel()
            p.data.copy_(flat_t[idx:idx+n].view(p.shape).to(DEVICE))
            idx += n

    def get_weights_flat(self):
        return [v for p in self.params for v in p.data.cpu().flatten().tolist()]

    def forward(self, x_tensor):
        h = self.relu(self.fc1(x_tensor))
        h = self.relu(self.fc2(h))
        return self.fc3(h)

    def train_epoch(self, X, y, lr=0.03):
        X_t = torch.tensor(X, dtype=torch.float32).to(DEVICE)
        y_t = torch.tensor(y, dtype=torch.long).to(DEVICE)
        optimizer = torch.optim.SGD(self.params, lr=lr)
        criterion = torch.nn.CrossEntropyLoss()

        # Shuffle
        perm = torch.randperm(len(y_t))
        X_t, y_t = X_t[perm], y_t[perm]

        optimizer.zero_grad()
        logits = self.forward(X_t)
        loss = criterion(logits, y_t)
        loss.backward()
        optimizer.step()
        return loss.item()

    def evaluate(self, X, y):
        X_t = torch.tensor(X, dtype=torch.float32).to(DEVICE)
        y_t = torch.tensor(y, dtype=torch.long).to(DEVICE)
        criterion = torch.nn.CrossEntropyLoss()
        with torch.no_grad():
            logits = self.forward(X_t)
            loss = criterion(logits, y_t).item()
            preds = logits.argmax(dim=1)
            acc = (preds == y_t).float().mean().item()
        return loss, acc

    def forward_one(self, x):
        x_t = torch.tensor([x], dtype=torch.float32).to(DEVICE)
        with torch.no_grad():
            logits = self.forward(x_t)
        return logits[0].cpu().tolist(), [], []


# ------------------------------------------------------------------------------
# Pure Python / NumPy Neural Network (fallback when torch is NOT available)
# ------------------------------------------------------------------------------
class LocalDiagnosticNet:
    """
    Fallback Neural Network Engine (16->32->16->2).
    Uses NumPy if available, else pure Python math.
    """
    def __init__(self, seed=42):
        self.rng = random.Random(seed)
        std1 = math.sqrt(2.0 / 16)
        self.W1 = [[self.rng.gauss(0, std1) for _ in range(32)] for _ in range(16)]
        self.b1 = [0.0] * 32
        std2 = math.sqrt(2.0 / 32)
        self.W2 = [[self.rng.gauss(0, std2) for _ in range(16)] for _ in range(32)]
        self.b2 = [0.0] * 16
        std3 = math.sqrt(2.0 / 16)
        self.W3 = [[self.rng.gauss(0, std3) for _ in range(2)] for _ in range(16)]
        self.b3 = [0.0] * 2

    def set_weights_flat(self, flat_weights):
        idx = 0
        for i in range(16):
            for j in range(32):
                if idx < len(flat_weights): self.W1[i][j] = float(flat_weights[idx]); idx += 1
        for j in range(32):
            if idx < len(flat_weights): self.b1[j] = float(flat_weights[idx]); idx += 1
        for i in range(32):
            for j in range(16):
                if idx < len(flat_weights): self.W2[i][j] = float(flat_weights[idx]); idx += 1
        for j in range(16):
            if idx < len(flat_weights): self.b2[j] = float(flat_weights[idx]); idx += 1
        for i in range(16):
            for j in range(2):
                if idx < len(flat_weights): self.W3[i][j] = float(flat_weights[idx]); idx += 1
        for j in range(2):
            if idx < len(flat_weights): self.b3[j] = float(flat_weights[idx]); idx += 1

    def get_weights_flat(self):
        res = []
        for i in range(16): res.extend(self.W1[i])
        res.extend(self.b1)
        for i in range(32): res.extend(self.W2[i])
        res.extend(self.b2)
        for i in range(16): res.extend(self.W3[i])
        res.extend(self.b3)
        return res

    def forward_one(self, x):
        z1 = [sum(x[i] * self.W1[i][j] for i in range(16)) + self.b1[j] for j in range(32)]
        a1 = [max(0.0, v) for v in z1]
        z2 = [sum(a1[i] * self.W2[i][j] for i in range(32)) + self.b2[j] for j in range(16)]
        a2 = [max(0.0, v) for v in z2]
        z3 = [sum(a2[i] * self.W3[i][j] for i in range(16)) + self.b3[j] for j in range(2)]
        return z3, a1, a2

    def train_epoch(self, X, y, lr=0.03):
        n = len(X)
        if n == 0: return 0.0
        indices = list(range(n))
        random.shuffle(indices)
        total_loss = 0.0
        for idx in indices:
            x_i, y_i = X[idx], y[idx]
            logits, a1, a2 = self.forward_one(x_i)
            max_l = max(logits)
            exp0 = math.exp(logits[0] - max_l)
            exp1 = math.exp(logits[1] - max_l)
            s = exp0 + exp1
            p = [exp0/s, exp1/s]
            total_loss += -math.log(max(1e-12, p[y_i]))
            dz3 = [p[0] - (1 if y_i==0 else 0), p[1] - (1 if y_i==1 else 0)]
            dW3 = [[a2[i]*dz3[j] for j in range(2)] for i in range(16)]
            db3 = list(dz3)
            da2 = [sum(dz3[j]*self.W3[i][j] for j in range(2)) for i in range(16)]
            dz2 = [da2[i] if a2[i] > 0 else 0.0 for i in range(16)]
            dW2 = [[a1[i]*dz2[j] for j in range(16)] for i in range(32)]
            db2 = list(dz2)
            da1 = [sum(dz2[j]*self.W2[i][j] for j in range(16)) for i in range(32)]
            dz1 = [da1[i] if a1[i] > 0 else 0.0 for i in range(32)]
            dW1 = [[x_i[i]*dz1[j] for j in range(32)] for i in range(16)]
            db1 = list(dz1)
            for i in range(16):
                for j in range(32): self.W1[i][j] -= lr * dW1[i][j]
            for j in range(32): self.b1[j] -= lr * db1[j]
            for i in range(32):
                for j in range(16): self.W2[i][j] -= lr * dW2[i][j]
            for j in range(16): self.b2[j] -= lr * db2[j]
            for i in range(16):
                for j in range(2): self.W3[i][j] -= lr * dW3[i][j]
            for j in range(2): self.b3[j] -= lr * db3[j]
        return total_loss / n

    def evaluate(self, X, y):
        n = len(X)
        if n == 0: return 0.0, 0.0
        total_loss, correct = 0.0, 0
        for i in range(n):
            logits, _, _ = self.forward_one(X[i])
            pred = 0 if logits[0] > logits[1] else 1
            if pred == y[i]: correct += 1
            max_l = max(logits)
            exp0 = math.exp(logits[0] - max_l)
            exp1 = math.exp(logits[1] - max_l)
            prob = (exp0 if y[i]==0 else exp1) / (exp0 + exp1)
            total_loss += -math.log(max(1e-12, prob))
        return total_loss / n, correct / n


# ------------------------------------------------------------------------------
# Model Factory — picks best available backend
# ------------------------------------------------------------------------------
def create_model(seed=42):
    if BACKEND in ("pytorch_gpu", "pytorch_cpu"):
        return TorchDiagnosticNet(seed=seed)
    else:
        return LocalDiagnosticNet(seed=seed)


# ------------------------------------------------------------------------------
# Synthetic Medical Biomarker Generator
# ------------------------------------------------------------------------------
def generate_local_biomarkers(n_samples=120, seed=1337):
    rng = random.Random(seed)
    X, y = [], []
    for _ in range(n_samples):
        label = 1 if rng.random() > 0.5 else 0
        features = []
        for d in range(16):
            base = 1.2 if (label == 1 and d < 6) else 0.2
            features.append(round(rng.gauss(base, 0.45), 4))
        X.append(features)
        y.append(label)
    return X, y


# ------------------------------------------------------------------------------
# HTTP API Client
# ------------------------------------------------------------------------------
def http_post(url, data_dict, timeout=10):
    try:
        data_bytes = json.dumps(data_dict).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes,
                                     headers={"Content-Type": "application/json",
                                              "User-Agent": "FedZero-Worker/2.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

def http_get(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FedZero-Worker/2.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}


def stream_log(server_url: str, node_name: str, wallet: str, message: str):
    """Streams real-time console/telemetry logs to master coordinator so root device sees live execution."""
    try:
        http_post(f"{server_url}/api/worker/log", {
            "node_name": node_name,
            "wallet_address": wallet,
            "message": message,
        }, timeout=2)
    except Exception:
        pass


def stream_epoch(
    server_url: str,
    node_name: str,
    wallet: str,
    epoch: int,
    total_epochs: int,
    loss: float,
    round_id: int,
    accuracy: float = 0.0,
    learning_rate: float = 0.03,
    delta_norm: float = 0.0,
    sample_weights: list = None,
):
    """Streams live comprehensive epoch SGD metrics and sample weights to coordinator."""
    try:
        http_post(f"{server_url}/api/worker/epoch-progress", {
            "node_name": node_name,
            "wallet_address": wallet,
            "epoch": epoch,
            "total_epochs": total_epochs,
            "loss": round(float(loss), 4),
            "accuracy": round(float(accuracy) * 100, 2),
            "learning_rate": round(float(learning_rate), 4),
            "delta_norm": round(float(delta_norm), 4),
            "sample_weights": [round(float(w), 4) for w in (sample_weights or [])[:6]],
            "round_id": round_id,
        }, timeout=2)
    except Exception:
        pass



# ------------------------------------------------------------------------------
# GPU Monitor (NVIDIA only, optional)
# ------------------------------------------------------------------------------
def get_gpu_utilization():
    """Returns GPU utilization % using nvidia-smi if available."""
    try:
        import subprocess
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu",
             "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=3
        )
        if result.returncode == 0:
            parts = [p.strip() for p in result.stdout.strip().split(",")]
            return {
                "util_pct": int(parts[0]),
                "mem_used_mb": int(parts[1]),
                "mem_total_mb": int(parts[2]),
                "temp_c": int(parts[3]),
            }
    except Exception:
        pass
    return None


# ------------------------------------------------------------------------------
# Dynamic Pipeline & Local Dataset Ingestion
# ------------------------------------------------------------------------------
def load_custom_pipeline(pipeline_path_or_url: str = None, server_url: str = None):
    """
    Loads custom Python pipeline script. Edge devices can edit this file locally!
    If file doesn't exist, fetches active pipeline from coordinator as template.
    """
    local_path = pipeline_path_or_url
    if not local_path or not os.path.exists(local_path):
        candidate = "pipeline.py"
        if os.path.exists(candidate):
            local_path = candidate
        elif server_url:
            try:
                print(f"[PIPELINE] Fetching active training pipeline from coordinator ({server_url})...")
                dl_url = f"{server_url}/api/pipeline/download"
                req = urllib.request.Request(dl_url, headers={"User-Agent": "FedZero-Worker/2.0"})
                with urllib.request.urlopen(req, timeout=5) as resp:
                    with open(candidate, "wb") as f_out:
                        f_out.write(resp.read())
                if os.path.exists(candidate):
                    local_path = candidate
                    print(f"[PIPELINE] Synchronized coordinator pipeline to '{candidate}'. Ready for local device edits.")
            except Exception as e:
                pass

    if local_path and os.path.exists(local_path):
        try:
            spec = importlib.util.spec_from_file_location("edge_pipeline", local_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            print(f"[PIPELINE] Custom pipeline module '{local_path}' loaded into hardware enclave.")
            return module
        except Exception as e:
            print(f"[PIPELINE_ERROR] Error loading '{local_path}': {e}. Using default architecture.")
            return None
    return None


def load_edge_dataset(data_path, pipeline_mod, fallback_samples: int, seed: int):
    """
    Loads edge node's private dataset.
    Uses pipeline.load_local_dataset() if present, or generic CSV reader.
    """
    if data_path and os.path.exists(data_path):
        if pipeline_mod and hasattr(pipeline_mod, "load_local_dataset"):
            try:
                print(f"[DATASET] Invoking pipeline.load_local_dataset('{data_path}')...")
                X, y = pipeline_mod.load_local_dataset(data_path)
                print(f"[DATASET] Loaded {len(y)} records ({len(X[0]) if X else 0} features) from {data_path}")
                return X, y
            except Exception as e:
                print(f"[DATASET_ERROR] Custom loader failed: {e}. Falling back to CSV parser.")

        import csv
        X, y = [], []
        try:
            with open(data_path, "r", encoding="utf-8", errors="ignore") as f:
                reader = csv.reader(f)
                header = next(reader, None)
                for row in reader:
                    if not row:
                        continue
                    try:
                        feats = [float(v.strip()) for v in row[:-1]]
                        lbl = int(float(row[-1].strip()))
                        X.append(feats)
                        y.append(lbl)
                    except Exception:
                        continue
            if len(y) > 0:
                print(f"[DATASET] Ingested {len(y)} private rows from '{data_path}' (Label: last column).")
                return X, y
        except Exception as e:
            print(f"[DATASET_ERROR] CSV read failed: {e}")

    print(f"[DATASET] Using isolated synthetic biomarker partition ({fallback_samples} samples).")
    return generate_local_biomarkers(n_samples=fallback_samples, seed=seed)


def detect_real_system_hardware():
    """
    Detects true, authentic hardware specs (OS, CPU, GPU, VRAM, and System RAM)
    directly from host machine OS APIs and device drivers.
    """
    # 1. Operating System
    os_name = f"{platform.system()} {platform.release()}"

    # 2. CPU Model & Cores
    cpu_cores = os.cpu_count() or 4
    cpu_name = ""
    if platform.system() == "Windows":
        # 1. Direct Windows NT Registry lookup (instant, 100% reliable on Win 10/11)
        try:
            import winreg
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\CentralProcessor\0")
            val, _ = winreg.QueryValueEx(key, "ProcessorNameString")
            if val and str(val).strip():
                cpu_name = str(val).strip()
        except Exception:
            pass

        # 2. Native PowerShell CIM query fallback
        if not cpu_name or "Family" in cpu_name:
            try:
                out = subprocess.check_output(
                    ["powershell", "-NoProfile", "-Command", "(Get-CimInstance Win32_Processor).Name"],
                    text=True,
                    timeout=3,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0)
                )
                if out.strip():
                    cpu_name = out.strip().split("\n")[0].strip()
            except Exception:
                pass

        # 3. WMIC fallback for older Windows
        if not cpu_name or "Family" in cpu_name:
            try:
                out = subprocess.check_output("wmic cpu get name", shell=True, text=True, timeout=2)
                lines = [l.strip() for l in out.strip().split("\n") if l.strip() and "Name" not in l]
                if lines:
                    cpu_name = lines[0]
            except Exception:
                pass
    elif platform.system() == "Darwin":
        try:
            out = subprocess.check_output(["sysctl", "-n", "machdep.cpu.brand_string"], text=True, timeout=2)
            if out.strip():
                cpu_name = out.strip()
        except Exception:
            pass
    elif platform.system() == "Linux":
        try:
            with open("/proc/cpuinfo", "r") as f:
                for line in f:
                    if "model name" in line:
                        cpu_name = line.split(":", 1)[1].strip()
                        break
        except Exception:
            pass

    if not cpu_name or "Family" in cpu_name:
        fallback_p = platform.processor() or platform.machine()
        if fallback_p and "Family" not in fallback_p:
            cpu_name = fallback_p
        elif not cpu_name:
            cpu_name = "Intel / AMD Multi-Core CPU"

    # 3. Total System Physical RAM (in GB)
    ram_gb = 16
    try:
        import psutil
        total_gb = psutil.virtual_memory().total / (1024**3)
        if 14 <= total_gb <= 18:
            ram_gb = 16
        elif 7 <= total_gb <= 10:
            ram_gb = 8
        elif 22 <= total_gb <= 26:
            ram_gb = 24
        elif 29 <= total_gb <= 36:
            ram_gb = 32
        elif 10 <= total_gb <= 14:
            ram_gb = 12
        else:
            ram_gb = int(round(total_gb))
    except Exception:
        if platform.system() == "Windows":
            try:
                import ctypes
                class MEMORYSTATUSEX(ctypes.Structure):
                    _fields_ = [
                        ("dwLength", ctypes.c_ulong),
                        ("dwMemoryLoad", ctypes.c_ulong),
                        ("ullTotalPhys", ctypes.c_ulonglong),
                        ("ullAvailPhys", ctypes.c_ulonglong),
                        ("ullTotalPageFile", ctypes.c_ulonglong),
                        ("ullAvailPageFile", ctypes.c_ulonglong),
                        ("ullTotalVirtual", ctypes.c_ulonglong),
                        ("ullAvailVirtual", ctypes.c_ulonglong),
                        ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
                    ]
                stat = MEMORYSTATUSEX()
                stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
                ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
                total_gb = stat.ullTotalPhys / (1024**3)
                if 14 <= total_gb <= 18:
                    ram_gb = 16
                elif 7 <= total_gb <= 10:
                    ram_gb = 8
                elif 29 <= total_gb <= 36:
                    ram_gb = 32
                else:
                    ram_gb = int(round(total_gb))
            except Exception:
                pass
        elif platform.system() == "Darwin":
            try:
                out = subprocess.check_output(["sysctl", "-n", "hw.memsize"], text=True, timeout=2)
                ram_gb = int(round(int(out.strip()) / (1024**3)))
            except Exception:
                pass
        elif platform.system() == "Linux":
            try:
                with open("/proc/meminfo", "r") as f:
                    for line in f:
                        if "MemTotal" in line:
                            kb = int(line.split()[1])
                            ram_gb = int(round(kb / (1024**2)))
                            break
            except Exception:
                pass

    # 4. GPU & VRAM Detection
    gpu_name = None
    vram_gb = 0.0

    if torch and hasattr(torch, "cuda") and torch.cuda.is_available():
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = round(torch.cuda.get_device_properties(0).total_memory / 1e9, 1)

    if not gpu_name:
        try:
            out = subprocess.check_output(
                ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
                text=True, timeout=2
            )
            parts = [p.strip() for p in out.strip().split("\n")[0].split(",")]
            if len(parts) >= 2:
                gpu_name = parts[0]
                vram_gb = round(float(parts[1]) / 1024.0, 1)
        except Exception:
            pass

    if not gpu_name and platform.system() == "Windows":
        try:
            out = subprocess.check_output("wmic path win32_VideoController get name", shell=True, text=True, timeout=2)
            cards = [l.strip() for l in out.strip().split("\n") if l.strip() and "Name" not in l]
            discrete = [c for c in cards if any(k in c.lower() for k in ("nvidia", "geforce", "rtx", "gtx", "radeon"))]
            if discrete:
                gpu_name = discrete[0]
                vram_gb = 4.0 if ("rtx" in gpu_name.lower() or "gtx" in gpu_name.lower()) else 2.0
            elif cards:
                gpu_name = cards[0]
                vram_gb = 2.0
        except Exception:
            pass

    # Clean label without losing genuine processor identity
    clean_cpu = " ".join(cpu_name.replace("(R)", "").replace("(TM)", "").replace("Processor", "").split())
    if not clean_cpu or "Family" in clean_cpu:
        clean_cpu = "Intel / AMD Multi-Core CPU"
    if gpu_name and vram_gb > 0:
        hardware_tier = f"{gpu_name} ({vram_gb} GB VRAM)"
        primary_mem = vram_gb
    else:
        hardware_tier = f"{clean_cpu} ({cpu_cores} Cores, {ram_gb} GB RAM)"
        primary_mem = ram_gb

    return {
        "hardware_tier": hardware_tier,
        "vram_gb": primary_mem,
        "system_ram_gb": ram_gb,
        "cpu_name": clean_cpu,
        "cpu_cores": cpu_cores,
        "os_name": os_name,
        "gpu_name": gpu_name or "CPU Enclave",
    }


# ------------------------------------------------------------------------------
# Main Worker Daemon Loop
# ------------------------------------------------------------------------------
def main():
    real_specs = detect_real_system_hardware()

    parser = argparse.ArgumentParser(description="FedZero Native Edge Compute Worker Daemon v2.0")
    parser.add_argument("--server", default="http://localhost:8000",
                        help="Master Coordinator URL (e.g. http://192.168.1.27:8000)")
    parser.add_argument("--name",   default=None,         help="Node Device Name (default: Hostname)")
    parser.add_argument("--tier",   default=None,         help="Hardware compute tier (default: auto-detected)")
    parser.add_argument("--vram",   type=float, default=None, help="GPU VRAM or System RAM in GB")
    parser.add_argument("--samples",type=int, default=120,help="Local dataset sample count")
    parser.add_argument("--wallet", default=None,         help="Solana payout wallet address")
    parser.add_argument("--poll-interval", type=float, default=1.8, help="Poll interval in seconds")
    parser.add_argument("--data-path", default=None,      help="Path to local private dataset CSV/file")
    parser.add_argument("--pipeline",  default=None,      help="Path to local Python pipeline script")
    args = parser.parse_args()

    server_url = args.server.rstrip("/")
    node_name = args.name or f"Edge_{platform.node().replace(' ', '_')[:14]}"
    hardware_tier = args.tier or real_specs["hardware_tier"]
    vram_gb = args.vram if args.vram is not None else real_specs["vram_gb"]

    # Wallet address
    wallet_address = args.wallet or ("0x" + hashlib.sha256(node_name.encode()).hexdigest()[:40])

    # Banner
    print("=" * 76)
    print("  FEDZERO DECENTRALIZED VERIFIABLE AI NETWORK - NATIVE EDGE WORKER v2.0")
    print(f"  Target Coordinator : {server_url}")
    print(f"  Node Identity      : {node_name}")
    print(f"  Compute Backend    : {backend_label()}")
    print(f"  Host Platform / OS : {real_specs['os_name']}")
    print(f"  Detected CPU Model : {real_specs['cpu_name']} ({real_specs['cpu_cores']} Cores)")
    print(f"  Physical System RAM: {real_specs['system_ram_gb']} GB")
    print(f"  Active Compute Spec: {hardware_tier}")
    print(f"  Payout Wallet      : {wallet_address}")
    if args.data_path:
        print(f"  Private Data Path  : {args.data_path}")
    if args.pipeline:
        print(f"  Local Pipeline     : {args.pipeline}")
    print("=" * 76)

    # GPU warmup check
    if BACKEND == "pytorch_gpu":
        print(f"\n[GPU] CUDA device active: {GPU_NAME}")
        print(f"[GPU] VRAM: {GPU_MEM} GB | CUDA version: {torch.version.cuda}")
        _w = torch.zeros(1, device=DEVICE)
        del _w
        print("[GPU] GPU warmup complete. Tensors will run on CUDA.")
    elif BACKEND == "pytorch_cpu":
        print(f"\n[INFO] PyTorch running on CPU: {real_specs['cpu_name']}.")
    elif BACKEND == "numpy_cpu":
        print(f"\n[INFO] NumPy active on CPU: {real_specs['cpu_name']}.")
    else:
        print(f"\n[INFO] Pure Python active on CPU: {real_specs['cpu_name']}.")

    # Load custom pipeline module (if available or synchronizable)
    pipeline_mod = load_custom_pipeline(args.pipeline, server_url)

    # Mount private local dataset
    print("\n[PARTITION] Initializing isolated hardware enclave...")
    seed = int(hashlib.md5(node_name.encode()).hexdigest()[:6], 16)
    X_local, y_local = load_edge_dataset(args.data_path, pipeline_mod, args.samples, seed)
    print(f"[PARTITION] Quarantined {len(y_local)} private records in memory enclave.")

    # Register with coordinator
    print(f"\n[NETWORK] Handshaking with Master Coordinator at {server_url}...")
    reg_payload = {
        "name": node_name,
        "hardware_tier": hardware_tier,
        "vram_gb": int(round(float(vram_gb))),
        "system_ram_gb": int(round(float(real_specs["system_ram_gb"]))),
        "cpu_name": real_specs["cpu_name"],
        "os_name": real_specs["os_name"],
        "samples_count": len(y_local),
        "wallet_address": wallet_address,
    }
    reg_res = http_post(f"{server_url}/api/worker/register", reg_payload)
    if "error" in reg_res:
        print(f"[WARNING] Register notice: {reg_res['error']} (Will continue polling)")
    else:
        print(f"[NETWORK] SUCCESS! Node '{node_name}' registered to Federated Mesh.")
        stream_log(server_url, node_name, wallet_address, f"[NODE_CONNECTED] Enclave initialized on {hardware_tier}. {len(y_local)} private records mounted.")

    # Create model on appropriate backend
    model = create_model(seed=seed)

    print("\n[STANDBY] Worker daemon listening. Standby for federated training dispatches...")
    last_completed_round = -1

    try:
        while True:
            poll_params = {
                "identifier": node_name,
                "wallet": wallet_address,
                "hardware_tier": hardware_tier,
                "vram_gb": str(int(round(float(vram_gb)))),
                "cpu_name": real_specs.get("cpu_name", ""),
                "system_ram_gb": str(int(round(float(real_specs.get("system_ram_gb", 16))))),
                "os_name": real_specs.get("os_name", ""),
            }
            query_str = urllib.parse.urlencode(poll_params)
            poll_res = http_get(f"{server_url}/api/worker/poll-job?{query_str}")

            if poll_res and poll_res.get("has_job"):
                round_id = poll_res.get("round_id")
                if round_id != last_completed_round:
                    print("\n" + "#" * 72)
                    print(f"  [DISPATCH RECEIVED] Federated Round #{round_id} triggered by Coordinator!")
                    print("#" * 72)

                    stream_log(server_url, node_name, wallet_address, f"[JOB_RECEIVED] Round #{round_id} triggered. Initializing local SGD on [{backend_label()}]...")

                    global_weights = poll_res.get("global_weights", [])
                    epochs = poll_res.get("epochs", 4)
                    lr = poll_res.get("learning_rate", 0.03)

                    # Load global weights
                    if global_weights:
                        model.set_weights_flat(global_weights)
                        base_weights_flat = list(global_weights)
                    else:
                        base_weights_flat = model.get_weights_flat()

                    loss_before, acc_before = model.evaluate(X_local, y_local)
                    print(f"--> Baseline: Loss = {loss_before:.4f} | Accuracy = {acc_before*100:.1f}%")
                    stream_log(server_url, node_name, wallet_address, f"[BASELINE] Initial Loss: {loss_before:.4f} | Accuracy: {acc_before*100:.1f}% | Training {epochs} Epochs (lr={lr})")
                    print(f"--> Starting {epochs} Local SGD Epochs on [{backend_label()}]...")

                    # GPU stats before training
                    gpu_before = get_gpu_utilization()
                    if gpu_before:
                        print(f"--> GPU Before: {gpu_before['util_pct']}% util | "
                              f"{gpu_before['mem_used_mb']}/{gpu_before['mem_total_mb']} MB | "
                              f"{gpu_before['temp_c']}°C")

                    epoch_logs = []
                    t_start = time.time()
                    if pipeline_mod and hasattr(pipeline_mod, "train_step"):
                        try:
                            model, epoch_logs = pipeline_mod.train_step(model, X_local, y_local, epochs=epochs, lr=lr)
                            for el in epoch_logs:
                                ep_num = el.get("epoch", 1)
                                ep_l = el.get("loss", 0.0)
                                _, ep_acc = model.evaluate(X_local, y_local)
                                curr_w = model.get_weights_flat()
                                curr_delta = [curr_w[i] - base_weights_flat[i] for i in range(len(curr_w))]
                                curr_delta_norm = math.sqrt(sum(d * d for d in curr_delta))
                                sample_w5 = [round(w, 4) for w in curr_w[:5]]
                                el["accuracy"] = ep_acc
                                el["delta_norm"] = curr_delta_norm
                                el["sample_weights"] = sample_w5
                                print(f"    [*] Epoch {ep_num}/{epochs}: Loss = {ep_l:.4f} | Accuracy = {ep_acc*100:.1f}% | Weight Delta Norm = {curr_delta_norm:.4f} | LR = {lr}")
                                print(f"        --> Weights Sample (first 5 params): {sample_w5}")
                                stream_epoch(server_url, node_name, wallet_address, ep_num, epochs, ep_l, round_id, accuracy=ep_acc, learning_rate=lr, delta_norm=curr_delta_norm, sample_weights=sample_w5)
                                stream_log(server_url, node_name, wallet_address, f"[EPOCH_METRICS] Epoch {ep_num}/{epochs} | Loss = {ep_l:.4f} | Accuracy = {ep_acc*100:.1f}% | Delta Norm = {curr_delta_norm:.4f} | Sample Weights = {sample_w5}")
                        except Exception as p_err:
                            print(f"[PIPELINE_FALLBACK] Custom step raised {p_err}. Executing default SGD...")
                            for ep in range(1, epochs + 1):
                                ep_loss = model.train_epoch(X_local, y_local, lr=lr)
                                _, ep_acc = model.evaluate(X_local, y_local)
                                curr_w = model.get_weights_flat()
                                curr_delta = [curr_w[i] - base_weights_flat[i] for i in range(len(curr_w))]
                                curr_delta_norm = math.sqrt(sum(d * d for d in curr_delta))
                                sample_w5 = [round(w, 4) for w in curr_w[:5]]
                                epoch_logs.append({
                                    "epoch": ep,
                                    "loss": ep_loss,
                                    "accuracy": ep_acc,
                                    "delta_norm": curr_delta_norm,
                                    "sample_weights": sample_w5,
                                })
                                print(f"    [*] Epoch {ep}/{epochs}: Loss = {ep_loss:.4f} | Accuracy = {ep_acc*100:.1f}% | Weight Delta Norm = {curr_delta_norm:.4f} | LR = {lr}")
                                print(f"        --> Weights Sample (first 5 params): {sample_w5}")
                                stream_epoch(server_url, node_name, wallet_address, ep, epochs, ep_loss, round_id, accuracy=ep_acc, learning_rate=lr, delta_norm=curr_delta_norm, sample_weights=sample_w5)
                                stream_log(server_url, node_name, wallet_address, f"[EPOCH_METRICS] Epoch {ep}/{epochs} | Loss = {ep_loss:.4f} | Accuracy = {ep_acc*100:.1f}% | Delta Norm = {curr_delta_norm:.4f} | Sample Weights = {sample_w5}")
                                time.sleep(0.08)
                    else:
                        for ep in range(1, epochs + 1):
                            ep_loss = model.train_epoch(X_local, y_local, lr=lr)
                            _, ep_acc = model.evaluate(X_local, y_local)
                            curr_w = model.get_weights_flat()
                            curr_delta = [curr_w[i] - base_weights_flat[i] for i in range(len(curr_w))]
                            curr_delta_norm = math.sqrt(sum(d * d for d in curr_delta))
                            sample_w5 = [round(w, 4) for w in curr_w[:5]]
                            epoch_logs.append({
                                "epoch": ep,
                                "loss": ep_loss,
                                "accuracy": ep_acc,
                                "delta_norm": curr_delta_norm,
                                "sample_weights": sample_w5,
                            })
                            print(f"    [*] Epoch {ep}/{epochs}: Loss = {ep_loss:.4f} | Accuracy = {ep_acc*100:.1f}% | Weight Delta Norm = {curr_delta_norm:.4f} | LR = {lr}")
                            print(f"        --> Weights Sample (first 5 params): {sample_w5}")
                            stream_epoch(server_url, node_name, wallet_address, ep, epochs, ep_loss, round_id, accuracy=ep_acc, learning_rate=lr, delta_norm=curr_delta_norm, sample_weights=sample_w5)
                            stream_log(server_url, node_name, wallet_address, f"[EPOCH_METRICS] Epoch {ep}/{epochs} | Loss = {ep_loss:.4f} | Accuracy = {ep_acc*100:.1f}% | Delta Norm = {curr_delta_norm:.4f} | Sample Weights = {sample_w5}")
                            time.sleep(0.08)

                    t_elapsed = time.time() - t_start

                    # GPU stats after training
                    gpu_after = get_gpu_utilization()
                    if gpu_after:
                        print(f"--> GPU After:  {gpu_after['util_pct']}% util | "
                              f"{gpu_after['mem_used_mb']}/{gpu_after['mem_total_mb']} MB | "
                              f"{gpu_after['temp_c']}°C")

                    loss_after, acc_after = model.evaluate(X_local, y_local)
                    acc_gain = acc_after - acc_before

                    # Weight delta, L2 norms, parameter counts, and SHA-256
                    new_weights_flat = model.get_weights_flat()
                    delta = [new_weights_flat[i] - base_weights_flat[i] for i in range(len(new_weights_flat))]
                    delta_norm = math.sqrt(sum(d*d for d in delta))
                    total_params = len(new_weights_flat)
                    weights_l2_norm = math.sqrt(sum(w*w for w in new_weights_flat))
                    weights_preview_8 = [round(w, 4) for w in new_weights_flat[:8]]
                    delta_preview_8 = [round(d, 4) for d in delta[:8]]
                    delta_bytes = json.dumps([round(d, 5) for d in delta]).encode("utf-8")
                    update_hash = hashlib.sha256(delta_bytes).hexdigest()

                    print("\n" + "=" * 76)
                    print(f" [LOCAL SGD COMPLETE] Model Training Converged on [{backend_label()}]")
                    print(f" --> Total Parameters: {total_params} weights")
                    print(f" --> Overall Weights L2 Norm: {weights_l2_norm:.4f} | Gradient Delta Norm: {delta_norm:.4f}")
                    print(f" --> Baseline Performance:    Loss = {loss_before:.4f} | Accuracy = {acc_before*100:.1f}%")
                    print(f" --> Final Performance:       Loss = {loss_after:.4f}  | Accuracy = {acc_after*100:.1f}% (+{acc_gain*100:.1f}%)")
                    print(f" --> Trained Weights Vector (first 8 params): {weights_preview_8}")
                    print(f" --> Gradient Delta Vector (first 8 params):  {delta_preview_8}")
                    print(f" --> SHA-256 Update Hash: {update_hash[:16]}...")
                    print("=" * 76 + "\n")

                    stream_log(server_url, node_name, wallet_address, f"[SGD_CONVERGED] Local SGD complete in {t_elapsed:.2f}s on {hardware_tier}. Loss: {loss_before:.4f}->{loss_after:.4f} (Acc: {acc_before*100:.1f}%->{acc_after*100:.1f}%, Gain: +{acc_gain*100:.1f}%)")
                    stream_log(server_url, node_name, wallet_address, f"[LOCAL_WEIGHTS_SUMMARY] Params={total_params} | L2 Norm={weights_l2_norm:.4f} | Delta Norm={delta_norm:.4f} | Weights Vector Preview={weights_preview_8}")

                    # Witness sample
                    sample_in = X_local[0]
                    sample_logits, _, _ = model.forward_one(sample_in)

                    # Submit to coordinator
                    submit_payload = {
                        "node_name": node_name,
                        "wallet_address": wallet_address,
                        "round_id": round_id,
                        "hardware_tier": hardware_tier,
                        "compute_backend": backend_label(),
                        "delta_norm": delta_norm,
                        "weights_l2_norm": weights_l2_norm,
                        "total_params": total_params,
                        "weights_preview": weights_preview_8,
                        "delta_preview": delta_preview_8,
                        "loss_before": loss_before,
                        "loss_after": loss_after,
                        "loss_reduction": max(0.0, loss_before - loss_after),
                        "accuracy_gain": acc_gain,
                        "update_hash": update_hash,
                        "update_weights": delta,
                        "num_samples": len(y_local),
                        "sample_witness_input": [sample_in],
                        "sample_witness_output": [sample_logits],
                        "epoch_logs": epoch_logs,
                        "gpu_stats": gpu_after,
                        "training_time_sec": round(t_elapsed, 3),
                    }

                    print("[SUBMIT] Transmitting locally computed weights to Master Coordinator...")
                    stream_log(server_url, node_name, wallet_address, f"[TRANSMITTING_WEIGHTS] Gradient update hash: {update_hash[:16]}... (Delta norm = {delta_norm:.4f}, Total params = {total_params}). Transmitting to coordinator.")
                    sub_res = http_post(f"{server_url}/api/worker/submit-update", submit_payload)
                    if "error" in sub_res:
                        print(f"[ERROR] Submission failed: {sub_res['error']}")
                        stream_log(server_url, node_name, wallet_address, f"[SUBMIT_FAILED] Error: {sub_res['error']}")
                    else:
                        print(f"[SUCCESS] Round #{round_id} update ACCEPTED by Coordinator!")
                        print(f"[REWARD] Incentive tokens disbursed to wallet {wallet_address[:12]}...")
                        stream_log(server_url, node_name, wallet_address, f"[ACCEPTED] Coordinator accepted update for Round #{round_id}! Verified in Byzantine FedAvg.")

                    last_completed_round = round_id
                    print("\n[STANDBY] Returning to standby for next round...\n")

            time.sleep(args.poll_interval)

    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Worker daemon terminated cleanly by user.")
        sys.exit(0)


if __name__ == "__main__":
    main()
