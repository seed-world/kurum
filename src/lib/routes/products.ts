// src/lib/routes/products.ts
// Node DB importları YOK; PHP endpoint'lerine fetch atıyoruz.

import type {
  ListOptions,
  PagedResult,
  Product,
  NewProductInput,
  UpdateProductInput,
} from "../types";
import { orderBy, paginate, sanitizeLike, pick, parseId } from "../utils";

function toError(res: Response, json: any) {
  return new Error(json?.error || `HTTP ${res.status}`);
}

/** undefined -> null (API tarafında tutarlı olsun) */
function normalizeUndefinedToNull<T extends object>(obj: T): T {
  const clone: any = { ...obj };
  for (const k of Object.keys(clone)) if (clone[k] === undefined) clone[k] = null;
  return clone;
}

/** Listeleme (arama + sıralama + sayfalama) – PHP: /api/products.php */
export async function listProducts(
  opts?: ListOptions & { category_id?: number }
): Promise<PagedResult<Product>> {
  const { page, limit } = paginate(opts);
  const like = sanitizeLike(opts?.search);
  const { column, direction } = orderBy(opts?.sort, opts?.order, [
    "id",
    "product_type",
    "variety",
    "region",
    "code",
    "created_at",
    "updated_at",
    "rating_avg",
    "rating_count",
  ]);

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (like) qs.set("search", like.replace(/%/g, "")); // PHP tarafı kendi LIKE hazırlasın
  if (opts?.category_id != null) qs.set("category_id", String(opts.category_id));
  qs.set("sort", column);
  qs.set("order", (direction || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC");

  const res = await fetch(`/api/products.php?` + qs.toString(), {
    cache: "no-store",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);

  return {
    data: (json.data as Product[]) ?? [],
    page: Number(json.page ?? page),
    limit: Number(json.limit ?? limit),
    total: Number(json.total ?? 0),
  };
}

/** Tek ürün – PHP: /api/products/{id}.php */
export async function getProductById(id: number | string): Promise<Product | null> {
  const pid = parseId(id);
  const res = await fetch(`/api/products/${pid}.php`, {
    cache: "no-store",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return (json?.data as Product) ?? null;
}

/** Ekle – PHP: POST /api/products.php */
export async function createProduct(input: NewProductInput): Promise<Product> {
  const payload = normalizeUndefinedToNull(
    pick(input, [
      "product_type",
      "variety",
      "sub_type",
      "code",
      "region",
      "germination_start_year",
      "seeds_2023",
      "seeds_2024",
      "seeds_2025_expected",
      "annual_growth_factor",
      "seedling_unit_price",
      "asset_value_2023",
      "asset_value_2024",
      "asset_value_2025",
      "is_active",
      "is_featured",
      "image_path",
      "category_id",
    ])
  );

  const res = await fetch(`/api/products.php`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return json?.data as Product;
}

/** Güncelle – PHP: PATCH /api/products/{id}.php */
export async function updateProduct(id: number | string, input: UpdateProductInput): Promise<Product | null> {
  const pid = parseId(id);
  const payload = normalizeUndefinedToNull(
    pick(input, [
      "product_type",
      "variety",
      "sub_type",
      "code",
      "region",
      "germination_start_year",
      "seeds_2023",
      "seeds_2024",
      "seeds_2025_expected",
      "annual_growth_factor",
      "seedling_unit_price",
      "asset_value_2023",
      "asset_value_2024",
      "asset_value_2025",
      "is_active",
      "is_featured",
      "image_path",
      "category_id",
    ])
  );

  const res = await fetch(`/api/products/${pid}.php`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return (json?.data as Product) ?? null;
}

/** Sil – PHP: DELETE /api/products/{id}.php */
export async function deleteProduct(id: number | string): Promise<{ deleted: boolean }> {
  const pid = parseId(id);
  const res = await fetch(`/api/products/${pid}.php`, {
    method: "DELETE",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw toError(res, json);
  return { deleted: Boolean(json?.deleted ?? true) };
}
