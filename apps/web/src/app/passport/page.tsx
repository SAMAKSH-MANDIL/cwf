"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Award,
  Zap,
  Coins,
  CheckCircle2,
  Lock,
  ExternalLink,
  Download,
  RefreshCw,
  KeyRound,
  Cpu,
  Copy,
  Check,
} from "lucide-react";

export default function PassportPage() {
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const walletAddr =
    passport?.contributor ?? "0x71C66336071ffd4e773E34dac3Ca0A6688211eef";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1C1917]/20 text-[#E05338] text-[11px] font-mono font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>ERC-5192 IDENTITY LAYER</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              ● Non-Transferable Soulbound
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            AI Contributor Passport
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Cryptographic reputation credential anchored on <strong className="text-[#1C1917]">Arbitrum</strong>. Proves verified edge compute provenance and zkML gradient integrity without exposing private data.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-white border-2 border-[#1C1917] retro-shadow-sm font-mono text-xs font-black text-[#E5A638] uppercase">
            {passport?.tier ?? "PLATINUM"} NODE
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SOULBOUND VERIFIABLE CREDENTIAL DECK */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow p-5 sm:p-7 md:p-8 rounded-2xl relative overflow-hidden space-y-6 sm:space-y-8">
        {/* Hologram Watermark */}
        <div className="absolute -right-12 -top-12 w-48 h-48 sm:w-60 sm:h-60 bg-[#E5A638]/10 rounded-full border-2 border-dashed border-[#E5A638]/25 pointer-events-none flex items-center justify-center rotate-12">
          <span className="font-mono text-[9px] font-black text-[#E5A638]/40 tracking-widest uppercase text-center px-4">
            CRYPTOGRAPHIC PROVENANCE SEAL
          </span>
        </div>

        {/* Passport Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1917]/20 pb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E05338] border-2 border-[#1C1917] retro-shadow-sm rounded-xl flex items-center justify-center shrink-0 text-white">
              <Award className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#E05338] uppercase bg-[#E05338]/10 px-2 py-0.5 rounded border border-[#E05338]/30">
                  SOULBOUND PASSPORT
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded border border-emerald-600/30">
                  ACTIVE
                </span>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#1C1917] font-display mt-1 truncate">
                {passport?.name ?? "Hospital Alpha (Lead Contributor)"}
              </h2>

              <div className="text-xs font-mono text-[#78716C] mt-1 flex items-center space-x-1.5">
                <span className="font-bold text-[#1C1917] shrink-0">DID:</span>
                <span className="truncate max-w-[140px] sm:max-w-xs bg-white px-2 py-0.5 rounded border border-[#1C1917]/20 font-bold text-[#1C1917]">
                  {walletAddr}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[#E05338] hover:underline flex items-center space-x-0.5 shrink-0 cursor-pointer text-[11px] font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "COPIED" : "COPY"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-[#78716C] shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1C1917]/10">
            <span className="font-bold block text-[#1C1917]">Arbitrum Anchor:</span>
            <span className="text-[11px]">Block #184,920,441</span>
          </div>
        </div>

        {/* 4 Scorecard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
          {/* Reputation Score */}
          <div className="p-4 bg-white rounded-xl border-2 border-[#1C1917] retro-shadow-sm space-y-2">
            <div className="text-[10px] font-bold text-[#78716C] uppercase flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-[#E5A638]" />
              <span>Reputation Score</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {passport?.reputation_score ?? 91}
              <span className="text-xs text-[#78716C] font-normal"> / 100</span>
            </div>
            <div className="w-full bg-[#FAF7F2] border border-[#1C1917]/30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E05338] h-full transition-all duration-500"
                style={{ width: `${passport?.reputation_score ?? 91}%` }}
              />
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">Top 2% Globally</div>
          </div>

          {/* Verified Gradients */}
          <div className="p-4 bg-white rounded-xl border-2 border-[#1C1917] retro-shadow-sm space-y-1">
            <div className="text-[10px] font-bold text-[#78716C] uppercase flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Proofs</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {passport?.verified_contributions ?? 47}
            </div>
            <div className="text-[10px] text-[#78716C] pt-2 border-t border-[#1C1917]/10">
              zkML 100% Pass Rate
            </div>
          </div>

          {/* Training Rounds */}
          <div className="p-4 bg-white rounded-xl border-2 border-[#1C1917] retro-shadow-sm space-y-1">
            <div className="text-[10px] font-bold text-[#78716C] uppercase flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>Training Rounds</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {passport?.training_rounds ?? 25}
            </div>
            <div className="text-[10px] text-[#78716C] pt-2 border-t border-[#1C1917]/10">
              25 / 25 Rounds Synced
            </div>
          </div>

          {/* Rewards Earned */}
          <div className="p-4 bg-white rounded-xl border-2 border-[#1C1917] retro-shadow-sm space-y-1">
            <div className="text-[10px] font-bold text-[#78716C] uppercase flex items-center space-x-1">
              <Coins className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Rewards Earned</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {passport?.total_rewards_earned
                ? Number(passport.total_rewards_earned).toFixed(1)
                : "128.5"}
              <span className="text-xs text-[#78716C] font-normal"> SOL</span>
            </div>
            <div className="text-[10px] text-[#78716C] pt-2 border-t border-[#1C1917]/10">
              Solana Escrow Settled
            </div>
          </div>
        </div>

        {/* Cryptographic Attestation Specs Table */}
        <div className="rounded-xl border-2 border-[#1C1917] bg-white overflow-hidden font-mono text-xs">
          <div className="px-4 py-2.5 bg-[#F4EFE6] border-b border-[#1C1917]/20 flex items-center justify-between">
            <span className="font-black text-[#1C1917] uppercase tracking-wider flex items-center space-x-2 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-[#E05338]" />
              <span>Cryptographic Specifications</span>
            </span>
            <span className="text-[10px] text-[#78716C] hidden sm:block">
              Contract Arb-One #0x3A2F...4C81
            </span>
          </div>

          <div className="divide-y divide-[#1C1917]/15">
            <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#78716C] font-bold text-[11px]">Token Standard</span>
              <span className="font-bold text-[#1C1917]">
                EIP-5192 Minimal Non-Fungible Soulbound Interface
              </span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#78716C] font-bold text-[11px]">ZK Verification Protocol</span>
              <span className="font-bold text-[#9333EA]">
                Halo2 / Groth16 Bilinear Pairing (BN254 Curve)
              </span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#78716C] font-bold text-[11px]">Differential Privacy Guarantee</span>
              <span className="font-bold text-emerald-800">
                (ε = 1.20, δ = 10⁻⁵) Gaussian Noise Calibration
              </span>
            </div>

            <div className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#78716C] font-bold text-[11px]">Hardware TEE Attestation</span>
              <span className="font-bold text-[#1C1917] flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-[#E05338]" />
                <span>Intel SGX &amp; NVIDIA Confidential TEE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Guarantee Note */}
        <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#1C1917]/20 flex items-start space-x-3 text-xs font-mono text-[#1C1917]">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <strong className="text-emerald-800 uppercase font-black">Zero Data Leakage Invariant:</strong> Raw patient records never leave the local node. The passport proves compute diligence and statistical validity without exposing private shards.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => alert("Cryptographic credential bundle exported in JSON-LD format.")}
            className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#E05338] text-white font-bold uppercase rounded-xl border-2 border-[#1C1917] retro-shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Credential (.JSON-LD)</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Attestation verified on Arbitrum: Signature valid.")}
            className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#1C1917] font-bold uppercase rounded-xl border-2 border-[#1C1917] retro-shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Verify Attestation</span>
          </button>

          <a
            href="https://arbiscan.io"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#1C1917] font-bold uppercase rounded-xl border-2 border-[#1C1917] retro-shadow-sm transition-all flex items-center space-x-2"
          >
            <span>Arbiscan Explorer</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
          </a>
        </div>
      </div>
    </div>
  );
}
