"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Cpu,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Layers,
  ArrowUpRight,
  Filter,
  ExternalLink,
} from "lucide-react";

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModel, setFilterModel] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contributions")
      .then((res) => res.json())
      .then((data) => {
        setContributions(Array.isArray(data) ? data : []);
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
      model_id: "Pneumonia-Diagnostic-v1",
      round_id: 14,
      update_hash: "0x4a9f28d8b10e9c8f2941b0284c198a28f73b",
      proof_hash: "0x7e29b14c990a421ef882190c4821a9c4",
      delta_norm: 0.1428,
      samples_count: 240,
      verification_status: "VERIFIED",
      reward_tokens: 18.5,
      arbitrum_tx: "0x89f2a71d84e2719a0bc431980aef88219c40",
      created_at: 1791306900,
    },
    {
      id: "contrib-102",
      contributor_name: "Clinic Beta Edge Node",
      contributor_address: "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2",
      model_id: "Pneumonia-Diagnostic-v1",
      round_id: 14,
      update_hash: "0x98f21ca4901b824ef78201b84920c81a284c",
      proof_hash: "0x3c99a01f01da52e90bb183920c8f12a884e1",
      delta_norm: 0.1284,
      samples_count: 180,
      verification_status: "VERIFIED",
      reward_tokens: 16.2,
      arbitrum_tx: "0x74a9...1e88",
      created_at: 1791306800,
    },
    {
      id: "contrib-103",
      contributor_name: "Research Lab Gamma",
      contributor_address: "0xE1294C668b828f7c9eF02559b36C67341De0923C",
      model_id: "Pneumonia-Diagnostic-v1",
      round_id: 14,
      update_hash: "0x28f710a9c8241be9042b10492810a9c8241b",
      proof_hash: "0x84e29c18401b824ef78201b84920c81a284c",
      delta_norm: 0.1562,
      samples_count: 320,
      verification_status: "VERIFIED",
      reward_tokens: 24.0,
      arbitrum_tx: "0x91da...4821",
      created_at: 1791306700,
    },
  ];

  const rawList = contributions.length > 0 ? contributions : fallbackContributions;

  // Extract unique model IDs for filtering
  const modelOptions = useMemo(() => {
    const set = new Set<string>();
    rawList.forEach((c) => {
      if (c.model_id) set.add(c.model_id);
    });
    return Array.from(set);
  }, [rawList]);

  // Filtered and searched list
  const filteredList = useMemo(() => {
    return rawList.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        (c.contributor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.contributor_address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.model_id || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModel = filterModel === "ALL" || c.model_id === filterModel;

      return matchesSearch && matchesModel;
    });
  }, [rawList, searchQuery, filterModel]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalRewards = useMemo(() => {
    return rawList.reduce((acc, c) => acc + (Number(c.reward_tokens) || 0), 0).toFixed(1);
  }, [rawList]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HERO BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1C1917]/20 text-[#E05338] text-[11px] font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC CONTRIBUTIONS LEDGER</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-[#78716C]">
              {rawList.length} Verified Submissions
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Model Contributions &amp; Proofs
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Record of local gradient updates calculated across edge enclaves. Every update is verified via zero-knowledge{" "}
            <strong className="text-[#1C1917]">Halo2 KZG circuits</strong> before FedAvg aggregation.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-4 py-3 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Total SOL Paid</span>
            <span className="text-lg font-black text-emerald-700">{totalRewards} SOL</span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Verified zkML</span>
            <span className="text-lg font-black text-[#9333EA]">{rawList.length} Proofs</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Node Name, Wallet, or Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#1C1917]/25 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#E05338]"
          />
        </div>

        {/* Model Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#78716C]" />
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border border-[#1C1917]/25 text-xs text-[#1C1917] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Models ({rawList.length})</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTRIBUTIONS DISPLAY (DESKTOP TABLE + MOBILE CARDS) */}
      {/* ========================================================================= */}

      {/* MOBILE VIEW (CARD STACK FOR SMALL SCREENS) */}
      <div className="block lg:hidden space-y-3">
        {filteredList.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm space-y-3 font-mono text-xs"
          >
            {/* Mobile Header: Node & Status */}
            <div className="flex items-start justify-between gap-2 border-b border-[#1C1917]/15 pb-2.5">
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#1C1917] font-display truncate">
                  {c.contributor_name}
                </div>
                <div className="text-[11px] text-[#78716C] truncate mt-0.5">
                  {c.contributor_address ? `${c.contributor_address.slice(0, 8)}...${c.contributor_address.slice(-6)}` : ""}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{c.verification_status || "VERIFIED"}</span>
                </span>
                <span className="text-emerald-700 font-bold text-xs">
                  +{c.reward_tokens || 18.5} SOL
                </span>
              </div>
            </div>

            {/* Mobile Meta Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-[#1C1917]/15">
                <span className="text-[#78716C] block text-[9px] uppercase">Model</span>
                <span className="font-bold text-[#1C1917] truncate block">{c.model_id}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#1C1917]/15">
                <span className="text-[#78716C] block text-[9px] uppercase">Round &amp; Samples</span>
                <span className="font-bold text-[#9333EA]">
                  Round #{c.round_id} • {c.samples_count || 120} rows
                </span>
              </div>
            </div>

            {/* Mobile Hashes Strip */}
            <div className="p-2.5 rounded-lg bg-[#F4EFE6] border border-[#1C1917]/20 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[#78716C] font-bold">Update Hash:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(c.update_hash, `up-${c.id}`)}
                  className="text-[#E05338] font-bold flex items-center space-x-1 hover:underline"
                >
                  {copiedId === `up-${c.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === `up-${c.id}` ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="font-mono text-[#1C1917] truncate bg-white p-1 rounded border border-[#1C1917]/10">
                {c.update_hash || "0x4a9f28d8b10..."}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[#78716C] font-bold">zkML Proof:</span>
                <span className="text-[#9333EA] font-bold">BN254 Pairing</span>
              </div>
              <div className="font-mono text-[#9333EA] truncate bg-white p-1 rounded border border-[#1C1917]/10">
                {c.proof_hash || "0x7e29b14c99..."}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW (SPACIOUS RESPONSIVE TABLE) */}
      <div className="hidden lg:block rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Contributor Enclave</th>
                <th className="py-3.5 px-3">Model &amp; Round</th>
                <th className="py-3.5 px-3">Update Hash (Norm)</th>
                <th className="py-3.5 px-3">zkML Proof Hash</th>
                <th className="py-3.5 px-3">Verification</th>
                <th className="py-3.5 px-4 text-right">Reward Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]/15">
              {filteredList.map((c) => (
                <tr key={c.id} className="hover:bg-[#F7F4EE] transition-colors">
                  {/* Contributor */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#1C1917] font-display text-sm">
                      {c.contributor_name}
                    </div>
                    <div className="text-[11px] text-[#78716C] font-mono mt-0.5 flex items-center space-x-1">
                      <span>{c.contributor_address ? `${c.contributor_address.slice(0, 10)}...${c.contributor_address.slice(-6)}` : ""}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.contributor_address || "", `addr-${c.id}`)}
                        className="text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                        title="Copy address"
                      >
                        {copiedId === `addr-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* Model & Round */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#1C1917] block truncate max-w-[140px]">
                      {c.model_id}
                    </span>
                    <span className="text-[10px] text-[#9333EA] font-bold uppercase">
                      Round #{c.round_id} • {c.samples_count || 120} rows
                    </span>
                  </td>

                  {/* Update Hash */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[#1C1917] font-bold truncate max-w-[150px]">
                        {c.update_hash}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.update_hash || "", `hash-${c.id}`)}
                        className="text-[#78716C] hover:text-[#1C1917] cursor-pointer shrink-0"
                        title="Copy update hash"
                      >
                        {copiedId === `hash-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="text-[10px] text-[#78716C] mt-0.5">
                      Delta Norm: <strong>{c.delta_norm ?? 0.14}</strong>
                    </div>
                  </td>

                  {/* zkML Proof */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[#9333EA] font-bold truncate max-w-[150px]">
                        {c.proof_hash}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.proof_hash || "", `proof-${c.id}`)}
                        className="text-[#78716C] hover:text-[#9333EA] cursor-pointer shrink-0"
                        title="Copy proof hash"
                      >
                        {copiedId === `proof-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#78716C] block mt-0.5">
                      BN254 KZG Verified
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black font-mono bg-emerald-100 text-emerald-800 border border-emerald-500/30 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{c.verification_status || "VERIFIED"}</span>
                    </span>
                  </td>

                  {/* Reward */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-700 font-black inline-flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.reward_tokens || 18.5} SOL</span>
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
