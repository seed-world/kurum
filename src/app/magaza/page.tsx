"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search as SearchIcon, Star, X, Eye } from "lucide-react";

/* ---------------- Types ---------------- */
type ApiProduct = {
  id: number;
  product_type: string;
  variety: string;
  sub_type: string | null;
  code: string;
  region: string | null;
  germination_start_year: number | null;
  seeds_2023: number | null;
  seeds_2024: number | null;
  seeds_2025_expected: number | null;
  annual_growth_factor: number | null;
  seedling_unit_price: number | null;
  asset_value_2023: number | null;
  asset_value_2024: number | null;
  asset_value_2025: number | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  rating?: number; // 0..5
  badges?: string[];
  raw: ApiProduct; // dialog için tüm veriler burada
};

/* ---------------- Mapping: API → Shop Product ---------------- */
function mapApiToShop(p: ApiProduct): Product | null {
  if (p.is_active === 0) return null;

  const title = [p.product_type, p.variety].filter(Boolean).join(" • ");
  const subtitle =
    p.sub_type || p.region || (p.code ? `Kod: ${p.code}` : undefined) || undefined;

  const price =
    typeof p.seedling_unit_price === "number" && !Number.isNaN(p.seedling_unit_price)
      ? Number(p.seedling_unit_price)
      : 0;

  const compareAt = price > 0 ? Math.round(price * 1.15) : undefined;

  const badges: string[] = [];
  if (p.region) badges.push(p.region);
  if (p.sub_type) badges.push(p.sub_type);
  if (p.germination_start_year) badges.push(String(p.germination_start_year)); // yıl string olarak

  return {
    id: `db-${p.id}`,
    title: title || p.code || `Ürün #${p.id}`,
    subtitle,
    price,
    compareAt,
    rating: undefined,
    badges,
    raw: p,
  };
}

/* ---------------- Helpers ---------------- */
function fmtNumber(val: unknown) {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") return Intl.NumberFormat("tr-TR").format(val);
  return String(val);
}
function fmtPrice(n?: number | null) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const formatted = Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${formatted} ₺`;
}
function fmtYear(n?: number | null) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return String(Math.trunc(Number(n)));
}

/* ---------------- Page ---------------- */
export default function ShopPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"popular" | "priceAsc" | "priceDesc">("popular");
  const [quickId, setQuickId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/products?limit=200&sort=created_at&order=desc", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Ürün listesi alınamadı (${res.status})`);
        const json = (await res.json()) as { data: ApiProduct[] };
        const mapped = (json.data || []).map(mapApiToShop).filter((x): x is Product => !!x);
        if (!abort) setDbProducts(mapped);
      } catch (e) {
        console.error("Mağaza: ürünler çekilemedi:", e);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, []);

  const products = useMemo(() => {
    let data = [...dbProducts];

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      data = data.filter((p) =>
        [p.title, p.subtitle, p.badges?.join(" "), p.raw.code, p.raw.product_type, p.raw.variety]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(qq)
      );
    }

    if (sort === "priceAsc") data.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") data.sort((a, b) => b.price - a.price);
    if (sort === "popular")
      data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.price - b.price);

    return data;
  }, [q, sort, dbProducts]);

  function addToCart(_p: Product) {
    setCartCount((c) => c + 1);
  }

  const quick = products.find((p) => p.id === quickId) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst gradient şerit (İzlenebilirlik ile uyumlu) */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Mağaza
          </h1>

          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium border border-gray-200 shadow-sm">
            <ShoppingCart className="h-4 w-4 text-[#27ae60]" />
            <span className="text-gray-700">Sepet</span>
            <span className="ml-1 rounded-full bg-[#27ae60] text-white px-1.5">{cartCount}</span>
          </div>
        </div>

        {/* Arama & Sıralama */}
        <div className="grid gap-3 md:grid-cols-3 mb-8">
          <label className="relative block md:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ürün ara (örn. domates, biber, kod)"
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
            />
          </label>
     
        </div>

        {/* Grid */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard p={p} onAdd={() => addToCart(p)} onQuick={() => setQuickId(p.id)} />
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && products.length === 0 && (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 text-gray-600 text-center">
              Aramanızla eşleşen ürün bulunamadı.
            </div>
          )}

          {loading && (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 text-gray-600 text-center">
              Yükleniyor…
            </div>
          )}
        </section>
      </main>

      {/* Dialog (Detaylı İncele) */}
      <AnimatePresence>
        {quick && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setQuickId(null)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="relative z-10 w-full max-w-4xl mx-4 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-xl"
            >
              <button
                className="cursor-pointer absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => setQuickId(null)}
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Başlık + fiyat */}
              <div className="space-y-2 pr-8">
                <h3 className="text-3xl font-semibold text-gray-900">{quick.title}</h3>
                {quick.subtitle && <p className="text-gray-500">{quick.subtitle}</p>}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-2xl font-bold text-gray-900">{fmtPrice(quick.price)}</span>
                  {typeof quick.rating === "number" && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-[#f39c12]" /> {quick.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Badgeler */}
              {quick.badges && quick.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {quick.badges.map((b, i) => (
                    <span
                      key={`${quick.id}-dlg-${b}-${i}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* TÜM VERİLER (grid) */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Tüm Alanlar</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(
                    [
                      ["Ürün Tipi", quick.raw.product_type],
                      ["Varyete", quick.raw.variety],
                      ["Alt Tip", quick.raw.sub_type],
                      ["Kod", quick.raw.code],
                      ["Bölge", quick.raw.region],
                      ["Çimlenme Başlangıç Yılı", fmtYear(quick.raw.germination_start_year)],
                      ["Seeds 2023", fmtNumber(quick.raw.seeds_2023)],
                      ["Seeds 2024", fmtNumber(quick.raw.seeds_2024)],
                      ["Seeds 2025 (Beklenen)", fmtNumber(quick.raw.seeds_2025_expected)],
                      ["Yıllık Büyüme Katsayısı", fmtNumber(quick.raw.annual_growth_factor)],
                      ["Fide Birim Fiyatı", fmtPrice(quick.raw.seedling_unit_price ?? null)],
                      ["Varlık Değeri 2023", fmtPrice(quick.raw.asset_value_2023)],
                      ["Varlık Değeri 2024", fmtPrice(quick.raw.asset_value_2024)],
                      ["Varlık Değeri 2025", fmtPrice(quick.raw.asset_value_2025)],
                    ] as Array<[string, any]>
                  ).map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
                      <div className="text-sm font-semibold text-gray-900 mt-1">{value ?? "—"}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    addToCart(quick);
                    setQuickId(null);
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#27ae60] text-white px-6 py-3 text-sm font-medium hover:bg-[#1b7f3a] transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" /> Sepete Ekle
                </button>
                <button
                  onClick={() => setQuickId(null)}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- UI Bits ---------------- */
function PriceTag({ price }: { price: number }) {
  const formatted = Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-gray-900">{formatted} ₺</span>
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
  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md hover:border-[#27ae60]/20">
      {/* Görsel alanı (görselsiz minimalist blok) */}
      <div className="h-48 w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center px-6">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            {p.title}
          </h3>
          {p.subtitle && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.subtitle}</p>}
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <PriceTag price={p.price} />
          {typeof p.rating === "number" && (
            <span className="ml-auto inline-flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-4 w-4 text-[#f39c12]" /> {p.rating}
            </span>
          )}
        </div>

        {p.badges && p.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.badges.slice(0, 4).map((b, i) => (
              <span
                key={`${p.id}-${b}-${i}`}
                className="font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onAdd}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#27ae60] text-white px-4 py-2 text-sm font-medium hover:bg-[#1b7f3a] transition-colors"
          >
            <ShoppingCart className="h-4 w-4" /> Sepete Ekle
          </button>
          <button
            onClick={onQuick}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Detaylı İncele
          </button>
        </div>
      </div>
    </article>
  );
}