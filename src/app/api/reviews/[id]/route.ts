// src/app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getReviewById, updateReview, deleteReview } from "../../../../lib/routes/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const r = await getReviewById(id);
    if (!r) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(r);
  } catch (e: any) {
    console.error("GET /api/reviews/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateReview(id, body ?? {});
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PATCH /api/reviews/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Güncellenemedi" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteReview(id);
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("DELETE /api/reviews/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Silinemedi" }, { status: 400 });
  }
}
