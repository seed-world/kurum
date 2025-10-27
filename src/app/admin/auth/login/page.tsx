// File: src/app/admin/auth/login/page.tsx
"use client";

import { useState } from "react";

// Server Action'ı import et (ayrı dosyadan, örneğin lib/actions.ts'den)
import { loginAction } from "../../../../lib/actions"; // Bu dosyayı oluşturacağız

export default function AdminLoginPage() {
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Paneli</h1>
          <p className="text-neutral-600">Devam etmek için giriş yapın</p>
        </div>

        <form
          action={async (formData) => {
            setErr("");
            setIsLoading(true);
            try {
              await loginAction(formData);
            } catch (error: any) {
              setErr(error.message || "Giriş başarısız");
            } finally {
              setIsLoading(false);
            }
          }}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-neutral-200"
        >
          {err && (
            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{err}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              E-posta
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Şifre
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-neutral-900 text-white py-3.5 font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Giriş yapılıyor...
              </>
            ) : (
              <>
                Giriş Yap
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          © 2025 Admin Panel. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}