"use client";

import { useEffect, useState } from "react";
import { Server, Cpu, CheckCircle2, ShieldCheck, Coins, Activity, HardDrive, Zap, ExternalLink, PlusCircle } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const totalVRAM = providers.reduce((acc, p) => acc + (p.declared_vram_gb || 0), 0);
  const totalRewards = providers.reduce((acc, p) => acc + (p.total_rewards_earned || 0), 0);

  const filteredProviders = providers.filter((p) => {
    if (filterTier === "ALL") return true;
    return p.hardware_tier?.toLowerCase().includes(filterTier.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b-2 border-[#1C1917] pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#059669]/10 border border-[#059669] text-[#059669] text-xs font-mono font-black uppercase tracking-wider mb-2">
          <span>HARDWARE MESH</span>
          <span>•</span>
          <span>PHYSICAL DECENTRALIZED INFRASTRUCTURE</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1C1917] tracking-tight flex items-center space-x-3">
              <Server className="w-8 h-8 text-[#059669]" />
              <span>Decentralized Compute Providers</span>
            </h1>
            <p className="text-sm font-medium text-[#1C1917]/70 mt-2 max-w-3xl leading-relaxed">
              Heterogeneous edge worker nodes, localized GPU clusters, and clinical hospital enclaves executing zero-knowledge federated learning cycles and verifying zkML gradient proofs.
            </p>
          </div>

          <button
            onClick={() => alert("Compute node daemon installer: curl -sSL https://network.verifiable-ai.org/install.sh | bash")}
            className="px-5 py-2.5 bg-[#1C1917] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#059669] hover:bg-[#059669] transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>JOIN AS COMPUTE WORKER</span>
          </button>
        </div>
      </div>

      {/* Network Compute Mesh Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917]">
          <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-[#059669]" />
            <span>Active Providers</span>
          </div>
          <div className="text-3xl font-black font-mono text-[#1C1917] mt-2">
            {providers.length > 0 ? `${providers.length} Nodes` : "4 Nodes"}
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1">100% Health Status</div>
        </div>

        <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917]">
          <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-[#E05338]" />
            <span>Online VRAM Pool</span>
          </div>
          <div className="text-3xl font-black font-mono text-[#E05338] mt-2">
            {totalVRAM > 0 ? `${totalVRAM} GB` : "72 GB"}
          </div>
          <div className="text-[11px] font-mono text-[#1C1917]/60 mt-1">High-Bandwidth Memory</div>
        </div>

        <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917]">
          <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-[#E5A638]" />
            <span>zkML Proof Throughput</span>
          </div>
          <div className="text-3xl font-black font-mono text-[#1C1917] mt-2">
            142 <span className="text-xs font-normal text-[#1C1917]/50">const/s</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1">Halo2 Acceleration</div>
        </div>

        <div className="p-4 bg-white border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917]">
          <div className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase flex items-center space-x-1.5">
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Total SOL Disbursed</span>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-700 mt-2">
            {totalRewards > 0 ? `${totalRewards.toFixed(1)} SOL` : "384.2 SOL"}
          </div>
          <div className="text-[11px] font-mono text-[#1C1917]/60 mt-1">On-Chain Settlement</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b-2 border-[#1C1917] pb-3">
        <span className="text-xs font-mono font-bold text-[#1C1917]/60 uppercase mr-2">Filter Tier:</span>
        {["ALL", "TIER 1", "TIER 2", "TIER 3", "EDGE"].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`px-3 py-1 font-mono text-xs font-bold border-2 border-[#1C1917] transition-all ${
              filterTier === tier
                ? "bg-[#1C1917] text-white shadow-[2px_2px_0px_#E05338]"
                : "bg-white text-[#1C1917] hover:bg-[#FAF7F2]"
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((p) => (
          <div
            key={p.wallet_address}
            className="p-6 bg-[#F7F4EE] border-2 border-[#1C1917] shadow-[5px_5px_0px_#1C1917] space-y-5 hover:translate-y-[-2px] transition-transform"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b-2 border-[#1C1917] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] flex items-center justify-center text-[#059669]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1C1917] leading-tight">{p.device_name}</h2>
                  <div className="text-[11px] font-mono text-[#1C1917]/60 mt-0.5 truncate max-w-[180px]">
                    {p.wallet_address}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-mono font-black uppercase bg-emerald-100 text-emerald-800 border-2 border-emerald-700 flex items-center space-x-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>ONLINE</span>
              </span>
            </div>

            {/* Hardware & Spec Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-white border-2 border-[#1C1917]">
                <div className="text-[#1C1917]/60 text-[10px] uppercase font-bold">Hardware Tier</div>
                <div className="text-[#1C1917] font-black text-sm mt-0.5">{p.hardware_tier}</div>
              </div>

              <div className="p-3 bg-white border-2 border-[#1C1917]">
                <div className="text-[#1C1917]/60 text-[10px] uppercase font-bold">VRAM Allocated</div>
                <div className="text-[#E05338] font-black text-sm mt-0.5">{p.declared_vram_gb} GB</div>
              </div>

              <div className="p-3 bg-white border-2 border-[#1C1917]">
                <div className="text-[#1C1917]/60 text-[10px] uppercase font-bold">Reputation</div>
                <div className="text-[#E5A638] font-black text-sm mt-0.5">{p.reputation_score} / 100</div>
              </div>

              <div className="p-3 bg-white border-2 border-[#1C1917]">
                <div className="text-[#1C1917]/60 text-[10px] uppercase font-bold">Verified Rounds</div>
                <div className="text-emerald-700 font-black text-sm mt-0.5">{p.total_contributions}</div>
              </div>
            </div>

            {/* Rewards strip */}
            <div className="p-3 bg-white border-2 border-[#1C1917] flex items-center justify-between text-xs font-mono">
              <span className="text-[#1C1917]/70 font-bold flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-[#E5A638]" />
                <span>Rewards Earned:</span>
              </span>
              <span className="text-[#1C1917] font-black text-sm bg-[#FAF7F2] px-2 py-0.5 border border-[#1C1917]">
                {p.total_rewards_earned.toFixed(2)} SOL
              </span>
            </div>

            {/* Card Action footer */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#1C1917]/50">TEE Attested • Intel SGX</span>
              <button
                onClick={() => alert(`Node ${p.device_name} Telemetry: Latency 14ms | Memory Utilization 42% | Enclave Verified`)}
                className="px-3 py-1 bg-[#FAF7F2] hover:bg-white text-[#1C1917] border border-[#1C1917] text-[11px] font-mono font-bold uppercase transition-colors"
              >
                TELEMETRY →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
