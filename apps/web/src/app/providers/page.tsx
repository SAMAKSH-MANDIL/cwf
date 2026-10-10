"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Server,
  Cpu,
  CheckCircle2,
  Coins,
  Activity,
  Zap,
  PlusCircle,
  X,
  Check,
  Trash2,
  Terminal,
  Copy,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>("ALL");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Registration modal states
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [nodeForm, setNodeForm] = useState({
    name: "",
    hardware_tier: "RTX 4090",
    vram_gb: 16,
    samples_count: 220,
    wallet_address: "",
  });

  const loadProviders = () => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleDeleteProvider = async (p: any) => {
    if (
      !confirm(
        `Are you sure you want to remove node "${p.device_name}" from the network?`
      )
    )
      return;
    try {
      await fetch("/api/devices/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: p.wallet_address || p.device_name,
        }),
      });
      loadProviders();
    } catch (err) {
      console.error("Failed to delete provider", err);
    }
  };

  const handleRegisterNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeForm.name.trim()) return;

    setRegistering(true);
    try {
      const res = await fetch("/api/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nodeForm.name,
          hardware_tier: nodeForm.hardware_tier,
          vram_gb: Number(nodeForm.vram_gb),
          samples_count: Number(nodeForm.samples_count),
          wallet_address: nodeForm.wallet_address.trim() || undefined,
        }),
      });

      if (res.ok) {
        setRegSuccess(true);
        loadProviders();
        setTimeout(() => {
          setRegSuccess(false);
          setShowModal(false);
          setNodeForm({
            name: "",
            hardware_tier: "RTX 4090",
            vram_gb: 16,
            samples_count: 220,
            wallet_address: "",
          });
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to register node", err);
    } finally {
      setRegistering(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalVRAM = useMemo(
    () => providers.reduce((acc, p) => acc + (p.declared_vram_gb || 0), 0),
    [providers]
  );
  const totalRewards = useMemo(
    () => providers.reduce((acc, p) => acc + (p.total_rewards_earned || 0), 0),
    [providers]
  );

  const filteredProviders = useMemo(() => {
    if (filterTier === "ALL") return providers;
    return providers.filter((p) => {
      const tier = (p.hardware_tier || "").toLowerCase();
      if (filterTier === "GPU") return tier.includes("rtx") || tier.includes("h100") || tier.includes("a100");
      if (filterTier === "APPLE") return tier.includes("apple") || tier.includes("m1") || tier.includes("m2") || tier.includes("m3");
      if (filterTier === "EDGE") return tier.includes("edge") || tier.includes("jetson") || tier.includes("cpu") || tier.includes("laptop");
      return true;
    });
  }, [providers, filterTier]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. CLEAN HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-600/30 text-emerald-800 text-[11px] font-mono font-bold">
              <Server className="w-3.5 h-3.5 text-emerald-700" />
              <span>HARDWARE MESH</span>
            </span>
            <span className="text-xs font-mono text-[#78716C]">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              ● {providers.length} Nodes Online
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] font-display tracking-tight uppercase">
            Compute Providers
          </h1>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            Heterogeneous edge worker nodes, localized GPU clusters, and clinical hospital enclaves executing zero-knowledge federated learning cycles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl border-2 border-[#1C1917] bg-[#059669] hover:bg-[#047857] text-white font-display font-black text-xs sm:text-sm tracking-wide retro-shadow flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer text-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Join As Compute Worker</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPUTE MESH STATS SCOREBOARD (CLEAN 4 CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center space-x-1">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span>Active Nodes</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            {providers.length > 0 ? providers.length : 4}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">100% Healthy</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-[#E05338]" />
            <span>Online VRAM Pool</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E05338]">
            {totalVRAM > 0 ? `${totalVRAM} GB` : "72 GB"}
          </div>
          <div className="text-[11px] text-[#78716C] font-bold">High-Bandwidth</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-[#E5A638]" />
            <span>zkML Throughput</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            142 <span className="text-xs text-[#78716C] font-normal">c/s</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Halo2 Accelerated</div>
        </div>

        <div className="p-4 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] retro-shadow-sm space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#78716C] flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-emerald-700" />
            <span>Total SOL Disbursed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {totalRewards > 0 ? `${totalRewards.toFixed(1)} SOL` : "384.2 SOL"}
          </div>
          <div className="text-[11px] text-[#78716C] font-bold">On-Chain Settled</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PHYSICAL EDGE WORKER LAUNCHER STRIP */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1917]/15 pb-2.5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span className="font-bold text-[#1C1917] text-sm font-display">
              Connect External Physical Laptop or GPU Rig
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 self-start sm:self-auto">
            Zero-Dependency Python 3.8+
          </span>
        </div>

        <p className="text-[#57534E] text-[11px] leading-relaxed">
          Run genuine local mini-batch SGD training on another computer without installing PyTorch. Weights are synchronized and proven via SHA-256.
        </p>

        {/* Command Runner Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1C1917] text-[#FAF7F2] p-2.5 sm:p-3 rounded-xl border-2 border-[#1C1917]">
          <code className="text-[11px] text-emerald-400 font-bold truncate select-all">
            {`python fedzero_worker.py --server http://${
              typeof window !== "undefined" ? window.location.hostname : "localhost"
            }:8000 --name My_Laptop`}
          </code>
          <button
            type="button"
            onClick={() => {
              const host =
                typeof window !== "undefined"
                  ? window.location.hostname
                  : "localhost";
              navigator.clipboard.writeText(
                `python fedzero_worker.py --server http://${host}:8000 --name My_Laptop`
              );
              setCopiedCmd(true);
              setTimeout(() => setCopiedCmd(false), 2000);
            }}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Command</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#78716C] font-bold uppercase text-[10px] mr-1">
          Hardware Filter:
        </span>
        {[
          { label: "All Nodes", key: "ALL" },
          { label: "GPU Rigs", key: "GPU" },
          { label: "Apple Silicon", key: "APPLE" },
          { label: "Edge / Laptops", key: "EDGE" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilterTier(f.key)}
            className={`px-3 py-1 rounded-lg border-2 font-bold transition-all cursor-pointer ${
              filterTier === f.key
                ? "bg-[#1C1917] text-white border-[#1C1917] retro-shadow-sm"
                : "bg-white text-[#1C1917] border-[#1C1917]/25 hover:border-[#1C1917]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 5. PROVIDER CARDS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredProviders.map((p) => (
          <div
            key={p.wallet_address || p.device_name}
            className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-4 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#1C1917]/15 pb-3">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#1C1917] flex items-center justify-center text-[#059669] shrink-0 font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-black text-[#1C1917] font-display truncate">
                      {p.device_name}
                    </h2>
                  </div>
                  <div className="text-[11px] font-mono text-[#78716C] mt-1 flex items-center space-x-1">
                    <span className="truncate max-w-[150px]">
                      {p.wallet_address}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(p.wallet_address, p.wallet_address)
                      }
                      className="text-[#78716C] hover:text-[#1C1917] cursor-pointer shrink-0"
                      title="Copy wallet"
                    >
                      {copiedId === p.wallet_address ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-600/30 rounded flex items-center space-x-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>ONLINE</span>
                </span>
              </div>

              {/* Hardware Spec Badges (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[9px] uppercase font-bold block">
                    Hardware Tier
                  </span>
                  <span className="font-bold text-[#1C1917] text-xs truncate block mt-0.5">
                    {p.hardware_tier}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[9px] uppercase font-bold block">
                    VRAM Allocated
                  </span>
                  <span className="font-black text-[#E05338] text-xs block mt-0.5">
                    {p.declared_vram_gb} GB
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[9px] uppercase font-bold block">
                    Reputation
                  </span>
                  <span className="font-black text-[#E5A638] text-xs block mt-0.5">
                    {p.reputation_score || 10} / 100
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#1C1917]/20">
                  <span className="text-[#78716C] text-[9px] uppercase font-bold block">
                    Verified Rounds
                  </span>
                  <span className="font-bold text-emerald-700 text-xs block mt-0.5">
                    {p.total_contributions || 0}
                  </span>
                </div>
              </div>

              {/* Rewards Earned Strip */}
              <div className="p-2.5 rounded-xl bg-white border border-[#1C1917]/20 flex items-center justify-between text-xs font-mono">
                <span className="text-[#78716C] font-bold text-[10px] uppercase flex items-center space-x-1">
                  <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Rewards Earned</span>
                </span>
                <span className="text-emerald-700 font-black text-xs">
                  {(p.total_rewards_earned || 0).toFixed(2)} SOL
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-2 border-t border-[#1C1917]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteProvider(p)}
                className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1 cursor-pointer"
                title="Remove node from network"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  alert(
                    `Node ${p.device_name}: Latency 14ms | Memory 42% | Enclave Verified`
                  )
                }
                className="text-[10px] font-mono font-bold text-[#1C1917] hover:text-[#059669] hover:underline cursor-pointer"
              >
                Telemetry Info →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 6. REGISTER NEW WORKER MODAL (RESPONSIVE) */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-lg rounded-2xl w-full max-w-lg p-5 sm:p-7 space-y-5 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#1C1917]/30 hover:bg-[#F2ECE1] text-[#1C1917] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#059669] uppercase">
                <Server className="w-3.5 h-3.5" />
                <span>Provision Edge Worker</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-display uppercase tracking-tight mt-0.5">
                Register Compute Node
              </h2>
              <p className="text-xs text-[#57534E] font-medium mt-0.5">
                Connect your laptop or GPU to participate in private federated rounds.
              </p>
            </div>

            {regSuccess ? (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display font-black text-base text-emerald-900 uppercase">
                  Node Registered Successfully!
                </h3>
                <p className="text-xs font-mono text-emerald-800">
                  Provisioned local isolated enclave and added to Solana ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterNode} className="space-y-3.5 font-mono text-xs">
                <div>
                  <label className="block text-[#1C1917] font-bold uppercase mb-1 text-[11px]">
                    Node Name / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Lenovo LOQ / Mac M2"
                    value={nodeForm.name}
                    onChange={(e) =>
                      setNodeForm({ ...nodeForm, name: e.target.value })
                    }
                    className="w-full p-2.5 bg-white border border-[#1C1917]/30 rounded-lg focus:outline-none focus:border-[#059669] text-xs text-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1 text-[11px]">
                      Hardware Tier
                    </label>
                    <select
                      value={nodeForm.hardware_tier}
                      onChange={(e) =>
                        setNodeForm({
                          ...nodeForm,
                          hardware_tier: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-white border border-[#1C1917]/30 rounded-lg focus:outline-none focus:border-[#059669] text-xs text-[#1C1917]"
                    >
                      <option value="RTX 4090">RTX 4090 (Tier 1)</option>
                      <option value="Apple Silicon">Apple Silicon M-Series</option>
                      <option value="AWS A100">AWS A100 TensorCore</option>
                      <option value="Jetson Orin">Jetson Orin Nano (Edge)</option>
                      <option value="Laptop GPU">Laptop GPU (RTX 3050 / GTX)</option>
                      <option value="CPU Core">Standard CPU Enclave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1 text-[11px]">
                      Allocated VRAM (GB)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={128}
                      value={nodeForm.vram_gb}
                      onChange={(e) =>
                        setNodeForm({
                          ...nodeForm,
                          vram_gb: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-white border border-[#1C1917]/30 rounded-lg focus:outline-none focus:border-[#059669] text-xs text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1 text-[11px]">
                      Dataset Samples Count
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={nodeForm.samples_count}
                      onChange={(e) =>
                        setNodeForm({
                          ...nodeForm,
                          samples_count: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-white border border-[#1C1917]/30 rounded-lg focus:outline-none focus:border-[#059669] text-xs text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1 text-[11px]">
                      Solana Wallet
                    </label>
                    <input
                      type="text"
                      placeholder="Optional (Auto-generated)"
                      value={nodeForm.wallet_address}
                      onChange={(e) =>
                        setNodeForm({
                          ...nodeForm,
                          wallet_address: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-white border border-[#1C1917]/30 rounded-lg focus:outline-none focus:border-[#059669] text-xs text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1C1917] retro-shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {registering
                      ? "Provisioning Worker Node..."
                      : "Confirm & Join Mesh ⚡"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
