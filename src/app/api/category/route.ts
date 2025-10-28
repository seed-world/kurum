// app/api/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listCategories, createCategory } from "../../../lib/routes/category";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Node.js runtime (db & fs için)
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

    const result = await listCategories({ page, limit, search, sort, order });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("GET /api/category failed:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

/** public/category/ altına görsel yazar, URL döner */
async function saveImageToPublic(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const extFromName = path.extname(file.name || "").toLowerCase();
  const extFromType = (() => {
    const t = (file.type || "").toLowerCase();
    if (t.includes("png")) return ".png";
    if (t.includes("jpeg") || t.includes("jpg")) return ".jpg";
    if (t.includes("webp")) return ".webp";
    if (t.includes("gif")) return ".gif";
    return extFromName || ".bin";
  })();

  const safeExt = extFromName || extFromType || ".bin";
  const fname = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${safeExt}`;
  const publicDir = path.join(process.cwd(), "public", "category");
  fs.mkdirSync(publicDir, { recursive: true });
  const fullPath = path.join(publicDir, fname);
  fs.writeFileSync(fullPath, bytes, { flag: "w" });

  return `/category/${fname}`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let payload: any = {};
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      const getStr = (k: string) => {
        const v = form.get(k)?.toString().trim();
        return v ? v : undefined;
      };
      const getNum = (k: string) => {
        const v = form.get(k)?.toString().trim();
        if (!v) return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      };

      payload = {
        name: getStr("name"),
        description: getStr("description"),
        is_active: (getNum("is_active") ?? 1) ? 1 : 0,
        image_path: null as string | null,
      };

      const image = form.get("image");
      if (image && image instanceof File && image.size > 0) {
        const max = 8 * 1024 * 1024;
        if (image.size > max) {
          return NextResponse.json({ error: "Görsel 8MB limitini aşıyor" }, { status: 400 });
        }
        payload.image_path = await saveImageToPublic(image);
      }
    } else {
      payload = await req.json();
    }

    if (!payload?.name) {
      return NextResponse.json({ error: "Kategori adı zorunludur" }, { status: 400 });
    }

    const created = await createCategory(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/category failed:", e);
    return NextResponse.json({ error: e?.message ?? "Oluşturulamadı" }, { status: 400 });
  }
}
