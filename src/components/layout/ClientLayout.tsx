// src/components/layout/ClientLayout.tsx

"use client";

import type { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
