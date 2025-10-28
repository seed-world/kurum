"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  is_featured: 0 | 1;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
  category_id: number | null; // ✅ eklendi
};

type Category = {
  id: number;
  name: string;
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
        let msg = `Liste hatası (${res.status})`;
        try {
          const txt = await res.text();
          msg = (() => {
            try { return JSON.parse(txt)?.error ?? msg; } catch { return txt.slice(0, 200); }
          })();
        } catch {}
        throw new Error(msg);
      }
      const json = await res.json();
      setList(json);
    } catch (e: any) {
      console.error("fetchList failed:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ✅ Kategori dropdown'ı için liste
  const [categories, setCategories] = useState<Category[]>([]);
  async function fetchCategories() {
    try {
      const res = await fetch(`/api/category?limit=1000&order=asc&sort=name`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const rows = (json?.data ?? []) as any[];
      setCategories(rows.map((r) => ({ id: r.id, name: r.name })));
    } catch {}
  }
  useEffect(() => { fetchCategories(); }, []);

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
    category_id: "" as string, // ✅ eklendi (dropdown değeri string tutuluyor)
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // edit modu
  const [editId, setEditId] = useState<number | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  // delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  // File input'u gerçekten sıfırlamak için
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const resetFileInput = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileInputKey(k => k + 1); // remount
    if (fileRef.current) fileRef.current.value = ""; // garanti
  };

  function toNumberSafe(v: string) {
    const cleaned = v.replace(/\s/g, "");
    if (/[,]/.test(cleaned) && !/[.]/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, "").replace(",", "."));
    }
    if (/[.]/.test(cleaned) && /,/.test(cleaned)) {
      return Number(cleaned.replace(/\./g, "").replace(",", "."));
    }
    return Number(cleaned.replace(/[^\d.]/g, ""));
  }

  function calcAutoAssets() {
    const s2023 = form.seeds_2023 ? toNumberSafe(form.seeds_2023) : undefined;
    const s2024 = form.seeds_2024 ? toNumberSafe(form.seeds_2024) : undefined;
    const s2025 = form.seeds_2025_expected ? toNumberSafe(form.seeds_2025_expected) : undefined;
    const price = form.seedling_unit_price ? toNumberSafe(form.seedling_unit_price) : undefined;

    const a2023 = form.asset_value_2023
      ? toNumberSafe(form.asset_value_2023)
      : (s2023 !== undefined && price !== undefined ? s2023 * price : undefined);

    const a2024 = form.asset_value_2024
      ? toNumberSafe(form.asset_value_2024)
      : (s2024 !== undefined && price !== undefined ? s2024 * price : undefined);

    const a2025 = form.asset_value_2025
      ? toNumberSafe(form.asset_value_2025)
      : (s2025 !== undefined && price !== undefined ? s2025 * price : undefined);

    return { a2023, a2024, a2025, s2023, s2024, s2025, price };
  }

  function resetForm() {
    setForm({
      product_type: "", variety: "", sub_type: "", code: "", region: "",
      germination_start_year: "", seeds_2023: "", seeds_2024: "", seeds_2025_expected: "",
      annual_growth_factor: "", seedling_unit_price: "",
      asset_value_2023: "", asset_value_2024: "", asset_value_2025: "",
      category_id: "",
    });
    setIsFeatured(false);
    resetFileInput();
    setEditId(null);
    setCurrentImagePath(null);
    setErr("");
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const fd = new FormData();

      fd.append("product_type", form.product_type || "");
      fd.append("variety", form.variety || "");
      fd.append("sub_type", form.sub_type || "");
      fd.append("code", form.code || "");
      fd.append("region", form.region || "");
      if (form.germination_start_year) fd.append("germination_start_year", String(Number(form.germination_start_year)));

      if (form.seeds_2023) fd.append("seeds_2023", String(toNumberSafe(form.seeds_2023)));
      if (form.seeds_2024) fd.append("seeds_2024", String(toNumberSafe(form.seeds_2024)));
      if (form.seeds_2025_expected) fd.append("seeds_2025_expected", String(toNumberSafe(form.seeds_2025_expected)));
      if (form.annual_growth_factor) fd.append("annual_growth_factor", String(Number(form.annual_growth_factor)));
      if (form.seedling_unit_price) fd.append("seedling_unit_price", String(toNumberSafe(form.seedling_unit_price)));

      const { a2023, a2024, a2025 } = calcAutoAssets();
      if (a2023 !== undefined) fd.append("asset_value_2023", String(a2023));
      if (a2024 !== undefined) fd.append("asset_value_2024", String(a2024));
      if (a2025 !== undefined) fd.append("asset_value_2025", String(a2025));

      // ✅ kategori
      if (form.category_id) fd.append("category_id", String(Number(form.category_id)));

      fd.append("is_active", "1");
      fd.append("is_featured", isFeatured ? "1" : "0");

      if (file) fd.append("image", file);

      const res = await fetch("/api/products", { method: "POST", body: fd });
      if (!res.ok) {
        let msg = "Kayıt başarısız";
        try { msg = (await res.json())?.error ?? msg; } catch {}
        throw new Error(msg);
      }

      resetForm();
      await fetchList();
    } catch (e: any) {
      setErr(e?.message ?? "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setErr("");
    setSaving(true);
    try {
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("product_type", form.product_type || "");
        fd.append("variety", form.variety || "");
        fd.append("sub_type", form.sub_type || "");
        fd.append("code", form.code || "");
        fd.append("region", form.region || "");
        if (form.germination_start_year) fd.append("germination_start_year", String(Number(form.germination_start_year)));

        if (form.seeds_2023) fd.append("seeds_2023", String(toNumberSafe(form.seeds_2023)));
        if (form.seeds_2024) fd.append("seeds_2024", String(toNumberSafe(form.seeds_2024)));
        if (form.seeds_2025_expected) fd.append("seeds_2025_expected", String(toNumberSafe(form.seeds_2025_expected)));
        if (form.annual_growth_factor) fd.append("annual_growth_factor", String(Number(form.annual_growth_factor)));
        if (form.seedling_unit_price) fd.append("seedling_unit_price", String(toNumberSafe(form.seedling_unit_price)));

        const { a2023, a2024, a2025 } = calcAutoAssets();
        if (a2023 !== undefined) fd.append("asset_value_2023", String(a2023));
        if (a2024 !== undefined) fd.append("asset_value_2024", String(a2024));
        if (a2025 !== undefined) fd.append("asset_value_2025", String(a2025));

        fd.append("is_featured", isFeatured ? "1" : "0");

        // ✅ kategori
        if (form.category_id) fd.append("category_id", String(Number(form.category_id)));

        fd.append("image", file);

        res = await fetch(`/api/products/${editId}`, { method: "PATCH", body: fd });
      } else {
        const body: any = {
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
          is_featured: isFeatured ? 1 : 0,
          // ✅ kategori
          category_id: form.category_id ? Number(form.category_id) : null,
        };
        res = await fetch(`/api/products/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        let msg = "Güncelleme başarısız";
        try { msg = (await res.json())?.error ?? msg; } catch {}
        throw new Error(msg);
      }

      resetForm();
      await fetchList();
    } catch (e: any) {
      setErr(e?.message ?? "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  }

  function onEditClick(p: Product) {
    setEditId(p.id);
    setForm({
      product_type: p.product_type ?? "",
      variety: p.variety ?? "",
      sub_type: p.sub_type ?? "",
      code: p.code ?? "",
      region: p.region ?? "",
      germination_start_year: p.germination_start_year ? String(p.germination_start_year) : "",
      seeds_2023: p.seeds_2023 != null ? String(p.seeds_2023) : "",
      seeds_2024: p.seeds_2024 != null ? String(p.seeds_2024) : "",
      seeds_2025_expected: p.seeds_2025_expected != null ? String(p.seeds_2025_expected) : "",
      annual_growth_factor: p.annual_growth_factor != null ? String(p.annual_growth_factor) : "",
      seedling_unit_price: p.seedling_unit_price != null ? String(p.seedling_unit_price) : "",
      asset_value_2023: p.asset_value_2023 != null ? String(p.asset_value_2023) : "",
      asset_value_2024: p.asset_value_2024 != null ? String(p.asset_value_2024) : "",
      asset_value_2025: p.asset_value_2025 != null ? String(p.asset_value_2025) : "",
      category_id: p.category_id != null ? String(p.category_id) : "", // ✅
    });
    setIsFeatured(p.is_featured === 1);
    resetFileInput(); // edit'e geçerken eski dosyayı sıfırla
    setCurrentImagePath(p.image_path ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function askDelete(p: Product) {
    setToDelete(p);
    setDeleteErr("");
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteErr("");
    try {
      const res = await fetch(`/api/products/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = "Silinemedi";
        try { msg = (await res.json())?.error ?? msg; } catch {}
        throw new Error(msg);
      }
      if (editId === toDelete.id) resetForm();
      setConfirmOpen(false);
      setToDelete(null);
      await fetchList();
    } catch (e: any) {
      setDeleteErr(e?.message ?? "Silinemedi");
    } finally {
      setDeleting(false);
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

        <form onSubmit={editId ? onUpdate : onCreate} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editId ? `Ürün Düzenle #${editId}` : "Hızlı Ürün Ekle"}
            </h2>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Vazgeç
              </button>
            )}
          </div>

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

            {/* ✅ Kategori dropdown */}
            <select
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Kategori seç (opsiyonel)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Görsel inputu */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center gap-3">
              <input
                key={fileInputKey}
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setPreviewUrl(f ? URL.createObjectURL(f) : null);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
              />
              {(previewUrl || currentImagePath) && (
                <img
                  src={previewUrl || (currentImagePath ?? undefined)}
                  alt="Önizleme"
                  className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                />
              )}
            </div>

            {/* Öne çıkan checkbox */}
            <label className="col-span-1 inline-flex items-center gap-2 text-gray-900">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-[#27ae60] focus:ring-[#27ae60]"
              />
              Öne çıkan ürün
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={saving}
              className="rounded-lg bg-[#27ae60] px-6 py-3 text-white font-medium hover:bg-[#1b7f3a] disabled:opacity-50 transition-colors"
            >
              {saving ? (editId ? "Güncelleniyor..." : "Kaydediliyor...") : (editId ? "Güncelle" : "Ekle")}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-800 hover:bg-gray-50"
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>

        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 w-20">Aksiyon</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">ID</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">Görsel</th>
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
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">Kategori</th>{/* ✅ */}
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">Öne çıkan</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">Aktif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td className="py-4 px-4 text-center text-gray-500" colSpan={20}>Yükleniyor…</td></tr>
                ) : list.data.length === 0 ? (
                  <tr><td className="py-4 px-4 text-center text-gray-500" colSpan={20}>Kayıt yok</td></tr>
                ) : (
                  list.data.map((p, index) => (
                    <tr key={p.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditClick(p)}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white w-8 h-8 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            title="Düzenle"
                            aria-label={`Ürünü düzenle #${p.id}`}
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => askDelete(p)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white w-8 h-8 text-xs font-medium text-red-600 hover:bg-red-50"
                            title="Sil"
                            aria-label={`Ürünü sil #${p.id}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{p.id}</td>
                      <td className="py-3 px-4">
                        {p.image_path ? (
                          <img
                            src={p.image_path}
                            alt={p.code}
                            className="h-12 w-12 rounded object-cover border border-gray-200"
                          />
                        ) : <span className="text-gray-400">—</span>}
                      </td>
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
                      <td className="py-3 px-4 text-gray-900">
                        {p.category_id
                          ? (categories.find(c => c.id === p.category_id)?.name ?? `#${p.category_id}`)
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{p.is_featured ? "★" : "-"}</td>
                      <td className="py-3 px-4 text-gray-900">{p.is_active ? "✓" : "✗"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

      {/* Silme Onay Diyaloğu */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && setConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Ürünü sil?</h3>
            <p className="mt-2 text-sm text-gray-600">
              {toDelete
                ? `#${toDelete.id} — ${toDelete.code} (${toDelete.product_type} / ${toDelete.variety}) kaydını silmek üzeresin. Bu işlem geri alınamaz.`
                : "Bu ürünü silmek üzeresin. Bu işlem geri alınamaz."}
            </p>

            {deleteErr && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {deleteErr}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                disabled={deleting}
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                disabled={deleting}
                onClick={doDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}