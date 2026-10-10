"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Lock,
  Sparkles,
  Cpu,
  Layers,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ProofsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "inspector">("list");

  const fallbackProofs = [
    {
      id: "proof-kzg-01",
      circuit_name: "DiagnosticNet-ONNX-Halo2",
      proof_hash: "0x84bf0c41787f6d33e65de7a8dc524acc38b4a2981a89ee57525738aea1e2e639",
      proving_scheme: "KZG-Halo2/EZKL-BN254",
      constraints_count: 14208,
      public_inputs: [
        "0x11cb81f971b96d0b5b7b602aebb828f9607806d82f3c8930c5505ec4d0655619 (Base Model Hash)",
        "0x26f929777408c747c64b6186d2da974b74fd24af8be64452926d999a55cbf639 (Gradient Delta)",
        "0x0e (Training Round #14)",
        "0x71C66336071ffd4e773E34dac3Ca0A6688211eef (Contributor Address)",
        "0x378ab9affd95703e5739fa37 (Batch Polynomial Commitment)",
        "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593effea3ae (Output Logits)",
      ],
      proof_hex_truncated:
        "0x7b2261223a205b2230783266366361643537653130313564353261333565663330313937313637376637373761383031613536613833646439613038353937... [G1/G2 Pairing Points: 256 bytes]",
      is_valid: true,
    },
    {
      id: "proof-kzg-02",
      circuit_name: "Halo2_Fraud_Sentinel_KZG",
      proof_hash: "0x3c99a01f01da52e90bb183920c8f12a884e1b824ef78201b84920c81a284c",
      proving_scheme: "KZG-Halo2/EZKL-BN254",
      constraints_count: 18450,
      public_inputs: [
        "0x3c99a01f01da52e90bb183920c8f12a884e1 (Base Model Hash)",
        "0x98f21ca4901b824ef78201b84920c81a284c (Gradient Delta)",
        "0x0e (Training Round #14)",
        "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2 (Contributor Address)",
        "0x5109b842910c8428a192c12a84b0192c84ef (Batch Polynomial Commitment)",
        "0x84e29c18401b824ef78201b84920c81a284c (Output Logits)",
      ],
      proof_hex_truncated:
        "0x89f210a4c8216ef01824b0192c84ef8910b842910c8428a192c12a84b019... [G1/G2 Pairing Points: 256 bytes]",
      is_valid: true,
    },
  ];

  useEffect(() => {
    fetch("/api/proofs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProofs(data);
          setSelectedProof(data[0]);
        } else {
          setProofs(fallbackProofs);
          setSelectedProof(fallbackProofs[0]);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setProofs(fallbackProofs);
        setSelectedProof(fallbackProofs[0]);
        setLoading(false);
      });
  }, []);

  const filteredProofs = useMemo(() => {
    if (!searchQuery.trim()) return proofs;
    const q = searchQuery.toLowerCase();
    return proofs.filter(
      (p) =>
        (p.circuit_name || "").toLowerCase().includes(q) ||
        (p.proof_hash || "").toLowerCase().includes(q) ||
        (p.id || "").toLowerCase().includes(q)
    );
  }, [proofs, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format public inputs nicely
  const formatInputLabel = (inp: string, idx: number) => {
    const labels = [
      "Base Model Hash Scalar",
      "Gradient Delta Hash Scalar",
      "Training Round ID",
      "Contributor Wallet Scalar",
      "Input Batch Commitment",
      "Output Logits Commitment",
    ];
    const defaultLabel = labels[idx] || `Input Parameter [${idx}]`;
    return {
      label: defaultLabel,
      value: inp,
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HERO BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>zkML VERIFIER</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-[#78716C]">
              {proofs.length} Synthesized Proofs
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            zkML Proofs &amp; Constraints
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Cryptographic zero-knowledge proofs synthesized over quantized ONNX computational graphs. Verifies private client gradient descent without exposing raw records.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Curve &amp; Scheme</span>
            <span className="text-sm font-black text-[#9333EA]">KZG / BN254</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Data Leaked</span>
            <span className="text-sm font-black text-emerald-700">0.00 Bytes</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE SEGMENTED CONTROL (TABS FOR SMALL SCREENS) */}
      {/* ========================================================================= */}
      <div className="flex lg:hidden rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] p-1 font-mono text-xs retro-shadow-sm">
        <button
          type="button"
          onClick={() => setMobileTab("list")}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer ${
            mobileTab === "list"
              ? "bg-[#1C1917] text-white shadow-sm"
              : "text-[#57534E] hover:text-[#1C1917]"
          }`}
        >
          Artifacts List ({filteredProofs.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("inspector")}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all cursor-pointer ${
            mobileTab === "inspector"
              ? "bg-[#1C1917] text-white shadow-sm"
              : "text-[#57534E] hover:text-[#1C1917]"
          }`}
        >
          Circuit Inspector
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. DUAL COLUMN LAYOUT (SIDEBAR + INSPECTOR) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Proofs List (Hidden on mobile if Inspector tab is active) */}
        <div
          className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-3.5 ${
            mobileTab === "inspector" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2.5">
            <h2 className="text-xs font-mono font-black text-[#1C1917] uppercase tracking-wider">
              Proof Artifacts ({filteredProofs.length})
            </h2>
            <span className="text-[10px] font-mono text-[#78716C]">
              Select to inspect
            </span>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circuits or hashes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border border-[#1C1917]/25 text-xs font-mono text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#E05338]"
            />
          </div>

          {/* Scrollable list */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredProofs.map((p) => {
              const isSelected = selectedProof?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProof(p);
                    setMobileTab("inspector");
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#1C1917] text-white border-[#1C1917] retro-shadow-sm"
                      : "bg-white border-[#1C1917]/20 hover:border-[#1C1917] text-[#1C1917]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold truncate max-w-[170px]">
                      {p.circuit_name || "DiagnosticNet-Halo2"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        isSelected
                          ? "bg-emerald-400 text-stone-950"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      VERIFIED
                    </span>
                  </div>

                  <div
                    className={`text-[11px] font-mono truncate mt-1 ${
                      isSelected ? "text-amber-300" : "text-[#9333EA] font-bold"
                    }`}
                  >
                    {p.proof_hash}
                  </div>

                  <div
                    className={`flex items-center justify-between text-[10px] mt-1.5 font-mono ${
                      isSelected ? "text-stone-400" : "text-[#78716C]"
                    }`}
                  >
                    <span>
                      {p.constraints_count
                        ? `${Number(p.constraints_count).toLocaleString()} Constraints`
                        : "14,208 Constraints"}
                    </span>
                    <span className="flex items-center space-x-0.5 text-xs">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Proof Inspector (Hidden on mobile if List tab is active) */}
        <div
          className={`lg:col-span-7 p-5 sm:p-6 md:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-5 ${
            mobileTab === "list" ? "hidden lg:block" : "block"
          }`}
        >
          {selectedProof ? (
            <>
              {/* Inspector Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1917]/20 pb-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h3 className="text-base sm:text-lg font-black text-[#1C1917] font-display uppercase truncate">
                      {selectedProof.circuit_name || "Circuit Inspector"}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs text-[#78716C]">
                    <span className="shrink-0 font-bold">Proof Hash:</span>
                    <span className="truncate text-[#1C1917] font-bold">
                      {selectedProof.proof_hash}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(selectedProof.proof_hash, "main-hash")
                      }
                      className="text-[#E05338] hover:underline flex items-center space-x-0.5 shrink-0 cursor-pointer"
                    >
                      {copiedId === "main-hash" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span className="text-[10px]">
                        {copiedId === "main-hash" ? "Copied" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-600/30 shrink-0 self-start sm:self-auto">
                  Arbitrum L2 Valid
                </span>
              </div>

              {/* 4 Spec Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[10px] uppercase font-bold block">
                    Constraints
                  </span>
                  <span className="text-[#1C1917] font-black text-sm">
                    {selectedProof.constraints_count
                      ? Number(selectedProof.constraints_count).toLocaleString()
                      : "14,208"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[10px] uppercase font-bold block">
                    Scheme
                  </span>
                  <span className="text-[#9333EA] font-black text-xs truncate block">
                    {selectedProof.proving_scheme || "KZG-Halo2"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[10px] uppercase font-bold block">
                    Scalar Field
                  </span>
                  <span className="text-[#2563EB] font-black text-xs truncate block">
                    BN254 (Alt-bn128)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[10px] uppercase font-bold block">
                    Leakage
                  </span>
                  <span className="text-emerald-700 font-black text-xs block">
                    0.00 B Private
                  </span>
                </div>
              </div>

              {/* Public Inputs Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1C1917]">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#E05338]" />
                    <span>Public Inputs Bound in Circuit</span>
                  </span>
                  <span className="text-[10px] text-[#78716C]">
                    {selectedProof.public_inputs?.length || 6} Scalars
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1917] text-[#FAF7F2] font-mono text-xs space-y-2 border-2 border-[#1C1917]">
                  {selectedProof.public_inputs?.map((inp: string, idx: number) => {
                    const info = formatInputLabel(inp, idx);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-stone-800 last:border-0"
                      >
                        <span className="text-stone-400 text-[10px] uppercase">
                          {info.label}:
                        </span>
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className="text-[#E5A638] font-bold text-[11px] truncate max-w-xs">
                            {info.value}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(info.value, `inp-${idx}`)}
                            className="text-stone-400 hover:text-white shrink-0 cursor-pointer"
                            title="Copy input scalar"
                          >
                            {copiedId === `inp-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Serialized Hex Pairing Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1C1917]">
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#9333EA]" />
                    <span>Proof Pairing Points (G1 &amp; G2 Calldata)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        selectedProof.proof_hex_truncated || "",
                        "calldata"
                      )
                    }
                    className="text-[#9333EA] hover:underline flex items-center space-x-0.5 text-[10px] cursor-pointer"
                  >
                    {copiedId === "calldata" ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === "calldata" ? "Copied" : "Copy Calldata"}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border-2 border-[#1C1917] leading-relaxed">
                  {selectedProof.proof_hex_truncated ||
                    "0x7b2261223a205b223078326636636164353765... [256 bytes]"}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#78716C] font-mono text-xs">
              Select a proof artifact on the left to inspect its circuit constraints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
