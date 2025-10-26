// File: src/app/admin/auth/login/page.tsx
"use client";

import { useState } from "react";

// Server Action'ı import et (ayrı dosyadan, örneğin lib/actions.ts'den)
import { loginAction } from "../../../../lib/actions"; // Bu dosyayı oluşturacağız

export default function AdminLoginPage() {
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-100">
      <form
        action={async (formData) => {
          setErr("");
          try {
            await loginAction(formData);
          } catch (error: any) {
            setErr(error.message || "Giriş başarısız");
          }
        }}
        className="bg-white w-full max-w-sm rounded-2xl shadow p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Admin Giriş</h1>

        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {err}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm">E-posta</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Şifre</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 text-white py-2 hover:opacity-90"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}