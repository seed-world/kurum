// app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory } from "../../../../lib/routes/category";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const c = await getCategoryById(id);
    if (!c) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(c);
  } catch (e: any) {
    console.error("GET /api/category/:id failed:", e);
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
  const dir = path.join(process.cwd(), "public", "category");
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, fname), buf, { flag: "w" });
  return `/category/${fname}`;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";
    let updates: any = {};

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

      updates = {
        name: getStr("name"),
        description: getStr("description"),
        is_active: (getNum("is_active") ?? undefined) as 0 | 1 | undefined,
      };

      const image = form.get("image");
      if (image && image instanceof File && image.size > 0) {
        if (image.size > 8 * 1024 * 1024) {
          return NextResponse.json({ error: "Görsel 8MB limitini aşıyor" }, { status: 400 });
        }
        updates.image_path = await saveImageToPublic(image);
      }

      Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    } else {
      // JSON
      const body = await req.json();
      updates = body ?? {};
    }

    const updated = await updateCategory(id, updates);
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PATCH /api/category/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Güncellenemedi" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteCategory(id);
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("DELETE /api/category/:id failed:", e);
    return NextResponse.json({ error: e?.message ?? "Silinemedi" }, { status: 400 });
  }
}
