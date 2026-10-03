"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Coins, 
  ArrowUpRight, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Lock, 
  RefreshCw,
  Play
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningRound, setRunningRound] = useState(false);
  const [roundResult, setRoundResult] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/network/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerRound = async () => {
    setRunningRound(true);
    try {
      const res = await fetch("/api/demo/run-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epochs: 3, learning_rate: 0.03 }),
      });
      if (res.ok) {
        const data = await res.json();
        setRoundResult(data);
        await fetchStats();
      }
    } catch (e) {
      console.error("Failed to run round", e);
    } finally {
      setRunningRound(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Federated Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            DECENTRALIZED AI NETWORK
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Collaboratively training deep machine learning models across distributed edge devices without sharing raw private data. 
            Cryptographically verified with <span className="text-cyan-300 font-semibold">zkML</span> proofs on <span className="text-cyan-300 font-semibold">Arbitrum</span>, coordinated and rewarded via <span className="text-emerald-400 font-semibold">Solana</span>, inspired by <span className="text-purple-300 font-semibold">Zcash</span> zero-knowledge cryptography.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch gap-3">
          <button
            onClick={triggerRound}
            disabled={runningRound}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
          >
            {runningRound ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Round...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Training Round</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: "Active Contributors", val: stats?.active_contributors ?? 3, icon: Cpu, color: "text-cyan-400", border: "border-cyan-500/20" },
          { label: "Training Rounds", val: stats?.training_rounds ?? 0, icon: Layers, color: "text-indigo-400", border: "border-indigo-500/20" },
          { label: "Verified Contributions", val: stats?.verified_contributions ?? 0, icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20" },
          { label: "ZK Proofs Verified", val: stats?.zk_proofs_verified ?? 0, icon: ShieldCheck, color: "text-purple-400", border: "border-purple-500/20" },
          { label: "Models Registered", val: stats?.models_count ?? 1, icon: Database, color: "text-blue-400", border: "border-blue-500/20" },
          { label: "Global Accuracy", val: `${stats?.global_accuracy ?? 0}%`, icon: Zap, color: "text-amber-400", border: "border-amber-500/20" },
          { label: "Total Rewards", val: `${stats?.total_rewards_distributed ?? 0} SOL`, icon: Coins, color: "text-pink-400", border: "border-pink-500/20" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl glass-panel border ${item.border} space-y-2`}>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-xl md:text-2xl font-bold font-mono text-white">
                {loading ? "..." : item.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Chain Infrastructure Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Arbitrum */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
                ARB
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Arbitrum Layer 2</h3>
                <p className="text-xs text-slate-400 font-mono">Verification & Trust Layer</p>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Connected</span>
            </span>
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">ZKVerifier.sol:</span>
              <span className="text-cyan-400">0x5FbD...aa3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ModelRegistry.sol:</span>
              <span className="text-cyan-400">0xe7f1...0512</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">AIPassport.sol:</span>
              <span className="text-cyan-400">0xCf7E...0Fc9</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verifies succinct zkML Groth16/KZG pairing constraints, preserves immutable model version CIDs, and stores Soulbound AI Passports.
          </p>
        </div>

        {/* Solana */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                SOL
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Solana High-Throughput</h3>
                <p className="text-xs text-slate-400 font-mono">Coordination & Incentives</p>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Connected</span>
            </span>
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Program ID:</span>
              <span className="text-emerald-400">Compute1...1111</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reward Rate:</span>
              <span className="text-emerald-400">10.00 Base Token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Anti-Sybil:</span>
              <span className="text-emerald-400">Rate-Limited PDA</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dispatches automated micro-incentive token rewards based on model quality, compute tiers (RTX 4090, A100, T4), and proof validity.
          </p>
        </div>

        {/* Zcash Pavilion */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold font-mono text-sm">
                ZEC
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Zcash Cryptographic Pavilion</h3>
                <p className="text-xs text-slate-400 font-mono">Zero-Knowledge Reference</p>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>Operational</span>
            </span>
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Principle:</span>
              <span className="text-purple-400">Shielded Computation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ZK Paradigm:</span>
              <span className="text-purple-400">Halo2 / KZG SNARK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Raw Data Uploaded:</span>
              <span className="text-emerald-400">0.00 Bytes (100% Private)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The foundational privacy reference: just as Zcash proves financial transactions without disclosing amounts or parties, our network proves valid ML computations without disclosing private clinical datasets.
          </p>
        </div>
      </div>

      {/* Latest Live Round Execution Card (if triggered) */}
      {roundResult && (
        <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>Training Round #{roundResult.round_id} Completed Successfully</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              0 Raw Data Uploaded
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">New Global Hash</div>
              <div className="text-cyan-300 truncate mt-1">{roundResult.new_hash}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">Accuracy Gain</div>
              <div className="text-emerald-400 font-bold mt-1">
                +{roundResult.accuracy_delta ? (roundResult.accuracy_delta * 100).toFixed(2) : "0"}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">Arbitrum Lineage Tx</div>
              <div className="text-indigo-300 truncate mt-1">{roundResult.arbitrum_round_tx}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">ZK Proofs Verified</div>
              <div className="text-purple-300 font-bold mt-1">{roundResult.proofs_verified} / 3 Nodes</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/training" className="p-6 rounded-2xl glass-panel hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              Training Control Center
            </h4>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Inspect the live federated round runner with step-by-step visualizers (Local Train → zkML Proof → Arbitrum Verify → Solana Reward).
          </p>
        </Link>

        <Link href="/proofs" className="p-6 rounded-2xl glass-panel hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
              Zero-Knowledge Proofs
            </h4>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Examine ONNX computation graph constraints, witness quantization, and BN254 scalar field public input commitments.
          </p>
        </Link>

        <Link href="/passport" className="p-6 rounded-2xl glass-panel hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              AI Contributor Passport
            </h4>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Review decentralized Soulbound reputation tokens, contributor tiers (Platinum, Gold, Silver), and tamper-evident achievements.
          </p>
        </Link>
      </div>
    </div>
  );
}
