import { getPool } from "@/lib/db/connection";
import type {
  PoolConnection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import type {
  AppOrderCreateInput,
  OrderDb,
  OrderItemDb,
  PagedResult,
  ListOptions,
  Order,
} from "@/lib/types";
import { paginate, sanitizeLike } from "@/lib/utils";

const pool = getPool();

/** Query paramlarını parse et (listeleme için) */
export function parseListOptions(sp: URLSearchParams): ListOptions {
  return {
    page: Number(sp.get("page") ?? 1),
    limit: Number(sp.get("limit") ?? 20),
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? "created_at",
    order: sp.get("order") === "desc" ? "desc" : "asc",
  };
}

/** Sipariş oluştur (transaction) */
export async function createOrder(input: AppOrderCreateInput) {
  const conn: PoolConnection = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      user_id = null,
      guest_key = null,
      customer_type,
      payment_method,
      status = "pending",
      currency = "TRY",

      subtotal,
      discount_total = 0,
      shipping_total = 0,
      tax_total = 0,
      grand_total,

      company_title = null,
      tax_number = null,
      tax_office = null,
      contact_name = null,
      email = null,
      phone = null,
      address_text = null,
      note = null,

      payment_snapshot = null,
      cart_id = null,
      domain = null,

      items,
    } = input;

    if (!customer_type || !payment_method) {
      throw new Error("customer_type ve payment_method zorunlu");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("items boş olamaz");
    }

    // 1) orders insert (order_number'ı sonra set'leyeceğiz)
    const [res] = await conn.execute<ResultSetHeader>(
      `INSERT INTO orders
       (user_id, guest_key, customer_type, payment_method, status, currency,
        subtotal, discount_total, shipping_total, tax_total, grand_total,
        company_title, tax_number, tax_office, contact_name, email, phone, address_text, note,
        payment_snapshot, cart_id, domain)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        user_id,
        guest_key,
        customer_type,
        payment_method,
        status,
        currency,
        subtotal,
        discount_total,
        shipping_total,
        tax_total,
        grand_total,
        company_title,
        tax_number,
        tax_office,
        contact_name,
        email,
        phone,
        address_text,
        note,
        payment_snapshot ? JSON.stringify(payment_snapshot) : null,
        cart_id,
        domain,
      ]
    );

    const orderId = res.insertId;

    // 2) Benzersiz sipariş no: SPNO + 8 haneli id pad
    const orderNumber = `SPNO${String(orderId).padStart(8, "0")}`;
    await conn.execute<ResultSetHeader>(
      `UPDATE orders SET order_number = ? WHERE id = ?`,
      [orderNumber, orderId]
    );

    // 3) order_items insert
    for (const it of items) {
      await conn.execute<ResultSetHeader>(
        `INSERT INTO order_items
         (order_id, product_id, code, title, unit_price, quantity, currency, line_total, image_path)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          orderId,
          it.product_id,
          it.code ?? null,
          it.title,
          it.unit_price,
          it.quantity,
          it.currency ?? currency,
          it.line_total,
          it.image_path ?? null,
        ]
      );
    }

    await conn.commit();

    // dönerken siparişi tam getir (order_number dahil)
    return await getOrderById(orderId, conn);
  } catch (err) {
    try { await conn.rollback(); } catch {}
    throw err;
  } finally {
    conn.release();
  }
}

/** Tek sipariş getir (items ile) */
export async function getOrderById(
  id: number,
  reuseConn?: PoolConnection
): Promise<Order | null> {
  const local = reuseConn ?? (await pool.getConnection());
  try {
    const [rows] = await local.execute<(OrderDb & RowDataPacket)[]>(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows.length) return null;

    const order = rows[0];
    const [items] = await local.execute<(OrderItemDb & RowDataPacket)[]>(
      `SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC`,
      [id]
    );

    return mapOrder(order, items);
  } finally {
    if (!reuseConn) local.release();
  }
}

/** Listeleme + arama */
export async function listOrders(opts?: ListOptions): Promise<PagedResult<Order>> {
  const { page, limit, offset } = paginate(opts);
  const like = sanitizeLike(opts?.search);

  const where: string[] = [];
  const args: any[] = [];
  if (like) {
    where.push(
      `(contact_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company_title LIKE ? OR tax_number LIKE ?)`
    );
    args.push(like, like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await pool.execute<(OrderDb & RowDataPacket)[]>(
    `SELECT * FROM orders
     ${whereSql}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...args, limit, offset]
  );

  const ids = rows.map((r) => r.id);
  let itemsByOrder = new Map<number, OrderItemDb[]>();

  if (ids.length) {
    const placeholders = ids.map(() => "?").join(",");
    const [itemRows] = await pool.execute<(OrderItemDb & RowDataPacket)[]>(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`,
      ids
    );
    for (const it of itemRows) {
      const arr = itemsByOrder.get(it.order_id) ?? [];
      arr.push(it);
      itemsByOrder.set(it.order_id, arr);
    }
  }

  const data: Order[] = rows.map((r) => mapOrder(r, itemsByOrder.get(r.id) ?? []));
  const [countRows] = await pool.execute<(RowDataPacket & { cnt: number })[]>(
    `SELECT COUNT(*) AS cnt FROM orders ${whereSql}`,
    args
  );

  const total = Number(countRows[0]?.cnt ?? 0);
  return { data, page, limit, total };
}

/** DB → App tip dönüşümü */
function mapOrder(o: OrderDb, items: OrderItemDb[]): Order {
  return {
    id: o.id,
    order_number: o.order_number,
    user_id: o.user_id,
    guest_key: o.guest_key,
    customer_type: o.customer_type,
    payment_method: o.payment_method,
    status: o.status,
    currency: o.currency,

    subtotal: Number(o.subtotal),
    discount_total: Number(o.discount_total),
    shipping_total: Number(o.shipping_total),
    tax_total: Number(o.tax_total),
    grand_total: Number(o.grand_total),

    company_title: o.company_title,
    tax_number: o.tax_number,
    tax_office: o.tax_office,
    contact_name: o.contact_name,
    email: o.email,
    phone: o.phone,
    address_text: o.address_text,
    note: o.note,

    payment_snapshot: o.payment_snapshot ? safeJson(o.payment_snapshot) : null,
    cart_id: o.cart_id,
    domain: o.domain,
    created_at: o.created_at,
    updated_at: o.updated_at,

    items: items.map((i) => ({
      id: i.id,
      order_id: i.order_id,
      product_id: i.product_id,
      code: i.code,
      title: i.title,
      unit_price: Number(i.unit_price),
      quantity: i.quantity,
      currency: i.currency,
      line_total: Number(i.line_total),
      image_path: i.image_path,
      created_at: i.created_at,
      updated_at: i.updated_at,
    })),
  };
}

function safeJson(v: any) {
  try { return typeof v === "string" ? JSON.parse(v) : v; } catch { return null; }
}
