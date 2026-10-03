"use client";

import { useEffect, useState } from "react";
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
  AlertCircle
} from "lucide-react";

export default function TrainingPage() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [lastRoundResult, setLastRoundResult] = useState<any>(null);

  const fetchRounds = async () => {
    try {
      const res = await fetch("/api/training/rounds");
      if (res.ok) {
        const data = await res.json();
        setRounds(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const runFederatedRound = async () => {
    setIsTraining(true);
    setActiveStep(1);

    // Step 1: Local training
    setTimeout(() => setActiveStep(2), 600);
    // Step 2: zkML proof generation
    setTimeout(() => setActiveStep(3), 1200);
    // Step 3: Arbitrum verify
    setTimeout(() => setActiveStep(4), 1800);
    // Step 4: Relayer & Solana rewards
    setTimeout(() => setActiveStep(5), 2400);

    try {
      const res = await fetch("/api/demo/run-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epochs: 3, learning_rate: 0.03 }),
      });
      if (res.ok) {
        const data = await res.json();
        setLastRoundResult(data);
        setActiveStep(6);
        await fetchRounds();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
      setTimeout(() => setActiveStep(null), 5000);
    }
  };

  const steps = [
    { num: 1, title: "1. Local Edge Training", desc: "Private local SGD on Hospital Alpha, Beta, & Gamma nodes (Raw data stays local)", icon: Cpu },
    { num: 2, title: "2. zkML Prover Synthesis", desc: "Halo2 / KZG proof generated over quantized ONNX computation trace", icon: ShieldCheck },
    { num: 3, title: "3. Arbitrum EVM Verification", desc: "ZKVerifier.sol pairing check validates public hash bindings", icon: CheckCircle2 },
    { num: 4, title: "4. Cross-Chain Relayer", desc: "Verification event bridged to Solana compute program", icon: ArrowRight },
    { num: 5, title: "5. Solana Token Disbursement", desc: "Dynamic reward calculated: Quality × Tier × ProofValidity", icon: Coins },
    { num: 6, title: "6. Robust FedAvg Aggregation", desc: "Norm clipping & outlier filtering updates global baseline", icon: Layers },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Federated Training Control Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch distributed training rounds across medical nodes, monitor zero-knowledge proofs, and verify dual-chain settlements.
          </p>
        </div>

        <button
          onClick={runFederatedRound}
          disabled={isTraining}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
        >
          {isTraining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Federated Round</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Stepper */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>End-to-End Cryptographic Execution Pipeline</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeStep ? `Running Step ${activeStep} of 6` : "Ready to Dispatch"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.num;
            const isDone = activeStep !== null && activeStep > s.num;

            return (
              <div
                key={s.num}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2 ${
                  isCurrent
                    ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                    : isDone
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isCurrent ? "text-cyan-400 animate-bounce" : isDone ? "text-emerald-400" : "text-slate-500"}`} />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800">
                    Step {s.num}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{s.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Result Details */}
      {lastRoundResult && (
        <div className="p-6 rounded-2xl glass-panel-glow border border-emerald-500/30 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Round #{lastRoundResult.round_id} Settlement Complete</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Global Accuracy:</span>
              <div className="text-emerald-400 font-bold text-sm mt-1">
                {(lastRoundResult.accuracy_after * 100).toFixed(2)}% (+{(lastRoundResult.accuracy_delta * 100).toFixed(2)}%)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Participating Nodes:</span>
              <div className="text-cyan-400 font-bold text-sm mt-1">
                {lastRoundResult.participating_clients.length} Nodes Verified (3 Proofs)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Solana Token Rewards:</span>
              <div className="text-pink-400 font-bold text-sm mt-1">
                {lastRoundResult.solana_payouts.reduce((a: any, b: any) => a + (b.tokens || 0), 0).toFixed(2)} SOL Distributed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Training Rounds Table */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Training Round Lineage History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Round</th>
                <th className="p-3">New Model Hash</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Loss</th>
                <th className="p-3">Accepted Nodes</th>
                <th className="p-3">Arbitrum Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rounds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-cyan-400">#{r.round_number}</td>
                  <td className="p-3 text-cyan-300 font-mono truncate max-w-xs">{r.new_model_hash}</td>
                  <td className="p-3 text-emerald-400 font-bold">{r.accuracy_after}% (+{r.accuracy_delta}%)</td>
                  <td className="p-3 text-slate-300">{r.loss_after}</td>
                  <td className="p-3 text-purple-300 font-bold">{r.accepted_nodes} / {r.participating_nodes}</td>
                  <td className="p-3 text-indigo-400 truncate max-w-xs">{r.arbitrum_tx_hash || "Simulated Tx"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
