"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";

const mainNav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/cesit-portfoyu", label: "Çeşit Portföyü" },
  { href: "/arge-sertifikalar", label: "Ar-Ge" },
  { href: "/izlenebilirlik", label: "İzlenebilirlik" },
];

const moreNav = [
  { href: "/surdurulebilirlik", label: "Sürdürülebilirlik" },
  { href: "/satis-kanallari", label: "Satış Kanalları" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/rfq", label: "RFQ Talebi" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/kvkk", label: "KVKK" },
];

const allNav = [...mainNav, ...moreNav];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 border-b border-black/5">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }} />
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0 group" aria-label="Seed World - Ana Sayfa">
            <Image src="/logo/logo_color.svg" alt="Seed World" width={55} height={55}
              className="rounded-md object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* desktop nav */}
          <nav className="hidden xl:flex items-center gap-6" aria-label="Ana menü">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-sm font-medium text-black/70 hover:text-black transition-colors whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-amber-600 hover:after:w-full after:transition-all after:duration-300">
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(v => !v)}
                onBlur={() => setMoreOpen(false)}
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                className="cursor-pointer text-sm font-medium text-black/70 hover:text-black flex items-center gap-1 whitespace-nowrap transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-amber-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Daha Fazla <ChevronDown size={16}
                  className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                role="menu"
                className={`absolute right-0 mt-3 w-56 rounded-xl border border-black/5 bg-white shadow-xl p-2 transition-all duration-200 ${moreOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                {moreNav.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem"
                    className="block px-4 py-2.5 text-sm text-black/70 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50 rounded-lg transition-all duration-200">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button aria-label="Ara"
              className="p-2.5 rounded-xl border border-black/10 hover:border-green-500/30 hover:bg-green-50/50 transition-all duration-200 group">
              <Search size={18} className="text-black/60 group-hover:text-green-600 transition-colors" />
            </button>

            <Link href="/sepet" aria-label="Sepet"
              className="relative p-2.5 rounded-xl border border-black/10 hover:border-amber-500/30 hover:bg-amber-50/50 transition-all duration-200 group">
              <ShoppingCart size={18} className="text-black/60 group-hover:text-amber-600 transition-colors" />
              <span className="absolute -top-1 -right-1 text-[10px] font-semibold leading-none rounded-full bg-gradient-to-r from-green-600 to-amber-600 text-white px-1.5 py-1 min-w-[18px] text-center shadow-lg">
                0
              </span>
            </Link>

            <Link href="/giris-kayit"
              className="hidden md:inline-flex items-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium px-4 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap">
              Giriş
            </Link>

            <Link href="/magaza"
              className="hidden lg:inline-flex items-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-medium px-4 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap">
              Mağaza
            </Link>

            <button aria-label="Menüyü aç"
              className="xl:hidden p-2.5 rounded-xl border border-black/10 hover:border-green-500/30 hover:bg-green-50/50 transition-all duration-200"
              onClick={() => setOpen(s => !s)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="xl:hidden border-t border-black/5 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-4 grid gap-1">
            {allNav.map((item) => (
              <Link key={item.href} href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-black/70 hover:text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-amber-50 transition-all duration-200"
                onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-black/5 mt-2">
              <Link href="/giris-kayit"
                className="flex-1 text-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-4 py-3 text-sm shadow-sm"
                onClick={() => setOpen(false)}>
                Giriş / Kayıt
              </Link>
              <Link href="/magaza"
                className="flex-1 text-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium px-4 py-3 text-sm shadow-sm"
                onClick={() => setOpen(false)}>
                Mağaza
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
