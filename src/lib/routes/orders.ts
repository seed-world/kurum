// src/lib/routes/orders.ts
// Not: Artık DB bağlantısı yok; PHP endpoint'lerine fetch atıyoruz.

import type {
  AppOrderCreateInput,
  PagedResult,
  ListOptions,
  Order,
} from "../types";
import { paginate, sanitizeLike } from "../utils";

/** (Opsiyonel) başka yerlerde kullanıyorsan kalsın */
export function parseListOptions(sp: URLSearchParams): ListOptions {
  return {
    page: Number(sp.get("page") ?? 1),
    limit: Number(sp.get("limit") ?? 20),
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? "created_at",
    order: sp.get("order") === "desc" ? "desc" : "asc",
  };
}

function toError(res: Response, json: any) {
  return new Error(json?.error || `HTTP ${res.status}`);
}

/** Sipariş oluştur — POST /api/orders.php */
export async function createOrder(input: AppOrderCreateInput): Promise<Order> {
  const res = await fetch(`/api/orders.php`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return json?.data as Order;
}

/** Tek sipariş — GET /api/orders/{id}.php */
export async function getOrderById(id: number | string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${id}.php`, {
    cache: "no-store",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return (json?.data as Order) ?? null;
}

/** Listeleme — GET /api/orders.php?page=&limit=&search=&sort=&order= */
export async function listOrders(opts?: ListOptions): Promise<PagedResult<Order>> {
  const { page, limit } = paginate(opts);
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (opts?.search) qs.set("search", (sanitizeLike(opts.search) || "").replace(/%/g, ""));
  if (opts?.sort) qs.set("sort", String(opts.sort));
  if (opts?.order) qs.set("order", String(opts.order).toLowerCase() === "desc" ? "desc" : "asc");

  const res = await fetch(`/api/orders.php?` + qs.toString(), {
    cache: "no-store",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);

  return {
    data: (json.data as Order[]) ?? [],
    page: Number(json.page ?? page),
    limit: Number(json.limit ?? limit),
    total: Number(json.total ?? 0),
  };
}
