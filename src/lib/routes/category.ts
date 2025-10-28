// src/lib/routes/category.ts
import { executeResult, queryRows } from "../db/connection";
import type {
  ListOptions, PagedResult,
  Category, CategoryRow, NewCategoryInput, UpdateCategoryInput
} from "../types";
import { orderBy, paginate, sanitizeLike, pick, parseId, normalizeUndefinedToNull } from "../utils";

/** Listeleme (arama + sıralama + sayfalama) — ürün sayısıyla birlikte */
export async function listCategories(opts?: ListOptions): Promise<PagedResult<Category & { product_count: number }>> {
  const { page, limit, offset } = paginate(opts);

  const safeLimit  = Number.isFinite(limit)  ? Math.max(1, Math.min(200, Number(limit))) : 20;
  const safeOffset = Number.isFinite(offset) ? Math.max(0, Number(offset)) : 0;

  const like = sanitizeLike(opts?.search);
  const { column, direction } = orderBy(opts?.sort, opts?.order, [
    "id", "name", "created_at", "updated_at"
  ]);

  const orderColumn = ["id", "name", "created_at", "updated_at"].includes(column)
    ? `c.${column}`
    : "c.id";
  const orderDir = (direction || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

  const where = like
    ? `WHERE (c.name LIKE :q ESCAPE '\\\\' OR c.description LIKE :q ESCAPE '\\\\')`
    : "";

  const params: any = like ? { q: like } : {};

  // 🔥 Ürün sayısı için LEFT JOIN + COUNT
  const [rows] = await queryRows<Array<CategoryRow & { product_count: number }>>(
    `
    SELECT
      c.*,
      COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    ${where}
    GROUP BY c.id
    ORDER BY ${orderColumn} ${orderDir}
    LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
    params
  );

  const [countRows] = await queryRows<any[]>(
    `SELECT COUNT(*) AS total FROM categories c ${where}`,
    params
  );

  return {
    data: rows as unknown as Array<Category & { product_count: number }>,
    page,
    limit: safeLimit,
    total: Number(countRows[0]?.total ?? 0)
  };
}

/** Tek kategori */
export async function getCategoryById(id: number | string): Promise<Category | null> {
  const cid = parseId(id);
  const [rows] = await queryRows<CategoryRow[]>(`SELECT * FROM categories WHERE id = :id`, { id: cid });
  return (rows[0] as unknown as Category) ?? null;
}

/** Ekle */
export async function createCategory(input: NewCategoryInput): Promise<Category> {
  const picked = pick(input, ["name", "description", "image_path", "is_active"]);
  const payload = normalizeUndefinedToNull(picked) as Record<string, any>;

  const [res] = await executeResult(
    `
    INSERT INTO categories
    (name, description, image_path, is_active, created_at, updated_at)
    VALUES
    (:name, :description, :image_path, COALESCE(:is_active,1), NOW(), NOW())
    `,
    payload
  );

  const insertId = Number(res.insertId);
  const [rows] = await queryRows<CategoryRow[]>(`SELECT * FROM categories WHERE id = :id`, { id: insertId });
  return rows[0] as unknown as Category;
}

/** Güncelle (partial) */
export async function updateCategory(id: number | string, input: UpdateCategoryInput): Promise<Category | null> {
  const cid = parseId(id);
  const picked = pick(input, ["name", "description", "image_path", "is_active"]);
  const allowed = normalizeUndefinedToNull(picked) as Record<string, any>;

  const keys = Object.keys(allowed);
  if (keys.length === 0) return await getCategoryById(cid);

  const setSql = keys.map(k => `${k} = :${k}`).join(", ");
  await executeResult(
    `UPDATE categories SET ${setSql}, updated_at = NOW() WHERE id = :id`,
    { id: cid, ...allowed }
  );

  return await getCategoryById(cid);
}

/** Sil */
export async function deleteCategory(id: number | string): Promise<{ deleted: boolean }> {
  const cid = parseId(id);
  const [res] = await executeResult(`DELETE FROM categories WHERE id = :id`, { id: cid });
  return { deleted: res.affectedRows > 0 };
}
