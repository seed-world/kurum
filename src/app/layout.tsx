// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"; // DİKKAT: başına @/app koyduk!
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GG Seed World",
  description: "GG Seed World Resmi Web Sitesi - Yüksek Kaliteli Tohum Çözümleri",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
