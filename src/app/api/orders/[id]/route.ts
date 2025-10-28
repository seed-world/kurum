// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/routes/orders";
import { parseId } from "@/lib/utils";

// Next 15+ için params bir Promise olarak geliyor:
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: raw } = await params;     // <-- ÖNEMLİ: await
    const id = parseId(raw);
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/orders/[id] error", err);
    return NextResponse.json({ error: err?.message ?? "unexpected_error" }, { status: 500 });
  }
}
