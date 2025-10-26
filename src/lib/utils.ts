// src/lib/utils.ts

import { ListOptions, Order } from "./types";

/** Boşlukları normalize edip %...% LIKE için güvenli hale getirir */
export function sanitizeLike(input?: string) {
  if (!input) return null;
  return `%${input.replace(/[%_]/g, s => "\\" + s).trim()}%`;
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
  order: Order | undefined,
  allowed: readonly string[]
) {
  const dir: Order = order === "desc" ? "desc" : "asc";
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
