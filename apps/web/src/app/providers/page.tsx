"use client";

import { useEffect, useState } from "react";
import { Server, Cpu, CheckCircle2, ShieldCheck, Coins, Activity } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
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
          <Server className="w-6 h-6 text-emerald-400" />
          <span>Decentralized Compute Providers</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Registered edge nodes, GPU clusters, and clinical servers powering federated training rounds and generating zkML proofs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div key={p.wallet_address} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{p.device_name}</h2>
                  <div className="text-[11px] font-mono text-cyan-400">{p.wallet_address}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Hardware Tier</div>
                <div className="text-white font-bold mt-1">{p.hardware_tier}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Dedicated VRAM</div>
                <div className="text-cyan-400 font-bold mt-1">{p.declared_vram_gb} GB</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Reputation Score</div>
                <div className="text-amber-400 font-bold mt-1">{p.reputation_score} / 100</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Verified Rounds</div>
                <div className="text-purple-400 font-bold mt-1">{p.total_contributions}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-pink-400" />
                <span>Rewards Earned:</span>
              </span>
              <span className="text-pink-400 font-bold text-sm">{p.total_rewards_earned.toFixed(2)} SOL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
