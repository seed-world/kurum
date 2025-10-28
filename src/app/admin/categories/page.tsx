"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Category = {
  id: number;
  name: string;
  description: string | null;
  image_path: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

type Paged<T> = { data: T[]; page: number; limit: number; total: number };

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Paged<Category>>({
    data: [],
    page: 1,
    limit,
    total: 0,
  });

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
      const res = await fetch(`/api/category?${query}`, { cache: "no-store" });
      if (!res.ok) {
        let msg = `Liste hatası (${res.status})`;
        try {
          const txt = await res.text();
          msg = (() => {
            try {
              return JSON.parse(txt)?.error ?? msg;
            } catch {
              return txt.slice(0, 200);
            }
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

  // --- Form state ---
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // edit modu
  const [editId, setEditId] = useState<number | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  // delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  // File input'u gerçekten sıfırlamak için
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const resetFileInput = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileInputKey((k) => k + 1); // remount
    if (fileRef.current) fileRef.current.value = ""; // garanti
  };

  function resetForm() {
    setForm({ name: "", description: "", is_active: true });
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
      fd.append("name", form.name || "");
      if (form.description) fd.append("description", form.description);
      fd.append("is_active", form.is_active ? "1" : "0");
      if (file) fd.append("image", file);

      const res = await fetch("/api/category", { method: "POST", body: fd });
      if (!res.ok) {
        let msg = "Kayıt başarısız";
        try {
          msg = (await res.json())?.error ?? msg;
        } catch {}
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
        // Görsel de güncellenecekse multipart
        const fd = new FormData();
        fd.append("name", form.name || "");
        if (form.description) fd.append("description", form.description);
        fd.append("is_active", form.is_active ? "1" : "0");
        fd.append("image", file);
        res = await fetch(`/api/category/${editId}`, { method: "PATCH", body: fd });
      } else {
        // Sadece text güncelleme
        const body: any = {
          name: form.name || null,
          description: form.description || null,
          is_active: form.is_active ? 1 : 0,
        };
        res = await fetch(`/api/category/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        let msg = "Güncelleme başarısız";
        try {
          msg = (await res.json())?.error ?? msg;
        } catch {}
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

  function onEditClick(c: Category) {
    setEditId(c.id);
    setForm({
      name: c.name ?? "",
      description: c.description ?? "",
      is_active: c.is_active === 1,
    });
    resetFileInput(); // edit'e geçerken eski dosyayı sıfırla
    setCurrentImagePath(c.image_path ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function askDelete(c: Category) {
    setToDelete(c);
    setDeleteErr("");
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteErr("");
    try {
      const res = await fetch(`/api/category/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = "Silinemedi";
        try {
          msg = (await res.json())?.error ?? msg;
        } catch {}
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
          <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Ara: isim, açıklama..."
              className="w-80 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={editId ? onUpdate : onCreate}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editId ? `Kategori Düzenle #${editId}` : "Hızlı Kategori Ekle"}
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

          {err && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {err}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
              placeholder="Kategori Adı *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <div className="md:col-span-2 lg:col-span-3">
              <textarea
                className="w-full min-h-[42px] rounded-lg border border-gray-300 px-4 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#27ae60]/20 transition-all"
                placeholder="Açıklama"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

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

            {/* Aktif checkbox */}
            <label className="col-span-1 inline-flex items-center gap-2 text-gray-900">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-[#27ae60] focus:ring-[#27ae60]"
              />
              Aktif
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={saving}
              className="rounded-lg bg-[#27ae60] px-6 py-3 text-white font-medium hover:bg-[#1b7f3a] disabled:opacity-50 transition-colors"
            >
              {saving
                ? editId
                  ? "Güncelleniyor..."
                  : "Kaydediliyor..."
                : editId
                ? "Güncelle"
                : "Ekle"}
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

        {/* Liste */}
        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-900 w-20">Aksiyon</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">ID</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Görsel</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Ad</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Açıklama</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Aktif</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Oluşturma</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan={8}>
                    Yükleniyor…
                  </td>
                </tr>
              ) : list.data.length === 0 ? (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan={8}>
                    Kayıt yok
                  </td>
                </tr>
              ) : (
                list.data.map((c, index) => (
                  <tr key={c.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditClick(c)}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white w-8 h-8 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          title="Düzenle"
                          aria-label={`Kategoriyi düzenle #${c.id}`}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => askDelete(c)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white w-8 h-8 text-xs font-medium text-red-600 hover:bg-red-50"
                          title="Sil"
                          aria-label={`Kategoriyi sil #${c.id}`}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{c.id}</td>
                    <td className="py-3 px-4">
                      {c.image_path ? (
                        <img
                          src={c.image_path}
                          alt={c.name}
                          className="h-12 w-12 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {c.description ? (
                        <span className="line-clamp-2 max-w-xs inline-block align-top">
                          {c.description}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{c.is_active ? "✓" : "✗"}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(c.created_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(c.updated_at).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-gray-700">Toplam: {list.total}</div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                ‹ Önceki
              </button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Sayfa {page}
              </span>
              <button
                disabled={page * limit >= list.total}
                onClick={() => setPage((p) => p + 1)}
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
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleting && setConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Kategoriyi sil?</h3>
            <p className="mt-2 text-sm text-gray-600">
              {toDelete
                ? `#${toDelete.id} — ${toDelete.name} kaydını silmek üzeresin. Bu işlem geri alınamaz.`
                : "Bu kategoriyi silmek üzeresin. Bu işlem geri alınamaz."}
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
