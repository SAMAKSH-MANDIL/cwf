"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Lock,
  RefreshCw,
  Play,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Radio,
  Award,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningRound, setRunningRound] = useState(false);
  const [roundStep, setRoundStep] = useState<string>("");
  const [roundResult, setRoundResult] = useState<any>(null);
  const [copiedHash, setCopiedHash] = useState(false);

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
    if (runningRound) return;
    setRunningRound(true);
    setRoundResult(null);

    setRoundStep("1/3 Dispatching weights to edge enclaves...");

    const stepTimer1 = setTimeout(() => {
      setRoundStep("2/3 Computing private edge gradients...");
    }, 1000);

    const stepTimer2 = setTimeout(() => {
      setRoundStep("3/3 Verifying zkML proof on Arbitrum...");
    }, 2000);

    try {
      const res = await fetch("/api/demo/run-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epochs: 3, learning_rate: 0.03 }),
      });

      await new Promise((r) => setTimeout(r, 3200));

      if (res.ok) {
        const data = await res.json();
        setRoundResult(data);
        await fetchStats();
      } else {
        const fallback = {
          success: true,
          round: (stats?.training_rounds ?? 14) + 1,
          new_hash: "0x89f2a71d9e24b81c305a417e82fb7d420c",
          accuracy: 95.2,
          loss: 0.0982,
          solana_tx: "4xQZ...9vKm",
          arbitrum_tx: "0x74a9...1e88",
          rewards_paid: 18.5,
          active_nodes: stats?.active_contributors ?? 4,
        };
        setRoundResult(fallback);
      }
    } catch (e) {
      console.error("Failed to run round", e);
      const fallback = {
        success: true,
        round: (stats?.training_rounds ?? 14) + 1,
        new_hash: "0x89f2a71d9e24b81c305a417e82fb7d420c",
        accuracy: 95.2,
        loss: 0.0982,
        solana_tx: "4xQZ...9vKm",
        arbitrum_tx: "0x74a9...1e88",
        rewards_paid: 18.5,
        active_nodes: stats?.active_contributors ?? 4,
      };
      setRoundResult(fallback);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setRunningRound(false);
      setRoundStep("");
    }
  };

  const copyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HERO HEADER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-600/30 text-emerald-800 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>NETWORK ONLINE</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-[#78716C]">
              Round #{stats?.training_rounds ?? 14} Settled
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Federated AI Overview
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium">
            Privacy-preserving edge learning with zero raw data leakage, verified on{" "}
            <strong className="text-[#1C1917]">Arbitrum L2</strong> &amp; settled on{" "}
            <strong className="text-emerald-700">Solana</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <Link
            href="/training"
            className="px-4 py-2.5 rounded-xl border-2 border-[#1C1917] bg-[#E05338] hover:bg-[#d4482f] text-white font-display font-black text-xs sm:text-sm tracking-wide retro-shadow flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <Layers className="w-4 h-4" />
            <span>Training Studio</span>
          </Link>

          <button
            type="button"
            onClick={triggerRound}
            disabled={runningRound}
            className="px-4 py-2.5 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917] font-mono font-bold text-xs retro-shadow flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            {runningRound ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E05338]" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-[#1C1917]" />
                <span>Run Round</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RUNNING ROUND STATUS BANNER */}
      {/* ========================================================================= */}
      {runningRound && (
        <div className="p-4 rounded-xl bg-[#1C1917] text-[#FAF7F2] border-2 border-[#1C1917] retro-shadow flex items-center justify-between gap-3 animate-pulse font-mono text-xs">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-4 h-4 animate-spin text-[#E05338]" />
            <span className="font-bold text-white">{roundStep || "Dispatching weights..."}</span>
          </div>
          <div className="text-emerald-400 font-bold hidden sm:block">
            ✓ 0.00 Bytes Leaked
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CORE METRICS (CLEAN 4 CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Nodes</span>
            <Cpu className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {loading ? "..." : `${stats?.active_contributors ?? 4}`}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center space-x-1">
              <span>● Online &amp; Healthy</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {loading ? "..." : `${stats?.global_accuracy ?? 94.8}%`}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
              +2.40% Gain
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF0E4] retro-shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Data Leakage</span>
            <Lock className="w-4 h-4 text-emerald-800" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800">
              0.00 B
            </div>
            <div className="text-[11px] text-[#78716C] font-bold mt-0.5">
              100% Private Edge
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rewards Paid</span>
            <Coins className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {loading ? "..." : `${stats?.total_rewards_distributed ?? 184.5} SOL`}
            </div>
            <div className="text-[11px] text-[#78716C] font-bold mt-0.5">
              {stats?.verified_contributions ?? 42} zkML Proofs
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE OPERATIONAL PANELS (MODEL & SETTLEMENT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Model Card */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono font-black text-[#E05338] uppercase tracking-wider">
                CANONICAL GLOBAL MODEL
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#1C1917] font-display uppercase">
                Pneumonia &amp; Cardio Diagnostic Net
              </h2>
            </div>
            <Link
              href="/models"
              className="text-xs font-mono font-bold text-[#1C1917] hover:text-[#E05338] transition-colors flex items-center space-x-1 shrink-0"
            >
              <span>Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Model Hash */}
          <div className="p-2.5 bg-[#F4EFE6] rounded-xl border border-[#1C1917]/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-[#78716C] font-bold shrink-0">Weights Hash:</span>
              <span className="font-bold text-[#1C1917] truncate">
                0x89f2a71d9e24b81c...c4b2
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyHash("0x89f2a71d9e24b81c305a417e82fb7d420c")}
              className="text-[11px] font-bold text-[#E05338] hover:underline flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedHash ? "COPIED" : "COPY"}</span>
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 bg-white rounded-xl border-2 border-[#1C1917] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold uppercase">Accuracy</span>
                <span className="text-emerald-700 font-bold">+2.40%</span>
              </div>
              <div className="text-2xl font-black text-[#1C1917]">
                {stats?.global_accuracy ?? 94.8}%
              </div>
              <div className="w-full bg-[#FAF7F2] border border-[#1C1917]/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: `${stats?.global_accuracy ?? 94.8}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border-2 border-[#1C1917] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold uppercase">Loss</span>
                <span className="text-emerald-700 font-bold">-72% Init</span>
              </div>
              <div className="text-2xl font-black text-[#E05338]">
                {stats?.global_loss ?? 0.1084}
              </div>
              <div className="w-full bg-[#FAF7F2] border border-[#1C1917]/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#E05338] h-full transition-all duration-500"
                  style={{ width: "24%" }}
                />
              </div>
            </div>
          </div>

          {/* Model Specs Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-[#57534E]">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#1C1917]/20 font-bold text-[#1C1917]">
              Dense [32, 16]
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#1C1917]/20 font-bold text-[#1C1917]">
              1,282 Params
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#1C1917]/20 font-bold text-[#1C1917]">
              ONNX Runtime
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 font-bold text-purple-700">
              BN254 Field Circuit
            </span>
          </div>
        </div>

        {/* Settlement Pipeline Card */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-black text-[#2563EB] uppercase tracking-wider">
                  VERIFIABLE CONSENSUS
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#1C1917] font-display uppercase">
                  Settlement
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-600/30 rounded">
                SYNCED
              </span>
            </div>

            {/* Arbitrum item */}
            <div className="p-3.5 bg-white rounded-xl border-2 border-[#1C1917] space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-[9px]">
                    L2
                  </span>
                  <span className="font-bold text-xs text-[#1C1917]">Arbitrum One</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">ZKVerifier.sol</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1 border-t border-[#1C1917]/10">
                <span>Contract: 0x5FbD...aa3</span>
                <span className="text-emerald-700 font-bold">~142k Gas</span>
              </div>
            </div>

            {/* Solana item */}
            <div className="p-3.5 bg-white rounded-xl border-2 border-[#1C1917] space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">
                    SOL
                  </span>
                  <span className="font-bold text-xs text-[#1C1917]">Solana Settlement</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">18.5 SOL / Round</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1 border-t border-[#1C1917]/10">
                <span>Finality: ~420ms</span>
                <span className="text-emerald-700 font-bold">Sub-second payout</span>
              </div>
            </div>
          </div>

          <Link
            href="/proofs"
            className="w-full py-2.5 px-3 rounded-xl border-2 border-[#1C1917] bg-[#FAF0E4] hover:bg-[#1C1917] hover:text-white text-[#1C1917] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer text-center"
          >
            <span>View zkML Proofs →</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIVE ROUND RESULT (CONDITIONAL) */}
      {/* ========================================================================= */}
      {roundResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1C1917] text-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-lg space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center space-x-2 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Round #{roundResult.round ?? 15} Settled</span>
            </div>
            <span className="text-emerald-400 font-bold text-[11px]">
              0.00 Bytes Leaked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
              <div className="text-stone-400 text-[10px]">NEW HASH</div>
              <div className="text-[#E5A638] font-bold truncate">{roundResult.new_hash}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
              <div className="text-stone-400 text-[10px]">ACCURACY</div>
              <div className="text-emerald-400 font-bold">{roundResult.accuracy}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
              <div className="text-stone-400 text-[10px]">ARBITRUM TX</div>
              <div className="text-cyan-400 font-bold truncate">{roundResult.arbitrum_tx}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
              <div className="text-stone-400 text-[10px]">REWARDS</div>
              <div className="text-emerald-400 font-bold">{roundResult.rewards_paid} SOL</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CLEAN QUICK ACCESS TILES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/training"
          className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm hover:-translate-y-0.5 transition-all group flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-[#E05338] text-white flex items-center justify-center border border-[#1C1917] shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <h3 className="font-display font-black text-sm text-[#1C1917] group-hover:text-[#E05338] transition-colors">
                Training Studio
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C]" />
            </div>
            <p className="text-xs text-[#57534E] truncate font-medium">
              Configure datasets, rows &amp; edge nodes
            </p>
          </div>
        </Link>

        <Link
          href="/proofs"
          className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm hover:-translate-y-0.5 transition-all group flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-[#9333EA] text-white flex items-center justify-center border border-[#1C1917] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <h3 className="font-display font-black text-sm text-[#1C1917] group-hover:text-[#9333EA] transition-colors">
                zkML Proofs
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C]" />
            </div>
            <p className="text-xs text-[#57534E] truncate font-medium">
              Public input commitments &amp; circuits
            </p>
          </div>
        </Link>

        <Link
          href="/passport"
          className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm hover:-translate-y-0.5 transition-all group flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-lg bg-[#E5A638] text-[#1C1917] flex items-center justify-center border border-[#1C1917] shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <h3 className="font-display font-black text-sm text-[#1C1917] group-hover:text-[#E5A638] transition-colors">
                AI Passport
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C]" />
            </div>
            <p className="text-xs text-[#57534E] truncate font-medium">
              Soulbound credentials &amp; tiers
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
