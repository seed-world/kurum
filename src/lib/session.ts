import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

export type Role = "superadmin" | "editor" | "viewer";

export type SessionPayload = {
  sub: number;
  email: string;
  role: Role;
};

const ALG = "HS256";
const COOKIE_NAME = "admin_session";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-only-insecure-secret-change-me"
);

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const opts: Parameters<typeof jwtVerify>[2] = { algorithms: [ALG] };
    if (process.env.JWT_ISS) opts.issuer = process.env.JWT_ISS;
    if (process.env.JWT_AUD) opts.audience = process.env.JWT_AUD;

    const { payload } = await jwtVerify(token, secret, opts);
    // type-safe kontrol:
    const subNum = Number(payload.sub);
    const email = (payload as any).email;
    const role = (payload as any).role;

    if (!subNum || !email || !role) return null;

    return { sub: subNum, email, role };
  } catch {
    return null;
  }
}
