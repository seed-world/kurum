// src/lib/routes/reviews.ts
// Not: Artık Node/MySQL importu yok; PHP API'ye fetch atıyoruz.
import type {
  ListOptions,
  PagedResult,
  Review,
  NewReviewInput,
  UpdateReviewInput,
} from "../types";
import { paginate, parseId } from "../utils";

type ApiPaged<T> = { ok?: boolean; data?: T[]; total?: number; page?: number; limit?: number } & any;

function toError(res: Response, json: any) {
  return new Error(json?.error || `HTTP ${res.status}`);
}

/** Ürün bazında yorum listesi (status filtresi opsiyonel) */
export async function listReviewsByProduct(
  productId: number | string,
  opts?: ListOptions & { status?: "pending" | "approved" | "rejected" }
): Promise<PagedResult<Review>> {
  const pid = parseId(productId);
  const { page, limit } = paginate(opts);

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (opts?.status) qs.set("status", opts.status);

  const res = await fetch(`/api/products/${pid}/reviews.php?` + qs.toString(), {
    cache: "no-store",
    credentials: "include",
  });
  const json: ApiPaged<Review> = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);

  // PHP tarafı {data,total,page,limit} döndürmeli
  return {
    data: (json.data as Review[]) ?? [],
    page: Number(json.page ?? page),
    limit: Number(json.limit ?? limit),
    total: Number(json.total ?? 0),
  };
}

/** Tek yorum getir */
export async function getReviewById(id: number | string): Promise<Review | null> {
  const rid = parseId(id);
  const res = await fetch(`/api/reviews/${rid}.php`, {
    cache: "no-store",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return (json?.data as Review) ?? null;
}

/** Yorum oluştur (rating 1..5) */
export async function createReview(input: NewReviewInput): Promise<Review> {
  if (!input?.product_id) throw new Error("product_id zorunlu");
  const res = await fetch(`/api/products/${input.product_id}/reviews.php`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return json?.data as Review;
}

/** Yorum güncelle (moderasyon vs.) */
export async function updateReview(id: number | string, input: UpdateReviewInput): Promise<Review | null> {
  const rid = parseId(id);
  const res = await fetch(`/api/reviews/${rid}.php`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input ?? {}),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return (json?.data as Review) ?? null;
}

/** Yorum sil */
export async function deleteReview(id: number | string): Promise<{ deleted: boolean }> {
  const rid = parseId(id);
  const res = await fetch(`/api/reviews/${rid}.php`, {
    method: "DELETE",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return { deleted: Boolean(json?.deleted ?? true) };
}
