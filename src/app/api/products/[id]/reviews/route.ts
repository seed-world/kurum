// src/app/api/products/[id]/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listReviewsByProduct, createReview } from "../../../../../lib/routes/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** LIST: /api/products/:id/reviews?status=approved&page=1&limit=20 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const statusParam = searchParams.get("status") as "pending" | "approved" | "rejected" | null;

    const result = await listReviewsByProduct(id, {
      page, limit, status: statusParam ?? undefined,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("GET /api/products/:id/reviews failed:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

/** CREATE: /api/products/:id/reviews  (JSON body) */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const created = await createReview({
      product_id: Number(id),
      rating: body?.rating,
      user_id: body?.user_id ?? null,
      reviewer_name: body?.reviewer_name ?? null,
      reviewer_email: body?.reviewer_email ?? null,
      title: body?.title ?? null,
      comment: body?.comment ?? null,
      status: body?.status ?? "approved",
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/products/:id/reviews failed:", e);
    return NextResponse.json({ error: e?.message ?? "Oluşturulamadı" }, { status: 400 });
  }
}
