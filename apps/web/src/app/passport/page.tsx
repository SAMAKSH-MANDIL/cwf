"use client";

import { useEffect, useState } from "react";
import { UserCheck, ShieldCheck, Award, Zap, Coins, CheckCircle2, Lock } from "lucide-react";

export default function PassportPage() {
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/passport")
      .then((res) => res.json())
      .then((data) => {
        setPassport(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <UserCheck className="w-6 h-6 text-amber-400" />
          <span>AI Contributor Passport</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Soulbound cryptographic reputation credential anchored on Arbitrum. Represents verified compute provenance and model contributions without revealing private identity.
        </p>
      </div>

      {/* Visual Web3 Passport Card */}
      <div className="p-8 rounded-3xl glass-panel border border-amber-500/40 relative overflow-hidden space-y-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header of Passport */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                VERIFIABLE SOULBOUND PASSPORT
              </div>
              <div className="text-2xl font-extrabold text-white mt-0.5">
                Hospital Alpha (Lead Contributor)
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1 flex items-center space-x-2">
                <span>Wallet:</span>
                <span className="text-cyan-300 font-bold">{passport?.contributor ?? "0x71C66336071ffd4e773E34dac3Ca0A6688211eef"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
              Tier: {passport?.tier ?? "Platinum"}
            </span>
          </div>
        </div>

        {/* Reputation Score & Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Reputation Score</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white mt-2">
              {passport?.reputation_score ?? 91} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
              <div
                className="bg-gradient-to-r from-amber-400 to-cyan-400 h-1.5 rounded-full"
                style={{ width: `${passport?.reputation_score ?? 91}%` }}
              ></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Contributions</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
              {passport?.verified_contributions ?? 47}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-3">zkML Validated</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Training Rounds</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-purple-400 mt-2">
              {passport?.training_rounds ?? 25}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-3">Active Rounds</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-pink-400" />
              <span>Total Rewards</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-pink-400 mt-2">
              {passport?.total_rewards_earned ? passport.total_rewards_earned.toFixed(1) : "128.5"} <span className="text-xs font-normal text-slate-400">SOL</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-3">Solana Payouts</div>
          </div>
        </div>

        {/* Privacy Invariant Banner */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Zero Personal Identifiable Information (PII) Stored. Cryptographic proofs verify computation integrity while raw patient data remains strictly quarantined on edge node hardware.
          </span>
        </div>
      </div>
    </div>
  );
}
