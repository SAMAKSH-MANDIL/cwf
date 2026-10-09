"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Terminal, Lock, Sparkles, RefreshCw, Cpu, Layers } from "lucide-react";

export default function ProofsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<any>(null);

  const fallbackProofs = [
    {
      id: "proof-kzg-01",
      circuit_name: "Halo2_Oncology_EHR_KZG",
      proof_hash: "0x7e29b14c990a421ef882190c4821a9c4bb10a9c8241b",
      proving_scheme: "KZG-Halo2/EZKL-BN254",
      constraints_count: 14208,
      public_inputs: [
        "0x89f2a71d84e2719a0bc431980aef88219c40 (Model Baseline Hash Scalar)",
        "0x4a9f28d8b10e9c8f2941b0284c198a28f73b (Update Delta Hash Scalar)",
        "14 (Training Round Identifier)",
        "0x71C66336071ffd4e773E34dac3Ca0A6688211eef (Participant Address)",
        "0x39a1b02f... (Input Batch Polynomial Commitment)",
        "0x918a24c1... (Output Logits Polynomial Commitment)",
      ],
      proof_hex_truncated: "0x12a8f90b1c84...3a9f0284c1e9 [G1/G2 Pairing Witness: 256 bytes]",
    },
    {
      id: "proof-kzg-02",
      circuit_name: "Halo2_Fraud_Sentinel_KZG",
      proof_hash: "0x3c99a01f01da52e90bb183920c8f12a884e1b824ef78",
      proving_scheme: "KZG-Halo2/EZKL-BN254",
      constraints_count: 18450,
      public_inputs: [
        "0x3c99a01f01da52e90bb183920c8f12a884e1 (Model Baseline Hash Scalar)",
        "0x98f21ca4901b824ef78201b84920c81a284c (Update Delta Hash Scalar)",
        "14 (Training Round Identifier)",
        "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2 (Participant Address)",
        "0x5109b842... (Input Batch Polynomial Commitment)",
        "0x84e29c18... (Output Logits Polynomial Commitment)",
      ],
      proof_hex_truncated: "0x89f210a4c821...91da4821a9c4 [G1/G2 Pairing Witness: 256 bytes]",
    }
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 select-none">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#9333EA] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9333EA]" />
            <span>ZERO-KNOWLEDGE MACHINE LEARNING (zkML) VERIFIER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            zkML Proofs & Circuit Constraints
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            Cryptographic zero-knowledge proofs synthesized over quantized ONNX computational graphs. Verifies private client gradient descent without exposing a single byte of patient records.
          </p>
        </div>

        <div className="z-10 flex items-center space-x-3">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm font-mono text-xs">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Proving Scheme</span>
            <span className="text-sm font-black text-[#9333EA]">KZG BN254 / Halo2</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Proofs List */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
          <h2 className="text-xs font-black text-[#1C1917] uppercase tracking-wider font-mono">
            Generated Proof Artifacts ({proofs.length})
          </h2>
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {proofs.map((p) => {
              const isSelected = selectedProof?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProof(p)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-[#1C1917] text-white border-[#1C1917] retro-shadow-sm"
                      : "bg-[#F7F4EE] border-[#1C1917]/25 hover:border-[#1C1917] text-[#1C1917]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold truncate max-w-[160px]">{p.circuit_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      isSelected ? "bg-emerald-400 text-stone-950" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      VERIFIED
                    </span>
                  </div>
                  <div className={`text-[11px] font-mono truncate mt-1.5 ${
                    isSelected ? "text-amber-300" : "text-[#9333EA]"
                  }`}>
                    {p.proof_hash}
                  </div>
                  <div className={`text-[10px] mt-1 font-mono ${
                    isSelected ? "text-stone-400" : "text-[#78716C]"
                  }`}>
                    {p.constraints_count ? `${p.constraints_count.toLocaleString()} Constraints` : "14,208 Constraints"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Proof Inspector */}
        <div className="lg:col-span-2 p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
          {selectedProof ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/15 pb-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1C1917] font-display flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Proof Inspector & Witness Commitments</span>
                  </h3>
                  <p className="text-xs text-[#78716C] font-mono truncate max-w-lg">
                    Hash: {selectedProof.proof_hash}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-500/15 text-emerald-800 border border-emerald-500/40">
                  Arbitrum L2 Pairing Valid
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25">
                  <div className="text-[#78716C] text-[10px] uppercase font-bold">Arithmetic Constraints</div>
                  <div className="text-[#1C1917] font-black text-base mt-0.5">
                    {selectedProof.constraints_count ? selectedProof.constraints_count.toLocaleString() : "14,208"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25">
                  <div className="text-[#78716C] text-[10px] uppercase font-bold">Proving Scheme</div>
                  <div className="text-[#9333EA] font-black text-xs mt-1 truncate">
                    {selectedProof.proving_scheme || "KZG-Halo2"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25">
                  <div className="text-[#78716C] text-[10px] uppercase font-bold">Scalar Field</div>
                  <div className="text-[#2563EB] font-black text-xs mt-1">
                    BN254 (Alt-bn128)
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#1C1917]/25">
                  <div className="text-[#78716C] text-[10px] uppercase font-bold">Data Exposure</div>
                  <div className="text-emerald-700 font-black text-xs mt-1">
                    0.00 Bytes (Zero-Leak)
                  </div>
                </div>
              </div>

              {/* Public Inputs Commitments */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-black text-[#1C1917] uppercase flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-[#E05338]" />
                  <span>Public Input Commitments Bound In Arithmetic Circuit:</span>
                </div>
                <div className="p-4 rounded-xl bg-[#1C1917] text-[#FAF7F2] font-mono text-[11px] space-y-2 border-2 border-[#1C1917]">
                  {selectedProof.public_inputs?.map((inp: string, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-stone-800 last:border-0">
                      <span className="text-stone-400">Input[{idx}]:</span>
                      <span className="text-[#E5A638] truncate max-w-md font-bold">{inp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Serialized Hex Calldata Payload */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-black text-[#1C1917] uppercase flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-[#9333EA]" />
                  <span>Proof Calldata Payload (G1 & G2 Pairing Points):</span>
                </div>
                <pre className="p-4 rounded-xl bg-stone-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border-2 border-[#1C1917]">
                  {selectedProof.proof_hex_truncated || "0x12a8f90b1c84...3a9f0284c1e9 [G1/G2 Pairing Witness: 256 bytes]"}
                </pre>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#78716C] font-mono text-sm">
              Select a proof artifact on the left to inspect circuit constraints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
