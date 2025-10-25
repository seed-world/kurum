"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Leaf, Sprout, BadgeCheck, QrCode, ChevronsUpDown, ChevronDown, X } from "lucide-react";

const VARIETIES = [
  {
    id: "tomato-ayar",
    title: "Ayar Domates",
    latin: "Solanum lycopersicum",
    tags: ["Heirloom", "Organik", "Marmara"],
    maturity: 75,
    brix: 6.2,
    img: "/api/placeholder/400/300",
  },
  {
    id: "pepper-kara",
    title: "Kara Biber Tatlı",
    latin: "Capsicum annuum",
    tags: ["Heirloom", "Ege"],
    maturity: 68,
    brix: 5.1,
    img: "/api/placeholder/400/300",
  },
  {
    id: "cucumber-ada",
    title: "Ada Hıyarı",
    latin: "Cucumis sativus",
    tags: ["Organik", "Karadeniz"],
    maturity: 55,
    brix: 3.8,
    img: "/api/placeholder/400/300",
  },
  {
    id: "eggplant-mor",
    title: "Mor Patlıcan",
    latin: "Solanum melongena",
    tags: ["Heirloom", "GAP"],
    maturity: 80,
    brix: 4.1,
    img: "/api/placeholder/400/300",
  },
  {
    id: "melon-cekirdeksiz",
    title: "Çekirdeksiz Kavun",
    latin: "Cucumis melo",
    tags: ["Organik", "İç Anadolu"],
    maturity: 90,
    brix: 11.3,
    img: "/api/placeholder/400/300",
  },
  {
    id: "lettuce-kristal",
    title: "Kristal Marul",
    latin: "Lactuca sativa",
    tags: ["Heirloom", "Akdeniz"],
    maturity: 45,
    brix: 2.5,
    img: "/api/placeholder/400/300",
  },
] as const;

type Variety = (typeof VARIETIES)[number];

const CATEGORIES = ["Heirloom", "Organik", "GAP", "Marmara", "Ege", "Karadeniz", "İç Anadolu", "Akdeniz"] as const;

type SortKey = "maturity-asc" | "maturity-desc" | "brix-desc" | "name-asc";

export default function VarietyPortfolioPage() {
  const [q, setQ] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [open, setOpen] = useState<Variety | null>(null);

  const filtered = useMemo(() => {
    let rows = VARIETIES.filter((v) =>
      [v.title, v.latin].some((t) => t.toLowerCase().includes(q.toLowerCase()))
    );
    if (activeTags.length) {
      rows = rows.filter((v) => activeTags.every((t) => v.tags.includes(t as any)));
    }
    switch (sort) {
      case "maturity-asc":
        rows.sort((a, b) => a.maturity - b.maturity);
        break;
      case "maturity-desc":
        rows.sort((a, b) => b.maturity - a.maturity);
        break;
      case "brix-desc":
        rows.sort((a, b) => b.brix - a.brix);
        break;
      default:
        rows.sort((a, b) => a.title.localeCompare(b.title, "tr"));
    }
    return rows;
  }, [q, activeTags, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Gradient şerit */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }} />

      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
                  Çeşit Portföyü
                </span>
              </h1>
              <p className="text-gray-700 text-lg max-w-2xl leading-relaxed">
                Heirloom ve bölgesel adaptasyonu yüksek çeşitlerimizin tamamını keşfedin. QR kodlu izlenebilirlik ve yetiştirme kılavuzlarıyla şeffaf deneyim.
              </p>
            </div>

            {/* Arama */}
            <div className="relative w-full md:w-96">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Çeşit veya Latince isim ara"
                className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none transition-colors"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="mb-8">
          <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Filter className="h-5 w-5 text-[#27ae60]" />
                <span>Filtreler:</span>
              </div>

              {CATEGORIES.map((t) => {
                const isActive = activeTags.includes(t);
                const isGreen = ["Heirloom", "Organik", "GAP"].includes(t);
                
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setActiveTags((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                      )
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? isGreen
                          ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-md"
                          : "bg-gradient-to-r from-[#f39c12] to-[#d35400] text-white shadow-md"
                        : "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}

              {/* Sıralama */}
              <div className="ml-auto">
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Aktif filtreler göstergesi */}
            {activeTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
                <span className="text-sm text-gray-600">Aktif filtreler:</span>
                {activeTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {t}
                    <button
                      onClick={() => setActiveTags((prev) => prev.filter((x) => x !== t))}
                      className="hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setActiveTags([])}
                  className="text-sm text-[#d35400] hover:text-[#f39c12] font-semibold"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sonuç sayısı */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">{filtered.length}</span> çeşit bulundu
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <article
              key={v.id}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl hover:border-[#27ae60] transition-all duration-300"
            >
              {/* Görsel */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={v.img} 
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Etiketler */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {v.tags.includes("Heirloom") && (
                    <BadgePill icon={<Sprout className="h-3.5 w-3.5" />} text="Heirloom" color="green" />
                  )}
                  {v.tags.includes("Organik") && (
                    <BadgePill icon={<Leaf className="h-3.5 w-3.5" />} text="Organik" color="green" />
                  )}
                  <BadgePill icon={<QrCode className="h-3.5 w-3.5" />} text="QR" color="amber" />
                </div>
              </div>

              {/* İçerik */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500 italic mb-4">{v.latin}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl bg-gradient-to-br from-[#1b7f3a]/10 to-[#27ae60]/10 p-3 border border-[#27ae60]/20">
                    <p className="text-xs text-gray-600 mb-1">Olgunlaşma</p>
                    <p className="text-lg font-bold text-gray-900">{v.maturity} gün</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-[#f39c12]/10 to-[#d35400]/10 p-3 border border-[#f39c12]/20">
                    <p className="text-xs text-gray-600 mb-1">Brix</p>
                    <p className="text-lg font-bold text-gray-900">{v.brix}</p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(v)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-semibold py-3 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all shadow-md hover:shadow-lg"
                >
                  Detaylı İncele
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-600 mb-4">Arama kriterlerinizi değiştirmeyi deneyin</p>
            <button
              onClick={() => {
                setQ("");
                setActiveTags([]);
              }}
              className="text-[#27ae60] font-semibold hover:text-[#1b7f3a]"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          />
          <div className="relative z-10 w-full max-w-3xl rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur text-gray-700 hover:bg-white shadow-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Görsel */}
              <div className="relative h-64 md:h-full">
                <img src={open.img} alt={open.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* İçerik */}
              <div className="p-8">
                <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a]/10 to-[#27ae60]/10 border border-[#27ae60]/30 px-3 py-1.5 text-sm font-semibold text-[#1b7f3a] mb-4">
                  <BadgeCheck className="h-4 w-4" />
                  İzlenebilir
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-2">{open.title}</h3>
                <p className="text-gray-600 italic mb-6">{open.latin}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Olgunlaşma süresi:</span>
                    <span className="font-bold text-gray-900">{open.maturity} gün</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Ortalama Brix:</span>
                    <span className="font-bold text-gray-900">{open.brix}</span>
                  </div>
                </div>

                {/* Etiketler */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Etiketler:</p>
                  <div className="flex flex-wrap gap-2">
                    {open.tags.map((t) => {
                      const isGreen = ["Heirloom", "Organik", "GAP"].includes(t);
                      return (
                        <span
                          key={t}
                          className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                            isGreen
                              ? "bg-gradient-to-r from-[#1b7f3a]/10 to-[#27ae60]/10 text-[#1b7f3a] border border-[#27ae60]/30"
                              : "bg-gradient-to-r from-[#f39c12]/10 to-[#d35400]/10 text-[#d35400] border border-[#f39c12]/30"
                          }`}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Butonları */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-bold py-3 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all shadow-md hover:shadow-lg">
                    Satın Al
                  </button>
                  <button className="rounded-xl border-2 border-[#27ae60] text-[#1b7f3a] font-bold py-3 hover:bg-[#27ae60]/5 transition-all">
                    Yetiştirme Rehberi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BadgePill({ icon, text, color }: { icon: React.ReactNode; text: string; color: "green" | "amber" }) {
  const bgClass = color === "green"
    ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60]"
    : "bg-gradient-to-r from-[#f39c12] to-[#d35400]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${bgClass} px-3 py-1.5 text-xs font-bold text-white shadow-md`}>
      {icon}
      {text}
    </span>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="relative">
      <ChevronsUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none rounded-xl border-2 border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 focus:border-[#27ae60] focus:outline-none transition-colors cursor-pointer"
      >
        <option value="name-asc">İsme göre (A→Z)</option>
        <option value="maturity-asc">Olgunlaşma (Artan)</option>
        <option value="maturity-desc">Olgunlaşma (Azalan)</option>
        <option value="brix-desc">Brix (Yüksek)</option>
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  );
}