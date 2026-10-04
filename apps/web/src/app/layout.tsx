import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Decentralized Verifiable AI Network | Private FL & zkML",
  description: "Collaborative Federated Learning with Zero-Knowledge ML Proofs and Multi-Chain Infrastructure across Arbitrum, Solana, and Zcash Cryptographic Pavilion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#060a13] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Modern Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col pl-64 min-w-0">
          {/* Header Bar */}
          <header className="h-16 border-b border-slate-800/80 bg-[#080d1a]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Network Live • FedAvg Active</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline">
                Privacy Standard: Raw Data Stays Local
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900/90 py-1.5 px-3 rounded-xl border border-slate-800 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="font-semibold">0x71C6...1eef</span>
                <span className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  Lead Node
                </span>
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
