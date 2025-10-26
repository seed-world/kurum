// src/app/admin/components/Header.tsx

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/auth/login");
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="text-xl font-semibold text-gray-900">Yönetim Paneli</div>
      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-[#27ae60] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b7f3a] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Çıkış
        </button>
      </div>
    </header>
  );
}