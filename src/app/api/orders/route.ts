import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder, parseListOptions } from "@/lib/routes/orders";
import type { AppOrderCreateInput } from "@/lib/types";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const result = await listOrders(parseListOptions(searchParams));
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        console.error("GET /api/orders error", err);
        return NextResponse.json({ error: err?.message ?? "unexpected_error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const accept = req.headers.get("accept") || "";
        const body = (await req.json()) as AppOrderCreateInput;

        if (!body || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ error: "Sepet boş olamaz" }, { status: 400 });
        }

        const created = await createOrder(body);

        if (!created) {
            return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
        }

        if (accept.includes("text/html")) {
            const url = new URL("/tesekkurler", req.url);
            url.searchParams.set("id", String(created.id));
            url.searchParams.set("no", created.order_number);
            url.searchParams.set("ct", created.customer_type);
            url.searchParams.set("pm", created.payment_method);
            return NextResponse.redirect(url, { status: 303 });
        }



        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/orders error", err);
        return NextResponse.json({ error: err?.message ?? "unexpected_error" }, { status: 500 });
    }
}
