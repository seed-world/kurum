// File: src/app/admin/auth/layout.tsx


import type { ReactNode } from "react";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {children}
    </div>
  );
}
