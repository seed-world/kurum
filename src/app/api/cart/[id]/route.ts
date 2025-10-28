// app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addItem, clearCart, getCartById, removeItem, setItemQty } from "@/lib/routes/cart";
import { getPool } from "@/lib/db/connection";
/**
 * GET /api/cart/:id  → sepet + items
 */
export async function GET(_: NextRequest, ctx: { params: { id: string } }) {
    try {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ ok: false, error: "Geçersiz id" }, { status: 400 });
        }
        const cart = await getCartById(id);
        if (!cart) return NextResponse.json({ ok: false, error: "Sepet bulunamadı" }, { status: 404 });
        return NextResponse.json({ ok: true, data: cart });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message ?? "Hata" }, { status: 500 });
    }
}

/**
 * PATCH /api/cart/:id
 * Body:
 *  - { action: "add", product_id, quantity, unit_price? }
 *  - { action: "set", product_id, quantity, unit_price? }
 *  - { action: "remove", product_id }
 *  - { action: "clear" }
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ ok: false, error: "Geçersiz id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));
        const action = String(body.action || "");

        if (!action) {
            return NextResponse.json({ ok: false, error: "action gerekli" }, { status: 400 });
        }

        if (action === "add" || action === "set") {
            const product_id = Number(body.product_id);
            const quantity = Number(body.quantity);
            const unit_price = body.unit_price != null ? Number(body.unit_price) : undefined;

            if (!Number.isInteger(product_id) || product_id <= 0) {
                return NextResponse.json({ ok: false, error: "Geçersiz product_id" }, { status: 400 });
            }
            if (!Number.isFinite(quantity)) {
                return NextResponse.json({ ok: false, error: "Geçersiz quantity" }, { status: 400 });
            }
            if (unit_price != null && !Number.isFinite(unit_price)) {
                return NextResponse.json({ ok: false, error: "Geçersiz unit_price" }, { status: 400 });
            }

            const cart =
                action === "add"
                    ? await addItem(id, { product_id, quantity, unit_price })
                    : await setItemQty(id, { product_id, quantity, unit_price });

            return NextResponse.json({ ok: true, data: cart });
        }

        if (action === "remove") {
            const product_id = Number(body.product_id);
            if (!Number.isInteger(product_id) || product_id <= 0) {
                return NextResponse.json({ ok: false, error: "Geçersiz product_id" }, { status: 400 });
            }
            const cart = await removeItem(id, product_id);
            return NextResponse.json({ ok: true, data: cart });
        }

        if (action === "clear") {
            const cart = await clearCart(id);
            return NextResponse.json({ ok: true, data: cart });
        }

        return NextResponse.json({ ok: false, error: "Geçersiz action" }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message ?? "Hata" }, { status: 500 });
    }
}

/**
 * DELETE /api/cart/:id
 * sepeti iptal eder (status=cancelled). Kolaylık için sadece flag değiştiriyoruz.
 */
export async function DELETE(_: NextRequest, ctx: { params: { id: string } }) {
    try {
        const id = Number(ctx.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ ok: false, error: "Geçersiz id" }, { status: 400 });
        }

        // yumuşak silme
        await getPool().query(
            "UPDATE carts SET status = 'cancelled' WHERE id = ?",
            [id]
        );

        const cart = await getCartById(id);
        return NextResponse.json({ ok: true, data: cart });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message ?? "Hata" }, { status: 500 });
    }
}
