// File: src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "../../../../lib/routes/products";

// Node.js runtime zorunlu
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const p = await getProductById(params.id);
    if (!p) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(p);
  } catch (e:any) {
    console.error("GET /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await updateProduct(params.id, body);
    return NextResponse.json(updated);
  } catch (e:any) {
    console.error("PATCH /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Güncellenemedi" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await deleteProduct(params.id);
    return NextResponse.json(res);
  } catch (e:any) {
    console.error("DELETE /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Silinemedi" }, { status: 400 });
  }
}
