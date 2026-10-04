"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ShieldCheck, Activity, Terminal, ArrowUpRight } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Get active breadcrumb title
  const pathClean = pathname.replace(/^\//, "").toUpperCase() || "DASHBOARD";

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans antialiased selection:bg-[#E05338] selection:text-white">
      {/* Retro Editorial Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Header Bar - Exactly h-[72px] to align seamlessly with sidebar's brand header */}
        <header className="h-[72px] border-b-2 border-[#1C1917] bg-[#FAF7F2] px-8 flex items-center justify-between sticky top-0 z-40 select-none">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#78716C]">
              <span>SYSTEM</span>
              <span>/</span>
              <span className="text-[#1C1917] bg-[#F4EFE6] px-2.5 py-1 rounded-md border border-[#1C1917]/30 retro-shadow-sm">
                {pathClean}
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#E5A638]/15 text-[#92400E] border border-[#E5A638]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FedAvg Engine Active • Raw Data Stays Local</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {pathname !== "/training" && (
              <Link
                href="/training"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#E05338] text-white text-xs font-mono font-bold border-2 border-[#1C1917] retro-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              >
                <span>⚡ Train Models</span>
              </Link>
            )}

            <Link
              href="/passport"
              title="View AI Contributor Passport"
              className="flex items-center space-x-2 text-xs font-mono text-[#1C1917] bg-[#F4EFE6] hover:bg-[#FAF7F2] py-1.5 px-3 rounded-lg border-2 border-[#1C1917] retro-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#E05338] animate-pulse"></span>
              <span className="font-bold">0x71C6...1eef</span>
              <span className="text-[10px] text-white font-black px-1.5 py-0.5 rounded bg-[#1C1917] hover:bg-[#E05338] transition-colors">
                LEAD NODE ↗
              </span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8 bg-[#FAF7F2]">
          {children}
        </main>
      </div>
    </div>
  );
}

