// src/components/layout/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin tarafında normal site header/footer görünmeyecek
    return <main className="min-h-screen">{children}</main>;
  }

  // Normal sitede her sayfada header/footer sabit
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
