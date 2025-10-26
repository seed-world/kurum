// src/app/api/auth/login/route.ts


import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { queryRows } from "../../../../lib/db/connection";
import { AdminRow } from "../../../../lib/types";
import { signSession } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre zorunlu" }, { status: 400 });
    }

    const [rows] = await queryRows<AdminRow[]>(
      `SELECT * FROM admins WHERE email = :email LIMIT 1`,
      { email }
    );
    const admin = rows[0];
    if (!admin || !admin.password_hash) {
      return NextResponse.json({ error: "Geçersiz bilgiler" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Geçersiz bilgiler" }, { status: 401 });
    }

    const token = await signSession({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const res = NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
    res.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
