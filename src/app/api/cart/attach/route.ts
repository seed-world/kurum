// src/app/api/cart/attach/route.ts
/* import { attachGuestCartToUser } from "@/lib/routes/cart";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth"; // varsayımsal

export async function POST(req: Request) {
  const { guest_key } = await req.json();
  const user_id = await getSessionUserId(); // login değilse 401
  if (!user_id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const cart = await attachGuestCartToUser(guest_key, user_id);
  return NextResponse.json({ ok: true, data: cart });
}
*/