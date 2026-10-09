"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Database,
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  ChevronRight,
  Layers,
  Sparkles,
  Server,
  FileCode2,
  Compass,
  Code2
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChain, setSelectedChain] = useState<"arb" | "sol" | "zec">("arb");

  const [simulating, setSimulating] = useState(false);
  const [simRound, setSimRound] = useState(12);
  const [simAccuracy, setSimAccuracy] = useState(94.8);
  const [simStep, setSimStep] = useState<string>("Standby • 3 Nodes Ready for FedAvg");

  const handleSimulateRound = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep("1/3 Dispatching weights to edge hardware...");

    setTimeout(() => {
      setSimStep("2/3 Generating Halo2 zkML proof (14,208 gates)...");
      setTimeout(() => {
        setSimStep("3/3 Arbitrum L2 verified ✓ Solana rewarded 10 SOL ✓");
        setSimRound((prev) => prev + 1);
        setSimAccuracy((prev) => Number((prev + 0.4).toFixed(1)));
        setTimeout(() => {
          setSimulating(false);
          setSimStep("Round Settled • 0 Bytes Raw Data Leaked ✓");
        }, 1200);
      }, 1200);
    }, 1100);
  };

  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const architectureSteps = [
    {
      step: "01",
      title: "Local Edge Device Training",
      tag: "Zero-Leakage Privacy",
      desc: "Raw datasets (medical records, financial transactions, private user actions) remain strictly confined to the participant's hardware. Models train locally for E epochs to generate gradient parameter updates (ΔW).",
      formula: "W_{i}^{(t+1)} = W^{(t)} - \\eta \\nabla \\mathcal{L}_i(W^{(t)}; \\mathcal{D}_i)",
      details: [
        "No raw sample is ever broadcast or uploaded to external servers",
        "Supports heterogeneous edge hardware: Apple M-series, RTX 4090, TensorRT, and Android NPU",
        "Local differential privacy (DP-SGD) with calibrated Gaussian noise clipping"
      ]
    },
    {
      step: "02",
      title: "zkML Proof Synthesis (Halo2 / EZKL)",
      tag: "Computational Integrity",
      desc: "The edge node compiles the forward and backward training graphs into arithmetic constraint circuits. A Halo2 SNARK proof (π) is synthesized, mathematically guaranteeing that the claimed gradients were genuinely calculated from the model architecture.",
      formula: "\\pi = \\text{Prover}(\\text{Circuit}_{\\text{ONNX}}, \\, \\mathcal{W}, \\, \\Delta W)",
      details: [
        "Arithmetized over the BN254 elliptic curve scalar field",
        "Validates model quantization, activation layers, and learning rate execution",
        "Succinct cryptographic proof verified on-chain in O(1) constant gas"
      ]
    },
    {
      step: "03",
      title: "Byzantine-Resilient FedAvg Aggregator",
      tag: "Poisoning Defense",
      desc: "Before incorporating edge updates into the global model, the aggregator applies Euclidean distance clustering, norm clipping, and Multi-Krum outlier rejection to detect and quarantine adversarial updates.",
      formula: "\\Delta W_{\\text{global}} = \\sum_{k=1}^{K} \\frac{n_k}{n} \\cdot \\text{Clip}(\\Delta W_k, C)",
      details: [
        "Defends against backdoor poisoning, Sybil inflation, and label-flipping attacks",
        "Adaptive weight assignment based on participant historical accuracy delta",
        "Generates cryptographic IPFS CID hash for the new global model tensor"
      ]
    },
    {
      step: "04",
      title: "Multi-Chain Consensus & Reward Dispatch",
      tag: "Arbitrum + Solana + Zcash",
      desc: "The verified state and model lineage are anchored to Arbitrum L2 contracts. Verified events trigger the Solana reward program, which instantly distributes tokens to contributors based on compute tier and contribution quality.",
      formula: "\\text{Reward} = \\text{Quality} \\times \\text{Validity} \\times \\text{ComputeTier} \\times \\text{Utility}",
      details: [
        "Arbitrum: ZKVerifier.sol executes pairing checks and logs ModelRegistry lineage",
        "Solana: High-frequency PDA program distributes micro-incentives without high gas fees",
        "Zcash Reference: Shielded edge privacy ensuring contributor identity confidentiality"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#1C1917] selection:bg-[#E05338] selection:text-white font-sans p-3 sm:p-6 md:p-8 lg:p-12 transition-colors duration-300">
      {/* Master Framed Poster Container */}
      <div id="top" className="max-w-[1360px] mx-auto border-[1.5px] border-[#1C1917] bg-[#FAF7F2] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl relative">

        {/* ========================================================================= */}
        {/* HEADER SECTION (Grid Boxed Header with Working Smooth-Scroll Links)       */}
        {/* ========================================================================= */}
        <header className="grid grid-cols-1 md:grid-cols-12 border-b-[1.5px] border-[#1C1917] divide-y md:divide-y-0 md:divide-x-[1.5px] divide-[#1C1917] bg-[#FAF7F2]">

          {/* Box 1: Stylized Terracotta Logo + Monogram */}
          <div className="md:col-span-4 p-4 sm:p-5 flex items-center justify-between md:justify-start space-x-3.5">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E05338] flex items-center justify-center border-[1.5px] border-[#1C1917] shadow-[2px_2px_0px_#1C1917] group-hover:rotate-6 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12H12V3Z" fill="#FAF7F2" stroke="#1C1917" strokeWidth="1.5" />
                  <circle cx="16" cy="7" r="3" fill="#E5A638" stroke="#1C1917" strokeWidth="1.2" />
                </svg>
              </div>
              <div>
                <div className="font-display font-extrabold text-base tracking-tight text-[#1C1917] uppercase flex items-center space-x-1.5">
                  <span>FedZero</span>
                  <span className="w-2 h-2 rounded-full bg-[#E05338] animate-ping"></span>
                </div>
                <div className="font-mono text-[10px] tracking-widest text-[#1C1917]/70 uppercase">
                  Federated • Zero-Knowledge Network
                </div>
              </div>
            </Link>
          </div>

          {/* Box 2: Centered Editorial Working Nav Links */}
          <nav className="md:col-span-5 p-4 sm:p-5 flex items-center justify-center space-x-5 lg:space-x-8 text-xs font-display font-bold uppercase tracking-wider text-[#1C1917]">
            <button
              onClick={() => scrollTo("top")}
              className="text-[#E05338] border-b-2 border-[#E05338] pb-0.5 hover:opacity-80 transition-all cursor-pointer"
            >
              HOME
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-[#E05338] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#E05338] cursor-pointer"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollTo("architecture")}
              className="hover:text-[#E05338] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#E05338] cursor-pointer"
            >
              ARCHITECTURE
            </button>
            <button
              onClick={() => scrollTo("pipeline")}
              className="hover:text-[#E05338] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#E05338] cursor-pointer"
            >
              HOW IT WORKS
            </button>
            <button
              onClick={() => scrollTo("comparison")}
              className="hover:text-[#E05338] transition-colors pb-0.5 border-b-2 border-transparent hover:border-[#E05338] cursor-pointer"
            >
              BENCHMARKS
            </button>
          </nav>

          {/* Box 3: Clean Live Status Indicator (NO BUTTONS) */}
          <div className="md:col-span-3 p-4 sm:p-5 flex items-center justify-center md:justify-end">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FAF0E4] border-[1.5px] border-[#1C1917] font-mono text-[11px] font-bold text-[#1C1917] retro-shadow-sm select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden xl:inline">LIVE //</span>
              <span>FEDAVG ACTIVE</span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* HERO SECTION (Exact grid structure matching the user's reference image) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] bg-[#FAF7F2]">

          {/* ------------------------------------------------------------- */}
          {/* Cell 1: Main Left Hero (Headline, Copy, Metric, Retro Button) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 relative flex flex-col justify-between overflow-hidden border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[#1C1917]">

            {/* Retro Vector Decor: Rotating Terracotta 12-point starburst */}
            <div className="absolute top-8 right-8 sm:top-12 sm:right-14 w-14 h-14 sm:w-20 sm:h-20 pointer-events-none animate-spin-slow opacity-95">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                <polygon
                  points="50,0 59,32 90,15 76,45 100,50 76,55 90,85 59,68 50,100 41,68 10,85 24,55 0,50 24,45 10,15 41,32"
                  fill="#E05338"
                />
              </svg>
            </div>

            {/* Retro Vector Decor: Playful Squiggly Spring Loop */}
            <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 w-40 sm:w-56 pointer-events-none opacity-80 animate-float">
              <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path
                  d="M10 25 C 30 5, 45 40, 65 20 C 85 0, 100 45, 120 22 C 140 -2, 155 42, 175 20 C 185 10, 195 25, 200 22"
                  stroke="#E05338"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Retro Vector Decor: Yellow 8-point sunburst */}
            <div className="absolute bottom-8 right-16 sm:right-24 w-10 h-10 sm:w-14 sm:h-14 pointer-events-none animate-float-alt">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <polygon
                  points="50,5 62,35 95,50 62,65 50,95 38,65 5,50 38,35"
                  fill="#E5A638"
                />
              </svg>
            </div>

            {/* Top Content */}
            <div className="space-y-6 relative z-10">
              {/* Featured Architecture kicker */}
              <div className="inline-flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05338]"></span>
                <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-[#E05338]">
                  FEATURED ARCHITECTURE • FEDERATED & zkML
                </span>
              </div>

              {/* Massive Bold Headline */}
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#1C1917] leading-[0.95] max-w-xl">
                FedZero<br />
                Network
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-[#1C1917]/80 max-w-lg font-sans font-medium leading-relaxed">
                Collaborative machine-learning training across edge devices without sharing private datasets. Computations are verified by zero-knowledge proofs on Arbitrum and incentivized on Solana.
              </p>
            </div>

            {/* Bottom Content: Price/Metric tag + Reference Image Button */}
            <div className="mt-12 sm:mt-16 space-y-7 relative z-10">

              {/* Highlight Metric styled like $999.99 in the image */}
              <div className="space-y-1">
                <div className="font-display font-black text-3xl sm:text-4xl text-[#1C1917] tracking-tight flex items-baseline space-x-3">
                  <span>0.00 BYTES</span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E05338] bg-[#E05338]/10 px-2 py-0.5 rounded-md border border-[#E05338]/30">
                    Shielded Edge
                  </span>
                </div>
                <div className="font-mono text-xs text-[#1C1917]/70 font-semibold tracking-wide uppercase">
                  Raw Data Leaked • 100% Client-Side Privacy Guaranteed
                </div>
              </div>

              {/* The Single Main Action Button */}
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-stretch border-[1.5px] border-[#1C1917] bg-[#FAF7F2] rounded-md overflow-hidden font-display font-extrabold text-xs tracking-wider uppercase text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7F2] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#E05338]"
                >
                  <span className="px-6 py-3.5 flex items-center space-x-2 border-r-[1.5px] border-[#1C1917]">
                    <span>ENTER DASHBOARD</span>
                  </span>
                  <span className="px-3.5 flex items-center justify-center bg-[#FAF0E4] group-hover:bg-[#E05338] group-hover:text-white transition-colors">
                    <ArrowDownRight className="w-4 h-4 transition-transform group-hover:scale-125" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Cell 2: Right Protocol & Multi-Chain Architecture Console      */}
          {/* (Warm Cream Editorial Theme matching the entire website)       */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF0E4] border-t-[1.5px] lg:border-t-0 border-[#1C1917] space-y-6">

            {/* Top Console Header */}
            <div className="flex items-center justify-between border-b-[1.5px] border-[#1C1917] pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05338] animate-ping"></span>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1C1917]">
                  PROTOCOL RUNTIME // LIVE MATRIX
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border-[1.5px] border-[#1C1917] font-mono text-[10px] font-bold text-[#E05338] retro-shadow-sm">
                3 NODES ONLINE
              </span>
            </div>

            {/* Chain Selector Tabs (Arbitrum, Solana, Zcash) */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1C1917]/70">
                Select Multi-Chain Layer:
              </div>

              <div className="grid grid-cols-3 gap-2 font-display text-xs font-bold uppercase">
                <button
                  onClick={() => setSelectedChain("arb")}
                  className={`p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "arb"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-xs">ARBITRUM</span>
                  <span className="text-[9px] font-mono opacity-80">ZK Verifier</span>
                </button>

                <button
                  onClick={() => setSelectedChain("sol")}
                  className={`p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "sol"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-xs">SOLANA</span>
                  <span className="text-[9px] font-mono opacity-80">Rewards</span>
                </button>

                <button
                  onClick={() => setSelectedChain("zec")}
                  className={`p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "zec"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-xs">ZCASH</span>
                  <span className="text-[9px] font-mono opacity-80">Shielded</span>
                </button>
              </div>

              {/* Dynamic Chain Detail Card */}
              <div className="p-4 sm:p-5 rounded-xl border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-3 retro-shadow-sm font-mono text-xs">
                {selectedChain === "arb" && (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-2">
                      <span className="font-bold text-[#E05338]">Arbitrum Layer 2 (EVM Rollup)</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/30">
                        Operational
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#1C1917]/85">
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Verifier Contract:</span>
                        <span className="font-bold text-[#1C1917]">ZKVerifier.sol (0x5FbD...aa3)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Model Lineage:</span>
                        <span className="font-bold text-[#1C1917]">ModelRegistry.sol (IPFS CIDs)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Pairing Gas:</span>
                        <span className="font-bold text-[#E05338]">O(1) Constant Gas</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedChain === "sol" && (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-2">
                      <span className="font-bold text-[#E05338]">Solana High-Throughput Engine</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/30">
                        Sub-second
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#1C1917]/85">
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Program PDA:</span>
                        <span className="font-bold text-[#1C1917]">Compute1...1111</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Reward Formula:</span>
                        <span className="font-bold text-[#1C1917]">Quality × Validity × ComputeTier</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Anti-Sybil:</span>
                        <span className="font-bold text-emerald-700">Rate-Limited Anchor PDA</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedChain === "zec" && (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-2">
                      <span className="font-bold text-[#E05338]">Zcash Cryptographic Pavilion</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded border border-purple-500/30">
                        Shielded Edge
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#1C1917]/85">
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Privacy Standard:</span>
                        <span className="font-bold text-[#1C1917]">Shielded Confidential Weights</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Raw Data Disclosed:</span>
                        <span className="font-bold text-emerald-700">0.00 Bytes (100% Private)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">ZK Paradigm:</span>
                        <span className="font-bold text-[#1C1917]">Halo2 / BN254 Scalar Field</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Live Edge Nodes Status Matrix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-[#1C1917]/70">
                <span>Active Edge Hardware:</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>100% Zero-Leakage</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#E05338] truncate">Node-01 // RTX 4090</div>
                  <div className="text-[#1C1917]/70">FL Epochs: 3</div>
                  <div className="text-emerald-700 font-semibold">Proof: Valid ✓</div>
                </div>

                <div className="p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#E5A638] truncate">Node-02 // M3 Max</div>
                  <div className="text-[#1C1917]/70">DP-SGD Local</div>
                  <div className="text-emerald-700 font-semibold">Halo2: BN254 ✓</div>
                </div>

                <div className="p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#1C1917] truncate">Node-03 // A100</div>
                  <div className="text-[#1C1917]/70">Cluster Tensor</div>
                  <div className="text-emerald-700 font-semibold">Byzantine: OK ✓</div>
                </div>
              </div>
            </div>

            {/* Interactive Testnet Round Simulator (Replaces static text & duplicate button) */}
            <div className="p-4 rounded-xl border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-3 retro-shadow-sm font-mono">
              <div className="flex items-center justify-between text-xs border-b border-[#1C1917]/15 pb-2">
                <span className="font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${simulating ? "bg-[#E05338] animate-ping" : "bg-emerald-500"}`}></span>
                  <span>Interactive Testnet Engine</span>
                </span>
                <span className="font-bold text-[#E05338] text-[11px]">
                  Round #{simRound}
                </span>
              </div>

              {/* Live Status Output Banner */}
              <div className="p-2.5 rounded-lg bg-[#FAF0E4] border border-[#1C1917]/30 text-xs text-[#1C1917] flex items-center justify-between">
                <span className="truncate font-semibold">{simStep}</span>
                <span className="text-[11px] font-bold text-[#E05338] ml-2 shrink-0">
                  {simAccuracy}% Acc
                </span>
              </div>

              {/* Interactive Trigger Button */}
              <button
                onClick={handleSimulateRound}
                disabled={simulating}
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#1C1917] bg-[#1C1917] text-[#FAF7F2] hover:bg-[#E05338] hover:text-white font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_#E05338] active:translate-x-[0px] active:translate-y-[0px] disabled:opacity-60 cursor-pointer"
              >
                <Zap className={`w-4 h-4 text-[#E5A638] ${simulating ? "animate-spin" : ""}`} />
                <span>{simulating ? "EXECUTING FEDAVG & ZK PROOFS..." : "TEST RUN FEDAVG ROUND ⚡"}</span>
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* TICKER / MARQUEE RIBBON */}
        {/* ========================================================================= */}
        <div className="border-y-[1.5px] border-[#1C1917] bg-[#FAF0E4] py-3 overflow-hidden select-none">
          <div className="flex items-center space-x-8 font-mono font-bold text-xs uppercase tracking-widest text-[#1C1917] whitespace-nowrap animate-pulse">
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>ZERO DATA LEAKAGE</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>HALO2 ZERO-KNOWLEDGE PROOFS</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>ARBITRUM L2 LINEAGE REGISTRY</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>SOLANA DYNAMIC INCENTIVE ENGINE</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>BYZANTINE POISONING DEFENSE</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-[#E05338]">★</span>
              <span>100% PRIVATE EDGE COMPUTE</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABOUT SECTION (Rich Project Description as requested by User) */}
        {/* ========================================================================= */}
        <section id="about" className="p-6 sm:p-10 lg:p-14 bg-[#FAF7F2] border-b-[1.5px] border-[#1C1917] space-y-12">

          {/* Section Header Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-[1.5px] border-[#1C1917] bg-[#F7F2EA] rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x-[1.5px] divide-[#1C1917]">
            <div className="md:col-span-3 p-4 flex items-center space-x-2 font-mono text-xs font-bold text-[#E05338]">
              <span className="w-2 h-2 rounded-full bg-[#E05338]"></span>
              <span>SECTION 01 // OVERVIEW</span>
            </div>
            <div className="md:col-span-6 p-4 text-center font-display font-extrabold text-sm uppercase tracking-wider text-[#1C1917]">
              ABOUT THE FEDZERO PROTOCOL
            </div>
            <div className="md:col-span-3 p-4 flex items-center justify-end font-mono text-xs font-semibold text-[#1C1917]/70">
              SPECIFICATION v2.4
            </div>
          </div>

          {/* Project Mission & Core Dilemma */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E05338]/10 text-[#E05338] border border-[#E05338]/30 inline-block">
                The Privacy Dilemma
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1C1917] uppercase tracking-tight leading-tight">
                AI MUST LEARN FROM DATA WITHOUT STEALING IT.
              </h2>
              <p className="text-sm text-[#1C1917]/80 leading-relaxed font-sans">
                Traditional AI requires organizations and individuals to surrender raw proprietary datasets into centralized cloud warehouses (OpenAI, AWS, Google Cloud). This creates dangerous single points of failure, copyright litigation, and catastrophic medical and financial privacy leaks.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF0E4] border-[1.5px] border-[#1C1917] rounded-2xl p-6 sm:p-8 space-y-4 retro-shadow">
              <h3 className="font-display font-extrabold text-xl text-[#1C1917] uppercase flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#E05338]" />
                <span>The Solution: Bring Code to Data, Not Data to Code</span>
              </h3>
              <p className="text-sm text-[#1C1917]/85 leading-relaxed">
                The <strong>FedZero Network</strong> unites <strong>Federated Learning (FL)</strong> with <strong>Zero-Knowledge Cryptography (zkML)</strong> and a <strong>Tripartite Multi-Chain Architecture</strong>. Devices independently compute local parameter weight improvements without ever transferring private data. Zero-Knowledge proofs verify computation integrity on-chain, eliminating the need to blindly trust edge participants.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#E05338] font-bold text-lg">0 KB</div>
                  <div className="text-[#1C1917]/70 text-[11px]">Raw Data Disclosed</div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#1C1917] font-bold text-lg">O(1) Gas</div>
                  <div className="text-[#1C1917]/70 text-[11px]">Succinct Pairing Checks</div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#E5A638] font-bold text-lg">&lt; 1.2s</div>
                  <div className="text-[#1C1917]/70 text-[11px]">Solana Micro-Payouts</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid matching the retro editorial aesthetic */}
          <div id="architecture" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 scroll-mt-20">

            {/* Pillar 1 */}
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-6 bg-[#FAF7F2] retro-btn space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E05338]/15 border-[1.5px] border-[#1C1917] flex items-center justify-center text-[#E05338]">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#E05338] tracking-widest uppercase">
                01 // EDGE COMPUTATION
              </div>
              <h3 className="font-display font-bold text-xl text-[#1C1917]">
                Federated Learning (FedAvg)
              </h3>
              <p className="text-xs text-[#1C1917]/80 leading-relaxed font-sans">
                Participants download the latest global model tensor, perform local epochs on edge datasets, and return mathematical delta weights (ΔW). Distance-based outlier rejection and L2 norm clipping actively defend against adversarial poisoning.
              </p>
              <ul className="text-xs font-mono space-y-1.5 text-[#1C1917]/75 pt-2 border-t border-[#1C1917]/20">
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E05338]">✔</span>
                  <span>Cross-device & Cross-silo FL</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E05338]">✔</span>
                  <span>Byzantine outlier filtering</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-6 bg-[#FAF7F2] retro-btn space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E5A638]/20 border-[1.5px] border-[#1C1917] flex items-center justify-center text-[#E5A638]">
                <ShieldCheck className="w-6 h-6 text-[#1C1917]" />
              </div>
              <div className="font-mono text-xs font-bold text-[#E5A638] tracking-widest uppercase">
                02 // CRYPTOGRAPHIC INTEGRITY
              </div>
              <h3 className="font-display font-bold text-xl text-[#1C1917]">
                Zero-Knowledge Proofs (zkML)
              </h3>
              <p className="text-xs text-[#1C1917]/80 leading-relaxed font-sans">
                Eliminates the "lazy node" problem. Every edge participant synthesizes an EZKL / Halo2 SNARK proof verifying that the claimed forward and backward training steps were honestly calculated without falsified weights.
              </p>
              <ul className="text-xs font-mono space-y-1.5 text-[#1C1917]/75 pt-2 border-t border-[#1C1917]/20">
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E5A638]">✔</span>
                  <span>Halo2 KZG & BN254 circuits</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E5A638]">✔</span>
                  <span>Quantization constraint checking</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-6 bg-[#FAF7F2] retro-btn space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1C1917] text-[#FAF7F2] border-[1.5px] border-[#1C1917] flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#1C1917] tracking-widest uppercase">
                03 // CONSENSUS & SETTLEMENT
              </div>
              <h3 className="font-display font-bold text-xl text-[#1C1917]">
                Tripartite Multi-Chain Layer
              </h3>
              <p className="text-xs text-[#1C1917]/80 leading-relaxed font-sans">
                <strong>Arbitrum</strong> verifies Groth16/KZG pairings and tracks model lineage CIDs. <strong>Solana</strong> delivers high-throughput token rewards. <strong>Zcash</strong> serves as the zero-knowledge privacy benchmark.
              </p>
              <ul className="text-xs font-mono space-y-1.5 text-[#1C1917]/75 pt-2 border-t border-[#1C1917]/20">
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E05338]">✔</span>
                  <span>ZKVerifier.sol & AIPassport.sol</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-[#E05338]">✔</span>
                  <span>Dynamic reward scoring engine</span>
                </li>
              </ul>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKFLOW PIPELINE (How it works with interactive step tabs) */}
        {/* ========================================================================= */}
        <section id="pipeline" className="p-6 sm:p-10 lg:p-14 bg-[#FAF0E4] border-b-[1.5px] border-[#1C1917] space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-extrabold text-[#E05338] uppercase tracking-widest">
                STEP-BY-STEP EXECUTION
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1C1917] uppercase tracking-tight mt-1">
                HOW A FEDERATED TRAINING ROUND OPERATES
              </h2>
            </div>
            <div className="font-mono text-xs text-[#1C1917]/70">
              Click any step to inspect mathematical mechanics
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {architectureSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border-[1.5px] text-left transition-all ${activeStep === idx
                    ? "bg-[#FAF7F2] border-[#1C1917] retro-shadow-sm font-bold"
                    : "bg-[#F7F2EA] border-[#1C1917]/40 hover:border-[#1C1917] text-[#1C1917]/80"
                  }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activeStep === idx ? "bg-[#E05338] text-white" : "bg-[#1C1917]/10 text-[#1C1917]"
                    }`}>
                    STEP {s.step}
                  </span>
                  <span className="text-[10px] text-[#1C1917]/60 uppercase">{s.tag}</span>
                </div>
                <div className="font-display text-sm font-bold text-[#1C1917] truncate">
                  {s.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <div className="bg-[#FAF7F2] border-[1.5px] border-[#1C1917] rounded-2xl p-6 sm:p-8 retro-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#E05338] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#E05338]"></span>
                <span>Active Phase: Step {architectureSteps[activeStep].step}</span>
              </div>
              <h3 className="font-display font-black text-2xl text-[#1C1917]">
                {architectureSteps[activeStep].title}
              </h3>
              <p className="text-sm text-[#1C1917]/85 leading-relaxed font-sans">
                {architectureSteps[activeStep].desc}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold text-[#1C1917] uppercase tracking-wider">
                  Guaranteed Cryptographic Properties:
                </div>
                {architectureSteps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start space-x-2 text-xs font-mono text-[#1C1917]/80">
                    <span className="text-[#E05338] font-bold">▶</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mathematical Formula Card - Styled in Website Warm Theme */}
            <div className="lg:col-span-5 bg-[#FAF0E4] text-[#1C1917] rounded-2xl p-5 sm:p-6 border-[1.5px] border-[#1C1917] font-mono text-xs space-y-4 retro-shadow-sm">
              <div className="flex items-center justify-between border-b-[1.5px] border-[#1C1917]/20 pb-2.5 text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E05338]"></span>
                  <span>MATHEMATICAL FORMULA</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 font-bold text-[10px] uppercase">
                  VERIFIED ✓
                </span>
              </div>

              {/* The Formula Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border-[1.5px] border-[#1C1917] text-[#E05338] font-mono text-xs sm:text-sm font-bold overflow-x-auto shadow-inner">
                <code>{architectureSteps[activeStep].formula}</code>
              </div>

              <div className="text-[11px] text-[#1C1917]/80 leading-relaxed font-mono bg-[#FAF7F2]/60 p-3 rounded-lg border border-[#1C1917]/15">
                Executed inside client hardware enclaves and validated via bilinear pairing checks on Arbitrum layer 2.
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* COMPARISON BENCHMARKS (Traditional AI vs Verifiable AI Network) */}
        {/* ========================================================================= */}
        <section id="comparison" className="p-6 sm:p-10 lg:p-14 bg-[#FAF7F2] border-b-[1.5px] border-[#1C1917] space-y-8">

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold text-[#E05338] uppercase tracking-widest">
              PARADIGM SHIFT
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1C1917] uppercase tracking-tight">
              TRADITIONAL AI VS. VERIFIABLE NETWORK
            </h2>
            <p className="text-xs sm:text-sm text-[#1C1917]/70 font-sans">
              How our zero-knowledge federated protocol changes the fundamental trust assumptions of machine learning.
            </p>
          </div>

          {/* Table Container */}
          <div className="border-[1.5px] border-[#1C1917] rounded-2xl overflow-hidden bg-[#FAF7F2] retro-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#1C1917] text-[#FAF7F2] uppercase tracking-wider font-bold">
                    <th className="p-4 border-r border-[#FAF7F2]/20">Evaluation Vector</th>
                    <th className="p-4 border-r border-[#FAF7F2]/20 text-[#FAF7F2]/70">Traditional Centralized AI</th>
                    <th className="p-4 text-[#E5A638]">FedZero Protocol (This Project)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[1.5px] divide-[#1C1917]">
                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Raw Data Custody
                    </td>
                    <td className="p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Uploaded to corporate servers; vulnerable to breach.
                    </td>
                    <td className="p-4 font-bold text-[#E05338]">
                      100% Client-Side; raw data never leaves device hardware.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Computation Trust
                    </td>
                    <td className="p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      "Trust us" cloud provider guarantees; no proof of honesty.
                    </td>
                    <td className="p-4 font-bold text-[#1C1917]">
                      Halo2 zk-SNARK cryptographic validity proof (π).
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Model Version Lineage
                    </td>
                    <td className="p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Opaque internal release notes; easily modified or retracted.
                    </td>
                    <td className="p-4 font-bold text-[#1C1917]">
                      Arbitrum Smart Contract (ModelRegistry.sol) with IPFS CIDs.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Contributor Incentive
                    </td>
                    <td className="p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Big tech monopoly captures 100% of commercial value.
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      Automated Solana micro-rewards based on quality & compute.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Reputation & Sybil Defense
                    </td>
                    <td className="p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Centralized ban-lists and closed API tokens.
                    </td>
                    <td className="p-4 font-bold text-[#1C1917]">
                      Soulbound AIPassport.sol tokens & rate-limited PDAs.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* BIG CALL TO ACTION BANNER (Direct Gateway to Dashboard) */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 lg:p-16 bg-[#181A24] text-[#FAF5EE] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E05338]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF5EE]/10 border border-[#FAF5EE]/20 text-[#E5A638] text-xs font-mono">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE TESTNET ONLINE • 3 SIMULATED PARTICIPANTS</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              READY TO INTERACT WITH THE RUNNING NETWORK?
            </h2>
            <p className="text-sm text-[#FAF5EE]/75 font-sans leading-relaxed">
              Launch the live telemetry dashboard. Trigger federated learning training rounds, inspect Halo2 zkML constraints, manage autoML datasets, and view automated Solana rewards in real time.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-[#E05338] hover:bg-[#FAF5EE] text-white hover:text-[#1C1917] font-display font-black text-sm uppercase tracking-wider flex items-center space-x-2.5 border-[2px] border-[#1C1917] shadow-[4px_4px_0px_#FAF5EE] hover:shadow-[4px_4px_0px_#E05338] transition-all hover:scale-105 active:scale-95"
            >
              <span>ENTER DASHBOARD NOW</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* FOOTER SECTION (Editorial Framed Grid Footer) */}
        {/* ========================================================================= */}
        <footer className="border-t-[1.5px] border-[#1C1917] bg-[#FAF7F2] p-6 sm:p-10 font-mono text-xs text-[#1C1917]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">

            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#E05338] flex items-center justify-center text-white font-bold text-xs border border-[#1C1917]">
                  V
                </div>
                <span className="font-display font-extrabold text-sm uppercase tracking-tight">
                  FEDZERO NETWORK
                </span>
              </div>
              <p className="text-[11px] text-[#1C1917]/70 max-w-sm">
                A research-grade decentralized machine learning framework powered by zero-knowledge proofs and multi-chain settlement.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-wrap gap-4 text-xs font-display font-bold uppercase">
              <Link href="/dashboard" className="hover:text-[#E05338] transition-colors">
                Dashboard
              </Link>
              <Link href="/training" className="hover:text-[#E05338] transition-colors">
                Training Center
              </Link>
              <Link href="/proofs" className="hover:text-[#E05338] transition-colors">
                ZK Proofs
              </Link>
              <Link href="/passport" className="hover:text-[#E05338] transition-colors">
                AI Passport
              </Link>
            </div>

            <div className="md:col-span-3 text-left md:text-right space-y-1 text-[11px] text-[#1C1917]/60">
              <div>Network Block: #19,420,812</div>
              <div>Cryptographic Status: Shielded Edge</div>
              <div className="text-[10px] text-[#1C1917]/40">© 2026 FedZero Protocol Consortium. All rights reserved.</div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
