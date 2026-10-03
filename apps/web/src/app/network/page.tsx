"use client";

import { Network, ShieldCheck, Cpu, Database, Coins, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export default function NetworkPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Network className="w-6 h-6 text-cyan-400" />
          <span>Multi-Chain Architecture & Pavilions</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tripartite blockchain separation of concerns: Arbitrum verification, Solana incentives, and Zcash zero-knowledge privacy pavilion.
        </p>
      </div>

      {/* Tripartite Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Arbitrum */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/40 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 font-mono">
              ARB
            </div>
            <div>
              <h2 className="text-base font-bold text-white">1. Arbitrum One / Sepolia</h2>
              <p className="text-xs text-slate-400 font-mono">Core Trust & Verification Layer</p>
            </div>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>ZKVerifier.sol:</strong> Verifies zkML Halo2/KZG SNARK pairing constraints over BN254 scalar field in constant gas.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>ModelRegistry.sol:</strong> Stores immutable model hashes and IPFS storage CIDs; weights never touch the blockchain.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>ContributionRegistry.sol:</strong> Records verified updates, prevents replay attacks, and anchors model lineage.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>AIPassport.sol:</strong> Soulbound contributor reputation credential based on verified proof history.</span>
            </li>
          </ul>
        </div>

        {/* Solana */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 font-mono">
              SOL
            </div>
            <div>
              <h2 className="text-base font-bold text-white">2. Solana High-Throughput</h2>
              <p className="text-xs text-slate-400 font-mono">Coordination & Incentive Layer</p>
            </div>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Compute Provider Registry:</strong> Tracks edge node telemetry, GPU tiers (RTX 4090, A100, T4), and declared VRAM.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Dynamic Incentive Engine:</strong> Calculates rewards based on Quality × Validity × ComputeTier × Utility.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Anti-Sybil Defense:</strong> PDA-enforced contribution rate limits and reputation-weighted eligibility checks.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Automated Token Payouts:</strong> Sub-second micro-token transfers directly to edge node wallets.</span>
            </li>
          </ul>
        </div>

        {/* Zcash Pavilion */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/40 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 font-mono">
              ZEC
            </div>
            <div>
              <h2 className="text-base font-bold text-white">3. Zcash Cryptographic Pavilion</h2>
              <p className="text-xs text-slate-400 font-mono">Zero-Knowledge Privacy Reference</p>
            </div>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Philosophical Foundation:</strong> Zcash proved that zero-knowledge proofs can protect sensitive financial records at scale.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Privacy Paradigm Application:</strong> We apply the shielded pool paradigm to medical diagnostic machine learning.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Halo2 Proving Engine:</strong> Built on Halo2 zero-knowledge circuit principles pioneered in the Zcash ecosystem.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Guaranteed Zero Data Leakage:</strong> Raw patient records never leave hospital edge devices.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* End-to-End Architectural Data Flow */}
      <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>Cryptographic Data Flow Invariants</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold">1. Private Edge Data</div>
            <p className="text-slate-400 leading-relaxed">
              Clinical diagnostic features strictly reside in participant memory. No central server or network packet contains patient records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-bold">2. zkML SNARK Proof</div>
            <p className="text-slate-400 leading-relaxed">
              Quantized forward & backward passes synthesize BN254 public input commitments matching model baseline and update delta.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-indigo-400 font-bold">3. Arbitrum Consensus</div>
            <p className="text-slate-400 leading-relaxed">
              Solidity contract verifies elliptic curve pairings and increments Soulbound AI Passport reputation upon successful validation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold">4. Solana Settlement</div>
            <p className="text-slate-400 leading-relaxed">
              Cross-chain relayer triggers Solana program instruction to dispense tokens to edge provider wallet without delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
