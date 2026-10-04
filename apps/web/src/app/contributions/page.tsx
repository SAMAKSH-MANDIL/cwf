"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, CheckCircle2, ShieldAlert, ExternalLink, Hash, Coins, Layers, ArrowUpRight, Lock } from "lucide-react";

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

  const fallbackContributions = [
    {
      id: "contrib-101",
      contributor_name: "Hospital Alpha Enclave",
      contributor_address: "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
      model_id: "model-oncology-v2",
      round_id: 14,
      update_hash: "0x4a9f28d8b10e9c8f2941b0284c198a28f73b",
      proof_hash: "0x7e29b14c990a421ef882190c4821a9c4",
      delta_norm: 0.1428,
      samples_count: 240,
      verification_status: "VERIFIED",
      reward_tokens: 18.5,
      arbitrum_tx: "0x89f2a71d84e2719a0bc431980aef88219c40",
      created_at: "Just now"
    },
    {
      id: "contrib-102",
      contributor_name: "Clinic Beta Edge Node",
      contributor_address: "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2",
      model_id: "model-oncology-v2",
      round_id: 14,
      update_hash: "0x98f21ca4901b824ef78201b84920c81a284c",
      proof_hash: "0x3c99a01f01da52e90bb183920c8f12a884e1",
      delta_norm: 0.1284,
      samples_count: 180,
      verification_status: "VERIFIED",
      reward_tokens: 16.2,
      arbitrum_tx: "0x74a9...1e88",
      created_at: "2 mins ago"
    },
    {
      id: "contrib-103",
      contributor_name: "Research Lab Gamma",
      contributor_address: "0xE1294C668b828f7c9eF02559b36C67341De0923C",
      model_id: "model-oncology-v2",
      round_id: 14,
      update_hash: "0x28f710a9c8241be9042b10492810a9c8241b",
      proof_hash: "0x84e29c18401b824ef78201b84920c81a284c",
      delta_norm: 0.1562,
      samples_count: 320,
      verification_status: "VERIFIED",
      reward_tokens: 24.0,
      arbitrum_tx: "0x91da...4821",
      created_at: "5 mins ago"
    },
    {
      id: "contrib-104",
      contributor_name: "Mobile Diagnostic Unit Delta",
      contributor_address: "0x98Fc44aB012C5E7290bC1864aDe7401c900D85Fb",
      model_id: "model-oncology-v2",
      round_id: 13,
      update_hash: "0x12a84b0192c84ef8910b842910c8428a192c",
      proof_hash: "0x5109b842910c8428a192c12a84b0192c84ef",
      delta_norm: 0.0984,
      samples_count: 120,
      verification_status: "VERIFIED",
      reward_tokens: 12.5,
      arbitrum_tx: "0x5c88...901b",
      created_at: "12 mins ago"
    },
  ];

  const displayList = contributions.length > 0 ? contributions : fallbackContributions;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 select-none">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#1C1917] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#E05338]" />
            <span>CRYPTOGRAPHIC CONTRIBUTIONS LEDGER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Model Contributions & Proofs
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            Record of local gradient updates calculated across edge enclaves. Every update is verified via zero-knowledge Halo2 KZG arithmetic circuits before FedAvg aggregation.
          </p>
        </div>

        <div className="z-10 flex items-center space-x-3">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm font-mono text-xs">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Total Verified Updates</span>
            <span className="text-2xl font-black text-[#1C1917]">{displayList.length} Updates</span>
          </div>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1C1917]/20 pb-4">
          <h2 className="text-lg font-black text-[#1C1917] font-display uppercase tracking-tight">
            Verified Gradient Submissions
          </h2>
          <span className="text-xs font-mono text-[#78716C]">
            Dual-Chain Settlement: Arbitrum (Proof) + Solana (Payout)
          </span>
        </div>

        <div className="rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] overflow-hidden retro-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Contributor Enclave</th>
                  <th className="py-3 px-3">Model & Round</th>
                  <th className="py-3 px-3">Update Hash (L2 Norm)</th>
                  <th className="py-3 px-3">zkML Proof Hash</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Reward Minted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {displayList.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F4EE] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1C1917] font-display text-sm">{c.contributor_name}</div>
                      <div className="text-[11px] text-[#78716C] font-mono mt-0.5">{c.contributor_address}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#1C1917] block">{c.model_id}</span>
                      <span className="text-[10px] text-[#9333EA] font-black uppercase">Round #{c.round_id}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-[#1C1917] font-bold truncate max-w-xs">{c.update_hash}</div>
                      <div className="text-[10px] text-[#78716C]">Delta Norm: <strong>{c.delta_norm}</strong></div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-[#9333EA] font-bold truncate max-w-xs">{c.proof_hash}</div>
                      <span className="text-[10px] text-[#78716C]">BN254 KZG Pairing</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black font-mono bg-emerald-500/15 text-emerald-800 border border-emerald-500/40 inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{c.verification_status || "VERIFIED"}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-emerald-700 font-black inline-flex items-center space-x-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{c.reward_tokens} SOL</span>
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
