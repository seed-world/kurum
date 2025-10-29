// app/magaza/kategori-urunler/KategoriUrunlerWrapper.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, ShoppingCart, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";

type Category = {
  id: number;
  name: string;
  image_path: string | null;
  description: string | null;
};

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
  is_featured: 0 | 1;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
  image_path?: string | null;
  rating_avg?: number;
  rating_count?: number;
};

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  rating: number;
  ratingCount: number;
  badges?: string[];
  featured: boolean;
  imageUrl?: string | null;
  raw: ApiProduct;
};

type Paged<T> = { data: T[]; page: number; limit: number; total: number };

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

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

/* ---------------- Mapping: API → UI ---------------- */
function mapApiToShop(p: ApiProduct): Product | null {
  if (p.is_active === 0) return null;
  const title = [p.product_type, p.variety].filter(Boolean).join(" • ");
  const subtitle =
    p.sub_type ||
    p.region ||
    (p.code ? `Kod: ${p.code}` : undefined) ||
    undefined;
  const price =
    typeof p.seedling_unit_price === "number" && !Number.isNaN(p.seedling_unit_price)
      ? Number(p.seedling_unit_price)
      : 0;
  const compareAt = price > 0 ? Math.round(price * 1.15) : undefined;
  const badges: string[] = [];
  if (p.region) badges.push(p.region);
  if (p.sub_type) badges.push(p.sub_type);
  if (p.germination_start_year) badges.push(String(p.germination_start_year));
  const rating = Number.isFinite(p.rating_avg as number) ? Number(p.rating_avg) : 0;
  const ratingCount = Number.isFinite(p.rating_count as number)
    ? Number(p.rating_count)
    : 0;

  return {
    id: `db-${p.id}`,
    title: title || p.code || `Ürün #${p.id}`,
    subtitle,
    price,
    compareAt,
    rating,
    ratingCount,
    badges,
    featured: p.is_featured === 1,
    imageUrl: p.image_path || null,
    raw: p,
  };
}

/* ---------------- Stars ---------------- */
function Stars({
  value,
  size = 16,
  showLabel = true,
  count,
}: {
  value: number;
  size?: number;
  showLabel?: boolean;
  count?: number;
}) {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
  const pct = (safe / 5) * 100;

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className="relative inline-block align-middle"
        style={{ width: size * 5, height: size }}
        aria-label={`Puan: ${safe.toFixed(1)} / 5`}
        title={`${safe.toFixed(1)} / 5`}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={`g-${i}`}
              className="w-[inherit] h-[inherit] text-gray-300"
              style={{ width: size, height: size }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`f-${i}`}
                className="w-[inherit] h-[inherit] text-[#f39c12] fill-[#f39c12]"
                style={{ width: size, height: size }}
              />
            ))}
          </div>
        </div>
      </div>
      {showLabel && (
        <span className="text-sm text-gray-700">
          {safe.toFixed(1)}
          {typeof count === "number" ? (
            <span className="text-gray-500">
              {" "}
              ({Intl.NumberFormat("tr-TR").format(count)})
            </span>
          ) : null}
        </span>
      )}
    </div>
  );
}

/* ---------------- Ürün Kartı ---------------- */
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
    <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:border-[#27ae60]/30">
      {/* Görsel */}
      <div className="relative">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
            Görsel yok
          </div>
        )}

        {/* Fiyat rozeti */}
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1">
          {fmtPrice(p.price)}
        </div>

        {/* Öne çıkan */}
        {p.featured && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[#27ae60] text-white text-[11px] font-semibold px-2 py-1 shadow-sm">
            ÖNE ÇIKAN
          </span>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Metin */}
          <div className="relative z-10 px-6 pt-10 pb-4 text-white transition-transform duration-300 translate-y-6 group-hover:-translate-y-1">
            <h3 className="text-lg font-bold drop-shadow-md line-clamp-1">
              {p.title}
            </h3>
            {p.subtitle && (
              <p className="mt-1 text-sm text-white/90 line-clamp-2 drop-shadow">
                {p.subtitle}
              </p>
            )}
            <div className="mt-2 mb-2">
              <Stars value={p.rating} count={p.ratingCount} size={14} />
            </div>
          </div>

          {/* CTA */}
          <div className="relative z-10 px-6 pb-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onAdd}
                className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-white/90 text-gray-900 px-4 py-2 text-sm font-medium shadow-md transition-all hover:bg-white"
              >
                Sepete Ekle
              </button>

              <Link
                href={`/magaza/urun-detay?id=${encodeURIComponent(p.raw.id)}`}
                prefetch
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-[#1b7f3a] hover:to-[#27ae60] hover:shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
              >
                Detaylı İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------- ANA WRAPPER ---------------- */
export default function KategoriUrunlerWrapper() {
  const sp = useSearchParams();
  const wantedSlug = (sp.get("category") || "").trim();

  const [cats, setCats] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catErr, setCatErr] = useState("");

  const [prods, setProds] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [quickId, setQuickId] = useState<string | null>(null);

  const { addItem } = useCart();

  // 1) Kategorileri çek
  useEffect(() => {
    let abort = false;
    (async () => {
      setCatLoading(true);
      setCatErr("");
      try {
        const res = await fetch("/api/category?limit=999&order=asc", {
          cache: "no-store",
        });
        const j = (await res.json()) as Paged<Category>;
        if (!abort) setCats(j.data || []);
      } catch (e: any) {
        if (!abort) setCatErr(e?.message || "Kategori hatası");
      } finally {
        if (!abort) setCatLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  const activeCategory = useMemo(() => {
    if (!wantedSlug) return null;
    return cats.find((c) => slugify(c.name) === wantedSlug) || null;
  }, [cats, wantedSlug]);

  // 2) Ürünleri kategori_id ile çek
  useEffect(() => {
    if (!activeCategory) return;
    let abort = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `/api/products?limit=24&order=desc&sort=created_at&category_id=${activeCategory.id}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Ürün listesi alınamadı (${res.status})`);
        const j = (await res.json()) as Paged<ApiProduct>;
        if (!abort) setProds(j.data || []);
      } catch (e: any) {
        if (!abort) setErr(e?.message || "Ürünler yüklenemedi");
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [activeCategory]);

  const products = useMemo(
    () => prods.map(mapApiToShop).filter((x): x is Product => !!x),
    [prods]
  );

  const quick = products.find((p) => p.id === quickId) || null;

  function addToCart(p: Product) {
    addItem({
      productId: p.raw.id,
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl ?? null,
      code: p.raw.code,
      qty: 1,
    });
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              {activeCategory ? activeCategory.name : "Mağaza"}
            </h1>
            <p className="mt-2 text-base text-gray-600">
              {activeCategory?.description || "Seçilen kategoriye ait ürünler listelenir."}
            </p>
          </div>
          <Link
            href="/magaza"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-6 py-3 text-sm font-medium text-white hover:from-[#1b7f3a] hover:to-[#27ae60] transition-all shadow-md hover:shadow-lg"
          >
            Tüm Kategoriler
          </Link>
        </div>

        {/* Kategori yükleniyor / bulunamadı */}
        {catLoading && (
          <div className="text-gray-500 text-center py-20">
            Kategoriler yükleniyor…
          </div>
        )}
        {!catLoading && wantedSlug && !activeCategory && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700 text-center">
            Aranan kategori bulunamadı.
          </div>
        )}

        {/* Ürünler */}
        {activeCategory && (
          <div>
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full rounded-2xl border bg-white p-4 animate-pulse shadow-sm"
                  >
                    <div className="aspect-[4/3] bg-gray-100 rounded-xl" />
                    <div className="mt-4 h-6 bg-gray-100 rounded w-2/3" />
                    <div className="mt-2 h-4 bg-gray-100 rounded w-1/3" />
                    <div className="mt-4 h-10 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {!loading && err && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700 text-center">
                {err}
              </div>
            )}

            {!loading && !err && products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onAdd={() => addToCart(p)}
                    onQuick={() => setQuickId(p.id)}
                  />
                ))}
              </div>
            ) : (
              !loading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 text-center">
                  Bu kategoride ürün bulunamadı.
                </div>
              )
            )}
          </div>
        )}

        {/* Quick View Dialog */}
        <AnimatePresence>
          {quick && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
                onClick={() => setQuickId(null)}
              />
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-3xl border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col ring-1 ring-[#27ae60]/10"
              >
                {/* Header */}
                <div className="flex-shrink-0 flex items-start justify-between p-4 sm:p-6 border-b border-gray-100/50 bg-gradient-to-b from-white to-gray-50">
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate tracking-tight">
                      {quick.title}
                    </h3>
                    <div className="mt-2">
                      <Stars value={quick.rating} count={quick.ratingCount} size={16} />
                    </div>
                  </div>
                  <div className="hidden lg:block space-y-3">
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="text-3xl font-bold text-[#27ae60]">
                        {fmtPrice(quick.price)}
                      </span>
                      {quick.compareAt && quick.compareAt > quick.price && (
                        <span className="text-base text-gray-500 line-through">
                          {fmtPrice(quick.compareAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="cursor-pointer flex-shrink-0 rounded-full bg-gray-100/50 p-2 text-gray-600 hover:bg-gray-200/50 transition-colors"
                    onClick={() => setQuickId(null)}
                    aria-label="Kapat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* İçerik */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Görsel */}
                      <div className="flex flex-col gap-4">
                        {quick.imageUrl ? (
                          <img
                            src={quick.imageUrl}
                            alt={quick.title}
                            loading="eager"
                            className="w-full aspect-[4/3] object-cover rounded-2xl border border-gray-200/50 shadow-md hover:shadow-lg transition-shadow"
                          />
                        ) : (
                          <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300/50 bg-gray-50/50 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">Görsel yok</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Detaylar */}
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(
                            [
                              ["Ürün Tipi", quick.raw.product_type],
                              ["Varyete", quick.raw.variety],
                              ["Alt Tip", quick.raw.sub_type],
                              ["Kod", quick.raw.code],
                              ["Bölge", quick.raw.region],
                              ["Çimlenme Yılı", fmtYear(quick.raw.germination_start_year)],
                              ["Öne Çıkan", quick.featured ? "Evet" : "Hayır"],
                            ] as Array<[string, any]>
                          ).map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-white/50 p-4 hover:border-[#27ae60]/40 hover:shadow-md transition-all"
                            >
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {label}
                              </div>
                              <div className="text-base font-bold text-gray-900 mt-1 truncate">
                                {value ?? "—"}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200/50 pb-2">
                            Detaylı Bilgiler
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(
                              [
                                ["Seeds 2023", fmtNumber(quick.raw.seeds_2023)],
                                ["Seeds 2024", fmtNumber(quick.raw.seeds_2024)],
                                ["Seeds 2025", fmtNumber(quick.raw.seeds_2025_expected)],
                                ["Büyüme Katsayısı", fmtNumber(quick.raw.annual_growth_factor)],
                                ["Birim Fiyat", fmtPrice(quick.raw.seedling_unit_price ?? null)],
                                ["Değer 2023", fmtPrice(quick.raw.asset_value_2023)],
                                ["Değer 2024", fmtPrice(quick.raw.asset_value_2024)],
                                ["Değer 2025", fmtPrice(quick.raw.asset_value_2025)],
                              ] as Array<[string, any]>
                            ).map(([label, value]) => (
                              <div
                                key={label}
                                className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-white/50 p-4 hover:border-[#27ae60]/40 hover:shadow-md transition-all"
                              >
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  {label}
                                </div>
                                <div className="text-base font-bold text-gray-900 mt-1 truncate">
                                  {value ?? "—"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-gray-100/50 p-4 sm:p-6 bg-gradient-to-t from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        if (quick) addToCart(quick);
                        setQuickId(null);
                      }}
                      className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] text-white px-6 py-3 text-sm font-semibold hover:shadow-xl hover:scale-[1.02] transition-all shadow-md"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}