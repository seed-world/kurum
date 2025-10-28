"use client";
import { addToCart } from "@/lib/client/cart";
import { useEffect, useMemo, useRef, useState } from "react";

/** Sepet item tipi */
export type CartItem = {
  productId: number;
  title: string;
  price: number;
  imageUrl?: string | null;
  code?: string | null;
  qty: number;
};

/** Basit event bus (multi-tab sync için BroadcastChannel + window event) */
const BC_NAME = "seedworld-cart";
let bc: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  bc = new BroadcastChannel(BC_NAME);
}

const STORAGE_KEY = "seedworld.cart.v1";

/** localStorage CRUD */
function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}
function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("seedworld:cart:changed"));
  bc?.postMessage({ type: "changed" });
}

async function tryServerAdd(item: CartItem) {
  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: item.productId, qty: item.qty }),
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Hook */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const loadingRef = useRef(false);

  // multi-tab ve diğer bileşenlerden gelen güncellemeleri yakala
  useEffect(() => {
    const onChange = () => setItems(readCart());
    window.addEventListener("seedworld:cart:changed", onChange);
    bc?.addEventListener("message", onChange);
    return () => {
      window.removeEventListener("seedworld:cart:changed", onChange);
      bc?.removeEventListener?.("message", onChange as any);
    };
  }, []);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0),
    [items]
  );

  const addItem = async (item: Omit<CartItem, "qty"> & { qty?: number }) => {
    const qty = Math.max(1, Math.min(9999, Number(item.qty ?? 1)));

    // 1) Optimistic local update
    const current = readCart();
    const ix = current.findIndex((c) => c.productId === item.productId);
    if (ix >= 0) current[ix].qty = Math.min(9999, current[ix].qty + qty);
    else current.push({ ...item, qty });

    writeCart(current);
    setItems(current);

    // 2) Server’a ekleme (varsa)
    try {
      await addToCart(item.productId, qty, item.price);
    } catch {
      // sessizce geç
    }
  };

  const setQty = (productId: number, qty: number) => {
    const n = Math.max(1, Math.min(9999, Number(qty)));
    const current = readCart();
    const ix = current.findIndex((c) => c.productId === productId);
    if (ix >= 0) {
      current[ix].qty = n;
      writeCart(current);
      setItems(current);
    }
  };

  const removeItem = (productId: number) => {
    const current = readCart().filter((c) => c.productId !== productId);
    writeCart(current);
    setItems(current);
  };

  const clear = () => {
    writeCart([]);
    setItems([]);
  };

  return {
    items,
    count,
    total,
    loading: loadingRef.current,
    addItem,
    setQty,
    removeItem,
    clear,
  };
}

/** Passthrough Provider (şimdilik context'e ihtiyaç yok) */
export function CartProvider({ children }: { children: React.ReactNode }) {
  // İlerde context eklemek istersen buradan genişletirsin.
  return <>{children}</>;
}
