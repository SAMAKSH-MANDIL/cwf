"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Coins, 
  UserCheck, 
  Network, 
  Server, 
  Layers,
  FolderPlus
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Training", href: "/training", icon: Layers, badge: "Live" },
  { name: "AutoML Datasets", href: "/datasets", icon: FolderPlus, badge: "New" },
  { name: "Models", href: "/models", icon: Database },
  { name: "Contributions", href: "/contributions", icon: Cpu },
  { name: "ZK Proofs", href: "/proofs", icon: ShieldCheck },
  { name: "Rewards", href: "/rewards", icon: Coins },
  { name: "AI Passport", href: "/passport", icon: UserCheck },
  { name: "Network", href: "/network", icon: Network },
  { name: "Compute Providers", href: "/providers", icon: Server },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#080d1a]/95 flex flex-col fixed inset-y-0 z-50 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-sm font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
            VERIFIABLE AI
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
            Decentralized Network
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Multi-Chain Infrastructure Badges */}
      <div className="p-4 border-t border-slate-800/80 bg-[#050811]/90 space-y-2">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Connected Multi-Chains
        </div>
        
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium text-[11px]">Arbitrum</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold">Sepolia L2</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium text-[11px]">Solana</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Devnet</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-slate-300 font-medium text-[11px]">Zcash</span>
          </span>
          <span className="text-[10px] font-mono text-purple-400 font-semibold">ZK Pavilion</span>
        </div>
      </div>
    </aside>
  );
}
