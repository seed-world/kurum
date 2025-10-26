// src/lib/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { queryRows } from "./db/connection";
import { AdminRow } from "./types";
import { signSession } from "./auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("E-posta ve şifre zorunlu");
  }

  const [rows] = await queryRows<AdminRow[]>(
    `SELECT * FROM admins WHERE email = :email LIMIT 1`,
    { email }
  );
  const admin = rows[0];
  if (!admin || !admin.password_hash) {
    throw new Error("Geçersiz bilgiler");
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    throw new Error("Geçersiz bilgiler");
  }

  const token = await signSession({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
  });

  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // 🔧 Burayı değiştiriyoruz:
  redirect("/admin");
}
