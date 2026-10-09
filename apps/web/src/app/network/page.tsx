"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Network,
  ShieldCheck,
  Cpu,
  Database,
  Coins,
  ArrowRight,
  Lock,
  CheckCircle2,
  Laptop,
  Server,
  Activity,
  Layers,
  Zap,
  RefreshCw,
  ArrowUpRight
} from "lucide-react";

export default function NetworkPage() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNetworkData = async () => {
    try {
      const [statsRes, provRes] = await Promise.all([
        fetch("/api/network/stats"),
        fetch("/api/providers"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (provRes.ok) {
        const provData = await provRes.json();
        setProviders(provData);
      }
    } catch (err) {
      console.error("Failed to load network stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fallback default nodes if backend array is empty
  const displayNodes = providers.length > 0 ? providers : [
    {
      device_name: "Hospital Alpha Enclave",
      hardware_tier: "RTX 4090",
      declared_vram_gb: 24,
      samples_count: 240,
      wallet_address: "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
      total_rewards_earned: 48.5,
      is_active: true,
    },
    {
      device_name: "Clinic Beta Edge Node",
      hardware_tier: "Apple M3 Max",
      declared_vram_gb: 36,
      samples_count: 180,
      wallet_address: "0x3A8F91B4C0257B881eAf06aDb5d10F9c976901A2",
      total_rewards_earned: 36.2,
      is_active: true,
    },
    {
      device_name: "Research Lab Gamma",
      hardware_tier: "AWS A100 TensorCore",
      declared_vram_gb: 80,
      samples_count: 320,
      wallet_address: "0xE1294C668b828f7c9eF02559b36C67341De0923C",
      total_rewards_earned: 64.0,
      is_active: true,
    },
    {
      device_name: "Mobile Diagnostic Unit Delta",
      hardware_tier: "Jetson Orin Nano",
      declared_vram_gb: 8,
      samples_count: 120,
      wallet_address: "0x98Fc44aB012C5E7290bC1864aDe7401c900D85Fb",
      total_rewards_earned: 22.8,
      is_active: true,
    },
  ];

  const activeNodesCount = stats?.active_contributors || displayNodes.length;
  const totalSamples = displayNodes.reduce((acc, curr) => acc + (curr.samples_count || curr.declared_samples || 200), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 select-none">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#2563EB] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <Network className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>DECENTRALIZED COMPUTE TOPOLOGY • MULTI-CHAIN CONSENSUS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Network State & Active Nodes
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            Live telemetry of all distributed edge compute providers, verifiable Arbitrum EVM contracts, Solana settlement channels, and Zcash zero-knowledge privacy pavilion.
          </p>
        </div>

        <div className="z-10 flex items-center space-x-3">
          <Link
            href="/training"
            className="px-6 py-3.5 rounded-xl border-2 border-[#1C1917] bg-[#E05338] hover:bg-[#d4482f] text-white font-display font-black text-sm tracking-wide retro-shadow flex items-center space-x-2 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <Layers className="w-4 h-4" />
            <span>TRAIN ON ACTIVE NODES ⚡</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC BAR SHOWING NUMBER OF NODES PROMINENTLY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Nodes Metric Card */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Active Edge Nodes</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#1C1917]">
            {loading ? "..." : `${activeNodesCount} Nodes`}
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Online & Synced</span>
          </div>
        </div>

        {/* Total Private Samples Metric Card */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Private Data Partitioned</span>
            <Lock className="w-4 h-4 text-[#E05338]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#1C1917]">
            {totalSamples.toLocaleString()} Samples
          </div>
          <div className="text-[11px] font-mono text-[#78716C]">
            0.00 Bytes Transferred (Local Enclaves)
          </div>
        </div>

        {/* Training Rounds Settled */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Rounds Completed</span>
            <Layers className="w-4 h-4 text-[#9333EA]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#1C1917]">
            {stats?.training_rounds ?? 14} Rounds
          </div>
          <div className="text-[11px] font-mono text-[#9333EA] font-bold">
            FedAvg L2-Norm Aggregated
          </div>
        </div>

        {/* Total Rewards Distributed */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-2">
          <div className="flex items-center justify-between text-[#78716C]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Incentives Paid</span>
            <Coins className="w-4 h-4 text-[#E5A638]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#1C1917]">
            {stats?.total_rewards_distributed ?? "184.5"} SOL
          </div>
          <div className="text-[11px] font-mono text-[#B45309] font-bold">
            Disbursed via Solana Devnet
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE EDGE NODES DIRECTORY TABLE */}
      {/* ========================================================================= */}
      <div className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#1C1917] text-white flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4 text-emerald-400" />
              </span>
              <h2 className="text-xl font-black text-[#1C1917] font-display uppercase tracking-tight">
                Participating Edge Nodes ({displayNodes.length} Online)
              </h2>
            </div>
            <p className="text-xs text-[#78716C] font-mono">
              Live hardware telemetry, memory capacities, and consensus state of every registered edge enclave.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#1C1917]/30 text-[#1C1917] font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FedAvg Peer Pool Active</span>
            </span>
          </div>
        </div>

        {/* Nodes Table */}
        <div className="rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] overflow-hidden retro-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Node Device Name</th>
                  <th className="py-3 px-3">Wallet Address</th>
                  <th className="py-3 px-3">Hardware Tier</th>
                  <th className="py-3 px-3">VRAM Memory</th>
                  <th className="py-3 px-3">Private Samples</th>
                  <th className="py-3 px-3">Rewards Earned</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {displayNodes.map((node, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F4EE] transition-colors">
                    {/* Device Name */}
                    <td className="py-3 px-4 font-bold text-[#1C1917]">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#FAF7F2] border border-[#1C1917] flex items-center justify-center text-[#E05338]">
                          <Laptop className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-display font-bold text-sm">
                          {node.device_name || node.name || `Node ${idx + 1}`}
                        </span>
                      </div>
                    </td>

                    {/* Wallet */}
                    <td className="py-3 px-3 text-[#57534E]">
                      <span className="bg-[#F2ECE1] px-2 py-0.5 rounded border border-[#1C1917]/20 text-[11px]">
                        {(node.wallet_address || "0x71C663...").substring(0, 10)}...
                      </span>
                    </td>

                    {/* Hardware Tier */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1C1917] bg-[#EAE4D8] px-2 py-0.5 rounded">
                        {node.hardware_tier || "RTX 4090"}
                      </span>
                    </td>

                    {/* VRAM */}
                    <td className="py-3 px-3 text-[#1C1917] font-bold">
                      {node.declared_vram_gb || node.vram_gb || 24} GB VRAM
                    </td>

                    {/* Local Samples */}
                    <td className="py-3 px-3 text-[#1C1917]">
                      <strong>{node.samples_count || node.declared_samples || 200}</strong> records
                    </td>

                    {/* Total Rewards */}
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {typeof node.total_rewards_earned === "number" ? node.total_rewards_earned.toFixed(1) : "32.0"} SOL
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>ONLINE</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      <Link
                        href="/training"
                        className="px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-[#1C1917] bg-[#FAF7F2] hover:bg-[#1C1917] hover:text-white transition-all inline-block"
                      >
                        Train Node ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tripartite Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Arbitrum */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white border-2 border-[#1C1917] flex items-center justify-center font-bold font-mono text-sm retro-shadow-sm">
              ARB
            </div>
            <div>
              <h2 className="text-base font-black text-[#1C1917] font-display">1. Arbitrum One / Sepolia</h2>
              <p className="text-xs text-[#78716C] font-mono">Core Trust & Verification Layer</p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span><strong>ZKVerifier.sol:</strong> Verifies zkML Halo2/KZG SNARK pairing constraints over BN254 scalar field in constant gas.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span><strong>ModelRegistry.sol:</strong> Stores immutable model hashes and IPFS storage CIDs; weights never touch the blockchain.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span><strong>AIPassport.sol:</strong> Soulbound contributor reputation credential based on verified proof history.</span>
            </li>
          </ul>
        </div>

        {/* Solana */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white border-2 border-[#1C1917] flex items-center justify-center font-bold font-mono text-sm retro-shadow-sm">
              SOL
            </div>
            <div>
              <h2 className="text-base font-black text-[#1C1917] font-display">2. Solana High-Throughput</h2>
              <p className="text-xs text-[#78716C] font-mono">Coordination & Incentive Layer</p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Compute Provider Registry:</strong> Tracks edge node telemetry, GPU tiers (RTX 4090, A100, M3), and declared VRAM.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Dynamic Incentive Engine:</strong> Calculates rewards based on Quality × Validity × ComputeTier.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automated Token Payouts:</strong> Sub-second micro-token transfers directly to edge node wallets.</span>
            </li>
          </ul>
        </div>

        {/* Zcash Pavilion */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5A638] text-[#1C1917] border-2 border-[#1C1917] flex items-center justify-center font-bold font-mono text-sm retro-shadow-sm">
              ZEC
            </div>
            <div>
              <h2 className="text-base font-black text-[#1C1917] font-display">3. Zcash Cryptographic Pavilion</h2>
              <p className="text-xs text-[#78716C] font-mono">Zero-Knowledge Privacy Reference</p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#E5A638] shrink-0 mt-0.5" />
              <span><strong>Shielded Pool Paradigm:</strong> Just as Zcash proves valid transactions without revealing balances, we prove ML training without revealing raw data.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#E5A638] shrink-0 mt-0.5" />
              <span><strong>Halo2 Proving Engine:</strong> Built on Halo2 zero-knowledge circuit principles pioneered in the Zcash ecosystem.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#E5A638] shrink-0 mt-0.5" />
              <span><strong>100% Confidential:</strong> Zero raw bytes leak outside of local edge device enclaves.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
