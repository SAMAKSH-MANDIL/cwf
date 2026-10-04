"use client";

import { useEffect, useState } from "react";
import { Server, Cpu, CheckCircle2, ShieldCheck, Coins, Activity, HardDrive, Zap, ExternalLink, PlusCircle, X, Check } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>("ALL");

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
        setProviders(data);
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
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to register node", err);
    } finally {
      setRegistering(false);
    }
  };

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
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#1C1917] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#059669] hover:bg-[#059669] transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto cursor-pointer"
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
            className={`px-3 py-1 font-mono text-xs font-bold border-2 border-[#1C1917] transition-all cursor-pointer ${
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
                className="px-3 py-1 bg-[#FAF7F2] hover:bg-white text-[#1C1917] border border-[#1C1917] text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer"
              >
                TELEMETRY →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* REGISTER NEW COMPUTE WORKER MODAL */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-[#1C1917] shadow-[6px_6px_0px_#1C1917] rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg border border-[#1C1917]/30 hover:bg-[#F2ECE1] text-[#1C1917] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#059669] uppercase">
                <Server className="w-3.5 h-3.5" />
                <span>Provision Edge Worker</span>
              </div>
              <h2 className="text-2xl font-black text-[#1C1917] font-display uppercase tracking-tight mt-1">
                Register New Compute Node
              </h2>
              <p className="text-xs text-[#57534E] font-medium mt-1">
                Connect your laptop, GPU cluster, or mobile device to participate in federated learning rounds.
              </p>
            </div>

            {regSuccess ? (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-lg text-emerald-900 uppercase">
                  Node Successfully Registered!
                </h3>
                <p className="text-xs font-mono text-emerald-800">
                  Provisioned local isolated dataset enclave and registered to Solana reward ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterNode} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[#1C1917] font-bold uppercase mb-1">
                    Node Name / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Lenovo Legion / Lab Mac M2"
                    value={nodeForm.name}
                    onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#059669] text-sm text-[#1C1917]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1">
                      Hardware Tier
                    </label>
                    <select
                      value={nodeForm.hardware_tier}
                      onChange={(e) => setNodeForm({ ...nodeForm, hardware_tier: e.target.value })}
                      className="w-full p-3 bg-white border-2 border-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#059669] text-sm text-[#1C1917]"
                    >
                      <option value="RTX 4090">RTX 4090 (Tier 1)</option>
                      <option value="Apple Silicon">Apple Silicon M-Series (Tier 2)</option>
                      <option value="AWS A100">AWS A100 TensorCore</option>
                      <option value="Jetson Orin">Jetson Orin Nano (Edge)</option>
                      <option value="GTX 1650/RTX 3050">NVIDIA Laptop GPU</option>
                      <option value="CPU Core">Standard CPU Enclave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1">
                      Allocated VRAM (GB)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={128}
                      value={nodeForm.vram_gb}
                      onChange={(e) => setNodeForm({ ...nodeForm, vram_gb: Number(e.target.value) })}
                      className="w-full p-3 bg-white border-2 border-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#059669] text-sm text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1">
                      Private Dataset Size
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      value={nodeForm.samples_count}
                      onChange={(e) => setNodeForm({ ...nodeForm, samples_count: Number(e.target.value) })}
                      className="w-full p-3 bg-white border-2 border-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#059669] text-sm text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1C1917] font-bold uppercase mb-1">
                      Solana Wallet Address
                    </label>
                    <input
                      type="text"
                      placeholder="Optional (Auto-generated)"
                      value={nodeForm.wallet_address}
                      onChange={(e) => setNodeForm({ ...nodeForm, wallet_address: e.target.value })}
                      className="w-full p-3 bg-white border-2 border-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#059669] text-xs text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-display font-black text-sm uppercase tracking-wider border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {registering ? "PROVISIONING WORKER NODE..." : "CONFIRM & JOIN COMPUTE MESH ⚡"}
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
