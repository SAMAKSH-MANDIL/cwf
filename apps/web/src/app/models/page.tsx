"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, GitCommit, Layers, ExternalLink, ShieldCheck, Sparkles, Cpu, Play, CheckCircle2, ArrowRight } from "lucide-react";

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

  const fallbackModels = [
    {
      id: "model-oncology-v2",
      name: "Oncology EHR Neural Classifier",
      version: "2.4.0",
      description: "Distributed diagnostic model trained across clinical edge enclaves to classify clinical diagnostic risks from 16 normalized patient biomarker dimensions.",
      benchmark_accuracy: 96.8,
      benchmark_loss: 0.1084,
      model_hash: "0x89f2a71d84e2719a0bc431980aef88219c40",
      architecture: "MLP [16 In → 32 → 16 → 2 Out]",
      parameters_count: 1074,
      storage_cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      proving_scheme: "KZG-Halo2/EZKL-BN254",
      constraints_count: 14208,
      is_active: true,
    },
    {
      id: "model-fintech-v1",
      name: "Financial Transaction Anomaly Sentinel",
      version: "1.2.0",
      description: "Privacy-preserving credit card fraud detection neural network trained across banking node partitions without revealing raw financial ledgers.",
      benchmark_accuracy: 98.4,
      benchmark_loss: 0.0842,
      model_hash: "0x3c99a01f01da52e90bb183920c8f12a884e1",
      architecture: "Dense [10 In → 64 → 32 → 2 Out]",
      parameters_count: 2818,
      storage_cid: "bafybeid92kf84h2nd82jdf92h4k29df83jf928hd284kd92jd84hd82nd8",
      proving_scheme: "Groth16/Circom-BN254",
      constraints_count: 18450,
      is_active: true,
    }
  ];

  const displayModels = models.length > 0 ? models : fallbackModels;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 select-none">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#1C1917] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <Database className="w-3.5 h-3.5 text-[#E05338]" />
            <span>MODEL REGISTRY • ON-CHAIN LINEAGE & IPFS PROVENANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Model Registry & Architectures
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            Immutable catalog of neural network topologies, parameter cryptographic hashes anchored to Arbitrum L2, and IPFS storage manifests with Zero-Knowledge verification proofs.
          </p>
        </div>

        <div className="z-10 flex items-center space-x-3">
          <Link
            href="/training"
            className="px-6 py-3.5 rounded-xl border-2 border-[#1C1917] bg-[#E05338] hover:bg-[#d4482f] text-white font-display font-black text-sm tracking-wide retro-shadow flex items-center space-x-2 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>TRAIN A MODEL ⚡</span>
          </Link>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {displayModels.map((model) => (
          <div
            key={model.id}
            className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1C1917]/15 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E05338] text-white flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1C1917] font-display">{model.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E5A638]/20 text-[#92400E] border border-[#E5A638]/50">
                    v{model.version}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/40">
                    ● ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[#57534E] max-w-3xl leading-relaxed">{model.description}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <div className="px-3.5 py-1.5 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow-sm">
                  <span className="text-[#78716C] block text-[10px]">ACCURACY</span>
                  <span className="text-emerald-700 font-black text-sm">{model.benchmark_accuracy}%</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow-sm">
                  <span className="text-[#78716C] block text-[10px]">LOSS</span>
                  <span className="text-[#E05338] font-black text-sm">{model.benchmark_loss}</span>
                </div>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] space-y-1">
                <div className="text-[#78716C] flex items-center space-x-1.5 font-bold uppercase text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-[#E05338]" />
                  <span>Arbitrum Model Hash</span>
                </div>
                <div className="text-[#1C1917] truncate font-bold text-xs">{model.model_hash}</div>
                <span className="text-[10px] text-emerald-700 font-bold block">Immutable L2 State</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] space-y-1">
                <div className="text-[#78716C] flex items-center space-x-1.5 font-bold uppercase text-[10px]">
                  <Layers className="w-4 h-4 text-[#9333EA]" />
                  <span>Architecture & Parameters</span>
                </div>
                <div className="text-[#1C1917] font-bold text-xs">{model.architecture}</div>
                <span className="text-[10px] text-[#78716C] font-bold block">{model.parameters_count.toLocaleString()} Trainable Weights</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] space-y-1">
                <div className="text-[#78716C] flex items-center space-x-1.5 font-bold uppercase text-[10px]">
                  <GitCommit className="w-4 h-4 text-[#2563EB]" />
                  <span>IPFS Storage Manifest CID</span>
                </div>
                <div className="text-[#2563EB] truncate font-bold text-xs">{model.storage_cid}</div>
                <span className="text-[10px] text-[#78716C] font-bold block">Decentralized Storage</span>
              </div>
            </div>

            {/* zkML Constraints Specification Pill */}
            <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#1C1917]/25 space-y-2 text-xs font-mono">
              <div className="font-bold text-[#1C1917] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#E5A638]" />
                <span>ONNX zkML Circuit Constraints & Prover Scheme</span>
              </div>
              <p className="text-[#57534E] leading-relaxed">
                Compiled arithmetic execution graph: <strong>{model.constraints_count || 14208} R1CS/PLONKish constraints</strong> over BN254 elliptic curve. Prover: <strong>{model.proving_scheme || "KZG-Halo2/EZKL-BN254"}</strong>. Quantization scale: 7-bit fixed point with verifiable witness commitments.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
