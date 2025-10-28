"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, X, ShoppingCart } from "lucide-react";

export type CartDrawerItem = {
  productId: number;
  title: string;
  price: number;
  imageUrl?: string | null;
  code?: string | null;
  qty: number;
};

export type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void; // Ödeme modalını açmak için
  items: CartDrawerItem[];
  total: number;
  setQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
};

function fmtPrice(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${f} ₺`;
}

export default function CartDrawer({
  open,
  onClose,
  onCheckout,
  items,
  total,
  setQty,
  removeItem,
}: CartDrawerProps) {
  // 👇 SSR → Client farklarını engelle
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.backdrop === "1") onClose();
  };

  const hasItems = mounted ? items.length > 0 : false;
  const safeTotal = mounted ? total : 0;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        data-backdrop="1"
        onClick={onBackdropClick}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sepet"
        className={`absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl border-l border-black/10 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-amber-600" />
            <h2 className="text-lg font-bold text-black">Sepetim</h2>
          </div>
          <button
            className="text-black p-2 rounded-md hover:bg-black/5 transition-colors"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X />
          </button>
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!mounted ? (
            // SSR’de stabil bir iskelet göster (hydration güvenli)
            <div className="space-y-3">
              <div className="h-20 rounded-xl border border-black/10 animate-pulse bg-gray-50" />
              <div className="h-20 rounded-xl border border-black/10 animate-pulse bg-gray-50" />
              <div className="h-20 rounded-xl border border-black/10 animate-pulse bg-gray-50" />
            </div>
          ) : !hasItems ? (
            <div className="text-center text-black/60 py-16">Sepetiniz boş.</div>
          ) : (
            items.map((it) => (
              <div
                key={it.productId}
                className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-xl border border-black/10 p-3"
              >
                <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden">
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-black/50">
                      Görsel yok
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-black font-semibold text-sm line-clamp-2">
                    {it.title}
                  </div>
                  {it.code && (
                    <div className="text-[11px] text-black/60 mt-0.5">
                      Kod: {it.code}
                    </div>
                  )}
                  <div className="mt-2 inline-flex items-center rounded-lg border border-black/10">
                    <button
                      className="text-black p-1.5 hover:bg-black/5"
                      onClick={() =>
                        setQty(it.productId, Math.max(1, it.qty - 1))
                      }
                      aria-label="Azalt"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      value={it.qty}
                      onChange={(e) => {
                        const n =
                          Number(String(e.target.value).replace(/\D/g, "")) ||
                          1;
                        setQty(
                          it.productId,
                          Math.min(9999, Math.max(1, n))
                        );
                      }}
                      className="text-black w-12 text-center text-sm outline-none"
                      inputMode="numeric"
                      aria-label="Adet"
                    />
                    <button
                      className="text-black p-1.5 hover:bg-black/5"
                      onClick={() =>
                        setQty(it.productId, Math.min(9999, it.qty + 1))
                      }
                      aria-label="Artır"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
                    onClick={() => removeItem(it.productId)}
                    aria-label="Ürünü kaldır"
                    title="Kaldır"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="text-black text-sm font-bold">
                    {fmtPrice(it.price * it.qty)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/70">Ara Toplam</span>
            <span
              className="text-base font-bold text-black"
              suppressHydrationWarning
            >
              {fmtPrice(safeTotal)}
            </span>
          </div>

          <div className="grid ">
    
            <button
              onClick={onCheckout}
              className="cursor-pointer text-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-3 text-sm font-semibold shadow"
              disabled={!mounted}
            >
              Ödeme Yap
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
