// File: app/surdurulebilirlik/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Leaf,
  Recycle,
  Droplets,
  Sun,
  Wind,
  Users,
  ShieldCheck,
  Sprout,
  Factory,
  Globe2,
  BadgeCheck,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  Info,
} from "lucide-react";

/* =========================================================
   1) TEK NOKTA GERÇEK VERİ GİRİŞİ  (REAL)
   - Buradaki alanları elindeki belgeler/kaynaklarla doldur.
   - Değer yoksa value: null bırak; UI otomatik "Henüz yayımlanmadı" der.
   ========================================================= */

type KPIItem = {
  key: string;
  title: string;
  unit: string;      // ör: "%", "MWh", "m³", "tCO₂e"
  value: number | null;
  year?: string;     // "2024" gibi
  sourceName?: string;
  sourceUrl?: string;
};

type InitiativeItem = {
  icon: React.ReactNode; // DÜZELTME: JSX.Element → React.ReactNode
  title: string;
  desc: string;
  sourceName?: string;
  sourceUrl?: string;
};

type RoadmapItem = {
  q: string;      // "2026 Q1"
  title: string;
  items: string[];
};

type CertItem = { name: string; url?: string };

const REAL = {
  hero: {
    tagline: "Topraktan Başlayan",
    headlineColor: "Döngüsel Değer",
    image: "/images/sustainability-hero.jpg",
    traceabilityNote: "%100 İzlenebilir",
  },

  // KPI’lar: Gerçek değerleri varsa doldur, yoksa null bırak.
  kpis: [
    {
      key: "renewable_share",
      title: "Yenilenebilir Enerji Payı",
      unit: "%",
      value: null,
      year: undefined,
      sourceName: undefined,
      sourceUrl: undefined,
    },
    {
      key: "water_saving",
      title: "Su Tasarrufu",
      unit: "%",
      value: null,
      year: undefined,
      sourceName: undefined,
      sourceUrl: undefined,
    },
    {
      key: "recycling_ratio",
      title: "Geri Dönüşüm Oranı",
      unit: "%",
      value: null,
      year: undefined,
      sourceName: undefined,
      sourceUrl: undefined,
    },
    {
      key: "carbon_intensity",
      title: "Karbon Yoğunluğu Değişimi",
      unit: "% (y/y)",
      value: null,
      year: undefined,
      sourceName: undefined,
      sourceUrl: undefined,
    },
  ] as KPIItem[],

  // ESG sütunlarının gerçek açıklamaları – metinler genel prensiptir (sayı içermez).
  esg: {
    env: [
      "Rejeneratif tarım uygulamaları (örtü bitkisi, münavebe, minimum toprak işleme)",
      "Toprak sağlığı ve organik madde artışı programları",
      "Su yönetimi (damla sulama, sensör tabanlı izleme, geri kazanım)",
      "Tedarikte ve tesislerde yenilenebilir enerji tercihi",
    ],
    soc: [
      "Üretici eğitimleri ve saha teknik destek",
      "İş sağlığı ve güvenliği (İSG) protokolleri",
      "Kooperatif ve çiftçilerle adil sözleşme modelleri",
      "Toplumsal katkı ve yerel istihdam programları",
    ],
    gov: [
      "Şeffaf tedarik zinciri ve QR doğrulama",
      "Etik tedarikçi standartları (denetim/uyum)",
      "Veri güvenliği ve KVKK uyumu",
      "Bağımsız denetim ve raporlama",
    ],
  },

  // Girişimler – metinler genel; varsa kaynak ekle.
  initiatives: [
    {
      icon: <Sprout className="h-5 w-5 text-[#27ae60]" />,
      title: "Rejeneratif Tarım",
      desc: "Örtü bitkisi, münavebe ve minimum toprak işlemesi ile toprak sağlığını destekliyoruz.",
    },
    {
      icon: <Droplets className="h-5 w-5 text-[#27ae60]" />,
      title: "Su Yönetimi",
      desc: "Damla sulama, sensör tabanlı izleme ve geri kazanım uygulamaları.",
    },
    {
      icon: <Sun className="h-5 w-5 text-[#f39c12]" />,
      title: "Yenilenebilir Enerji",
      desc: "Tedarikte yeşil enerji tercihleri ve çatı GES projeleri.",
    },
    {
      icon: <Recycle className="h-5 w-5 text-[#f39c12]" />,
      title: "Döngüsel Paketleme",
      desc: "Geri dönüştürülebilir ambalaj ve atık azaltım programları.",
    },
  ] as InitiativeItem[],

  // SDG hizalaması – genel hedef başlıkları.
  sdgs: [
    "SDG 2: Sıfır Açlık",
    "SDG 6: Temiz Su ve Sanitasyon",
    "SDG 7: Erişilebilir ve Temiz Enerji",
    "SDG 8: İnsana Yakışır İş ve Ekonomik Büyüme",
    "SDG 12: Sorumlu Tüketim ve Üretim",
    "SDG 13: İklim Eylemi",
    "SDG 15: Karasal Yaşam",
  ],

  // Etki göstergeleri – değerler yoksa null bırak, grafik gizlenir.
  impact: {
    energyMWh: [] as { label: string; value: number }[],
    waterM3: [] as { label: string; value: number }[],
  },

  // Sertifikalar – varsa link ekle
  certs: [
    { name: "ISO 14001" },
    { name: "ISO 22000" },
    { name: "HACCP" },
    { name: "GLOBALG.A.P." },
    { name: "İyi Tarım Uygulamaları" },
  ] as CertItem[],

  // Yol haritası – somut tarihler/veriler eline geçtikçe güncelle
  roadmap: [
    {
      q: "2025–2026",
      title: "Veri Altyapısı ve Denetim",
      items: ["GHG kapsam 1–2 ölçüm kurulumu", "Tedarikçi veri toplama", "Bağımsız doğrulama planı"],
    },
    {
      q: "2026",
      title: "Kaynak Verimliliği",
      items: ["Damla sulama kapsama artışı", "Ambalaj optimizasyonu", "Enerji verimli ekipman dönüşümü"],
    },
    {
      q: "2027",
      title: "Net-Sıfır Yolunda İvmelenme",
      items: ["Yenilenebilir enerji payı artışı", "Lojistik optimizasyonu", "Kapsam 3 yol haritası"],
    },
  ] as RoadmapItem[],
};

/* =============================== SAYFA =============================== */

export default function SustainabilityPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Sayfada hiç KPI değeri girilmemişse üstte uyarı bandı göster.
  const hasAnyKPI = useMemo(() => REAL.kpis.some(k => k.value !== null), []);

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

      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">

        {!hasAnyKPI && (
          <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5" />
            <div className="text-sm">
              Bu sayfadaki metrikler yalnızca mevcut olduğunda gösterilir. Elindeki doğrulanmış değerleri
              <b> REAL.kpis</b> alanına eklediğinde göstergeler otomatik güncellenecektir.
            </div>
          </div>
        )}

        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center mb-12">
          <div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              {REAL.hero.tagline}
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                {REAL.hero.headlineColor}
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              GG SEED WORLD; tohumdan tüketime uzanan zincirde çevresel etkiyi
              azaltmak, toplumsal faydayı artırmak ve iyi yönetişim sağlamak için
              <strong> ESG</strong> ilkeleriyle hareket eder.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill icon={<ShieldCheck className="h-4 w-4" />} text="ESG Prensipleri" color="green" />
              <Pill icon={<BadgeCheck className="h-4 w-4" />} text="Denetlenebilir Yapı" color="green" />
              <Pill icon={<Globe2 className="h-4 w-4" />} text="SDG Hizalaması" color="amber" />
            </div>
          </div>

          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <Image
              src={REAL.hero.image}
              alt="Sürdürülebilirlik hero"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 border-2 border-gray-200 text-sm font-semibold text-gray-900 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-[#27ae60]" /> {REAL.hero.traceabilityNote}
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REAL.kpis.map((k) => (
            <KPI
              key={k.key}
              icon={iconForKPI(k.key)}
              title={k.title}
              value={k.value}
              unit={k.unit}
              year={k.year}
              sourceName={k.sourceName}
              sourceUrl={k.sourceUrl}
            />
          ))}
        </section>

        {/* ESG Sütunları */}
        <section className="mb-12 grid gap-6 md:grid-cols-3">
          <InfoCard icon={<Leaf className="h-5 w-5 text-white" />} title="Çevresel (E)" gradient="green">
            <BulletList items={REAL.esg.env} />
          </InfoCard>

          <InfoCard icon={<Users className="h-5 w-5 text-white" />} title="Sosyal (S)" gradient="amber">
            <BulletList items={REAL.esg.soc} />
          </InfoCard>

          <InfoCard icon={<ShieldCheck className="h-5 w-5 text-white" />} title="Yönetişim (G)" gradient="green">
            <BulletList items={REAL.esg.gov} />
          </InfoCard>
        </section>

        {/* Girişimler */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Sürdürülebilirlik Girişimleri</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REAL.initiatives.map((i) => (
              <Initiative key={i.title} {...i} />
            ))}
          </div>
        </section>

        {/* SDG Alignment */}
        <section className="mb-12 rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            BM Sürdürülebilir Kalkınma Amaçları (SDGs) ile Hizalama
          </h3>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {REAL.sdgs.map((s) => (
              <span
                key={s}
                className="rounded-lg px-2.5 py-1 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(27,127,58,0.08) 0%, rgba(39,174,96,0.08) 100%)",
                  color: "#1b7f3a",
                  border: "1px solid #27ae60",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Etki Göstergeleri */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          {REAL.impact.energyMWh.length > 0 ? (
            <BarCard title="Yıllık Enerji Tüketimi (MWh)" bars={REAL.impact.energyMWh} />
          ) : (
            <PlaceholderCard title="Yıllık Enerji Tüketimi (MWh)" />
          )}
          {REAL.impact.waterM3.length > 0 ? (
            <BarCard title="Tatlı Su Kullanımı (m³)" bars={REAL.impact.waterM3} />
          ) : (
            <PlaceholderCard title="Tatlı Su Kullanımı (m³)" />
          )}
        </section>

        {/* Sertifikalar */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Sertifikalar & Standartlar</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {REAL.certs.map((c, i) => (
              <div
                key={i}
                className="group aspect-[3/2] rounded-2xl border-2 border-gray-200 bg-white hover:border-[#27ae60] hover:shadow-lg transition flex items-center justify-center text-sm font-semibold text-gray-700"
              >
                {c.url ? (
                  <Link href={c.url} className="underline underline-offset-2" target="_blank">
                    {c.name}
                  </Link>
                ) : (
                  c.name
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Yol Haritası */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Net-Sıfır Yol Haritası</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {REAL.roadmap.map((r) => (
              <div
                key={r.q}
                className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md"
              >
                <p className="text-xs font-semibold text-gray-500">{r.q}</p>
                <h4 className="text-lg font-bold mt-1 text-gray-900">{r.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#27ae60]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================= Bileşenler ============================= */

function Pill({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: "green" | "amber";
}) {
  const gradientClass =
    color === "green"
      ? "from-[#1b7f3a] to-[#27ae60]"
      : "from-[#f39c12] to-[#d35400]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${gradientClass} px-3 py-1.5 text-xs font-bold text-white shadow-md`}
    >
      {icon}
      {text}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-gray-700">
      {items.map((t) => (
        <li key={t}>• {t}</li>
      ))}
    </ul>
  );
}

function KPI({
  icon,
  title,
  value,
  unit,
  year,
  sourceName,
  sourceUrl,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | null;
  unit: string;
  year?: string;
  sourceName?: string;
  sourceUrl?: string;
}) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
      <div className="flex items-center gap-2 text-gray-800">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b7f3a]/10 to-[#27ae60]/10 border border-[#27ae60]/30">
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>

      <div className="mt-2 text-3xl font-extrabold text-gray-900">
        {hasValue ? (
          <>
            {value}
            <span className="text-base font-bold text-gray-600 ml-1">{unit}</span>
          </>
        ) : (
          <span className="text-base font-semibold text-gray-500">Henüz yayımlanmadı</span>
        )}
      </div>

      <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
        {year && <span>Yıl: {year}</span>}
        {sourceName && (
          <>
            <span>•</span>
            {sourceUrl ? (
              <Link className="underline underline-offset-2" href={sourceUrl} target="_blank">
                {sourceName}
              </Link>
            ) : (
              <span>{sourceName}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  gradient,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  gradient: "green" | "amber";
  children: React.ReactNode;
}) {
  const gradientClass =
    gradient === "green"
      ? "from-[#1b7f3a] to-[#27ae60]"
      : "from-[#f39c12] to-[#d35400]";
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`} />
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Initiative({
  icon,
  title,
  desc,
  sourceName,
  sourceUrl,
}: InitiativeItem) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f39c12]/10 to-[#d35400]/10 border border-[#f39c12]/30">
        {icon}
      </div>
      <h4 className="mt-3 font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-700 mt-1">{desc}</p>
      {sourceName && (
        <p className="mt-2 text-xs text-gray-500">
          Kaynak:{" "}
          {sourceUrl ? (
            <Link href={sourceUrl} className="underline underline-offset-2" target="_blank">
              {sourceName}
            </Link>
          ) : (
            sourceName
          )}
        </p>
      )}
    </div>
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-6 text-gray-600">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm">Grafik için henüz açıklanmış veri bulunmuyor.</p>
    </div>
  );
}

function BarCard({
  title,
  bars,
}: {
  title: string;
  bars: { label: string; value: number }[];
}) {
  const max = Math.max(...bars.map((b) => (b.value ?? 0)), 1);
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <div className="mt-4 space-y-3">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-16 text-xs text-gray-600">{b.label}</span>
            <div className="h-2 flex-1 rounded bg-gray-100">
              <div
                className="h-2 rounded bg-gradient-to-r from-[#1b7f3a] to-[#f39c12]"
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
            <span className="w-10 text-xs text-gray-600 text-right">
              {b.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function iconForKPI(key: string) {
  switch (key) {
    case "renewable_share":
      return <Wind className="h-5 w-5" />;
    case "water_saving":
      return <Droplets className="h-5 w-5" />;
    case "recycling_ratio":
      return <Recycle className="h-5 w-5" />;
    case "carbon_intensity":
      return <Factory className="h-5 w-5" />;
    default:
      return <Leaf className="h-5 w-5" />;
  }
}