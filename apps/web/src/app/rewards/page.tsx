"use client";

import { useEffect, useState } from "react";
import { Coins, Zap, ShieldCheck, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive formula simulator states
  const [quality, setQuality] = useState(1.2);
  const [tier, setTier] = useState("RTX4090");
  const [proofValid, setProofValid] = useState(true);
  const [utility, setUtility] = useState(1.25);

  const tierMultipliers: Record<string, number> = {
    H100: 2.5,
    A100: 2.0,
    RTX4090: 1.5,
    T4: 1.0,
    EdgeDevice: 0.8,
  };

  const calculatedReward = proofValid
    ? (10.0 * quality * tierMultipliers[tier] * utility).toFixed(2)
    : "0.00";

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => {
        setRewards(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Coins className="w-6 h-6 text-pink-400" />
          <span>Solana Incentive Distribution & Tokenomics</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-throughput, programmatic token reward disbursement scaled by model convergence quality, compute hardware tier, and zkML validity.
        </p>
      </div>

      {/* Interactive Dynamic Reward Equation Simulator */}
      <div className="p-6 rounded-2xl glass-panel border border-pink-500/30 space-y-6">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Interactive Reward Engine Formula Simulator</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-center text-slate-300">
          <span className="text-pink-400 font-bold">Reward</span> = 
          <span className="text-cyan-400"> BaseRate (10.0)</span> × 
          <span className="text-emerald-400"> Quality ({quality})</span> × 
          <span className="text-purple-400"> ProofValid ({proofValid ? "1.0" : "0.0"})</span> × 
          <span className="text-indigo-400"> ComputeTier ({tierMultipliers[tier]}x)</span> × 
          <span className="text-amber-400"> ModelUtility ({utility})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">Model Quality (Loss Reduction): {quality}</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">Hardware Compute Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="H100">NVIDIA H100 (2.5x)</option>
              <option value="A100">NVIDIA A100 (2.0x)</option>
              <option value="RTX4090">NVIDIA RTX 4090 (1.5x)</option>
              <option value="T4">NVIDIA T4 (1.0x)</option>
              <option value="EdgeDevice">Edge IoT Device (0.8x)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">zkML Proof Validity</label>
            <div className="flex items-center space-x-3 pt-1">
              <label className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 cursor-pointer">
                <input
                  type="radio"
                  name="validity"
                  checked={proofValid === true}
                  onChange={() => setProofValid(true)}
                  className="accent-emerald-400"
                />
                <span>Valid (1.0)</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-mono text-rose-400 cursor-pointer">
                <input
                  type="radio"
                  name="validity"
                  checked={proofValid === false}
                  onChange={() => setProofValid(false)}
                  className="accent-rose-400"
                />
                <span>Invalid (0.0)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-pink-950/30 border border-pink-500/40 flex flex-col justify-center items-center">
            <span className="text-[11px] font-mono text-pink-300 uppercase">Calculated Reward</span>
            <span className="text-2xl font-bold font-mono text-white mt-1">{calculatedReward} SOL</span>
          </div>
        </div>
      </div>

      {/* Recent Solana Payout Transactions */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Confirmed Solana Reward Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Contributor Wallet</th>
                <th className="p-3">Hardware Tier</th>
                <th className="p-3">Round</th>
                <th className="p-3">Reward Amount</th>
                <th className="p-3">Solana Signature</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rewards.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono text-cyan-400">{r.contributor}</td>
                  <td className="p-3 font-semibold text-white">{r.hardware_tier}</td>
                  <td className="p-3 text-slate-400">Round #{r.round_id}</td>
                  <td className="p-3 font-bold text-pink-400">{r.reward_amount} SOL</td>
                  <td className="p-3 text-emerald-400 font-mono truncate max-w-xs">{r.tx_signature}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
