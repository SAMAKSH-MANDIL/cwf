"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, Terminal, Lock, Sparkles, RefreshCw } from "lucide-react";

export default function ProofsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<any>(null);

  useEffect(() => {
    fetch("/api/proofs")
      .then((res) => res.json())
      .then((data) => {
        setProofs(data);
        if (data.length > 0) setSelectedProof(data[0]);
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
          <ShieldCheck className="w-6 h-6 text-purple-400" />
          <span>Zero-Knowledge Machine Learning (zkML) Proofs</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cryptographic SNARK/Halo2 proofs proving valid forward and backward passes over quantized neural networks without revealing patient data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proofs List */}
        <div className="lg:col-span-1 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Generated Proof Artifacts</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {proofs.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProof(p)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedProof?.id === p.id
                    ? "bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-500/10"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">{p.circuit_name}</span>
                  <span className="text-emerald-400 text-[10px] font-bold">VERIFIED</span>
                </div>
                <div className="text-[11px] font-mono text-purple-300 truncate mt-1">{p.proof_hash}</div>
                <div className="text-[10px] text-slate-500 mt-1">Scheme: {p.proving_scheme}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Proof Inspector */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-purple-500/30 space-y-6">
          {selectedProof ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Proof Inspector & BN254 Witness Constraints</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Proof Hash: {selectedProof.proof_hash}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Arbitrum Verified
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Circuit Constraints</div>
                  <div className="text-white font-bold text-sm mt-1">{selectedProof.constraints_count.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Proving Scheme</div>
                  <div className="text-purple-400 font-bold mt-1">{selectedProof.proving_scheme}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Scalar Field</div>
                  <div className="text-cyan-400 font-bold mt-1">BN254 (Alt-bn128)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Data Exposure</div>
                  <div className="text-emerald-400 font-bold mt-1">0% (Zero-Knowledge)</div>
                </div>
              </div>

              {/* Public Inputs */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Public Input Commitments Bound In Circuit</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
                  {selectedProof.public_inputs?.map((inp: string, idx: number) => {
                    const labels = [
                      "PublicInput[0] (Model Baseline Hash Scalar)",
                      "PublicInput[1] (Update Delta Hash Scalar)",
                      "PublicInput[2] (Training Round Identifier)",
                      "PublicInput[3] (Participant Wallet Address Scalar)",
                      "PublicInput[4] (Input Batch Polynomial Commitment)",
                      "PublicInput[5] (Output Logits Polynomial Commitment)",
                    ];
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-900 last:border-0">
                        <span className="text-slate-400">{labels[idx] || `Input[${idx}]`}:</span>
                        <span className="text-cyan-300 truncate max-w-md">{inp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Serialized Hex Payload */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Proof Calldata (G1, G2 Curve Points Payload)</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto">
                  {selectedProof.proof_hex_truncated}
                </pre>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              Select a proof to inspect circuit constraints
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
