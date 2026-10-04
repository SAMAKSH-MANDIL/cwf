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
  Home,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Activity },
  { name: "Training", href: "/training", icon: Layers, badge: "STUDIO" },
  { name: "Models", href: "/models", icon: Database },
  { name: "Contributions", href: "/contributions", icon: Cpu },
  { name: "ZK Proofs", href: "/proofs", icon: ShieldCheck },
  { name: "Rewards", href: "/rewards", icon: Coins, badge: "SOL" },
  { name: "AI Passport", href: "/passport", icon: UserCheck },
  { name: "Compute Providers", href: "/providers", icon: Server },
  { name: "Network", href: "/network", icon: Network },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r-2 border-[#1C1917] bg-[#FAF7F2] flex flex-col fixed inset-y-0 z-50 select-none">
      {/* Brand Header - Height h-[72px] matches Navbar line perfectly */}
      <div className="h-[72px] px-5 border-b-2 border-[#1C1917] bg-[#F4EFE6] flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#E05338] border-2 border-[#1C1917] flex items-center justify-center retro-shadow-sm group-hover:rotate-6 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-[#1C1917] font-display uppercase">
              FedZero
            </div>
            <div className="text-[10px] text-[#78716C] font-mono tracking-tight uppercase">
              Verifiable AI Network
            </div>
          </div>
        </Link>
      </div>

      {/* Prominent Back to Landing Page Button */}
      <div className="p-3 border-b-2 border-[#1C1917]/20 bg-[#FAF7F2]">
        <Link
          href="/"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F7F4EE] hover:bg-[#F2ECE1] border-2 border-[#1C1917] retro-shadow-sm text-xs font-mono font-bold text-[#1C1917] transition-all group"
        >
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 text-[#E05338]" />
            <span>← Landing Page</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#E05338] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C]">
          Dashboard Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#1C1917] text-[#FAF7F2] retro-shadow-sm font-bold"
                  : "text-[#44403C] hover:text-[#1C1917] hover:bg-[#F2ECE1] border border-transparent hover:border-[#1C1917]/20"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#E05338]" : "text-[#78716C]"}`} />
                <span className="font-display tracking-tight text-[13px]">{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black border ${
                  isActive
                    ? "bg-[#E05338] text-white border-white/20"
                    : "bg-[#E5A638]/20 text-[#92400E] border-[#E5A638]/60"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Multi-Chain Infrastructure Badges */}
      <div className="p-4 border-t-2 border-[#1C1917] bg-[#F4EFE6] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#78716C] uppercase tracking-wider mb-1">
          <span>Connected Chains</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/30">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            <span className="text-[#1C1917] font-bold text-[11px]">Arbitrum</span>
          </span>
          <span className="text-[10px] font-mono text-[#2563EB] font-bold">Sepolia L2</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/30">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[#1C1917] font-bold text-[11px]">Solana</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">Devnet</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/30">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E5A638]"></span>
            <span className="text-[#1C1917] font-bold text-[11px]">Zcash</span>
          </span>
          <span className="text-[10px] font-mono text-[#B45309] font-bold">ZK Pavilion</span>
        </div>
      </div>
    </aside>
  );
}

