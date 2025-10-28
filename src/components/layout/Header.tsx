"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const kurumsalSub = [
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/arge-sertifikalar", label: "Ar-Ge" },
  { href: "/surdurulebilirlik", label: "Sürdürülebilirlik" },
  { href: "/satis-kanallari", label: "Satış Kanalları" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/kvkk", label: "KVKK" },
];

const mainNav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/izlenebilirlik", label: "İzlenebilirlik" },
  { label: "Kurumsal", sub: kurumsalSub },
];

const moreNav = [
  { href: "/urun-katalogu", label: "Ürün Kataloğu" },
  { href: "/sss", label: "SSS" },
  { href: "/toplu-siparis", label: "Toplu Sipariş" },
  { href: "/rfq", label: "RFQ Talebi" },
];

const allNav = [
  ...mainNav.filter((item: any) => item.href),
  ...kurumsalSub,
  ...moreNav,
];

function fmtPrice(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${f} ₺`;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // 🔔 Cart Drawer state
  const [cartOpen, setCartOpen] = useState(false);

  const { count, items, total, setQty, removeItem } = useCart();

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drawer açıkken body scroll kilidi
  useEffect(() => {
    if (cartOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [cartOpen]);

  const empty = items.length === 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 border-b border-black/5">
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center shrink-0 group"
              aria-label="Seed World - Ana Sayfa"
            >
              <Image
                src="/logo/logo_color.svg"
                alt="Seed World"
                width={55}
                height={55}
                className="rounded-md object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* desktop nav */}
            <nav
              className="hidden xl:flex items-center gap-6"
              aria-label="Ana menü"
            >
              {mainNav.map((item: any, idx) =>
                item.sub ? (
                  <div key={idx} className="relative">
                    <button
                      type="button"
                      onClick={() => setKurumsalOpen((v) => !v)}
                      onBlur={() => setKurumsalOpen(false)}
                      aria-haspopup="menu"
                      aria-expanded={kurumsalOpen}
                      className="cursor-pointer text-sm font-medium text-black/70 hover:text-black flex items-center gap-1 whitespace-nowrap transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-amber-600 hover:after:w-full after:transition-all after:duration-300"
                    >
                      {item.label}{" "}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          kurumsalOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      role="menu"
                      className={`absolute left-0 mt-3 w-56 rounded-xl border border-black/5 bg-white shadow-xl p-2 transition-all duration-200 ${
                        kurumsalOpen
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      {item.sub.map((subItem: any) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm text-black/70 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50 rounded-lg transition-all duration-200"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-black/70 hover:text-black transition-colors whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-amber-600 hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  onBlur={() => setMoreOpen(false)}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  className="cursor-pointer text-sm font-medium text-black/70 hover:text-black flex items-center gap-1 whitespace-nowrap transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-amber-600 hover:after:w-full after:transition-all after:duration-300"
                >
                  Daha Fazla{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  role="menu"
                  className={`absolute right-0 mt-3 w-56 rounded-xl border border-black/5 bg-white shadow-xl p-2 transition-all duration-200 ${
                    moreOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  {moreNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-black/70 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/arama"
                aria-label="Arama"
                className="p-2.5 rounded-xl border border-black/10 hover:border-green-500/30 hover:bg-green-50/50 transition-all duration-200 group"
              >
                <Search
                  size={18}
                  className="text-black/60 group-hover:text-green-600 transition-colors"
                />
              </Link>

              {/* 🛒 CART BUTTON -> Drawer aç */}
              <button
                aria-label="Sepeti aç"
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl border border-black/10 hover:border-amber-500/30 hover:bg-amber-50/50 transition-all duration-200 group"
              >
                <ShoppingCart
                  size={18}
                  className="text-black/60 group-hover:text-amber-600 transition-colors"
                />
                <span className="absolute -top-1 -right-1 text-[10px] font-semibold leading-none rounded-full bg-gradient-to-r from-green-600 to-amber-600 text-white px-1.5 py-1 min-w-[18px] text-center shadow-lg">
                  {count}
                </span>
              </button>

              <Link
                href="/giris-kayit"
                className="hidden md:inline-flex items-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium px-4 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                Giriş
              </Link>

              <Link
                href="/magaza"
                className="hidden lg:inline-flex items-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-medium px-4 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                Mağaza
              </Link>

              <button
                aria-label="Menüyü aç"
                className="xl:hidden p-2.5 rounded-xl border border-black/10 hover:border-green-500/30 hover:bg-green-50/50 transition-all duration-200"
                onClick={() => setOpen((s) => !s)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="xl:hidden border-t border-black/5 bg-white/95 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4 grid gap-1">
              {allNav.map((item: any) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-black/70 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50 transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-3 border-t border-black/5 mt-2">
                <Link
                  href="/giris-kayit"
                  className="flex-1 text-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-4 py-3 text-sm shadow-sm"
                  onClick={() => setOpen(false)}
                >
                  Giriş / Kayıt
                </Link>
                <Link
                  href="/magaza"
                  className="flex-1 text-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium px-4 py-3 text-sm shadow-sm"
                  onClick={() => setOpen(false)}
                >
                  Mağaza
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 🧲 CART DRAWER (sağdan kayar) */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        total={total}
        setQty={setQty}
        removeItem={removeItem}
      />
    </>
  );
}

/* ---------------- Drawer Bileşeni ---------------- */

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  items: Array<{
    productId: number;
    title: string;
    price: number;
    imageUrl?: string | null;
    code?: string | null;
    qty: number;
  }>;
  total: number;
  setQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
};

function CartDrawer({
  open,
  onClose,
  items,
  total,
  setQty,
  removeItem,
}: DrawerProps) {
  // dışa tıklama
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.backdrop === "1") onClose();
  };

  const hasItems = items.length > 0;

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
          {!hasItems && (
            <div className="text-center text-black/60 py-16">
              Sepetiniz boş.
            </div>
          )}

          {items.map((it) => (
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
                    onClick={() => setQty(it.productId, Math.max(1, it.qty - 1))}
                    aria-label="Azalt"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    value={it.qty}
                    onChange={(e) => {
                      const n = Number(String(e.target.value).replace(/\D/g, "")) || 1;
                      setQty(it.productId, Math.min(9999, Math.max(1, n)));
                    }}
                    className="text-black w-12 text-center text-sm outline-none"
                    inputMode="numeric"
                    aria-label="Adet"
                  />
                  <button
                    className="text-black p-1.5 hover:bg-black/5"
                    onClick={() => setQty(it.productId, Math.min(9999, it.qty + 1))}
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
                <div className="text-black text-sm font-bold">{fmtPrice(it.price * it.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/70">Ara Toplam</span>
            <span className="text-base font-bold text-black ">{fmtPrice(total)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/sepet"
              onClick={onClose}
              className="text-black text-center rounded-xl border border-black/10 hover:border-black/20 px-4 py-3 text-sm font-semibold"
            >
              Sepete Git
            </Link>
            <Link
              href="/odeme"
              onClick={onClose}
              className="text-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-3 text-sm font-semibold shadow"
            >
              Ödeme Yap
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
