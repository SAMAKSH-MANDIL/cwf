"use client";

import { useEffect, useState } from "react";
import { Database, GitCommit, Layers, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
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
          <Database className="w-6 h-6 text-cyan-400" />
          <span>Model Registry & Lineage</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Decentralized catalog of neural network architectures, cryptographic parameter hashes, and IPFS storage references.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {models.map((model) => (
          <div key={model.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white">{model.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Version {model.version}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">{model.description}</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Accuracy: {model.benchmark_accuracy}%
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Loss: {model.benchmark_loss}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Current Parameter Hash</span>
                </div>
                <div className="text-cyan-300 truncate font-semibold">{model.model_hash}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Architecture & Parameters</span>
                </div>
                <div className="text-purple-300 font-semibold">{model.architecture} ({model.parameters_count} params)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center space-x-1.5">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                  <span>Decentralized Storage CID</span>
                </div>
                <div className="text-emerald-300 truncate font-semibold">{model.storage_cid}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ONNX zkML Circuit Specification</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Input Shape: [1, 16] Normalized Biomarkers • Layers: Dense(16,32)-&gt;ReLU-&gt;Dense(32,16)-&gt;ReLU-&gt;Dense(16,2) • Prover: Halo2 KZG BN254 • Fixed-point quantization scale: 7 bits
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
