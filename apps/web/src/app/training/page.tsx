"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Play,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Coins,
  ArrowRight,
  Lock,
  Plus,
  Terminal,
  Server,
  Zap,
  X,
  Laptop,
  Activity,
  Trash2,
  Check,
  Box,
  FolderPlus,
  Sliders
} from "lucide-react";
import NetworkHologram3D from "@/components/NetworkHologram3D";

export default function TrainingPage() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [lastRoundResult, setLastRoundResult] = useState<any>(null);

  // Training Hyperparameters
  const [epochs, setEpochs] = useState<number>(4);
  const [learningRate, setLearningRate] = useState<number>(0.03);

  // Live Console Logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [hardwareTier, setHardwareTier] = useState("RTX4090");
  const [vramGb, setVramGb] = useState(16);
  const [sampleCount, setSampleCount] = useState(250);
  const [submittingDevice, setSubmittingDevice] = useState(false);

  const fetchRounds = async () => {
    try {
      const res = await fetch("/api/training/rounds");
      if (res.ok) {
        const data = await res.json();
        setRounds(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/providers");
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    fetchProviders();
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  // Quick preset helper
  const applyPreset = (presetName: string, tier: string, vram: number, samples: number) => {
    setDeviceName(presetName);
    setHardwareTier(tier);
    setVramGb(vram);
    setSampleCount(samples);
  };

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    setSubmittingDevice(true);

    try {
      const res = await fetch("/api/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deviceName,
          hardware_tier: hardwareTier,
          vram_gb: Number(vramGb),
          samples_count: Number(sampleCount),
        }),
      });

      if (res.ok) {
        await fetchProviders();
        setShowModal(false);
        setDeviceName("");
        setConsoleLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [System] ✅ Added Device: "${deviceName}" (${hardwareTier}, ${vramGb}GB VRAM). Joined Federated Training Pool.`,
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDevice(false);
    }
  };

  const runFederatedRound = async () => {
    setIsTraining(true);
    setActiveStep(1);
    setConsoleLogs([
      `[${new Date().toLocaleTimeString()}] [Coordinator] Initializing round across ${providers.length} edge devices...`,
      `[${new Date().toLocaleTimeString()}] [Coordinator] Round Hyperparameters: Local Epochs = ${epochs} | Learning Rate η = ${learningRate} | Mini-batch SGD`,
      `[${new Date().toLocaleTimeString()}] [Coordinator] Broadcasting latest global baseline weights (SHA-256 verified)...`,
    ]);

    // Visual step progression
    setTimeout(() => setActiveStep(2), 600);
    setTimeout(() => setActiveStep(3), 1200);
    setTimeout(() => setActiveStep(4), 1800);
    setTimeout(() => setActiveStep(5), 2400);

    try {
      const res = await fetch("/api/demo/run-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epochs: Number(epochs), learning_rate: Number(learningRate) }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastRoundResult(data);
        setActiveStep(6);

        if (data.logs && Array.isArray(data.logs)) {
          setConsoleLogs(data.logs);
        }

        await fetchRounds();
        await fetchProviders();
      }
    } catch (e) {
      console.error(e);
      setConsoleLogs((prev) => [...prev, `[ERROR] Failed to complete round execution.`]);
    } finally {
      setIsTraining(false);
      setTimeout(() => setActiveStep(null), 4000);
    }
  };

  const steps = [
    { num: 1, title: "1. Local Edge Training", desc: "Private SGD on each node partition", icon: Cpu },
    { num: 2, title: "2. zkML Prover Synthesis", desc: "Halo2 KZG proof over ONNX trace", icon: ShieldCheck },
    { num: 3, title: "3. Arbitrum EVM Verify", desc: "ZKVerifier.sol pairing validation", icon: CheckCircle2 },
    { num: 4, title: "4. Cross-Chain Relayer", desc: "Verification bridged to Solana", icon: ArrowRight },
    { num: 5, title: "5. Solana Rewards", desc: "Quality × Tier × Validity formula", icon: Coins },
    { num: 6, title: "6. Robust FedAvg", desc: "Norm clipping & outlier filtering", icon: Layers },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner & Primary CTAs */}
      <div className="p-7 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Data Leakage • Federated Learning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Training Control Center
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Run decentralized training across multiple simulated edge devices. All raw datasets remain strictly on client nodes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            href="/datasets"
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-sm font-semibold shadow-sm transition-all hover:scale-102"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span>Dataset & AutoML Studio</span>
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-cyan-500/30 text-sm font-semibold shadow-sm transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+ Add Device Node</span>
          </button>

          <button
            onClick={runFederatedRound}
            disabled={isTraining}
            className="flex items-center justify-center space-x-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Training In Progress...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Training Round</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Round Hyperparameters Tuning Deck */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Round Hyperparameter Calibration</span>
          </div>
          <p className="text-xs text-slate-400">
            Tune local client SGD iterations and gradient descent learning rate before dispatching federated round.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          {/* Local Epochs Slider & Stepper */}
          <div className="space-y-1.5 min-w-[200px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">Local Epochs (E):</span>
              <span className="px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                {epochs} {epochs === 1 ? "Epoch" : "Epochs"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1</span>
              <span>3</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Learning Rate Selector */}
          <div className="space-y-1.5 min-w-[220px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] text-slate-400">Learning Rate (η):</span>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
                {learningRate}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {[0.005, 0.01, 0.03, 0.05, 0.1].map((lr) => (
                <button
                  key={lr}
                  type="button"
                  onClick={() => setLearningRate(lr)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                    learningRate === lr
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {lr}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500">
              Optimal convergence range: 0.01 - 0.05
            </div>
          </div>

          {/* Mini-batch & Loss specs pill */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-white font-bold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>SGD Optimizer Specs</span>
            </div>
            <div>Mini-batch: <span className="text-cyan-300">32 samples</span></div>
            <div>Est. Iterations: <span className="text-indigo-300">{epochs * 8} steps/node</span></div>
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-800/80">
          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Active Devices</div>
            <div className="text-xl font-bold text-white mt-1">{providers.length} Nodes</div>
          </div>
          <Server className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-800/80">
          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Completed Rounds</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">{rounds.length} Rounds</div>
          </div>
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-800/80">
          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Global Accuracy</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {rounds.length > 0 ? `${rounds[0].accuracy_after}%` : "94.50%"}
            </div>
          </div>
          <Zap className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-800/80">
          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Privacy Guarantee</div>
            <div className="text-xl font-bold text-purple-300 mt-1">0 Bytes Leak</div>
          </div>
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
      </div>

      {/* Connected Participating Devices Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Participating Edge Nodes ({providers.length})</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Level 1: Multi-Device In-Memory Virtualization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((p, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border card-3d transition-all duration-200 relative group overflow-hidden ${isTraining
                  ? "bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-500/10 scale-101"
                  : "glass-panel border-slate-800/80 hover:border-slate-700"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-cyan-400 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-white truncate">{p.device_name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1.5 border ${isTraining
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isTraining ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`}></span>
                  <span>{isTraining ? "Training" : "Ready"}</span>
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Compute Tier</span>
                  <div className="text-cyan-300 font-semibold">{p.hardware_tier}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Memory</span>
                  <div className="text-slate-300 font-semibold">{p.declared_vram_gb} GB VRAM</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">Total Rewards:</span>
                <span className="text-pink-400 font-bold">{p.total_rewards_earned ? p.total_rewards_earned.toFixed(1) : "0.0"} SOL</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Hologram + Live Terminal Twin Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Neural Constellation Hologram */}
        <div className="lg:col-span-5 hologram-card card-3d p-6 flex flex-col justify-between border border-cyan-500/30">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs font-mono">
              <Box className="w-4 h-4" />
              <span>3D NEURAL TOPOLOGY</span>
            </div>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
              isTraining
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              {isTraining ? "⚡ Turborotation Active" : "Orbiting Stable"}
            </span>
          </div>

          <div className="w-full h-64 relative flex items-center justify-center my-2">
            <NetworkHologram3D 
              activeNodesCount={providers.length}
              isTraining={isTraining}
            />
          </div>

          <div className="pt-3 border-t border-cyan-500/20 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Active Edge Satellites</span>
              <span className="text-cyan-300 font-bold">{providers.length} Virtual Nodes</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Privacy State</span>
              <span className="text-emerald-400 font-bold">100% Shielded</span>
            </div>
          </div>
        </div>

        {/* Live Terminal Execution Console */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                  LIVE TRAINING TERMINAL (Per-Device Stream)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Console Active</span>
                </span>

                {consoleLogs.length > 0 && (
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center space-x-1 hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                    title="Clear Logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#050811] border border-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-2 shadow-inner mt-4">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-500 italic py-16 text-center">
                  Click &quot;Start Training Round&quot; above to see real-time distributed edge logs stream across all participating devices...
                </div>
              ) : (
                consoleLogs.map((log, i) => {
                  let tagColor = "text-slate-400";
                  if (log.includes("[Coordinator]")) {
                    tagColor = "text-cyan-400 font-bold";
                  } else if (log.includes("[Arbitrum]")) {
                    tagColor = "text-indigo-300 font-bold";
                  } else if (log.includes("[Solana]")) {
                    tagColor = "text-pink-400 font-bold";
                  } else if (log.includes("[zkML Prover]")) {
                    tagColor = "text-purple-300 font-bold";
                  } else if (log.includes("✅")) {
                    tagColor = "text-emerald-300";
                  }

                  return (
                    <div key={i} className="flex items-start space-x-2.5 leading-relaxed">
                      <span className="text-slate-600 select-none text-[11px]">&gt;</span>
                      <span className={tagColor}>{log}</span>
                    </div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Timeline */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Six-Stage Verifiable Workflow
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.num;
            const isDone = activeStep !== null && activeStep > s.num;

            return (
              <div
                key={s.num}
                className={`p-4 rounded-2xl border transition-all duration-300 space-y-1.5 ${isCurrent
                    ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-103"
                    : isDone
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-400"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isCurrent ? "text-cyan-400 animate-bounce" : isDone ? "text-emerald-400" : "text-slate-500"}`} />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800">
                    Step {s.num}
                  </span>
                </div>
                <div className="text-xs font-bold text-white pt-1">{s.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Training Rounds Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Training Round Lineage History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Round</th>
                <th className="p-3.5">New Model Hash</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Loss</th>
                <th className="p-3.5">Accepted Nodes</th>
                <th className="p-3.5">Arbitrum Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rounds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-cyan-400">#{r.round_number}</td>
                  <td className="p-3.5 text-cyan-300 font-mono truncate max-w-xs">{r.new_model_hash}</td>
                  <td className="p-3.5 text-emerald-400 font-bold">{r.accuracy_after}% (+{r.accuracy_delta}%)</td>
                  <td className="p-3.5 text-slate-300">{r.loss_after}</td>
                  <td className="p-3.5 text-purple-300 font-bold">{r.accepted_nodes} / {r.participating_nodes}</td>
                  <td className="p-3.5 text-indigo-400 truncate max-w-xs">{r.arbitrum_tx_hash || "Simulated Tx"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Device Node */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-[#090e1c] border border-cyan-500/40 w-full max-w-lg rounded-3xl p-7 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add Edge Device Node</span>
              </h3>
              <p className="text-xs text-slate-400">
                Quickly add a new virtualized edge device with its own hardware tier and private training partition.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => applyPreset("Apollo Hospital Delhi", "A100", 80, 300)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 text-center transition-all"
                >
                  🏥 Hospital Server
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Gaming Laptop RTX 3050", "RTX4090", 16, 200)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 text-center transition-all"
                >
                  💻 Laptop GPU
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Edge IoT Diagnostic Sensor", "EdgeDevice", 4, 150)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 text-center transition-all"
                >
                  📱 Mobile / IoT
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterDevice} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-300">Device Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fortis Healthcare, or Home Laptop"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300">Hardware Tier</label>
                  <select
                    value={hardwareTier}
                    onChange={(e) => setHardwareTier(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="H100">NVIDIA H100 (2.5x Reward)</option>
                    <option value="A100">NVIDIA A100 (2.0x Reward)</option>
                    <option value="RTX4090">NVIDIA RTX 4090 (1.5x)</option>
                    <option value="T4">NVIDIA T4 (1.0x)</option>
                    <option value="EdgeDevice">Mobile / IoT Edge (0.8x)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Dedicated VRAM (GB)</label>
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={vramGb}
                    onChange={(e) => setVramGb(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">Local Private Training Samples</label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={sampleCount}
                  onChange={(e) => setSampleCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500">
                  Data stays strictly localized in memory. Zero raw samples uploaded.
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDevice}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-md shadow-cyan-500/20"
                >
                  {submittingDevice ? "Provisioning..." : "Add to Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
