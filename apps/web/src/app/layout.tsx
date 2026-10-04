import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "FedZero | Decentralized Verifiable AI Network (FL & zkML)",
  description: "FedZero — Collaborative Federated Learning with Zero-Knowledge ML Proofs and Multi-Chain Infrastructure across Arbitrum, Solana, and Zcash Cryptographic Pavilion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
