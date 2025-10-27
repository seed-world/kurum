import { executeResult, queryRows } from "../db/connection";
import type {
    ListOptions,
    PagedResult,
    Product,
    ProductRow,
    NewProductInput,
    UpdateProductInput
} from "../types";
import { orderBy, paginate, sanitizeLike, pick, parseId } from "../utils";

/** undefined değerleri null'a çevirir (DB driver'ı undefined kabul etmez) */
function normalizeUndefinedToNull<T extends object>(obj: T): T {
    const clone: any = { ...obj };
    for (const key of Object.keys(clone)) {
        if (clone[key] === undefined) clone[key] = null;
    }
    return clone;
}

/** Listeleme (arama + sıralama + sayfalama) */
export async function listProducts(opts?: ListOptions): Promise<PagedResult<Product>> {
    const { page, limit, offset } = paginate(opts);

    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(200, Number(limit))) : 20;
    const safeOffset = Number.isFinite(offset) ? Math.max(0, Number(offset)) : 0;

    const like = sanitizeLike(opts?.search);
    const { column, direction } = orderBy(opts?.sort, opts?.order, [
        "id", "product_type", "variety", "region", "code", "created_at", "updated_at"
    ]);

    const orderColumn = ["id", "product_type", "variety", "region", "code", "created_at", "updated_at"].includes(column)
        ? `p.${column}`
        : "p.id";
    const orderDir = (direction || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

    const where = like
        ? `WHERE (p.product_type LIKE :q ESCAPE '\\\\'
          OR p.variety  LIKE :q ESCAPE '\\\\'
          OR p.region   LIKE :q ESCAPE '\\\\'
          OR p.code     LIKE :q ESCAPE '\\\\')`
        : "";

    const params: any = like ? { q: like } : {};

    const [rows] = await queryRows<ProductRow[]>(
        `
    SELECT * FROM products p
    ${where}
    ORDER BY ${orderColumn} ${orderDir}
    LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
        params
    );

    const [countRows] = await queryRows<any[]>(
        `SELECT COUNT(*) AS total FROM products p ${where}`,
        like ? { q: like } : {}
    );

    return { data: rows as unknown as Product[], page, limit: safeLimit, total: Number(countRows[0]?.total ?? 0) };
}

/** Tek ürün */
export async function getProductById(id: number | string): Promise<Product | null> {
    const pid = parseId(id);
    const [rows] = await queryRows<ProductRow[]>(`SELECT * FROM products WHERE id = :id`, { id: pid });
    return (rows[0] as unknown as Product) ?? null;
}

/** Ekle */
export async function createProduct(input: NewProductInput): Promise<Product> {
    // input burada JSON ya da form-data'dan normalize edilip geliyor.
    const picked = pick(input, [
        "product_type", "variety", "sub_type", "code", "region", "germination_start_year",
        "seeds_2023", "seeds_2024", "seeds_2025_expected", "annual_growth_factor",
        "seedling_unit_price", "asset_value_2023", "asset_value_2024", "asset_value_2025",
        "is_active", "is_featured", "image_path"
    ]);

    const payload = normalizeUndefinedToNull(picked) as Record<string, any>;

    const [res] = await executeResult(
        `
    INSERT INTO products
    (product_type,variety,sub_type,code,region,germination_start_year,
     seeds_2023,seeds_2024,seeds_2025_expected,annual_growth_factor,
     seedling_unit_price,asset_value_2023,asset_value_2024,asset_value_2025,
     is_active,is_featured,image_path,created_at,updated_at)
    VALUES
    (:product_type,:variety,:sub_type,:code,:region,:germination_start_year,
     :seeds_2023,:seeds_2024,:seeds_2025_expected,:annual_growth_factor,
     :seedling_unit_price,:asset_value_2023,:asset_value_2024,:asset_value_2025,
     COALESCE(:is_active,1),COALESCE(:is_featured,0),:image_path,NOW(),NOW())
    `,
        payload
    );

    const insertId = Number(res.insertId);
    const [rows] = await queryRows<ProductRow[]>(`SELECT * FROM products WHERE id = :id`, { id: insertId });
    return rows[0] as unknown as Product;
}

/** Güncelle */
export async function updateProduct(id: number | string, input: UpdateProductInput): Promise<Product | null> {
    const pid = parseId(id);

    const picked = pick(input, [
        "product_type", "variety", "sub_type", "code", "region", "germination_start_year",
        "seeds_2023", "seeds_2024", "seeds_2025_expected", "annual_growth_factor",
        "seedling_unit_price", "asset_value_2023", "asset_value_2024", "asset_value_2025",
        "is_active", "is_featured", "image_path"
    ]);

    const allowed = normalizeUndefinedToNull(picked) as Record<string, any>;
    const keys = Object.keys(allowed);
    if (keys.length === 0) return await getProductById(pid);

    const setSql = keys.map(k => `${k} = :${k}`).join(", ");
    await executeResult(
        `UPDATE products SET ${setSql}, updated_at = NOW() WHERE id = :id`,
        { id: pid, ...allowed }
    );

    return await getProductById(pid);
}

/** Sil */
export async function deleteProduct(id: number | string): Promise<{ deleted: boolean }> {
    const pid = parseId(id);
    const [res] = await executeResult(`DELETE FROM products WHERE id = :id`, { id: pid });
    return { deleted: res.affectedRows > 0 };
}
