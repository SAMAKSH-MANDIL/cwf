import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
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
  Terminal,
  ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Decentralized Verifiable AI Network | Private FL & zkML",
  description: "Collaborative Federated Learning with Zero-Knowledge ML Proofs and Multi-Chain Infrastructure across Arbitrum, Solana, and Zcash Cryptographic Pavilion.",
};

const navItems = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Models", href: "/models", icon: Database },
  { name: "Training", href: "/training", icon: Layers },
  { name: "Contributions", href: "/contributions", icon: Cpu },
  { name: "ZK Proofs", href: "/proofs", icon: ShieldCheck },
  { name: "Rewards", href: "/rewards", icon: Coins },
  { name: "AI Passport", href: "/passport", icon: UserCheck },
  { name: "Network", href: "/network", icon: Network },
  { name: "Compute Providers", href: "/providers", icon: Server },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#070b13] text-slate-100 font-sans antialiased">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#090e1a]/95 flex flex-col fixed inset-y-0 z-50">
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                VERIFIABLE AI
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
                Decentralized Network
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Multi-Chain Pavilion Badges */}
          <div className="p-4 border-t border-slate-800/80 bg-[#060a12]/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Chain Infrastructure
            </div>
            
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-slate-300 font-medium">Arbitrum</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Sepolia</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-medium">Solana</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Devnet</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-slate-300 font-medium">Zcash</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400">ZK Reference</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col pl-64 min-w-0">
          {/* Header Bar */}
          <header className="h-16 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Network Live • FedAvg Active</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                Privacy Standard: Raw Data Stays Local
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-800/60 py-1.5 px-3 rounded-lg border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>0x71C6...1eef</span>
                <span className="text-[10px] text-cyan-400 font-semibold px-1 rounded bg-cyan-950/60">Alpha</span>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
