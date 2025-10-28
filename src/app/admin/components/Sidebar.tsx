// File: src/app/admin/components/Sidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Package, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/auth/login");
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-6 flex flex-col h-screen">
      <nav className="space-y-1 flex-1">
        <a
          href="/admin"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#27ae60] rounded-lg transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </a>
        <a
          href="/admin/users"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#27ae60] rounded-lg transition-colors"
        >
          <Users className="h-5 w-5" />
          Kullanıcılar
        </a>
        <a
          href="/admin/categories"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#27ae60] rounded-lg transition-colors"
        >
          <Users className="h-5 w-5" />
          Kategoriler
        </a>
        <a
          href="/admin/products"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#27ae60] rounded-lg transition-colors"
        >
          <Package className="h-5 w-5" />
          Ürünler
        </a>
        <a
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#27ae60] rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5" />
          Ayarlar
        </a>
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#d35400] rounded-lg transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Çıkış
      </button>
    </aside>
  );
}