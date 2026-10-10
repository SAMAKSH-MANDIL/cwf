"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Coins,
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Sliders,
} from "lucide-react";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive formula simulator states
  const [quality, setQuality] = useState(1.05);
  const [tier, setTier] = useState("RTX4090");
  const [proofValid, setProofValid] = useState(true);
  const [utility, setUtility] = useState(1.2);

  const tierMultipliers: Record<string, number> = {
    H100: 2.5,
    A100: 2.0,
    RTX4090: 1.5,
    M3Max: 1.4,
    T4: 1.0,
    Jetson: 0.8,
  };

  const calculatedReward = useMemo(() => {
    if (!proofValid) return "0.00";
    const mult = tierMultipliers[tier] || 1.5;
    return (10.0 * quality * mult * utility).toFixed(2);
  }, [proofValid, quality, tier, utility]);

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRewards(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRewards = useMemo(() => {
    if (!searchQuery.trim()) return rewards;
    const q = searchQuery.toLowerCase();
    return rewards.filter(
      (r) =>
        (r.contributor || "").toLowerCase().includes(q) ||
        (r.contributor_name || "").toLowerCase().includes(q) ||
        (r.tx_signature || "").toLowerCase().includes(q) ||
        (r.hardware_tier || "").toLowerCase().includes(q)
    );
  }, [rewards, searchQuery]);

  const totalDisbursed = useMemo(() => {
    return rewards
      .reduce((acc, r) => acc + (parseFloat(r.reward_amount) || 0), 0)
      .toFixed(1);
  }, [rewards]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HERO BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-mono font-bold">
              <Coins className="w-3.5 h-3.5 text-[#D97706]" />
              <span>SOLANA SETTLEMENT ENGINE</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              ● Sub-second Finality (~420ms)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Incentive Distribution &amp; Rewards
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Automated token disbursements scaled by model quality gain, client hardware compute tier, and zero-knowledge validity on <strong className="text-emerald-700">Solana</strong>.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Total Paid Out</span>
            <span className="text-lg font-black text-emerald-700">{totalDisbursed} SOL</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Transactions</span>
            <span className="text-lg font-black text-[#1C1917]">{rewards.length} Confirmed</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE REWARD SIMULATOR */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-5">
        <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#E05338]" />
            <h2 className="text-base sm:text-lg font-black text-[#1C1917] font-display uppercase tracking-tight">
              Interactive Formula Simulator
            </h2>
          </div>
          <span className="text-xs font-mono text-[#78716C] hidden sm:block">
            Test how different machines &amp; quality affect payout
          </span>
        </div>

        {/* Dynamic Equation Strip */}
        <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25 font-mono text-xs flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[#1C1917] text-center">
          <span className="font-black text-[#E05338]">Reward</span>
          <span>=</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#1C1917]/20 font-bold">
            Base (10.0)
          </span>
          <span>×</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
            Quality ({quality}x)
          </span>
          <span>×</span>
          <span
            className={`px-2 py-0.5 rounded border font-bold ${
              proofValid
                ? "bg-purple-100 text-purple-900 border-purple-300"
                : "bg-red-100 text-red-900 border-red-300"
            }`}
          >
            ProofValid ({proofValid ? "1.0" : "0.0"})
          </span>
          <span>×</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">
            Tier ({tierMultipliers[tier]}x)
          </span>
          <span>×</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
            Priority ({utility}x)
          </span>
        </div>

        {/* 4 Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono text-xs items-stretch">
          {/* Quality Slider */}
          <div className="p-3.5 rounded-xl bg-white border-2 border-[#1C1917] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] font-bold text-[10px] uppercase">Quality Gain</span>
                <span className="font-black text-[#E05338] text-sm">{quality}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-[#E05338] cursor-pointer h-1.5 bg-[#F2ECE1] rounded-lg mt-2"
              />
            </div>
            <span className="text-[10px] text-[#78716C]">Loss reduction performance</span>
          </div>

          {/* Hardware Tier Dropdown */}
          <div className="p-3.5 rounded-xl bg-white border-2 border-[#1C1917] space-y-1.5 flex flex-col justify-between">
            <span className="text-[#78716C] font-bold text-[10px] uppercase block">
              Compute Hardware
            </span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/30 text-xs font-mono font-bold text-[#1C1917] focus:outline-none cursor-pointer"
            >
              <option value="H100">NVIDIA H100 (2.5x)</option>
              <option value="A100">NVIDIA A100 (2.0x)</option>
              <option value="RTX4090">NVIDIA RTX 4090 (1.5x)</option>
              <option value="M3Max">Apple M3 Max (1.4x)</option>
              <option value="T4">NVIDIA T4 (1.0x)</option>
              <option value="Jetson">Jetson / Edge (0.8x)</option>
            </select>
            <span className="text-[10px] text-[#78716C]">Compute capacity weight</span>
          </div>

          {/* zkML Proof Toggle */}
          <div className="p-3.5 rounded-xl bg-white border-2 border-[#1C1917] space-y-2 flex flex-col justify-between">
            <span className="text-[#78716C] font-bold text-[10px] uppercase block">
              zkML Verification
            </span>
            <div className="flex items-center space-x-2 pt-0.5">
              <button
                type="button"
                onClick={() => setProofValid(true)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  proofValid
                    ? "bg-emerald-600 text-white"
                    : "bg-[#F2ECE1] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                Valid (1.0)
              </button>
              <button
                type="button"
                onClick={() => setProofValid(false)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  !proofValid
                    ? "bg-red-600 text-white"
                    : "bg-[#F2ECE1] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                Invalid (0.0)
              </button>
            </div>
            <span className="text-[10px] text-[#78716C]">Arbitrum KZG pairing check</span>
          </div>

          {/* Output Card */}
          <div className="p-4 rounded-xl bg-[#1C1917] text-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm flex flex-col justify-center items-center text-center space-y-0.5">
            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
              Calculated Payout
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#E5A638]">
              {calculatedReward} SOL
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {proofValid ? "Instant Micro-Payout" : "Rejected: 0 SOL"}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONFIRMED SOLANA PAYOUT TRANSACTIONS */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1917]/15 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-[#1C1917] font-display uppercase tracking-tight">
              Confirmed Solana Payout Ledger
            </h2>
            <p className="text-[11px] text-[#78716C]">
              Program Derived Addresses (PDA) Anti-Sybil Guaranteed
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search wallet or tx signature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border border-[#1C1917]/25 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#E05338]"
            />
          </div>
        </div>

        {/* MOBILE VIEW (CARD STACK) */}
        <div className="block lg:hidden space-y-2.5">
          {filteredRewards.map((r, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border-2 border-[#1C1917] space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#1C1917]/10 pb-2">
                <div className="min-w-0">
                  <div className="font-bold text-[#1C1917] truncate">
                    {r.contributor_name ? `${r.contributor_name} • ` : ""}
                    {r.contributor ? `${r.contributor.slice(0, 8)}...${r.contributor.slice(-6)}` : "Wallet"}
                  </div>
                  <div className="text-[10px] text-[#78716C] mt-0.5">
                    Round #{r.round_id} • {r.hardware_tier || "RTX 4090"}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-emerald-700 font-black text-sm block">
                    +{r.reward_amount} SOL
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                    {r.status || "CONFIRMED"}
                  </span>
                </div>
              </div>

              {/* Tx Signature */}
              <div className="flex items-center justify-between text-[11px] bg-[#FAF7F2] p-2 rounded-lg border border-[#1C1917]/15">
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="text-[#78716C] text-[10px] shrink-0">Tx:</span>
                  <span className="text-[#2563EB] font-bold truncate">
                    {r.tx_signature}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(r.tx_signature, `mob-${idx}`)}
                  className="text-[#78716C] hover:text-[#1C1917] shrink-0 ml-2 cursor-pointer"
                  title="Copy signature"
                >
                  {copiedId === `mob-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW (SPACIOUS TABLE) */}
        <div className="hidden lg:block rounded-xl border-2 border-[#1C1917] bg-white overflow-hidden retro-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Contributor Wallet</th>
                  <th className="py-3 px-3">Hardware Tier</th>
                  <th className="py-3 px-3">Round</th>
                  <th className="py-3 px-3">Reward Minted</th>
                  <th className="py-3 px-3">Solana Tx Signature</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {filteredRewards.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1C1917]">
                      <div className="flex items-center space-x-1.5">
                        <span className="truncate max-w-[150px]">
                          {r.contributor_name ? `${r.contributor_name} (${r.contributor.slice(0, 6)}...)` : r.contributor}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(r.contributor || "", `addr-${idx}`)}
                          className="text-[#78716C] hover:text-[#1C1917] cursor-pointer shrink-0"
                          title="Copy address"
                        >
                          {copiedId === `addr-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1C1917] bg-[#F2ECE1] px-2 py-0.5 rounded border border-[#1C1917]/20 text-[11px]">
                        {r.hardware_tier || "RTX 4090"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#78716C] font-bold">
                      Round #{r.round_id}
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-emerald-700 font-black inline-flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Coins className="w-3 h-3 text-emerald-600" />
                        <span>{r.reward_amount} SOL</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold">
                      <div className="flex items-center space-x-1 text-[#2563EB]">
                        <span className="truncate max-w-[170px]">{r.tx_signature}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(r.tx_signature, `sig-${idx}`)}
                          className="text-[#78716C] hover:text-[#2563EB] cursor-pointer shrink-0"
                          title="Copy signature"
                        >
                          {copiedId === `sig-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-500/30">
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
