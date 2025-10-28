"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* --- API tipleri --- */
type Category = {
  id: number;
  name: string;
  description: string | null;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
  product_count?: number;
};

type Paged<T> = { data: T[]; page: number; limit: number; total: number };

/* --- ufak yardımcılar --- */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CategorySection() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("/api/category?limit=12&sort=created_at&order=desc", { cache: "no-store" });
        if (!res.ok) throw new Error(`Kategori listesi alınamadı (${res.status})`);
        const json = (await res.json()) as Paged<Category>;
        const active = (json.data || []).filter((c) => c.is_active === 1);
        if (!abort) setCats(active);
      } catch (e: any) {
        if (!abort) setErr(e?.message ?? "Kategoriler yüklenemedi");
        console.error(e);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  const visible = useMemo(() => {
    const otherVeg = cats.find(c => c.name === "Diğer Sebzeler");
    const others = cats.filter(c => c.name !== "Diğer Sebzeler");
    return [...others.slice(0, 11), otherVeg].filter(Boolean).slice(0, 12);
  }, [cats]);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Başlık satırı */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              Kategoriler
            </h2>
            <p className="mt-2 text-base text-gray-600">Öne çıkan kategorilerden birini seçin.</p>
          </div>

          <Link
            href="/magaza"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-6 py-3 text-sm font-medium text-white hover:from-[#1b7f3a] hover:to-[#27ae60] transition-all shadow-md hover:shadow-lg"
          >
            Tüm Ürünler
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {/* Yükleniyor iskeleti */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white animate-pulse shadow-sm"
              >
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="mt-auto h-10 bg-gray-100 rounded-md" />
                </div>
              </div>
            ))}

          {!loading && err && (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700 text-center font-medium">
              {err}
            </div>
          )}

          {!loading && !err && visible.map((c) => {
            const href = `/magaza?category=${encodeURIComponent(slugify(c.name))}`;
            return (
              <article
                key={c.id}
                className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:border-[#27ae60]/30"
              >
                {/* Görsel */}
                <div className="relative">
                  {c.image_path ? (
                    <img
                      src={c.image_path}
                      alt={c.name}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
                      Görsel yok
                    </div>
                  )}

                  {/* Ürün sayısı rozeti (sol üst) */}
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1">
                    {(c.product_count ?? 0).toLocaleString("tr-TR")} ürün
                  </div>

                  {/* OVERLAY İçerik */}
                  <div className="absolute inset-0 flex flex-col justify-end">
                    {/* üstten transparan → alta koyulaşan maske */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Başlık + açıklama */}
                    <div
                      className="relative z-10 px-6 pt-10 pb-4 text-white transition-transform duration-300 translate-y-6 group-hover:-translate-y-1"
                    >
                      <h3 className="text-lg font-bold drop-shadow-md line-clamp-1">{c.name}</h3>
                      {c.description && (
                        <p className="mt-1 text-sm text-white/90 line-clamp-2 drop-shadow">
                          {c.description}
                        </p>
                      )}
                    </div>

                    {/* CTA – başlangıçta gizli, hover’da alttan gelir */}
                    <div className="relative z-10 px-6 pb-6">
                      <Link
                        href={href}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-[#1b7f3a] hover:to-[#27ae60] hover:shadow-lg
                        opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
                      >
                        Ürünleri Gör
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {!loading && !err && visible.length === 0 && (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 text-center font-medium">
              Gösterilecek kategori bulunamadı.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
