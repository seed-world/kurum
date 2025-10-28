// src/lib/routes/reviews.ts
import { executeResult, queryRows } from "../db/connection";
import type {
  ListOptions,
  PagedResult,
  Review,
  ReviewRow,
  NewReviewInput,
  UpdateReviewInput
} from "../types";
import { paginate, parseId } from "../utils";

/** Ürün bazında yorum listesi (status filtresi opsiyonel) */
export async function listReviewsByProduct(
  productId: number | string,
  opts?: ListOptions & { status?: "pending" | "approved" | "rejected" }
): Promise<PagedResult<Review>> {
  const pid = parseId(productId);
  const { page, limit, offset } = paginate(opts);

  const whereStatus = opts?.status ? "AND r.status = :status" : "";
  const params: any = { pid };
  if (opts?.status) params.status = opts.status;

  const [rows] = await queryRows<ReviewRow[]>(
    `
    SELECT * FROM product_reviews r
    WHERE r.product_id = :pid ${whereStatus}
    ORDER BY r.created_at DESC
    LIMIT :limit OFFSET :offset
    `,
    { ...params, limit, offset }
  );

  const [countRows] = await queryRows<any[]>(
    `
    SELECT COUNT(*) as total
    FROM product_reviews r
    WHERE r.product_id = :pid ${whereStatus}
    `,
    params
  );

  return {
    data: rows as unknown as Review[],
    page,
    limit,
    total: Number(countRows[0]?.total ?? 0),
  };
}

/** Tek yorum getir */
export async function getReviewById(id: number | string): Promise<Review | null> {
  const rid = parseId(id);
  const [rows] = await queryRows<ReviewRow[]>(`SELECT * FROM product_reviews WHERE id = :id`, { id: rid });
  return (rows[0] as unknown as Review) ?? null;
}

/** Yorum oluştur (rating 1..5) */
export async function createReview(input: NewReviewInput): Promise<Review> {
  if (!input || !input.product_id) throw new Error("product_id zorunlu");
  if (!Number.isFinite(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("rating 1..5 olmalı");
  }

  const payload = {
    product_id: input.product_id,
    user_id: input.user_id ?? null,
    reviewer_name: input.reviewer_name ?? null,
    reviewer_email: input.reviewer_email ?? null,
    rating: Math.round(Number(input.rating)),
    title: input.title ?? null,
    comment: input.comment ?? null,
    status: input.status ?? "approved",
  };

  const [res] = await executeResult(
    `
    INSERT INTO product_reviews
    (product_id,user_id,reviewer_name,reviewer_email,rating,title,comment,status,created_at,updated_at)
    VALUES
    (:product_id,:user_id,:reviewer_name,:reviewer_email,:rating,:title,:comment,:status,NOW(),NOW())
    `,
    payload
  );

  const rid = Number(res.insertId);
  const [rows] = await queryRows<ReviewRow[]>(`SELECT * FROM product_reviews WHERE id = :id`, { id: rid });
  return rows[0] as unknown as Review;
}

/** Yorum güncelle (moderasyon vs.) */
export async function updateReview(id: number | string, input: UpdateReviewInput): Promise<Review | null> {
  const rid = parseId(id);
  const fields: string[] = [];
  const params: any = { id: rid };

  if (input.rating !== undefined) {
    const r = Number(input.rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) throw new Error("rating 1..5 olmalı");
    fields.push("rating = :rating");
    params.rating = Math.round(r);
  }
  if (input.title !== undefined) { fields.push("title = :title"); params.title = input.title ?? null; }
  if (input.comment !== undefined) { fields.push("comment = :comment"); params.comment = input.comment ?? null; }
  if (input.status !== undefined) { fields.push("status = :status"); params.status = input.status; }
  if (input.reviewer_name !== undefined) { fields.push("reviewer_name = :reviewer_name"); params.reviewer_name = input.reviewer_name ?? null; }
  if (input.reviewer_email !== undefined) { fields.push("reviewer_email = :reviewer_email"); params.reviewer_email = input.reviewer_email ?? null; }
  if (input.user_id !== undefined) { fields.push("user_id = :user_id"); params.user_id = input.user_id ?? null; }

  if (fields.length === 0) return await getReviewById(rid);

  const setSql = fields.join(", ");
  await executeResult(
    `UPDATE product_reviews SET ${setSql}, is_edited = 1, updated_at = NOW() WHERE id = :id`,
    params
  );

  return await getReviewById(rid);
}

/** Yorum sil */
export async function deleteReview(id: number | string): Promise<{ deleted: boolean }> {
  const rid = parseId(id);
  const [res] = await executeResult(`DELETE FROM product_reviews WHERE id = :id`, { id: rid });
  return { deleted: res.affectedRows > 0 };
}
