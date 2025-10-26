// File: src/app/admin/products/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
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

type Paged<T> = { data: T[]; page: number; limit: number; total: number };

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Paged<Product>>({ data: [], page: 1, limit, total: 0 });

  const query = useMemo(() => {
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("limit", String(limit));
    if (search.trim()) q.set("search", search.trim());
    q.set("sort", "created_at");
    q.set("order", "desc");
    return q.toString();
  }, [page, limit, search]);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?${query}`, { cache: "no-store" });
      if (!res.ok) {
        // JSON dönmeyebilir (Next hata sayfası), önce text dene
        let msg = `Liste hatası (${res.status})`;
        try {
          const txt = await res.text();
          msg = (() => {
            try { return JSON.parse(txt)?.error ?? msg; } catch { return txt.slice(0, 200); }
          })();
        } catch { }
        throw new Error(msg);
      }
      const json = await res.json();
      setList(json);
    } catch (e: any) {
      console.error("fetchList failed:", e);
      // üstte kırmızı kutuda göstermek istersen state tutabilirsin
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const [form, setForm] = useState({
    product_type: "",
    variety: "",
    sub_type: "",
    code: "",
    region: "",
    germination_start_year: "",
    seeds_2023: "",
    seeds_2024: "",
    seeds_2025_expected: "",
    annual_growth_factor: "",
    seedling_unit_price: "",
    asset_value_2023: "",
    asset_value_2024: "",
    asset_value_2025: "",
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function toNumberSafe(v: string) {
    // "1.472.926" -> 1472926 , "39,50" -> 39.50
    const cleaned = v.replace(/\s/g, "");
    if (/[,]/.test(cleaned) && !/[.]/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, "").replace(",", "."));
    }
    if (/[.]/.test(cleaned) && /,/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, "").replace(",", "."));
    }
    return Number(cleaned.replace(/[^\d.]/g, ""));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const payload: any = {
        product_type: form.product_type || null,
        variety: form.variety || null,
        sub_type: form.sub_type || null,
        code: form.code || null,
        region: form.region || null,
        germination_start_year: form.germination_start_year ? Number(form.germination_start_year) : null,
        seeds_2023: form.seeds_2023 ? toNumberSafe(form.seeds_2023) : null,
        seeds_2024: form.seeds_2024 ? toNumberSafe(form.seeds_2024) : null,
        seeds_2025_expected: form.seeds_2025_expected ? toNumberSafe(form.seeds_2025_expected) : null,
        annual_growth_factor: form.annual_growth_factor ? Number(form.annual_growth_factor) : null,
        seedling_unit_price: form.seedling_unit_price ? toNumberSafe(form.seedling_unit_price) : null,
        asset_value_2023: form.asset_value_2023 ? toNumberSafe(form.asset_value_2023) : null,
        asset_value_2024: form.asset_value_2024 ? toNumberSafe(form.asset_value_2024) : null,
        asset_value_2025: form.asset_value_2025 ? toNumberSafe(form.asset_value_2025) : null,
        is_active: 1
      };

      if (form.sub_type) payload.sub_type = form.sub_type;
      if (form.region) payload.region = form.region;
      if (form.germination_start_year) payload.germination_start_year = Number(form.germination_start_year);

      const s2023 = form.seeds_2023 ? toNumberSafe(form.seeds_2023) : undefined;
      const s2024 = form.seeds_2024 ? toNumberSafe(form.seeds_2024) : undefined;
      const s2025 = form.seeds_2025_expected ? toNumberSafe(form.seeds_2025_expected) : undefined;
      const price = form.seedling_unit_price ? toNumberSafe(form.seedling_unit_price) : undefined;

      if (s2023 !== undefined) payload.seeds_2023 = s2023;
      if (s2024 !== undefined) payload.seeds_2024 = s2024;
      if (s2025 !== undefined) payload.seeds_2025_expected = s2025;

      if (form.annual_growth_factor) payload.annual_growth_factor = Number(form.annual_growth_factor);
      if (price !== undefined) payload.seedling_unit_price = price;

      // Varlık değerleri: girilirse kullan; boşsa otomatik hesapla (seeds * price)
      const a2023 = form.asset_value_2023 ? toNumberSafe(form.asset_value_2023) : (s2023 !== undefined && price !== undefined ? s2023 * price : undefined);
      const a2024 = form.asset_value_2024 ? toNumberSafe(form.asset_value_2024) : (s2024 !== undefined && price !== undefined ? s2024 * price : undefined);
      const a2025 = form.asset_value_2025 ? toNumberSafe(form.asset_value_2025) : (s2025 !== undefined && price !== undefined ? s2025 * price : undefined);

      if (a2023 !== undefined) payload.asset_value_2023 = a2023;
      if (a2024 !== undefined) payload.asset_value_2024 = a2024;
      if (a2025 !== undefined) payload.asset_value_2025 = a2025;

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Kayıt başarısız");

      setForm({
        product_type: "", variety: "", sub_type: "", code: "", region: "",
        germination_start_year: "", seeds_2023: "", seeds_2024: "", seeds_2025_expected: "",
        annual_growth_factor: "", seedling_unit_price: "",
        asset_value_2023: "", asset_value_2024: "", asset_value_2025: ""
      });
      await fetchList();
    } catch (e: any) {
      setErr(e?.message ?? "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              placeholder="Ara: tür, çeşit, bölge, kod..."
              className="w-80 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
            />
          </div>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Hızlı Ürün Ekle</h2>
          {err && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{err}</div>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Ürün Türü *" value={form.product_type} onChange={e => setForm({ ...form, product_type: e.target.value })} required />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Çeşit *" value={form.variety} onChange={e => setForm({ ...form, variety: e.target.value })} required />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Alt Tür" value={form.sub_type} onChange={e => setForm({ ...form, sub_type: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Kod * (örn: GNAYC-01)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Bölgesi" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Çim. Başlangıç Yılı (örn: 2022)" value={form.germination_start_year} onChange={e => setForm({ ...form, germination_start_year: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="2023 Tohum Adedi" value={form.seeds_2023} onChange={e => setForm({ ...form, seeds_2023: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="2024 Üretilen Tohum Sayısı" value={form.seeds_2024} onChange={e => setForm({ ...form, seeds_2024: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="2025 Beklenen Tohum Adedi" value={form.seeds_2025_expected} onChange={e => setForm({ ...form, seeds_2025_expected: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Yıllık Artış Katsayısı" value={form.annual_growth_factor} onChange={e => setForm({ ...form, annual_growth_factor: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Fide Birim Fiyatı (₺)" value={form.seedling_unit_price} onChange={e => setForm({ ...form, seedling_unit_price: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Varlık Değeri 2023 (₺)" value={form.asset_value_2023} onChange={e => setForm({ ...form, asset_value_2023: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Varlık Değeri 2024 (₺)" value={form.asset_value_2024} onChange={e => setForm({ ...form, asset_value_2024: e.target.value })} />
            <input className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all" placeholder="Varlık Değeri 2025 (₺)" value={form.asset_value_2025} onChange={e => setForm({ ...form, asset_value_2025: e.target.value })} />
          </div>
          <button disabled={saving} className="mt-4 rounded-lg bg-[#27ae60] px-6 py-3 text-white font-medium hover:bg-[#1b7f3a] disabled:opacity-50 transition-colors">
            {saving ? "Kaydediliyor..." : "Ekle"}
          </button>
        </form>

        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">ID</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Tür</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Çeşit</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Alt Tür</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Kod</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Bölge</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Yıl (Çim.)</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">2023</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">2024</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">2025 Bekl.</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Artış</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Fide ₺</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Varlık 2023</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Varlık 2024</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Varlık 2025</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td className="py-4 px-4 text-center text-gray-500" colSpan={16}>Yükleniyor…</td></tr>
              ) : list.data.length === 0 ? (
                <tr><td className="py-4 px-4 text-center text-gray-500" colSpan={16}>Kayıt yok</td></tr>
              ) : (
                list.data.map((p, index) => (
                  <tr key={p.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 text-gray-900">{p.id}</td>
                    <td className="py-3 px-4 text-gray-900">{p.product_type}</td>
                    <td className="py-3 px-4 text-gray-900">{p.variety}</td>
                    <td className="py-3 px-4 text-gray-900">{p.sub_type ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.code}</td>
                    <td className="py-3 px-4 text-gray-900">{p.region ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.germination_start_year ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.seeds_2023 ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.seeds_2024 ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.seeds_2025_expected ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.annual_growth_factor ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.seedling_unit_price ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.asset_value_2023 ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.asset_value_2024 ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.asset_value_2025 ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-900">{p.is_active ? "✓" : "✗"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* sayfalama */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-gray-700">Toplam: {list.total}</div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                ‹ Önceki
              </button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">Sayfa {page}</span>
              <button
                disabled={page * limit >= list.total}
                onClick={() => setPage(p => p + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Sonraki ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}