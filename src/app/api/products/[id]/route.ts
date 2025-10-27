import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "../../../../lib/routes/products";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Node.js runtime zorunlu
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const p = await getProductById(id);
    if (!p) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(p);
  } catch (e: any) {
    console.error("GET /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

async function saveImageToPublic(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const extFromName = path.extname(file.name || "").toLowerCase();
  const guessedExt = (() => {
    const t = (file.type || "").toLowerCase();
    if (t.includes("png")) return ".png";
    if (t.includes("jpeg") || t.includes("jpg")) return ".jpg";
    if (t.includes("webp")) return ".webp";
    if (t.includes("gif")) return ".gif";
    return extFromName || ".bin";
  })();
  const ext = extFromName || guessedExt || ".bin";
  const fname = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
  // images klasörü
  const dir = path.join(process.cwd(), "public", "urun", "images");
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, fname), buf, { flag: "w" });
  return `/urun/images/${fname}`;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";
    let updates: any = {};

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

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

      updates = {
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
        is_featured: (getNum("is_featured") ?? undefined) as 0 | 1 | undefined,
      };

      const image = form.get("image");
      if (image && image instanceof File && image.size > 0) {
        if (image.size > 8 * 1024 * 1024) {
          return NextResponse.json({ error: "Görsel 8MB limitini aşıyor" }, { status: 400 });
        }
        updates.image_path = await saveImageToPublic(image);
      }

      // boş olanları tamamen çıkar (partial update)
      Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    } else {
      // JSON
      const body = await req.json();
      updates = body ?? {};
    }

    const updated = await updateProduct(id, updates);
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PATCH /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Güncellenemedi" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteProduct(id);
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("DELETE /api/products/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Silinemedi" }, { status: 400 });
  }
}
