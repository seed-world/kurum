// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import AppShell from "@/components/layout/AppShell";
import { CartProvider } from "../components/cart/CartProvider";

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
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>

      </body>
    </html>
  );
}
