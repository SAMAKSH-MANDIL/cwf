"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ShieldCheck, Activity, Terminal, ArrowUpRight, Menu } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLanding = pathname === "/";

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLanding) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Get active breadcrumb title
  const pathClean = pathname.replace(/^\//, "").toUpperCase() || "DASHBOARD";

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans antialiased selection:bg-[#E05338] selection:text-white">
      {/* Retro Editorial Sidebar with Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-0 lg:pl-64 min-w-0">
        {/* Header Bar - Exactly h-[72px] to align seamlessly with sidebar's brand header */}
        <header className="h-[72px] border-b-2 border-[#1C1917] bg-[#FAF7F2] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border-2 border-[#1C1917] bg-[#F4EFE6] hover:bg-[#FAF7F2] text-[#1C1917] retro-shadow-sm flex items-center justify-center transition-all cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#1C1917]" />
            </button>

            {/* Mobile Brand Favicon Link */}
            <Link href="/" className="lg:hidden flex items-center">
              <div className="w-8 h-8 rounded-lg border-2 border-[#1C1917] bg-[#141416] retro-shadow-sm overflow-hidden flex items-center justify-center">
                <img src="/fedzero_emblem.png" alt="FedZero" className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#78716C]">
              <span className="hidden sm:inline">SYSTEM</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-[#1C1917] bg-[#F4EFE6] px-2.5 py-1 rounded-md border border-[#1C1917]/30 retro-shadow-sm text-[11px] sm:text-xs">
                {pathClean}
              </span>
            </div>

            <div className="hidden md:inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#E5A638]/15 text-[#92400E] border border-[#E5A638]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FedAvg Engine Active • Raw Data Local</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {pathname !== "/training" && (
              <Link
                href="/training"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#E05338] text-white text-xs font-mono font-bold border-2 border-[#1C1917] retro-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
              >
                <span>⚡ Train Models</span>
              </Link>
            )}

            <Link
              href="/passport"
              title="View AI Contributor Passport"
              className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-mono text-[#1C1917] bg-[#F4EFE6] hover:bg-[#FAF7F2] py-1.5 px-2.5 sm:px-3 rounded-lg border-2 border-[#1C1917] retro-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#E05338] animate-pulse"></span>
              <span className="font-bold text-[11px] sm:text-xs">0x71C6...1eef</span>
              <span className="hidden sm:inline text-[10px] text-white font-black px-1.5 py-0.5 rounded bg-[#1C1917] hover:bg-[#E05338] transition-colors">
                LEAD NODE ↗
              </span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAF7F2]">
          {children}
        </main>
      </div>
    </div>
  );
}

