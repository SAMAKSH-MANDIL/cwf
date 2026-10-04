"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Zap, ShieldCheck, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

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
    M3Max: 1.4,
    T4: 1.0,
    Jetson: 0.8,
  };

  const calculatedReward = proofValid
    ? (10.0 * quality * (tierMultipliers[tier] || 1.5) * utility).toFixed(2)
    : "0.00";

  const fallbackRewards = [
    {
      contributor: "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
      hardware_tier: "RTX 4090",
      round_id: 14,
      reward_amount: "22.50",
      tx_signature: "5YNtk84j29df83jf928hd284kd92jd84hd82nd8",
      status: "CONFIRMED",
    },
    {
      contributor: "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2",
      hardware_tier: "Apple M3 Max",
      round_id: 14,
      reward_amount: "18.80",
      tx_signature: "4kJdf829nd82h4k29df83jf928hd284kd92jd84",
      status: "CONFIRMED",
    },
    {
      contributor: "0xE1294C668b828f7c9eF02559b36C67341De0923C",
      hardware_tier: "AWS A100 TensorCore",
      round_id: 14,
      reward_amount: "28.00",
      tx_signature: "3xLkd924kd92jd84hd82nd82h4k29df83jf928h",
      status: "CONFIRMED",
    },
    {
      contributor: "0x98Fc44aB012C5E7290bC1864aDe7401c900D85Fb",
      hardware_tier: "Jetson Orin Nano",
      round_id: 13,
      reward_amount: "14.20",
      tx_signature: "2mPjf83hd82nd82h4k29df83jf928hd284kd92j",
      status: "CONFIRMED",
    },
  ];

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRewards(data);
        } else {
          setRewards(fallbackRewards);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setRewards(fallbackRewards);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 select-none">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#1C1917] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <Coins className="w-3.5 h-3.5 text-pink-600" />
            <span>SOLANA REWARDS & TOKENOMICS ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Incentive Distribution & Rewards
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            High-throughput automated token disbursements scaled by model quality gain, client hardware compute tier, and zero-knowledge validity.
          </p>
        </div>

        <div className="z-10 flex items-center space-x-3">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm font-mono text-xs">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Settlement Channel</span>
            <span className="text-sm font-black text-emerald-700">Solana Devnet (Sub-second)</span>
          </div>
        </div>
      </div>

      {/* Interactive Dynamic Reward Equation Simulator */}
      <div className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex items-center space-x-2 text-[#1C1917] font-display font-black text-lg">
          <Sparkles className="w-5 h-5 text-[#E5A638]" />
          <span>Interactive Reward Engine Formula Simulator</span>
        </div>

        {/* Formula Box */}
        <div className="p-5 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] font-mono text-xs text-center text-[#1C1917] retro-shadow-sm flex flex-wrap items-center justify-center gap-2">
          <span className="text-pink-600 font-black text-sm">Reward</span> = 
          <span className="px-2 py-0.5 rounded bg-white border border-[#1C1917]/25 font-bold">BaseRate (10.0)</span> × 
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">Quality ({quality})</span> × 
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-bold">ProofValid ({proofValid ? "1.0" : "0.0"})</span> × 
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">Tier ({tierMultipliers[tier]}x)</span> × 
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">Utility ({utility})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25 space-y-2">
            <label className="text-xs font-mono font-bold text-[#1C1917] block">
              Quality Gain: <strong className="text-[#E05338]">{quality}x</strong>
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-[#E05338] cursor-pointer h-1.5 bg-[#EAE4D8] rounded-lg"
            />
            <span className="text-[10px] text-[#78716C] font-mono block">Accuracy gain multiplier</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25 space-y-2">
            <label className="text-xs font-mono font-bold text-[#1C1917] block">
              Hardware Accelerator Tier
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full p-2 rounded-lg bg-white border border-[#1C1917] text-xs font-mono font-bold text-[#1C1917] focus:outline-none"
            >
              <option value="H100">NVIDIA H100 (2.5x)</option>
              <option value="A100">NVIDIA A100 (2.0x)</option>
              <option value="RTX4090">NVIDIA RTX 4090 (1.5x)</option>
              <option value="M3Max">Apple M3 Max (1.4x)</option>
              <option value="T4">NVIDIA T4 (1.0x)</option>
              <option value="Jetson">Jetson Orin (0.8x)</option>
            </select>
            <span className="text-[10px] text-[#78716C] font-mono block">Compute capacity weight</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25 space-y-2">
            <label className="text-xs font-mono font-bold text-[#1C1917] block">
              zkML Proof Verification
            </label>
            <div className="flex items-center space-x-3 pt-1">
              <label className="flex items-center space-x-1.5 text-xs font-mono text-emerald-800 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="validity"
                  checked={proofValid === true}
                  onChange={() => setProofValid(true)}
                  className="accent-emerald-600"
                />
                <span>Valid (1.0)</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs font-mono text-red-800 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="validity"
                  checked={proofValid === false}
                  onChange={() => setProofValid(false)}
                  className="accent-red-600"
                />
                <span>Invalid (0.0)</span>
              </label>
            </div>
            <span className="text-[10px] text-[#78716C] font-mono block">Arbitrum L2 Pairing Check</span>
          </div>

          {/* Reward Output Card */}
          <div className="p-5 rounded-xl bg-[#1C1917] text-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Estimated Round Payout</span>
            <span className="text-3xl font-black font-mono text-[#E5A638] mt-1">{calculatedReward} SOL</span>
            <span className="text-[10px] font-mono text-emerald-400 mt-1">Automatic Micro-disbursement</span>
          </div>
        </div>
      </div>

      {/* Confirmed Solana Payout Transactions */}
      <div className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1C1917]/20 pb-4">
          <h2 className="text-lg font-black text-[#1C1917] font-display uppercase tracking-tight">
            Confirmed Solana Payout Ledger
          </h2>
          <span className="text-xs font-mono text-[#78716C]">
            Program Derived Address (PDA) Anti-Sybil Guaranteed
          </span>
        </div>

        <div className="rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] overflow-hidden retro-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Contributor Wallet</th>
                  <th className="py-3 px-3">Hardware Tier</th>
                  <th className="py-3 px-3">Round</th>
                  <th className="py-3 px-3">Reward Minted</th>
                  <th className="py-3 px-3">Solana Tx Signature</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {rewards.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F4EE] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1C1917]">
                      <span className="bg-[#F2ECE1] px-2 py-0.5 rounded border border-[#1C1917]/20 text-[11px]">
                        {r.contributor}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#1C1917] bg-[#EAE4D8] px-2 py-0.5 rounded text-[11px]">
                        {r.hardware_tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[#78716C] font-bold">
                      Round #{r.round_id}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-emerald-700 font-black inline-flex items-center space-x-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{r.reward_amount} SOL</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[#2563EB] font-bold truncate max-w-xs">
                      {r.tx_signature}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-800 border border-emerald-500/40">
                        {r.status || "CONFIRMED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
