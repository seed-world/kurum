// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ensureActiveCart, findActiveCart } from "@/lib/routes/cart";
import { isUUID } from "@/lib/utils";

/**
 * GET /api/cart?user_id=...&guest_key=...
 * Aktif sepeti getir (items ile)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("user_id");
    const guestKey = searchParams.get("guest_key");

    const user_id = userIdParam ? Number(userIdParam) : undefined;
    if (user_id !== undefined && (!Number.isInteger(user_id) || user_id <= 0)) {
      return NextResponse.json({ error: "Geçersiz user_id" }, { status: 400 });
    }

    const cart = await findActiveCart({
      user_id,
      guest_key: guestKey || undefined,
    });

    return NextResponse.json({ data: cart, ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Hata" }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Body: { user_id?: number, guest_key?: string, currency?: string }
 * Aktif sepeti garanti eder (yoksa oluşturur) ve döner
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const user_id: number | undefined =
      typeof body.user_id === "number" && Number.isInteger(body.user_id) && body.user_id > 0
        ? body.user_id
        : undefined;

    const guest_key: string | undefined =
      typeof body.guest_key === "string" && isUUID(body.guest_key) ? body.guest_key : undefined;

    const currency: string | undefined =
      typeof body.currency === "string" ? body.currency.toUpperCase().slice(0, 3) : undefined;

    const cart = await ensureActiveCart({ user_id: user_id ?? null, guest_key: guest_key ?? null, currency });

    return NextResponse.json({ data: cart, ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Hata" }, { status: 500 });
  }
}
