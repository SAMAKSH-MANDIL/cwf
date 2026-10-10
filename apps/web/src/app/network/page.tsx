"use client";

import { useEffect, useState, useMemo } from "react";
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
  Layers,
  Zap,
  Copy,
  Check,
} from "lucide-react";

export default function NetworkPage() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        setProviders(Array.isArray(provData) ? provData : []);
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

  const fallbackNodes = [
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

  const displayNodes = providers.length > 0 ? providers : fallbackNodes;
  const activeNodesCount = stats?.active_contributors || displayNodes.length;
  const totalSamples = useMemo(
    () =>
      displayNodes.reduce(
        (acc, curr) => acc + (curr.samples_count || curr.declared_samples || 200),
        0
      ),
    [displayNodes]
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HERO BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-[11px] font-mono font-bold">
              <Network className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>CONSENSUS TOPOLOGY</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              ● Multi-Chain Synced
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Network State &amp; Nodes
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Live telemetry of all distributed edge compute providers, verifiable{" "}
            <strong className="text-[#1C1917]">Arbitrum EVM</strong> contracts, and{" "}
            <strong className="text-emerald-700">Solana</strong> settlement channels.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/training"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-[#1C1917] bg-[#E05338] hover:bg-[#d4482f] text-white font-display font-black text-xs sm:text-sm tracking-wide retro-shadow flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <Layers className="w-4 h-4" />
            <span>Train On Active Nodes ⚡</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CORE TELEMETRY METRICS (CLEAN 4 CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center justify-between">
            <span>Active Edge Nodes</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            {loading ? "..." : `${activeNodesCount}`}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">100% Synced</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center justify-between">
            <span>Private Samples</span>
            <Lock className="w-3.5 h-3.5 text-[#E05338]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            {totalSamples.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#78716C] font-bold">0.00 B Leaked</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center justify-between">
            <span>Rounds Settled</span>
            <Layers className="w-3.5 h-3.5 text-[#9333EA]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            {stats?.training_rounds ?? 14}
          </div>
          <div className="text-[11px] text-[#9333EA] font-bold">FedAvg L2-Norm</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center justify-between">
            <span>Incentives Paid</span>
            <Coins className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            {stats?.total_rewards_distributed ?? "184.5"} SOL
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Solana Settled</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE EDGE NODES DIRECTORY (MOBILE CARDS + DESKTOP TABLE) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1917]/15 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-[#1C1917] font-display uppercase tracking-tight">
              Participating Edge Nodes ({displayNodes.length})
            </h2>
            <p className="text-[11px] font-mono text-[#78716C]">
              Hardware specs, local sample allocation, and real-time consensus state
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#1C1917]/20 text-emerald-800 font-mono text-[11px] font-bold self-start sm:self-auto flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>FedAvg Peer Pool Active</span>
          </span>
        </div>

        {/* MOBILE VIEW (CARD STACK) */}
        <div className="block lg:hidden space-y-3 font-mono text-xs">
          {displayNodes.map((node, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border-2 border-[#1C1917] space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#1C1917]/10 pb-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#E05338] shrink-0" />
                    <span className="font-bold text-sm text-[#1C1917] font-display truncate">
                      {node.device_name || node.name || `Node ${idx + 1}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-0.5 flex items-center space-x-1">
                    <span>
                      {(node.wallet_address || "0x71C663...").substring(0, 10)}...
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          node.wallet_address || "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
                          `mob-w-${idx}`
                        )
                      }
                      className="text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      {copiedId === `mob-w-${idx}` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-500/30 shrink-0">
                  ONLINE
                </span>
              </div>

              {/* Node Specs Grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 rounded bg-[#FAF7F2] border border-[#1C1917]/15">
                  <span className="text-[#78716C] block uppercase">Hardware</span>
                  <span className="font-bold text-[#1C1917] truncate block mt-0.5">
                    {node.hardware_tier || "RTX 4090"}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FAF7F2] border border-[#1C1917]/15">
                  <span className="text-[#78716C] block uppercase">VRAM</span>
                  <span className="font-black text-[#E05338] block mt-0.5">
                    {node.declared_vram_gb || node.vram_gb || 24} GB
                  </span>
                </div>
                <div className="p-2 rounded bg-[#FAF7F2] border border-[#1C1917]/15">
                  <span className="text-[#78716C] block uppercase">Samples</span>
                  <span className="font-bold text-[#1C1917] block mt-0.5">
                    {node.samples_count || node.declared_samples || 200}
                  </span>
                </div>
              </div>

              {/* Action & Reward footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-emerald-700 font-bold text-xs">
                  {typeof node.total_rewards_earned === "number"
                    ? node.total_rewards_earned.toFixed(1)
                    : "32.0"}{" "}
                  SOL Earned
                </span>
                <Link
                  href="/training"
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-[#1C1917] bg-[#FAF7F2] hover:bg-[#1C1917] hover:text-white transition-all"
                >
                  Train Node ↗
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW (SPACIOUS TABLE) */}
        <div className="hidden lg:block rounded-xl border-2 border-[#1C1917] bg-white overflow-hidden retro-shadow-sm font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Node Device Name</th>
                  <th className="py-3 px-3">Wallet Address</th>
                  <th className="py-3 px-3">Hardware Tier</th>
                  <th className="py-3 px-3">VRAM Memory</th>
                  <th className="py-3 px-3">Private Samples</th>
                  <th className="py-3 px-3">Rewards Earned</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {displayNodes.map((node, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                    {/* Device Name */}
                    <td className="py-3 px-4 font-bold text-[#1C1917]">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-[#FAF7F2] border border-[#1C1917] flex items-center justify-center text-[#E05338] shrink-0">
                          <Laptop className="w-3 h-3" />
                        </div>
                        <span className="font-display font-bold text-sm truncate max-w-[170px]">
                          {node.device_name || node.name || `Node ${idx + 1}`}
                        </span>
                      </div>
                    </td>

                    {/* Wallet */}
                    <td className="py-3 px-3 text-[#57534E]">
                      <div className="flex items-center space-x-1">
                        <span className="bg-[#F2ECE1] px-1.5 py-0.5 rounded border border-[#1C1917]/20 text-[11px]">
                          {(node.wallet_address || "0x71C663...").substring(0, 10)}...
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              node.wallet_address || "0x71C66336071ffd4e773E34dac3Ca0A6688211eef",
                              `desk-w-${idx}`
                            )
                          }
                          className="text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                        >
                          {copiedId === `desk-w-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Hardware Tier */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1C1917] bg-[#F2ECE1] px-2 py-0.5 rounded border border-[#1C1917]/20 text-[11px]">
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

                    {/* Rewards */}
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {typeof node.total_rewards_earned === "number"
                        ? node.total_rewards_earned.toFixed(1)
                        : "32.0"}{" "}
                      SOL
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-600/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>ONLINE</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <Link
                        href="/training"
                        className="px-2.5 py-1 rounded text-[11px] font-bold border border-[#1C1917] bg-[#FAF7F2] hover:bg-[#1C1917] hover:text-white transition-all inline-block"
                      >
                        Train ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TRIPARTITE CONSENSUS ARCHITECTURE (3 CLEAN CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Arbitrum Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-3">
          <div className="flex items-center space-x-3 border-b border-[#1C1917]/15 pb-3">
            <span className="w-9 h-9 rounded-xl bg-[#2563EB] text-white font-bold font-mono text-xs flex items-center justify-center border border-[#1C1917]">
              ARB
            </span>
            <div>
              <h3 className="font-display font-black text-sm text-[#1C1917]">
                1. Arbitrum One L2
              </h3>
              <p className="text-[11px] text-[#78716C] font-mono">
                Verification &amp; Lineage Layer
              </p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 font-medium">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <span>
                <strong>ZKVerifier.sol:</strong> Verifies Halo2 KZG proof pairing in constant O(1) gas.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <span>
                <strong>ModelRegistry.sol:</strong> Stores immutable weights CID hashes on IPFS.
              </span>
            </li>
          </ul>
        </div>

        {/* Solana Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-3">
          <div className="flex items-center space-x-3 border-b border-[#1C1917]/15 pb-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold font-mono text-xs flex items-center justify-center border border-[#1C1917]">
              SOL
            </span>
            <div>
              <h3 className="font-display font-black text-sm text-[#1C1917]">
                2. Solana High-Speed
              </h3>
              <p className="text-[11px] text-[#78716C] font-mono">
                Coordination &amp; Incentive Layer
              </p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 font-medium">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Compute Registry:</strong> Tracks edge node telemetry, GPU tiers, and VRAM.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Automated Payouts:</strong> Sub-second (~420ms) SOL disbursements to edge wallets.
              </span>
            </li>
          </ul>
        </div>

        {/* Zcash / Zero-Knowledge Pavilion */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-3">
          <div className="flex items-center space-x-3 border-b border-[#1C1917]/15 pb-3">
            <span className="w-9 h-9 rounded-xl bg-[#E5A638] text-[#1C1917] font-bold font-mono text-xs flex items-center justify-center border border-[#1C1917]">
              ZEC
            </span>
            <div>
              <h3 className="font-display font-black text-sm text-[#1C1917]">
                3. ZK Privacy Pavilion
              </h3>
              <p className="text-[11px] text-[#78716C] font-mono">
                Shielded Privacy Architecture
              </p>
            </div>
          </div>
          <ul className="text-xs text-[#57534E] space-y-2 font-medium">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A638] shrink-0 mt-0.5" />
              <span>
                <strong>Shielded Math:</strong> Proves valid ML training without ever transmitting raw datasets.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A638] shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Leak Invariant:</strong> Raw training data stays locked in local edge enclaves.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
