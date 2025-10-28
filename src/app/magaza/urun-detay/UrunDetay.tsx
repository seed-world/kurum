"use client";

import { useEffect, useState } from "react";
import {
  Star, Eye, Leaf, Package, TrendingUp, Calendar, MapPin, Award,
  ChevronRight, ShoppingCart
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

/* --- Tipler --- */
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
  category_id?: number | null;
  category_name?: string | null;
};

/* --- Format Fonksiyonları --- */
function fmtNumber(val: unknown) {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") return Intl.NumberFormat("tr-TR").format(val);
  return String(val);
}
function fmtPrice(n?: number | null) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return `${f} ₺`;
}
function fmtYear(n?: number | null) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return String(Math.trunc(Number(n)));
}

/* --- Yıldız Bileşeni --- */
function Stars({ value, count, size = 18 }: { value: number; count?: number; size?: number }) {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
  const pct = (safe / 5) * 100;

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative" style={{ width: size * 5, height: size }}>
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={`g-${i}`} className="text-gray-300" style={{ width: size, height: size }} />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={`f-${i}`} className="text-emerald-500 fill-emerald-500" style={{ width: size, height: size }} />
            ))}
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700">
        {safe.toFixed(1)}
        {typeof count === "number" ? (
          <span className="text-gray-500 font-normal"> ({Intl.NumberFormat("tr-TR").format(count)})</span>
        ) : null}
      </span>
    </div>
  );
}

/* --- Detay Komponenti --- */
export default function UrunDetay({ id }: { id: number }) {
  const [data, setData] = useState<ApiProduct | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState<number>(1);

  const { addItem } = useCart();

  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Ürün bulunamadı (${res.status})`);
        const json = await res.json();
        const p: ApiProduct = json?.data ?? json;
        if (!abort) setData(p);
      } catch (e: any) {
        if (!abort) setErr(e?.message ?? "Ürün getirilemedi");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (err) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-red-700 bg-red-50 border border-red-200 rounded-2xl">
        {err}
      </div>
    );
  }
  if (!data) return null;

  const title = [data.product_type, data.variety].filter(Boolean).join(" • ") || data.code || `Ürün #${data.id}`;
  const price = data.seedling_unit_price ?? 0;
  const rating = Number.isFinite(data.rating_avg as number) ? Number(data.rating_avg) : 0;
  const ratingCount = Number.isFinite(data.rating_count as number) ? Number(data.rating_count) : 0;
  const categoryName = (data.category_name && data.category_name.trim()) ? data.category_name : data.product_type;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(9999, q + 1));
  const onQtyChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const n = raw === "" ? NaN : Number(raw);
    if (Number.isNaN(n)) setQty(1);
    else setQty(Math.min(9999, Math.max(1, n)));
  };

  const onAddToCart = () => {
    addItem({
      productId: data.id,
      title,
      price,
      imageUrl: data.image_path ?? null,
      code: data.code,
      qty,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Dekoratif arka plan */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-green-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-emerald-600 transition-colors">Ana Sayfa</a>
          <ChevronRight className="h-4 w-4" />
          <a href="/magaza" className="hover:text-emerald-600 transition-colors">Mağaza</a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </nav>

        {/* Ana içerik grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sol - Görsel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 z-10">
              {data.image_path ? (
                <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5">
                  <img
                    src={data.image_path}
                    alt={title}
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {data.is_featured === 1 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                        <Award className="h-4 w-4" />
                        Öne Çıkan
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-400 shadow-inner">
                  <Eye className="h-20 w-20 mb-4 opacity-30" />
                  <p className="text-lg font-semibold">Görsel Yok</p>
                  <p className="text-sm mt-2">Bu ürün için görsel eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ - Detaylar */}
          <div className="lg:col-span-7 space-y-6">
            {/* Başlık, kategori ve puan */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg ring-1 ring-gray-900/5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {categoryName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    <Leaf className="h-3.5 w-3.5" />
                    {categoryName}
                  </span>
                )}
                {data.code && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Package className="h-3.5 w-3.5" />
                    {data.code}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>

              <div className="mt-4">
                <Stars value={rating} count={ratingCount} size={20} />
              </div>

              {/* Fiyat */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center">
                <p className="text-sm font-semibold text-emerald-50 uppercase tracking-wide">Birim Fiyat</p>
                <p className="text-4xl md:text-5xl font-bold text-white mt-2">{fmtPrice(price)}</p>
              </div>

              {/* Adet Seçici + CTA */}
              <div className="mt-6 flex items-stretch gap-3">
                <div className="inline-flex items-center rounded-2xl border border-emerald-200 bg-emerald-50/40 overflow-hidden">
                  <button type="button" onClick={dec} className="px-4 py-3 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition" aria-label="Azalt">−</button>
                  <input
                    value={qty}
                    onChange={onQtyChange}
                    inputMode="numeric"
                    className="w-16 text-center font-semibold text-gray-900 bg-transparent outline-none"
                    aria-label="Adet"
                  />
                  <button type="button" onClick={inc} className="px-4 py-3 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition" aria-label="Artır">+</button>
                </div>

                <button
                  onClick={onAddToCart}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Sepete Ekle
                </button>
              </div>
            </div>

            {/* Temel Bilgiler */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg ring-1 ring-gray-900/5">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                Temel Bilgiler
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Kategori", value: categoryName, icon: Leaf },
                  { label: "Ürün Tipi", value: data.product_type, icon: Leaf },
                  { label: "Varyete", value: data.variety, icon: Leaf },
                  { label: "Bölge", value: data.region, icon: MapPin },
                  { label: "Çimlenme Yılı", value: fmtYear(data.germination_start_year), icon: Calendar },
                  { label: "Alt Tip", value: data.sub_type || "—", icon: Package },
                  { label: "Durum", value: data.is_active === 1 ? "Aktif" : "Pasif", icon: null },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:border-emerald-300 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          {Icon && <Icon className="h-4 w-4 text-emerald-600" />}
                          <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 truncate">{value || "—"}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stok ve Değer Bilgileri */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg ring-1 ring-gray-900/5">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="p-2 bg-teal-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                </div>
                Stok ve Değer Takibi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "2023 Tohum", value: fmtNumber(data.seeds_2023), color: "blue" },
                  { label: "2024 Tohum", value: fmtNumber(data.seeds_2024), color: "blue" },
                  { label: "2025 Beklenen", value: fmtNumber(data.seeds_2025_expected), color: "blue" },
                  { label: "Büyüme Faktörü", value: fmtNumber(data.annual_growth_factor), color: "purple" },
                  { label: "Değer 2023", value: fmtPrice(data.asset_value_2023), color: "emerald" },
                  { label: "Değer 2024", value: fmtPrice(data.asset_value_2024), color: "emerald" },
                  { label: "Değer 2025", value: fmtPrice(data.asset_value_2025), color: "emerald" },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-2xl bg-gradient-to-br from-${color}-50 to-white p-4 border border-${color}-100`}>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-lg font-bold text-${color}-700`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* --- Loading Skeleton --- */
function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 h-4 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse shadow-xl" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-14 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
