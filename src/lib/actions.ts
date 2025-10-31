"use server";

import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

// Admin session cookie adımız
const COOKIE_NAME = "admin_session";

function isProd() {
  return process.env.NODE_ENV === "production";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    throw new Error("E-posta ve şifre zorunlu");
  }
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE tanımlı değil");
  }

  // Backend’e JSON isteği
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Origin başlığı bazı CORS kurulumlarında gerekli olabilir:
      Origin: headers().get("origin") || "",
    },
    // server action olduğu için credentials gerekli değil, token body’den alınacak
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* noop */ }

  if (!res.ok) {
    const msg = json?.error || `Giriş başarısız (${res.status})`;
    throw new Error(msg);
  }

  const token = json?.token as string | undefined;
  if (!token) {
    // Güvenlik için backend token döndürmediyse hataya düş
    throw new Error("Token alınamadı");
  }

  // Next tarafında httpOnly cookie set et
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd(),
    // 7 gün
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect("/admin");
}

export async function logoutAction() {
  // İsteğe bağlı: backend’i de haberdar et (session invalidate vs.)
  if (API_BASE) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
    } catch {
      // backend erişilemese bile local cookie’yi sileriz
    }
  }
  cookies().delete(COOKIE_NAME);
  redirect("/admin/auth/login");
}
