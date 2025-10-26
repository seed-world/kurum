// src/lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "gg-seed-world-secret-key-change-this");
const alg = "HS256";

export type Role = "superadmin" | "editor" | "viewer";

export type SessionPayload = {
  sub: number;        // admin id (biz projede number tutacağız)
  email: string;
  role: Role;
};

/** Token üretme
 *  - JWT'de 'sub' string olmalı -> String(payload.sub)
 *  - Özel alanları payload içine koyuyoruz (email, role)
 */
export async function signSession(payload: SessionPayload) {
  return await new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg })
    .setSubject(String(payload.sub)) // <— sub string zorunlu
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/** Runtime doğrulama + güçlü tipe dönüştürme */
function toSessionPayload(p: JWTPayload): SessionPayload {
  // sub kontrolü
  if (!p.sub || Number.isNaN(Number(p.sub))) {
    throw new Error("Invalid token: sub");
  }
  const email = p.email;
  const role = p.role;

  if (typeof email !== "string") {
    throw new Error("Invalid token: email");
  }
  if (role !== "superadmin" && role !== "editor" && role !== "viewer") {
    throw new Error("Invalid token: role");
  }

  return {
    sub: Number(p.sub),
    email,
    role,
  };
}

/** Token doğrulama -> güçlü tipe çevir */
export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
  return toSessionPayload(payload);
}
