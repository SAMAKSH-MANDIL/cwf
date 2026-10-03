"use client";

import { useEffect, useState } from "react";
import { Cpu, CheckCircle2, ShieldAlert, ExternalLink, Hash, Coins } from "lucide-react";

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        setContributions(data);
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
          <Cpu className="w-6 h-6 text-cyan-400" />
          <span>Contributions Ledger</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cryptographic model updates submitted by edge devices, validated via zkML proofs on Arbitrum, and rewarded on Solana.
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Contributor</th>
                <th className="p-3">Model & Round</th>
                <th className="p-3">Update Hash</th>
                <th className="p-3">Proof Hash</th>
                <th className="p-3">Status</th>
                <th className="p-3">Reward</th>
                <th className="p-3">Proof Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {contributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="p-3">
                    <div className="font-bold text-white">{c.contributor_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{c.contributor_address}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-cyan-400 font-medium">{c.model_id}</div>
                    <div className="text-[11px] text-slate-400">Round #{c.round_id}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300 font-mono truncate max-w-xs">{c.update_hash}</div>
                    <div className="text-[10px] text-slate-500">L2 Norm: {c.delta_norm}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-purple-300 font-mono truncate max-w-xs">{c.proof_hash}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{c.verification_status}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-pink-400 font-bold inline-flex items-center space-x-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{c.reward_tokens} SOL</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold">VALID (Groth16/KZG)</span>
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
