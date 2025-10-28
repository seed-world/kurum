// src/lib/client/cart.ts


"use client";

type EnsureCartResponse = {
  ok: boolean;
  data?: { id: number; items?: Array<{ quantity: number }> };
  error?: string;
};

type CartResponse = EnsureCartResponse;

const GUEST_KEY_STORAGE = "guest_key";
const CART_ID_STORAGE = "cart_id";

/** Misafir anahtarını al/oluştur (localStorage) */
export function getGuestKey(): string {
  if (typeof window === "undefined") return "";
  let gk = localStorage.getItem(GUEST_KEY_STORAGE);
  if (!gk) {
    gk = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    localStorage.setItem(GUEST_KEY_STORAGE, gk);
  }
  return gk;
}

/** Cart id’yi oku/yaz/sil */
export function getStoredCartId(): number | null {
  const raw = typeof window !== "undefined" ? localStorage.getItem(CART_ID_STORAGE) : null;
  const n = raw ? Number(raw) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}
export function setStoredCartId(id: number) {
  if (typeof window !== "undefined") localStorage.setItem(CART_ID_STORAGE, String(id));
}
export function clearStoredCartId() {
  if (typeof window !== "undefined") localStorage.removeItem(CART_ID_STORAGE);
}

/** Sunucudan aktif sepeti garanti et (misafir ve/veya kullanıcı için) */
export async function ensureCart(): Promise<number> {
  const guest_key = getGuestKey();
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ guest_key, currency: "TRY" }),
    cache: "no-store",
  });
  const json: EnsureCartResponse = await res.json();
  if (!json.ok || !json.data?.id) {
    throw new Error(json.error || "Sepet oluşturulamadı");
  }
  setStoredCartId(json.data.id);
  return json.data.id;
}

/** Sepeti id’ye göre getir (count hesaplamak için) */
export async function fetchCartById(id: number) {
  const res = await fetch(`/api/cart/${id}`, { cache: "no-store" });
  const json: CartResponse = await res.json();
  if (!json.ok || !json.data?.id) throw new Error(json.error || "Sepet getirilemedi");
  return json.data;
}

/** Sepete ekle; yoksa sepeti oluşturur */
export async function addToCart(product_id: number, quantity = 1, unit_price?: number) {
  let id = getStoredCartId();
  try {
    if (!id) id = await ensureCart();
  } catch {
    // ensureCart hata verirse tekrar deneyeceğiz
    id = await ensureCart();
  }

  const res = await fetch(`/api/cart/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "add", product_id, quantity, unit_price }),
  });
  const json: CartResponse = await res.json();

  if (!json.ok || !json.data?.id) {
    // sepet iptal edilmiş olabilir → cart id cache’i temizle ve bir daha dene
    clearStoredCartId();
    const freshId = await ensureCart();
    const res2 = await fetch(`/api/cart/${freshId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "add", product_id, quantity, unit_price }),
    });
    const json2: CartResponse = await res2.json();
    if (!json2.ok || !json2.data?.id) throw new Error(json2.error || "Sepete eklenemedi");
    setStoredCartId(json2.data.id);
    return json2.data;
  }

  setStoredCartId(json.data.id);
  return json.data;
}

/** Sepetteki toplam adet (satır adetlerinin toplamı) */
export function countFromCart(cart: { items?: Array<{ quantity: number }> } | null | undefined) {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
}
