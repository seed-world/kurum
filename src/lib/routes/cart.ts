// src/lib/routes/cart.ts

import { getPool } from "@/lib/db/connection";
import {
  AddOrSetItemInput,
  Cart,
  CartItemRow,
  CartRow,
  EnsureCartInput,
} from "@/lib/types";
import { isUUID, uuidv4 } from "@/lib/utils";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

/** aktif sepet çıkar + itemleri ekle */
export async function getCartById(cartId: number): Promise<Cart | null> {
  const [rows] = await getPool().query<CartRow[]>(
    "SELECT * FROM carts WHERE id = ?",
    [cartId]
  );
  if (!rows.length) return null;

  const cart = rows[0];
  const [items] = await getPool().query<CartItemRow[]>(
    "SELECT * FROM cart_items WHERE cart_id = ? ORDER BY id ASC",
    [cart.id]
  );

  return { ...cart, items: items as any };
}

/** user_id veya guest_key ile aktif sepet bul */
export async function findActiveCart(params: { user_id?: number | null; guest_key?: string | null }): Promise<Cart | null> {
  const { user_id, guest_key } = params;

  if (user_id) {
    const [rows] = await getPool().query<CartRow[]>(
      "SELECT * FROM carts WHERE user_id = ? AND status = 'active' ORDER BY updated_at DESC LIMIT 1",
      [user_id]
    );
    if (rows.length) return getCartById(rows[0].id);
  }

  if (guest_key && isUUID(guest_key)) {
    const [rows] = await getPool().query<CartRow[]>(
      "SELECT * FROM carts WHERE guest_key = ? AND status = 'active' ORDER BY updated_at DESC LIMIT 1",
      [guest_key]
    );
    if (rows.length) return getCartById(rows[0].id);
  }

  return null;
}

/** yoksa oluştur → aktif sepet döndür */
export async function ensureActiveCart(input: EnsureCartInput): Promise<Cart> {
  const userId = input.user_id ?? null;
  const gk = input.guest_key && isUUID(input.guest_key) ? input.guest_key : null;
  const currency = (input.currency || "TRY").toUpperCase().slice(0, 3);

  const existing = await findActiveCart({ user_id: userId || undefined, guest_key: gk || undefined });
  if (existing) return existing;

  const guestKeyToUse = userId ? null : gk || uuidv4();

  const [res] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO carts (user_id, guest_key, status, currency, subtotal, discount_total, shipping_total, tax_total, grand_total)
     VALUES (?, ?, 'active', ?, 0, 0, 0, 0, 0)`,
    [userId, guestKeyToUse, currency]
  );

  const insertId = res.insertId as number;
  const created = await getCartById(insertId);
  if (!created) throw new Error("Sepet oluşturulamadı");
  return created;
}

/** ürün fiyatını DB'den al (fallback) */
async function getProductUnitPrice(productId: number): Promise<number> {
  type PriceRow = RowDataPacket & { seedling_unit_price: number | null };
  const [rows] = await getPool().query<PriceRow[]>(
    "SELECT seedling_unit_price FROM products WHERE id = ? AND is_active = 1",
    [productId]
  );
  if (!rows.length) throw new Error("Ürün bulunamadı veya pasif");
  return Number(rows[0].seedling_unit_price ?? 0);
}

/** toplamları yeniden hesapla */
export async function recalcCartTotals(cartId: number): Promise<void> {
  type SumRow = RowDataPacket & { subtotal: number | null };
  const [[sumRow]] = await getPool().query<SumRow[]>(
    "SELECT SUM(line_total) AS subtotal FROM cart_items WHERE cart_id = ?",
    [cartId]
  );
  const subtotal = Number(sumRow?.subtotal ?? 0);
  const discount_total = 0; // kupon vb. eklendiğinde güncelle
  const shipping_total = 0; // kargo hes. eklendiğinde güncelle
  const tax_total = 0;      // vergi hes. eklendiğinde güncelle
  const grand_total = subtotal - discount_total + shipping_total + tax_total;

  await getPool().query(
    `UPDATE carts
     SET subtotal = ?, discount_total = ?, shipping_total = ?, tax_total = ?, grand_total = ?
     WHERE id = ?`,
    [subtotal, discount_total, shipping_total, tax_total, grand_total, cartId]
  );
}

/** item ekle (yoksa), varsa miktarı arttır; quantity>0 olmalı */
export async function addItem(cartId: number, payload: AddOrSetItemInput): Promise<Cart> {
  if (payload.quantity <= 0) throw new Error("Geçersiz miktar");

  const unitPrice = payload.unit_price ?? (await getProductUnitPrice(payload.product_id));
  const [existing] = await getPool().query<CartItemRow[]>(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
    [cartId, payload.product_id]
  );

  if (existing.length) {
    const it = existing[0];
    const newQty = it.quantity + payload.quantity;
    await getPool().query(
      "UPDATE cart_items SET quantity = ?, unit_price = ?, line_total = ? WHERE id = ?",
      [newQty, unitPrice, newQty * unitPrice, it.id]
    );
  } else {
    await getPool().query(
      `INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, currency, line_total)
       VALUES (?, ?, ?, ?, 'TRY', ?)`,
      [cartId, payload.product_id, payload.quantity, unitPrice, payload.quantity * unitPrice]
    );
  }

  await recalcCartTotals(cartId);
  const cart = await getCartById(cartId);
  if (!cart) throw new Error("Sepet güncellenemedi");
  return cart;
}

/** item miktarını mutlak olarak ayarla (0 → satır silinir) */
export async function setItemQty(cartId: number, payload: AddOrSetItemInput): Promise<Cart> {
  if (payload.quantity < 0) throw new Error("Geçersiz miktar");

  const unitPrice = payload.unit_price ?? (await getProductUnitPrice(payload.product_id));
  if (payload.quantity === 0) {
    await getPool().query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cartId, payload.product_id]);
  } else {
    const [existing] = await getPool().query<CartItemRow[]>(
      "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, payload.product_id]
    );
    if (existing.length) {
      await getPool().query(
        "UPDATE cart_items SET quantity = ?, unit_price = ?, line_total = ? WHERE id = ?",
        [payload.quantity, unitPrice, payload.quantity * unitPrice, existing[0].id]
      );
    } else {
      await getPool().query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, currency, line_total)
         VALUES (?, ?, ?, ?, 'TRY', ?)`,
        [cartId, payload.product_id, payload.quantity, unitPrice, payload.quantity * unitPrice]
      );
    }
  }

  await recalcCartTotals(cartId);
  const cart = await getCartById(cartId);
  if (!cart) throw new Error("Sepet güncellenemedi");
  return cart;
}

/** ürünü satır olarak çıkar */
export async function removeItem(cartId: number, productId: number): Promise<Cart> {
  await getPool().query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cartId, productId]);
  await recalcCartTotals(cartId);
  const cart = await getCartById(cartId);
  if (!cart) throw new Error("Sepet güncellenemedi");
  return cart;
}

/** tüm itemleri temizle */
export async function clearCart(cartId: number): Promise<Cart> {
  await getPool().query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
  await recalcCartTotals(cartId);
  const cart = await getCartById(cartId);
  if (!cart) throw new Error("Sepet güncellenemedi");
  return cart;
}

/** login olduysa misafir sepetini kullanıcıya bağla (varsa birleştir) */
export async function attachGuestCartToUser(guest_key: string, user_id: number): Promise<Cart | null> {
  if (!isUUID(guest_key)) return null;

  const guestCart = await findActiveCart({ guest_key });
  if (!guestCart) return findActiveCart({ user_id }); // zaten kullanıcı sepeti varsa onu döndür

  const userCart = await findActiveCart({ user_id });

  // kullanıcıda aktif sepet varsa birleştir → guest->userCart
  if (userCart) {
    const [guestItems] = await getPool().query<CartItemRow[]>(
      "SELECT * FROM cart_items WHERE cart_id = ?",
      [guestCart.id]
    );
    for (const gi of guestItems) {
      await addItem(userCart.id, { product_id: gi.product_id, quantity: gi.quantity, unit_price: gi.unit_price });
    }
    await getPool().query("UPDATE carts SET status = 'cancelled' WHERE id = ?", [guestCart.id]);
    return getCartById(userCart.id);
  }

  // kullanıcıda yoksa guest sepetini devral
  await getPool().query("UPDATE carts SET user_id = ?, guest_key = NULL WHERE id = ?", [user_id, guestCart.id]);
  return getCartById(guestCart.id);
}
