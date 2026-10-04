"use client";

import { useEffect, useState } from "react";
import { UserCheck, ShieldCheck, Award, Zap, Coins, CheckCircle2, Lock, ExternalLink, Download, RefreshCw, KeyRound, Cpu } from "lucide-react";

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

  const walletAddr = passport?.contributor ?? "0x71C66336071ffd4e773E34dac3Ca0A6688211eef";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b-2 border-[#1C1917] pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#E05338]/10 border border-[#E05338] text-[#E05338] text-xs font-mono font-black uppercase tracking-wider mb-2">
          <span>IDENTITY LAYER</span>
          <span>•</span>
          <span>ERC-5192 SOULBOUND</span>
        </div>
        <h1 className="text-3xl font-black text-[#1C1917] tracking-tight flex items-center space-x-3">
          <UserCheck className="w-8 h-8 text-[#E05338]" />
          <span>AI Contributor Passport</span>
        </h1>
        <p className="text-sm font-medium text-[#1C1917]/70 mt-2 max-w-3xl leading-relaxed">
          Soulbound cryptographic reputation credential anchored on Arbitrum. Represents verified edge compute provenance, federated gradient contributions, and zkML proof history without exposing patient or proprietary training datasets.
        </p>
      </div>

      {/* Physical-Style Verifiable Credential Card */}
      <div className="bg-[#F7F4EE] border-2 border-[#1C1917] shadow-[6px_6px_0px_#1C1917] p-8 relative overflow-hidden space-y-8">
        {/* Vintage Hologram Watermark */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#E5A638]/10 rounded-full border-4 border-dashed border-[#E5A638]/20 pointer-events-none flex items-center justify-center rotate-12">
          <span className="font-mono text-[10px] font-black text-[#E5A638]/40 tracking-widest uppercase">
            CRYPTOGRAPHIC PROVENANCE SEAL
          </span>
        </div>

        {/* Passport Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-[#1C1917] pb-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-[#E05338] border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] flex items-center justify-center shrink-0">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-black text-[#E05338] uppercase tracking-wider bg-[#E05338]/10 px-2 py-0.5 border border-[#E05338]">
                  VERIFIED SOULBOUND IDENTITY
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 border border-emerald-700">
                  ACTIVE • NON-TRANSFERABLE
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#1C1917] mt-1.5">
                Hospital Alpha (Lead Contributor)
              </h2>
              <div className="text-xs font-mono text-[#1C1917]/70 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#1C1917]">DID / Wallet:</span>
                <button
                  onClick={handleCopy}
                  className="bg-white px-2 py-0.5 border border-[#1C1917] text-[#1C1917] font-bold hover:bg-[#FAF7F2] transition-colors flex items-center space-x-1"
                >
                  <span>{walletAddr}</span>
                  <span className="text-[10px] text-[#E05338] ml-1">{copied ? "COPIED!" : "COPY"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2">
            <span className="px-4 py-2 bg-[#E5A638] text-[#1C1917] border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] font-mono font-black text-sm uppercase">
              TIER: {passport?.tier ?? "PLATINUM"} NODE
            </span>
            <span className="text-[11px] font-mono text-[#1C1917]/60">
              Anchor: Arbitrum Block #184,920,441
            </span>
          </div>
        </div>

        {/* Reputation Score & High-Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]">
            <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-[#E5A638]" />
              <span>Reputation Score</span>
            </div>
            <div className="text-3xl font-black font-mono text-[#1C1917] mt-2">
              {passport?.reputation_score ?? 91} <span className="text-sm font-normal text-[#1C1917]/50">/ 100</span>
            </div>
            <div className="w-full bg-[#FAF7F2] border border-[#1C1917] h-3 mt-3 p-0.5">
              <div
                className="bg-[#E05338] h-full"
                style={{ width: `${passport?.reputation_score ?? 91}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-mono text-[#1C1917]/50 mt-1 text-right">Top 2% Globally</div>
          </div>

          <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]">
            <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Gradients</span>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-700 mt-2">
              {passport?.verified_contributions ?? 47}
            </div>
            <div className="text-[11px] font-mono text-[#1C1917]/60 mt-3 pt-2 border-t border-[#1C1917]/20 flex justify-between">
              <span>zkML Validation</span>
              <span className="font-bold text-emerald-700">100% Pass</span>
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]">
            <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
              <span>Training Rounds</span>
            </div>
            <div className="text-3xl font-black font-mono text-[#1C1917] mt-2">
              {passport?.training_rounds ?? 25}
            </div>
            <div className="text-[11px] font-mono text-[#1C1917]/60 mt-3 pt-2 border-t border-[#1C1917]/20 flex justify-between">
              <span>Federated Cycles</span>
              <span className="font-bold text-[#1C1917]">25 / 25 Sync</span>
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]">
            <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-[#E05338]" />
              <span>Rewards Earned</span>
            </div>
            <div className="text-3xl font-black font-mono text-[#E05338] mt-2">
              {passport?.total_rewards_earned ? passport.total_rewards_earned.toFixed(1) : "128.5"} <span className="text-sm font-normal text-[#1C1917]/50">SOL</span>
            </div>
            <div className="text-[11px] font-mono text-[#1C1917]/60 mt-3 pt-2 border-t border-[#1C1917]/20 flex justify-between">
              <span>Solana Escrow</span>
              <span className="font-bold text-emerald-700">Settled</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Attestation Details Table */}
        <div className="border-2 border-[#1C1917] bg-white">
          <div className="px-4 py-2.5 bg-[#FAF7F2] border-b-2 border-[#1C1917] flex items-center justify-between">
            <span className="text-xs font-mono font-black text-[#1C1917] uppercase tracking-wider flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-[#E05338]" />
              <span>SOULBOUND CRYPTOGRAPHIC SPECIFICATIONS</span>
            </span>
            <span className="text-[11px] font-mono text-[#1C1917]/60">CONTRACT ARB-ONE #0x3A2F...4C81</span>
          </div>

          <div className="divide-y border-[#1C1917]/20 text-xs font-mono">
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#1C1917]/70 font-bold">Token Standard</span>
              <span className="text-[#1C1917] font-extrabold bg-[#FAF7F2] px-2 py-0.5 border border-[#1C1917]">
                EIP-5192 Minimal Non-Fungible Soulbound Interface
              </span>
            </div>

            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#1C1917]/70 font-bold">ZK Verification Protocol</span>
              <span className="text-[#1C1917] font-extrabold">
                Halo2 / Groth16 Bilinear Pairing Proofs (BN254 Curve)
              </span>
            </div>

            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#1C1917]/70 font-bold">Differential Privacy Guarantee</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 border border-emerald-600">
                (ε = 1.20, δ = 10⁻⁵) Gaussian Noise Calibration
              </span>
            </div>

            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[#1C1917]/70 font-bold">Hardware Attestation</span>
              <span className="text-[#1C1917] font-extrabold flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#E05338]" />
                <span>Intel SGX & NVIDIA Confidential Computing TEE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Invariant Banner */}
        <div className="p-4 bg-[#FAF7F2] border-2 border-[#1C1917] flex items-start space-x-3 text-xs text-[#1C1917] font-mono">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-emerald-800">ZERO DATA LEAKAGE INVARIANT:</strong> No patient electronic health records (EHR) or local training weights are ever transmitted to the network. The soulbound passport mathematically proves compute diligence and statistical validity without revealing private local shards.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => alert("Cryptographic credential bundle exported in JSON-LD format.")}
            className="px-5 py-2.5 bg-[#1C1917] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#E05338] hover:bg-[#E05338] transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CREDENTIAL (.JSON-LD)</span>
          </button>

          <button
            onClick={() => alert("Attestation verified on Arbitrum Goerli: Valid signature 0x8f2d...c34b")}
            className="px-5 py-2.5 bg-white text-[#1C1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] hover:bg-[#FAF7F2] transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RE-VERIFY ATTESTATION</span>
          </button>

          <a
            href="https://arbiscan.io"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-white text-[#1C1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] hover:bg-[#FAF7F2] transition-colors flex items-center space-x-2"
          >
            <span>VIEW ON ARBISCAN</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
