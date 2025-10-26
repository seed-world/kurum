// File: src/app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import "@/app/globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/admin/auth"); // login/şifre sıfırlama vb.

  // Auth rotalarında sadece sade bir container göster (Header/Sidebar yok)
  if (isAuth) {
    return (
      <div className="min-h-screen bg-neutral-100 text-neutral-900">
        {children}
      </div>
    );
  }

  // Diğer tüm /admin rotalarında klasik yönetim şablonu
  return (
    <div className="bg-neutral-100 text-neutral-900 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1  overflow-auto">{children}</main>
      </div>
    </div>
  );
}
