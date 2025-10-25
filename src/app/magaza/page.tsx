// File: app/magaza/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  BadgePercent,
  Star,
  X,
  ChevronDown,
  Eye,
} from "lucide-react";

/* ---------------- Types ---------------- */

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  compareAt?: number;
  rating?: number; // 0..5
  badges?: string[]; // ["Heirloom", "Organik"]
  category: "Tohum" | "Set" | "Aksesuar";
};

/* ---------------- Dummy Data ----------------
 * Görselleri /public altına yerleştirin. */
const ALL_PRODUCTS: Product[] = [
  {
    id: "tomato-ayar",
    title: "Ayar Domates",
    subtitle: "Heirloom – orta sezon",
    image: "/images/shop/ayar.jpg",
    price: 149,
    compareAt: 189,
    rating: 4.7,
    badges: ["Heirloom", "İzlenebilir"],
    category: "Tohum",
  },
  {
    id: "pepper-kirmizi",
    title: "Kırmızı Biber",
    subtitle: "Tatlı – yüksek verim",
    image: "/images/shop/pepper.jpg",
    price: 129,
    rating: 4.5,
    badges: ["Organik", "Heirloom"],
    category: "Tohum",
  },
  {
    id: "seed-kit-mini",
    title: "SeedStart Mini Set",
    subtitle: "Toprak + tablet + 6 çeşit",
    image: "/images/shop/kit-mini.jpg",
    price: 349,
    compareAt: 399,
    rating: 4.6,
    badges: ["Başlangıç", "Hediye"],
    category: "Set",
  },
  {
    id: "seed-kit-pro",
    title: "SeedGrow Pro Set",
    subtitle: "12 çeşit + rehber + QR",
    image: "/images/shop/kit-pro.jpg",
    price: 799,
    rating: 4.9,
    badges: ["Premium", "İzlenebilir"],
    category: "Set",
  },
  {
    id: "gloves-eco",
    title: "Eco Eldiven",
    subtitle: "Nefes alan, yıkanabilir",
    image: "/images/shop/gloves.jpg",
    price: 89,
    rating: 4.2,
    badges: ["Aksesuar"],
    category: "Aksesuar",
  },
  {
    id: "labels-bamboo",
    title: "Bambu Etiket 20'li",
    subtitle: "Kompostlanabilir",
    image: "/images/shop/labels.jpg",
    price: 59,
    rating: 4.3,
    badges: ["Doğa Dostu"],
    category: "Aksesuar",
  },
];

const CATEGORIES: Array<Product["category"]> = ["Tohum", "Set", "Aksesuar"];

/* ---------------- Page ---------------- */

export default function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Product["category"] | "Hepsi">("Hepsi");
  const [sort, setSort] = useState<"popular" | "priceAsc" | "priceDesc">("popular");
  const [quickId, setQuickId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const products = useMemo(() => {
    let data = [...ALL_PRODUCTS];

    if (cat !== "Hepsi") data = data.filter((p) => p.category === cat);

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      data = data.filter((p) =>
        [p.title, p.subtitle, p.badges?.join(" ")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(qq)
      );
    }

    if (sort === "priceAsc") data.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") data.sort((a, b) => b.price - a.price);
    if (sort === "popular")
      data.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.price - b.price
      );

    return data;
  }, [q, cat, sort]);

  function addToCart(p: Product) {
    // Burada gerçek sepet API'nı çağırabilirsiniz.
    setCartCount((c) => c + 1);
  }

  const quick = ALL_PRODUCTS.find((p) => p.id === quickId) || null;

  return (
    <div className="min-h-screen bg-white">
      {/* Üst gradient şerit */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* Header Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Mağaza
          </h1>

          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold border-2 border-gray-200 shadow-sm">
            <ShoppingCart className="h-4 w-4 text-[#27ae60]" />
            <span className="text-gray-800">Sepet</span>
            <span className="ml-1 rounded-full bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-1.5">
              {cartCount}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Arama */}
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ürün ara (ör. domates, set, organik)"
              className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none transition-colors"
            />
          </label>

          {/* Kategori */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <FilterPill active={cat === "Hepsi"} onClick={() => setCat("Hepsi")}>
              Hepsi
            </FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </FilterPill>
            ))}
          </div>

          {/* Sıralama */}
          <div className="flex items-center justify-end">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="appearance-none rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 pr-9 hover:border-gray-300 focus:border-[#27ae60] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="popular">Popüler</option>
                <option value="priceAsc">Fiyat: Artan</option>
                <option value="priceDesc">Fiyat: Azalan</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard
                  p={p}
                  onAdd={() => addToCart(p)}
                  onQuick={() => setQuickId(p.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {products.length === 0 && (
            <div className="col-span-full rounded-3xl border-2 border-gray-200 bg-white p-6 text-gray-700">
              Aramanızla eşleşen ürün bulunamadı.
            </div>
          )}
        </section>

        {/* Kampanya şeridi */}
        <div className="mt-10 rounded-3xl border-2 border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <BadgePercent className="h-5 w-5 text-[#f39c12]" />
            <p>
              Sepette <b>3 ürün</b> ve üzeri alımlarda <b>%10</b> ek indirim! —{" "}
              <Link
                href="/satis-kanallari"
                className="font-semibold text-[#1b7f3a] hover:underline"
              >
                Satış kanallarını gör
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quick && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setQuickId(null)}
            />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="relative z-10 w-full max-w-2xl mx-auto rounded-3xl border-2 border-gray-200 bg-white p-6 md:p-8 shadow-2xl"
            >
              <button
                className="absolute right-4 top-4 rounded-full border-2 border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setQuickId(null)}
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border-2 border-gray-200">
                  <Image
                    src={quick.image}
                    alt={quick.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{quick.title}</h3>
                  {quick.subtitle && (
                    <p className="text-gray-600 mt-1">{quick.subtitle}</p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <PriceTag price={quick.price} compareAt={quick.compareAt} />
                    {typeof quick.rating === "number" && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-700">
                        <Star className="h-3.5 w-3.5 text-[#f39c12]" /> {quick.rating}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {quick.badges?.map((b) => (
                      <span
                        key={b}
                        className="rounded-full px-2.5 py-1 font-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(27,127,58,0.08) 0%, rgba(39,174,96,0.08) 100%)",
                          color: "#1b7f3a",
                          border: "1px solid #27ae60",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        addToCart(quick);
                        setQuickId(null);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-5 py-3 text-sm font-bold hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
                    >
                      <ShoppingCart className="h-4 w-4" /> Sepete Ekle
                    </button>
                    <Link
                      href={`/urun/${quick.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      Ürün Detayı
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- UI Bits ---------------- */

function FilterPill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${
        active
          ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-md"
          : "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function PriceTag({ price, compareAt }: { price: number; compareAt?: number }) {
  const hasDiscount = typeof compareAt === "number" && compareAt > price;
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-gray-900">
        {price.toFixed(2)} TL
      </span>
      {hasDiscount && (
        <span className="text-xs text-gray-500 line-through">
          {compareAt!.toFixed(2)} TL
        </span>
      )}
    </div>
  );
}

function ProductCard({
  p,
  onAdd,
  onQuick,
}: {
  p: Product;
  onAdd: () => void;
  onQuick: () => void;
}) {
  const discount = typeof p.compareAt === "number" && p.compareAt > p.price;
  return (
    <article className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl hover:border-[#27ae60] transition-all">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {discount && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-2 py-0.5 text-[11px] font-extrabold shadow">
            <BadgePercent className="h-3.5 w-3.5" /> İndirim
          </div>
        )}

        <button
          onClick={onQuick}
          className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg border-2 border-white/80 bg-white/95 px-2 py-1 text-[11px] font-semibold text-gray-900 shadow hover:bg-white"
        >
          <Eye className="h-3.5 w-3.5" /> Hızlı Bakış
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-base md:text-lg font-bold text-gray-900">{p.title}</h3>
        {p.subtitle && <p className="text-xs text-gray-600 mt-0.5">{p.subtitle}</p>}

        <div className="mt-2 flex items-center gap-2">
          <PriceTag price={p.price} compareAt={p.compareAt} />
          {typeof p.rating === "number" && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-700">
              <Star className="h-3.5 w-3.5 text-[#f39c12]" /> {p.rating}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {p.badges?.map((b, i) => (
            <span
              key={b}
              className="font-semibold px-2 py-0.5 rounded-full"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, rgba(27,127,58,0.08) 0%, rgba(39,174,96,0.08) 100%)"
                    : "linear-gradient(135deg, rgba(243,156,18,0.08) 0%, rgba(211,84,0,0.08) 100%)",
                color: i % 2 === 0 ? "#1b7f3a" : "#d35400",
                border: `1px solid ${i % 2 === 0 ? "#27ae60" : "#f39c12"}`,
              }}
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onAdd}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-4 py-2.5 text-sm font-bold hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
          >
            <ShoppingCart className="h-4 w-4" /> Sepete Ekle
          </button>
          <Link
            href={`/urun/${p.id}`}
            className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            İncele
          </Link>
        </div>
      </div>
    </article>
  );
}
