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
  Code2,
  Info,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChain, setSelectedChain] = useState<"arb" | "sol" | "zec">("arb");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
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
      formulaTitle: "Local Gradient Descent (Federated SGD)",
      formulaPlain: "W_i^(t+1) = W^(t) − η · ∇L_i(W^(t); D_i)",
      formulaDisplay: (
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1.5 font-serif text-base sm:text-lg text-[#1C1917] select-none py-1">
          <span className="bg-amber-500/15 text-amber-950 px-2.5 py-0.5 rounded-md border border-amber-500/30 font-bold shadow-xs">
            <i>W</i><sub className="font-sans text-[10px]">i</sub><sup className="font-sans text-[10px]">(t+1)</sup>
          </span>
          <span className="font-sans font-bold text-[#1C1917]/70">=</span>
          <span className="bg-stone-200/80 text-stone-900 px-2.5 py-0.5 rounded-md border border-stone-300 font-semibold shadow-xs">
            <i>W</i><sup className="font-sans text-[10px]">(t)</sup>
          </span>
          <span className="font-sans font-black text-[#E05338] text-xl leading-none">−</span>
          <span className="bg-[#E05338]/15 text-[#E05338] px-2.5 py-0.5 rounded-md border border-[#E05338]/30 font-bold font-serif shadow-xs">
            η
          </span>
          <span className="text-[#1C1917]/40 font-sans">·</span>
          <span className="bg-blue-500/15 text-blue-950 px-2.5 py-0.5 rounded-md border border-blue-500/30 font-semibold shadow-xs flex items-center space-x-0.5">
            <span>∇<i>L</i><sub className="font-sans text-[10px]">i</sub></span>
            <span className="text-xs text-[#1C1917]/80 font-sans ml-0.5">
              (<i>W</i><sup className="text-[9px]">(t)</sup>; <strong className="text-[#E05338] font-serif">D<sub className="text-[9px]">i</sub></strong>)
            </span>
          </span>
        </div>
      ),
      intuition: "Har node apne private data (D_i) par error gradient calculate karta hai aur weights update karta hai — kisi bhi patient ya user ka raw data device se bahar nahi jata.",
      terms: [
        { symbol: "W_i^(t+1)", label: "Updated Local Weights", meaning: "Training ke baad node i ka agla local model" },
        { symbol: "W^(t)", label: "Global Base Model", meaning: "Coordinator se mila current round ka model" },
        { symbol: "η (Eta)", label: "Learning Rate", meaning: "Model training step size (e.g. 0.01)" },
        { symbol: "∇L_i", label: "Loss Gradient", meaning: "Loss/error kam karne ke liye weights ka direction" },
        { symbol: "D_i", label: "Private Dataset", meaning: "Edge device par stored sensitive data (zero leakage)" },
      ],
      venue: "Executed inside local GPU/CPU hardware enclaves; zero raw bytes broadcast.",
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
      formulaTitle: "zk-SNARK Circuit Proof Synthesis",
      formulaPlain: "π_i = Prover(Circuit_ONNX, W, ΔW_i)",
      formulaDisplay: (
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1.5 font-serif text-base sm:text-lg text-[#1C1917] select-none py-1">
          <span className="bg-purple-500/15 text-purple-950 px-2.5 py-0.5 rounded-md border border-purple-500/30 font-bold shadow-xs">
            π<sub className="font-sans text-[10px]">i</sub>
          </span>
          <span className="font-sans font-bold text-[#1C1917]/70">=</span>
          <span className="font-sans font-bold text-stone-800 text-sm sm:text-base">Prover</span>
          <span className="font-sans text-stone-800 text-sm">
            (
            <span className="bg-blue-500/15 text-blue-950 px-1.5 py-0.5 rounded border border-blue-500/25 text-xs font-mono font-semibold">Circuit<sub>ONNX</sub></span>
            <span className="mx-1 text-stone-400">,</span>
            <span className="bg-amber-500/15 text-amber-950 px-1.5 py-0.5 rounded border border-amber-500/25 text-xs font-serif font-bold"><i>W</i></span>
            <span className="mx-1 text-stone-400">,</span>
            <span className="bg-emerald-500/15 text-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/25 text-xs font-mono font-semibold">ΔW<sub className="text-[9px]">i</sub></span>
            )
          </span>
        </div>
      ),
      intuition: "Cryptographic proof (π) verify karta hai ki node ne sachme genuine model training kari hai, bina fake gradients submit kiye.",
      terms: [
        { symbol: "π_i (Pi)", label: "Zero-Knowledge Proof", meaning: "Succinct proof jo blockchain par instantly verify hota hai" },
        { symbol: "Circuit_ONNX", label: "Model Architecture", meaning: "Arithmetic gates me compiled neural network graph" },
        { symbol: "W (Witness)", label: "Private Trace", meaning: "Prover ka internal execution trace (tamper-proof)" },
        { symbol: "ΔW_i", label: "Gradient Delta", meaning: "Network aggregation ke liye bheje gaye weight updates" },
      ],
      venue: "Arithmetized over BN254 elliptic curve; verified in O(1) constant gas on Arbitrum L2.",
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
      formulaTitle: "Robust Byzantine Federated Averaging",
      formulaPlain: "ΔW_global = ∑ (n_k / n) · Clip(ΔW_k, C)",
      formulaDisplay: (
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1.5 font-serif text-base sm:text-lg text-[#1C1917] select-none py-1">
          <span className="bg-emerald-500/15 text-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-bold shadow-xs">
            Δ<i>W</i><sub className="font-sans text-[10px]">global</sub>
          </span>
          <span className="font-sans font-bold text-[#1C1917]/70">=</span>
          <span className="font-serif text-2xl font-bold text-stone-800">∑</span>
          <span className="inline-flex flex-col items-center justify-center text-xs font-mono px-1 font-bold">
            <span className="border-b border-[#1C1917] pb-0.5">n<sub>k</sub></span>
            <span className="pt-0.5">n</span>
          </span>
          <span className="text-[#1C1917]/40 font-sans">·</span>
          <span className="bg-amber-500/15 text-amber-950 px-2 py-0.5 rounded-md border border-amber-500/30 text-xs sm:text-sm font-mono font-semibold shadow-xs">
            Clip(Δ<i>W</i><sub>k</sub>, <span className="text-[#E05338] font-bold">C</span>)
          </span>
        </div>
      ),
      intuition: "Sabhi valid nodes ke updates ko data size ke proportional merge karta hai, aur malicious/poisoned nodes ko auto-reject & clip karta hai.",
      terms: [
        { symbol: "ΔW_global", label: "Merged Weight Delta", meaning: "Sabhi nodes ka aggregate kiya hua final global model update" },
        { symbol: "∑ (Sum)", label: "Honest Aggregation", meaning: "K-validated non-malicious nodes ka weighted sum" },
        { symbol: "n_k / n", label: "Sample Ratio", meaning: "Node k ka private dataset proportion (more data = higher weight)" },
        { symbol: "Clip(·, C)", label: "Norm Clipping", meaning: "Weight update norm ko limit C par lock karke attack rokta hai" },
      ],
      venue: "Evaluated by Coordinator with Multi-Krum outlier rejection before IPFS publish.",
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
      formulaTitle: "Proof-of-Compute Dynamic Reward Engine",
      formulaPlain: "Reward = Quality × Validity × ComputeTier × Utility",
      formulaDisplay: (
        <div className="flex items-center justify-center flex-wrap gap-x-1.5 gap-y-1 font-serif text-sm sm:text-base text-[#1C1917] select-none py-1">
          <span className="bg-[#E05338]/15 text-[#E05338] px-2.5 py-0.5 rounded-md border border-[#E05338]/30 font-bold font-mono shadow-xs">
            Reward
          </span>
          <span className="font-sans font-bold text-[#1C1917]/70">=</span>
          <span className="bg-blue-500/15 text-blue-950 px-2 py-0.5 rounded border border-blue-500/25 text-xs font-mono font-bold shadow-xs">
            Quality
          </span>
          <span className="text-[#1C1917]/40 font-sans">×</span>
          <span className="bg-emerald-500/15 text-emerald-950 px-2 py-0.5 rounded border border-emerald-500/25 text-xs font-mono font-bold shadow-xs">
            Validity
          </span>
          <span className="text-[#1C1917]/40 font-sans">×</span>
          <span className="bg-purple-500/15 text-purple-950 px-2 py-0.5 rounded border border-purple-500/25 text-xs font-mono font-bold shadow-xs">
            Tier
          </span>
          <span className="text-[#1C1917]/40 font-sans">×</span>
          <span className="bg-amber-500/15 text-amber-950 px-2 py-0.5 rounded border border-amber-500/25 text-xs font-mono font-bold shadow-xs">
            Utility
          </span>
        </div>
      ),
      intuition: "Smart contract automatically token payout calculate karta hai based on model accuracy improvement, valid zk-proof, and hardware tier.",
      terms: [
        { symbol: "Quality", label: "Model Gain (ΔAcc)", meaning: "Node ke weights se model accuracy kitni improve hui" },
        { symbol: "Validity", label: "zk-SNARK Status", meaning: "1.0 if proof verified on Arbitrum, 0.0 if failed" },
        { symbol: "Tier", label: "Hardware Weight", meaning: "Compute multiplier (RTX 4090: 2.5x, Apple Silicon: 1.8x, CPU: 1.0x)" },
        { symbol: "Utility", label: "Network Factor", meaning: "Federated round scarcity & dynamic token distribution curve" },
      ],
      venue: "Executed on Solana Anchor PDA program for sub-second, micro-cent gas token payouts.",
      details: [
        "Arbitrum: ZKVerifier.sol executes pairing checks and logs ModelRegistry lineage",
        "Solana: High-frequency PDA program distributes micro-incentives without high gas fees",
        "Zcash Reference: Shielded edge privacy ensuring contributor identity confidentiality"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#1C1917] selection:bg-[#E05338] selection:text-white font-sans p-2 sm:p-5 md:p-8 lg:p-12 transition-colors duration-300">
      {/* Master Framed Poster Container */}
      <div id="top" className="max-w-[1360px] mx-auto border-[1.5px] border-[#1C1917] bg-[#FAF7F2] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl relative">

        {/* ========================================================================= */}
        {/* HEADER SECTION (Grid Boxed Header with Working Smooth-Scroll Links)       */}
        {/* ========================================================================= */}
        <header className="grid grid-cols-1 md:grid-cols-12 border-b-[1.5px] border-[#1C1917] divide-y md:divide-y-0 md:divide-x-[1.5px] divide-[#1C1917] bg-[#FAF7F2]">

          {/* Box 1: Stylized Terracotta Logo + Monogram + Mobile Toggle */}
          <div className="md:col-span-4 p-3.5 sm:p-5 flex items-center justify-between space-x-3.5">
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#141416] flex items-center justify-center border-[1.5px] border-[#1C1917] shadow-[2px_2px_0px_#1C1917] group-hover:rotate-6 transition-transform shrink-0 overflow-hidden">
                <img src="/fedzero_emblem.png" alt="FedZero" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display font-extrabold text-sm sm:text-base tracking-tight text-[#1C1917] uppercase flex items-center space-x-1.5">
                  <span>FedZero</span>
                  <span className="w-2 h-2 rounded-full bg-[#E05338] animate-ping"></span>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#1C1917]/70 uppercase">
                  Federated • Zero-Knowledge
                </div>
              </div>
            </Link>

            {/* Mobile Actions: Live Pill + Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-[#FAF0E4] border border-[#1C1917] font-mono text-[9px] font-bold text-[#1C1917]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile navigation menu"
                className="p-2 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF0E4] hover:bg-[#E05338] hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Box 2: Centered Editorial Working Nav Links (Desktop) */}
          <nav className="hidden md:flex md:col-span-5 p-4 sm:p-5 items-center justify-center space-x-4 lg:space-x-8 text-xs font-display font-bold uppercase tracking-wider text-[#1C1917]">
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

          {/* Box 3: Clean Live Status Indicator (Desktop) */}
          <div className="hidden md:flex md:col-span-3 p-4 sm:p-5 items-center justify-end">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FAF0E4] border-[1.5px] border-[#1C1917] font-mono text-[11px] font-bold text-[#1C1917] retro-shadow-sm select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden xl:inline">LIVE //</span>
              <span>FEDAVG ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b-[1.5px] border-[#1C1917] bg-[#FAF7F2] p-4 space-y-3">
            <div className="grid grid-cols-1 gap-1.5 font-display text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => scrollTo("top")}
                className="p-3 rounded-lg border border-[#1C1917]/20 bg-[#FAF0E4]/60 text-left hover:bg-[#E05338] hover:text-white flex items-center justify-between"
              >
                <span>01 // HOME</span>
                <span className="text-xs font-mono">↑</span>
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="p-3 rounded-lg border border-[#1C1917]/20 bg-[#FAF0E4]/60 text-left hover:bg-[#E05338] hover:text-white flex items-center justify-between"
              >
                <span>02 // ABOUT PROTOCOL</span>
                <span className="text-xs font-mono">↓</span>
              </button>
              <button
                onClick={() => scrollTo("architecture")}
                className="p-3 rounded-lg border border-[#1C1917]/20 bg-[#FAF0E4]/60 text-left hover:bg-[#E05338] hover:text-white flex items-center justify-between"
              >
                <span>03 // 3 PILLARS ARCHITECTURE</span>
                <span className="text-xs font-mono">↓</span>
              </button>
              <button
                onClick={() => scrollTo("pipeline")}
                className="p-3 rounded-lg border border-[#1C1917]/20 bg-[#FAF0E4]/60 text-left hover:bg-[#E05338] hover:text-white flex items-center justify-between"
              >
                <span>04 // MATHEMATICAL FORMULAS</span>
                <span className="text-xs font-mono">↓</span>
              </button>
              <button
                onClick={() => scrollTo("comparison")}
                className="p-3 rounded-lg border border-[#1C1917]/20 bg-[#FAF0E4]/60 text-left hover:bg-[#E05338] hover:text-white flex items-center justify-between"
              >
                <span>05 // BENCHMARKS</span>
                <span className="text-xs font-mono">↓</span>
              </button>
            </div>
            <div className="pt-2 border-t border-[#1C1917]/15">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#E05338] text-white text-center font-display font-extrabold text-xs uppercase tracking-wider border-[1.5px] border-[#1C1917] flex items-center justify-center space-x-2 shadow-[2px_2px_0px_#1C1917]"
              >
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Quick-Scroll Pill Bar */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 px-3 space-x-2 border-b-[1.5px] border-[#1C1917] bg-[#FAF0E4]/70 whitespace-nowrap text-[10px] font-display font-bold uppercase">
          <button
            onClick={() => scrollTo("top")}
            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#1C1917]/30 text-[#1C1917] shrink-0 active:bg-[#E05338] active:text-white"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#1C1917]/30 text-[#1C1917] shrink-0 active:bg-[#E05338] active:text-white"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("architecture")}
            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#1C1917]/30 text-[#1C1917] shrink-0 active:bg-[#E05338] active:text-white"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollTo("pipeline")}
            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#1C1917]/30 text-[#1C1917] shrink-0 active:bg-[#E05338] active:text-white"
          >
            Formulas
          </button>
          <button
            onClick={() => scrollTo("comparison")}
            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#1C1917]/30 text-[#1C1917] shrink-0 active:bg-[#E05338] active:text-white"
          >
            Benchmarks
          </button>
        </div>

        {/* ========================================================================= */}
        {/* HERO SECTION (Responsive Grid matching the retro editorial aesthetic)     */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[580px] bg-[#FAF7F2]">

          {/* ------------------------------------------------------------- */}
          {/* Cell 1: Main Left Hero (Headline, Copy, Metric, Retro Button) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-14 relative flex flex-col justify-between overflow-hidden border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[#1C1917]">

            {/* Retro Vector Decor: Rotating Terracotta 12-point starburst */}
            <div className="absolute top-4 right-4 sm:top-12 sm:right-14 w-10 h-10 sm:w-20 sm:h-20 pointer-events-none animate-spin-slow opacity-95 hidden xs:block">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                <polygon
                  points="50,0 59,32 90,15 76,45 100,50 76,55 90,85 59,68 50,100 41,68 10,85 24,55 0,50 24,45 10,15 41,32"
                  fill="#E05338"
                />
              </svg>
            </div>

            {/* Retro Vector Decor: Playful Squiggly Spring Loop */}
            <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 w-40 sm:w-56 pointer-events-none opacity-80 animate-float hidden md:block">
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
            <div className="absolute bottom-8 right-16 sm:right-24 w-10 h-10 sm:w-14 sm:h-14 pointer-events-none animate-float-alt hidden sm:block">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <polygon
                  points="50,5 62,35 95,50 62,65 50,95 38,65 5,50 38,35"
                  fill="#E5A638"
                />
              </svg>
            </div>

            {/* Top Content */}
            <div className="space-y-4 sm:space-y-6 relative z-10">
              {/* Featured Architecture kicker */}
              <div className="inline-flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05338]"></span>
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-[#E05338]">
                  FEATURED ARCHITECTURE • FEDERATED & zkML
                </span>
              </div>

              {/* Massive Bold Headline */}
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-7xl uppercase tracking-tighter text-[#1C1917] leading-[0.95] max-w-xl">
                FedZero<br />
                Network
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-base text-[#1C1917]/80 max-w-lg font-sans font-medium leading-relaxed">
                Collaborative machine-learning training across edge devices without sharing private datasets. Computations are verified by zero-knowledge proofs on Arbitrum and incentivized on Solana.
              </p>
            </div>

            {/* Bottom Content: Price/Metric tag + Reference Image Button */}
            <div className="mt-8 sm:mt-16 space-y-5 sm:space-y-7 relative z-10">

              {/* Highlight Metric styled like $999.99 in the image */}
              <div className="space-y-1">
                <div className="font-display font-black text-2xl sm:text-4xl text-[#1C1917] tracking-tight flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span>0.00 BYTES</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#E05338] bg-[#E05338]/10 px-2 py-0.5 rounded-md border border-[#E05338]/30">
                    Shielded Edge
                  </span>
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-[#1C1917]/70 font-semibold tracking-wide uppercase">
                  Raw Data Leaked • 100% Client-Side Privacy Guaranteed
                </div>
              </div>

              {/* The Single Main Action Button */}
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="group w-full sm:w-auto inline-flex items-stretch justify-center border-[1.5px] border-[#1C1917] bg-[#FAF7F2] rounded-md overflow-hidden font-display font-extrabold text-xs tracking-wider uppercase text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7F2] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#E05338]"
                >
                  <span className="px-5 py-3 sm:px-6 sm:py-3.5 flex-1 sm:flex-initial flex items-center justify-center space-x-2 border-r-[1.5px] border-[#1C1917]">
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
          <div className="lg:col-span-5 p-4 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF0E4] border-t-[1.5px] lg:border-t-0 border-[#1C1917] space-y-5 sm:space-y-6">

            {/* Top Console Header */}
            <div className="flex items-center justify-between border-b-[1.5px] border-[#1C1917] pb-3 sm:pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05338] animate-ping"></span>
                <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#1C1917]">
                  PROTOCOL RUNTIME // LIVE MATRIX
                </span>
              </div>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FAF7F2] border-[1.5px] border-[#1C1917] font-mono text-[9px] sm:text-[10px] font-bold text-[#E05338] retro-shadow-sm">
                3 NODES ONLINE
              </span>
            </div>

            {/* Chain Selector Tabs (Arbitrum, Solana, Zcash) */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#1C1917]/70">
                Select Multi-Chain Layer:
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 font-display text-xs font-bold uppercase">
                <button
                  onClick={() => setSelectedChain("arb")}
                  className={`p-2 sm:p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "arb"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-[10px] sm:text-xs">ARBITRUM</span>
                  <span className="text-[8px] sm:text-[9px] font-mono opacity-80">ZK Verifier</span>
                </button>

                <button
                  onClick={() => setSelectedChain("sol")}
                  className={`p-2 sm:p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "sol"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-[10px] sm:text-xs">SOLANA</span>
                  <span className="text-[8px] sm:text-[9px] font-mono opacity-80">Rewards</span>
                </button>

                <button
                  onClick={() => setSelectedChain("zec")}
                  className={`p-2 sm:p-3 rounded-xl border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center transition-all ${selectedChain === "zec"
                      ? "bg-[#1C1917] text-[#FAF7F2] shadow-[2px_2px_0px_#E05338] scale-102"
                      : "bg-[#FAF7F2] text-[#1C1917] hover:bg-[#FAF0E4]"
                    }`}
                >
                  <span className="text-[10px] sm:text-xs">ZCASH</span>
                  <span className="text-[8px] sm:text-[9px] font-mono opacity-80">Shielded</span>
                </button>
              </div>

              {/* Dynamic Chain Detail Card */}
              <div className="p-3.5 sm:p-5 rounded-xl border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-2.5 sm:space-y-3 retro-shadow-sm font-mono text-xs">
                {selectedChain === "arb" && (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1C1917]/20 pb-2">
                      <span className="font-bold text-[#E05338] text-[11px] sm:text-xs">Arbitrum Layer 2 (EVM Rollup)</span>
                      <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/30">
                        Operational
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[10px] sm:text-[11px] text-[#1C1917]/85">
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Verifier Contract:</span>
                        <span className="font-bold text-[#1C1917] truncate ml-1">ZKVerifier.sol (0x5FbD...aa3)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1917]/60">Model Lineage:</span>
                        <span className="font-bold text-[#1C1917] truncate ml-1">ModelRegistry.sol (IPFS CIDs)</span>
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
                      <span className="font-bold text-[#E05338] text-[11px] sm:text-xs">Solana High-Throughput Engine</span>
                      <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/30">
                        Sub-second
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[10px] sm:text-[11px] text-[#1C1917]/85">
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
                      <span className="font-bold text-[#E05338] text-[11px] sm:text-xs">Zcash Cryptographic Pavilion</span>
                      <span className="text-[9px] sm:text-[10px] bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded border border-purple-500/30">
                        Shielded Edge
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[10px] sm:text-[11px] text-[#1C1917]/85">
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
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#1C1917]/70">
                <span>Active Edge Hardware:</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>100% Zero-Leakage</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 font-mono text-[10px]">
                <div className="p-2 sm:p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#E05338] truncate">Node-01 // RTX 4090</div>
                  <div className="text-[#1C1917]/70 text-[9px] sm:text-[10px]">FL Epochs: 3</div>
                  <div className="text-emerald-700 font-semibold text-[9px] sm:text-[10px]">Proof: Valid ✓</div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#E5A638] truncate">Node-02 // M3 Max</div>
                  <div className="text-[#1C1917]/70 text-[9px] sm:text-[10px]">DP-SGD Local</div>
                  <div className="text-emerald-700 font-semibold text-[9px] sm:text-[10px]">Halo2: BN254 ✓</div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-lg border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-0.5">
                  <div className="font-bold text-[#1C1917] truncate">Node-03 // A100</div>
                  <div className="text-[#1C1917]/70 text-[9px] sm:text-[10px]">Cluster Tensor</div>
                  <div className="text-emerald-700 font-semibold text-[9px] sm:text-[10px]">Byzantine: OK ✓</div>
                </div>
              </div>
            </div>

            {/* Interactive Testnet Round Simulator (Replaces static text & duplicate button) */}
            <div className="p-3.5 sm:p-4 rounded-xl border-[1.5px] border-[#1C1917] bg-[#FAF7F2] space-y-2.5 sm:space-y-3 retro-shadow-sm font-mono">
              <div className="flex items-center justify-between text-xs border-b border-[#1C1917]/15 pb-2">
                <span className="font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5 text-[11px] sm:text-xs">
                  <span className={`w-2 h-2 rounded-full ${simulating ? "bg-[#E05338] animate-ping" : "bg-emerald-500"}`}></span>
                  <span>Interactive Testnet Engine</span>
                </span>
                <span className="font-bold text-[#E05338] text-[10px] sm:text-[11px]">
                  Round #{simRound}
                </span>
              </div>

              {/* Live Status Output Banner */}
              <div className="p-2 sm:p-2.5 rounded-lg bg-[#FAF0E4] border border-[#1C1917]/30 text-xs text-[#1C1917] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <span className="truncate font-semibold text-[11px] sm:text-xs">{simStep}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#E05338] shrink-0">
                  {simAccuracy}% Acc
                </span>
              </div>

              {/* Interactive Trigger Button */}
              <button
                onClick={handleSimulateRound}
                disabled={simulating}
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border-[1.5px] border-[#1C1917] bg-[#1C1917] text-[#FAF7F2] hover:bg-[#E05338] hover:text-white font-display font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_#E05338] active:translate-x-[0px] active:translate-y-[0px] disabled:opacity-60 cursor-pointer"
              >
                <Zap className={`w-4 h-4 text-[#E5A638] ${simulating ? "animate-spin" : ""}`} />
                <span>{simulating ? "EXECUTING FEDAVG & ZK PROOFS..." : "TEST RUN FEDAVG ROUND ⚡"}</span>
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* TICKER / MARQUEE RIBBON (Responsive Scrollable) */}
        {/* ========================================================================= */}
        <div className="border-y-[1.5px] border-[#1C1917] bg-[#FAF0E4] py-2.5 sm:py-3 overflow-x-auto select-none">
          <div className="flex items-center space-x-6 sm:space-x-8 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#1C1917] whitespace-nowrap min-w-max px-4">
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
        <section id="about" className="p-5 sm:p-8 lg:p-14 bg-[#FAF7F2] border-b-[1.5px] border-[#1C1917] space-y-8 sm:space-y-12">

          {/* Section Header Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-[1.5px] border-[#1C1917] bg-[#F7F2EA] rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x-[1.5px] divide-[#1C1917]">
            <div className="md:col-span-3 p-3 sm:p-4 flex items-center space-x-2 font-mono text-xs font-bold text-[#E05338]">
              <span className="w-2 h-2 rounded-full bg-[#E05338]"></span>
              <span>SECTION 01 // OVERVIEW</span>
            </div>
            <div className="md:col-span-6 p-3 sm:p-4 text-center font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#1C1917]">
              ABOUT THE FEDZERO PROTOCOL
            </div>
            <div className="md:col-span-3 p-3 sm:p-4 flex items-center justify-between md:justify-end font-mono text-xs font-semibold text-[#1C1917]/70">
              SPECIFICATION v2.4
            </div>
          </div>

          {/* Project Mission & Core Dilemma */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E05338]/10 text-[#E05338] border border-[#E05338]/30 inline-block">
                The Privacy Dilemma
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1C1917] uppercase tracking-tight leading-tight">
                AI MUST LEARN FROM DATA WITHOUT STEALING IT.
              </h2>
              <p className="text-xs sm:text-sm text-[#1C1917]/80 leading-relaxed font-sans">
                Traditional AI requires organizations and individuals to surrender raw proprietary datasets into centralized cloud warehouses (OpenAI, AWS, Google Cloud). This creates dangerous single points of failure, copyright litigation, and catastrophic medical and financial privacy leaks.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#FAF0E4] border-[1.5px] border-[#1C1917] rounded-2xl p-4 sm:p-8 space-y-3.5 sm:space-y-4 retro-shadow">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1C1917] uppercase flex items-center space-x-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#E05338]" />
                <span>The Solution: Bring Code to Data, Not Data to Code</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917]/85 leading-relaxed">
                The <strong>FedZero Network</strong> unites <strong>Federated Learning (FL)</strong> with <strong>Zero-Knowledge Cryptography (zkML)</strong> and a <strong>Tripartite Multi-Chain Architecture</strong>. Devices independently compute local parameter weight improvements without ever transferring private data. Zero-Knowledge proofs verify computation integrity on-chain, eliminating the need to blindly trust edge participants.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 font-mono text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#E05338] font-bold text-base sm:text-lg">0 KB</div>
                  <div className="text-[#1C1917]/70 text-[10px] sm:text-[11px]">Raw Data Disclosed</div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#1C1917] font-bold text-base sm:text-lg">O(1) Gas</div>
                  <div className="text-[#1C1917]/70 text-[10px] sm:text-[11px]">Succinct Pairing Checks</div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1C1917]/30">
                  <div className="text-[#E5A638] font-bold text-base sm:text-lg">&lt; 1.2s</div>
                  <div className="text-[#1C1917]/70 text-[10px] sm:text-[11px]">Solana Micro-Payouts</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid matching the retro editorial aesthetic */}
          <div id="architecture" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4 scroll-mt-20">

            {/* Pillar 1 */}
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-4 sm:p-6 bg-[#FAF7F2] retro-btn space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E05338]/15 border-[1.5px] border-[#1C1917] flex items-center justify-center text-[#E05338]">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-mono text-[10px] sm:text-xs font-bold text-[#E05338] tracking-widest uppercase">
                01 // EDGE COMPUTATION
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#1C1917]">
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
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-4 sm:p-6 bg-[#FAF7F2] retro-btn space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E5A638]/20 border-[1.5px] border-[#1C1917] flex items-center justify-center text-[#E5A638]">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#1C1917]" />
              </div>
              <div className="font-mono text-[10px] sm:text-xs font-bold text-[#E5A638] tracking-widest uppercase">
                02 // CRYPTOGRAPHIC INTEGRITY
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#1C1917]">
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
            <div className="border-[1.5px] border-[#1C1917] rounded-2xl p-4 sm:p-6 bg-[#FAF7F2] retro-btn space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1C1917] text-[#FAF7F2] border-[1.5px] border-[#1C1917] flex items-center justify-center">
                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="font-mono text-[10px] sm:text-xs font-bold text-[#1C1917] tracking-widest uppercase">
                03 // CONSENSUS & SETTLEMENT
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#1C1917]">
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
        <section id="pipeline" className="p-5 sm:p-8 lg:p-14 bg-[#FAF0E4] border-b-[1.5px] border-[#1C1917] space-y-6 sm:space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="font-mono text-[10px] sm:text-xs font-extrabold text-[#E05338] uppercase tracking-widest">
                STEP-BY-STEP EXECUTION
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1C1917] uppercase tracking-tight mt-1">
                HOW A FEDERATED TRAINING ROUND OPERATES
              </h2>
            </div>
            <div className="font-mono text-[11px] sm:text-xs text-[#1C1917]/70">
              Click any step to inspect mathematical mechanics
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {architectureSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-2.5 sm:p-4 rounded-xl border-[1.5px] text-left transition-all ${activeStep === idx
                    ? "bg-[#FAF7F2] border-[#1C1917] retro-shadow-sm font-bold"
                    : "bg-[#F7F2EA] border-[#1C1917]/40 hover:border-[#1C1917] text-[#1C1917]/80"
                  }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5 sm:mb-2">
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold ${activeStep === idx ? "bg-[#E05338] text-white" : "bg-[#1C1917]/10 text-[#1C1917]"
                    }`}>
                    STEP {s.step}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#1C1917]/60 uppercase truncate ml-1">{s.tag}</span>
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-[#1C1917] truncate">
                  {s.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <div className="bg-[#FAF7F2] border-[1.5px] border-[#1C1917] rounded-2xl p-4 sm:p-8 retro-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#E05338] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#E05338]"></span>
                <span>Active Phase: Step {architectureSteps[activeStep].step}</span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#1C1917]">
                {architectureSteps[activeStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917]/85 leading-relaxed font-sans">
                {architectureSteps[activeStep].desc}
              </p>

              <div className="space-y-1.5 sm:space-y-2 pt-2">
                <div className="text-[11px] sm:text-xs font-mono font-bold text-[#1C1917] uppercase tracking-wider">
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
            <div className="lg:col-span-5 bg-[#FAF0E4] text-[#1C1917] rounded-2xl p-4 sm:p-6 border-[1.5px] border-[#1C1917] font-mono text-xs space-y-3.5 sm:space-y-4 retro-shadow-sm">
              <div className="flex items-center justify-between border-b-[1.5px] border-[#1C1917]/20 pb-2.5 text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[#1C1917] flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E05338] animate-pulse"></span>
                  <span>MATHEMATICAL FORMULA</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 font-bold text-[10px] uppercase flex items-center space-x-1">
                  <span>VERIFIED</span>
                  <span>✓</span>
                </span>
              </div>

              {/* Formula Subtitle & Phase */}
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[11px] sm:text-xs uppercase text-[#1C1917]">
                  {architectureSteps[activeStep].formulaTitle}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#E05338]/10 text-[#E05338] font-mono font-bold text-[9px] sm:text-[10px]">
                  STEP {architectureSteps[activeStep].step}
                </span>
              </div>

              {/* The Styled Formula Box */}
              <div className="p-3 sm:p-4 bg-[#FAF7F2] rounded-xl border-[1.5px] border-[#1C1917] shadow-inner text-center overflow-x-auto space-y-2">
                {architectureSteps[activeStep].formulaDisplay}
                <div className="text-[10px] font-mono text-[#1C1917]/60 border-t border-[#1C1917]/10 pt-2 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="uppercase text-[9px] tracking-wider text-[#1C1917]/40">Formula:</span>
                  <code className="text-[#E05338] font-bold text-[10px] sm:text-[11px] break-all">{architectureSteps[activeStep].formulaPlain}</code>
                </div>
              </div>

              {/* Intuitive Meaning ("Samjhne ke liye simple explanation") */}
              <div className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-xl border border-[#1C1917]/20 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E05338] flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Simple Explanation / Intuition:</span>
                </div>
                <p className="text-[11px] text-[#1C1917]/85 font-sans leading-relaxed">
                  {architectureSteps[activeStep].intuition}
                </p>
              </div>

              {/* Variable Guide Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1C1917]/70 flex items-center justify-between">
                  <span>Variable Breakdown (Symbols):</span>
                  <span className="text-[9px] text-[#1C1917]/50 font-normal">Click step to view</span>
                </div>
                <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
                  {architectureSteps[activeStep].terms.map((term, tIdx) => (
                    <div key={tIdx} className="p-2 bg-[#FAF7F2]/90 rounded-lg border border-[#1C1917]/15 flex items-start space-x-2 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#1C1917]/10 text-[#1C1917] font-mono font-bold text-[10px] shrink-0 border border-[#1C1917]/20">
                        {term.symbol}
                      </span>
                      <div className="leading-tight">
                        <span className="font-bold text-[#1C1917] block font-sans text-[11px]">{term.label}</span>
                        <span className="text-[#1C1917]/70 text-[10px] font-sans">{term.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Venue Footer */}
              <div className="text-[10px] text-[#1C1917]/80 leading-relaxed font-mono bg-[#FAF7F2]/70 p-2 sm:p-2.5 rounded-lg border border-[#1C1917]/15 flex items-start space-x-1.5">
                <span className="text-emerald-700 font-bold shrink-0">🔒</span>
                <span>{architectureSteps[activeStep].venue}</span>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* COMPARISON BENCHMARKS (Traditional AI vs Verifiable AI Network) */}
        {/* ========================================================================= */}
        <section id="comparison" className="p-5 sm:p-8 lg:p-14 bg-[#FAF7F2] border-b-[1.5px] border-[#1C1917] space-y-6 sm:space-y-8">

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#E05338] uppercase tracking-widest">
              PARADIGM SHIFT
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1C1917] uppercase tracking-tight">
              TRADITIONAL AI VS. VERIFIABLE NETWORK
            </h2>
            <p className="text-xs sm:text-sm text-[#1C1917]/70 font-sans">
              How our zero-knowledge federated protocol changes the fundamental trust assumptions of machine learning.
            </p>
          </div>

          {/* Table Container */}
          <div className="border-[1.5px] border-[#1C1917] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F2] retro-shadow">
            <div className="text-[10px] font-mono text-[#1C1917]/60 px-4 py-2 border-b border-[#1C1917]/20 md:hidden flex items-center justify-between bg-[#FAF0E4]/60">
              <span>Swipe horizontally to view all columns</span>
              <span>👉</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#1C1917] text-[#FAF7F2] uppercase tracking-wider font-bold">
                    <th className="p-3 sm:p-4 border-r border-[#FAF7F2]/20">Evaluation Vector</th>
                    <th className="p-3 sm:p-4 border-r border-[#FAF7F2]/20 text-[#FAF7F2]/70">Traditional Centralized AI</th>
                    <th className="p-3 sm:p-4 text-[#E5A638]">FedZero Protocol (This Project)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[1.5px] divide-[#1C1917]">
                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Raw Data Custody
                    </td>
                    <td className="p-3 sm:p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Uploaded to corporate servers; vulnerable to breach.
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-[#E05338]">
                      100% Client-Side; raw data never leaves device hardware.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Computation Trust
                    </td>
                    <td className="p-3 sm:p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      "Trust us" cloud provider guarantees; no proof of honesty.
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917]">
                      Halo2 zk-SNARK cryptographic validity proof (π).
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Model Version Lineage
                    </td>
                    <td className="p-3 sm:p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Opaque internal release notes; easily modified or retracted.
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917]">
                      Arbitrum Smart Contract (ModelRegistry.sol) with IPFS CIDs.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Contributor Incentive
                    </td>
                    <td className="p-3 sm:p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Big tech monopoly captures 100% of commercial value.
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-emerald-700">
                      Automated Solana micro-rewards based on quality & compute.
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0E4] transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917] border-r-[1.5px] border-[#1C1917]">
                      Reputation & Sybil Defense
                    </td>
                    <td className="p-3 sm:p-4 text-[#1C1917]/70 border-r-[1.5px] border-[#1C1917]">
                      Centralized ban-lists and closed API tokens.
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-[#1C1917]">
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
        <section className="p-6 sm:p-12 lg:p-16 bg-[#181A24] text-[#FAF5EE] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E05338]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 relative z-10 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF5EE]/10 border border-[#FAF5EE]/20 text-[#E5A638] text-xs font-mono">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE TESTNET ONLINE • 3 SIMULATED PARTICIPANTS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
              READY TO INTERACT WITH THE RUNNING NETWORK?
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF5EE]/75 font-sans leading-relaxed">
              Launch the live telemetry dashboard. Trigger federated learning training rounds, inspect Halo2 zkML constraints, manage autoML datasets, and view automated Solana rewards in real time.
            </p>
          </div>

          <div className="relative z-10 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#E05338] hover:bg-[#FAF5EE] text-white hover:text-[#1C1917] font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2.5 border-[2px] border-[#1C1917] shadow-[4px_4px_0px_#FAF5EE] hover:shadow-[4px_4px_0px_#E05338] transition-all hover:scale-105 active:scale-95 text-center"
            >
              <span>ENTER DASHBOARD NOW</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* FOOTER SECTION (Editorial Framed Grid Footer) */}
        {/* ========================================================================= */}
        <footer className="border-t-[1.5px] border-[#1C1917] bg-[#FAF7F2] p-5 sm:p-10 font-mono text-xs text-[#1C1917]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center justify-between">

            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#141416] flex items-center justify-center border border-[#1C1917] overflow-hidden">
                  <img src="/fedzero_emblem.png" alt="FedZero" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-extrabold text-sm uppercase tracking-tight">
                  FEDZERO NETWORK
                </span>
              </div>
              <p className="text-[11px] text-[#1C1917]/70 max-w-sm">
                A research-grade decentralized machine learning framework powered by zero-knowledge proofs and multi-chain settlement.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-wrap gap-3 sm:gap-4 text-xs font-display font-bold uppercase">
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
