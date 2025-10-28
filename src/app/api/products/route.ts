import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "../../../lib/routes/products";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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

    // 🔥 kategori filtresini ekle
    const category_id = searchParams.get("category_id");
    const categoryIdNum = category_id ? Number(category_id) : undefined;

    const result = await listProducts({
      page,
      limit,
      search,
      sort,
      order,
      category_id: Number.isFinite(categoryIdNum) ? categoryIdNum : undefined,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("GET /api/products failed:", e);
    return NextResponse.json(
      { error: e?.message ?? "Internal error", detail: String(e) },
      { status: 500 }
    );
  }
}


/** Yardımcı: image dosyasını public/urun/images/ altına yazar, public URL yolunu döner */
async function saveImageToPublic(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const origName = file.name || "upload";
  const extFromName = path.extname(origName).toLowerCase();
  const extFromType = (() => {
    const t = file.type || "";
    if (t.includes("png")) return ".png";
    if (t.includes("jpeg") || t.includes("jpg")) return ".jpg";
    if (t.includes("webp")) return ".webp";
    if (t.includes("gif")) return ".gif";
    return extFromName || ".bin";
  })();

  const safeExt = extFromName || extFromType || ".bin";
  const fname = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${safeExt}`;
  // DÜZELTME: images klasörü
  const publicDir = path.join(process.cwd(), "public", "urun", "images");
  fs.mkdirSync(publicDir, { recursive: true });

  const fullPath = path.join(publicDir, fname);
  fs.writeFileSync(fullPath, bytes, { flag: "w" });

  // public altı otomatik serve edilir -> URL yolu:
  return `/urun/images/${fname}`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let payload: any = {};
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      // Text alanları
      const getNum = (k: string) => {
        const v = form.get(k)?.toString().trim();
        if (!v) return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      };
      const getStr = (k: string) => {
        const v = form.get(k)?.toString().trim();
        return v ? v : undefined;
      };

      payload = {
        product_type: getStr("product_type"),
        variety: getStr("variety"),
        sub_type: getStr("sub_type"),
        code: getStr("code"),
        region: getStr("region"),
        germination_start_year: getNum("germination_start_year"),
        seeds_2023: getNum("seeds_2023"),
        seeds_2024: getNum("seeds_2024"),
        seeds_2025_expected: getNum("seeds_2025_expected"),
        annual_growth_factor: getNum("annual_growth_factor"),
        seedling_unit_price: getNum("seedling_unit_price"),
        asset_value_2023: getNum("asset_value_2023"),
        asset_value_2024: getNum("asset_value_2024"),
        asset_value_2025: getNum("asset_value_2025"),
        is_active: (getNum("is_active") ?? 1) ? 1 : 0,
        is_featured: (getNum("is_featured") ?? 0) ? 1 : 0,
        category_id: (getNum("category_id") ?? null), // ✅ eklendi
        image_path: null as string | null,
      };

      // Dosya
      const image = form.get("image");
      if (image && image instanceof File && image.size > 0) {
        const max = 8 * 1024 * 1024;
        if (image.size > max) {
          return NextResponse.json(
            { error: "Görsel 8MB limitini aşıyor" },
            { status: 400 }
          );
        }
        payload.image_path = await saveImageToPublic(image);
      }
    } else {
      // Eski JSON akışı da desteklensin
      payload = await req.json();
    }

    const created = await createProduct(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/products failed:", e);
    return NextResponse.json(
      { error: e?.message ?? "Oluşturulamadı", detail: String(e) },
      { status: 400 }
    );
  }
}
