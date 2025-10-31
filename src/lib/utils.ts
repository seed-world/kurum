// src/lib/utils.ts

import { ListOptions, OrderDirection } from "./types";

/** Boşlukları normalize edip %...% LIKE için güvenli hale getirir */
export function sanitizeLike(input?: string) {
  if (!input) return null;
  return `%${input.replace(/[%_]/g, s => "\\" + s).trim()}%`;
}

export function normalizeUndefinedToNull<T extends Record<string, any>>(obj: T): T {
  const clone: any = { ...obj };
  for (const key of Object.keys(clone)) {
    if (clone[key] === undefined) clone[key] = null;
  }
  return clone;
}

/** page/limit → LIMIT/OFFSET */
export function paginate(opts?: ListOptions) {
  const page = Math.max(1, Number(opts?.page ?? 1));
  const limit = Math.min(200, Math.max(1, Number(opts?.limit ?? 20)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/** Sadece izin verilen alan adlarıyla ORDER BY üretir */
export function orderBy(
  sort: string | undefined,
  order: OrderDirection | undefined,
  allowed: readonly string[]
) {
  const dir: OrderDirection = order === "desc" ? "desc" : "asc";
  const col = allowed.includes(String(sort)) ? String(sort) : allowed[0];
  return { column: col, direction: dir };
}

/** id parametresini güvenle sayıya çevirir */
export function parseId(id: string | number): number {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Geçersiz id");
  }
  return n;
}

/** basit UUID v4 kontrolü (guest_key için) */
export function isUUID(input?: string | null) {
  if (!input) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
}

/** UUID üret (misafir için) */
export function uuidv4() {
  // crypto yoksa fallback
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  const rnd = (n: number) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `${rnd(8)}-${rnd(4)}-4${rnd(3)}-${["8","9","a","b"][Math.floor(Math.random()*4)]}${rnd(3)}-${rnd(12)}`;
}

/** Nesneden belirli anahtarları alır */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // @ts-ignore
  const out: any = {};
  for (const k of keys) if (k in obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

/** Nesneden belirli anahtarları çıkarır */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  // @ts-ignore
  const out: any = {};
  for (const k in obj) if (!keys.includes(k as unknown as K)) out[k] = (obj as any)[k];
  return out;
}

/* -------------------- ORDERS yardımcıları -------------------- */

/** Para değerini 2 haneye yuvarla (float toplama hatalarını azalt) */
export function money(n: number) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

/** Satır toplamını hesapla */
export function lineTotal(unit_price: number, quantity: number) {
  return money(unit_price * quantity);
}

/** Basit toplam hesap (kupon, kargo, vergi dışarıdan girilebilir) */
export function calcTotals(
  items: { unit_price: number; quantity: number }[],
  opts?: {
    discount_total?: number;
    shipping_total?: number;
    tax_total?: number;
  }
) {
  const subtotal = money(items.reduce((a, it) => a + lineTotal(it.unit_price, it.quantity), 0));
  const discount_total = money(opts?.discount_total ?? 0);
  const shipping_total = money(opts?.shipping_total ?? 0);
  const tax_total = money(opts?.tax_total ?? 0);
  const grand_total = money(subtotal - discount_total + shipping_total + tax_total);
  return { subtotal, discount_total, shipping_total, tax_total, grand_total };
}
