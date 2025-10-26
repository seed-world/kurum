// File: src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "../../../lib/routes/products";

// Bu endpoint Node.js runtime'da çalışmalı (mysql vs. için)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const search = searchParams.get("search") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const order = (searchParams.get("order") ?? "asc") as any;

    const result = await listProducts({ page, limit, search, sort, order });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("GET /api/products failed:", e);
    // Her durumda JSON dönelim (dev error overlay HTML'i yerine)
    return NextResponse.json(
      { error: e?.message ?? "Internal error", detail: String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await createProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/products failed:", e);
    return NextResponse.json(
      { error: e?.message ?? "Oluşturulamadı", detail: String(e) },
      { status: 400 }
    );
  }
}
