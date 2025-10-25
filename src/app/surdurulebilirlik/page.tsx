// File: app/surdurulebilirlik/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
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
} from "lucide-react";

/**
 * SustainabilityPage — ışık tema uyumlu düzen:
 * - Üstte gradient şerit
 * - max-w-7xl kapsayıcı
 * - Beyaz kartlar, border-2, gölge
 * - Yeşil/amber gradient aksanlar
 */

export default function SustainabilityPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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
        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center mb-12">
          <div>
      

            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Topraktan Başlayan
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Döngüsel Değer
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              GG SEED WORLD; tohumdan tüketime uzanan zincirde çevresel etkiyi
              azaltmak, toplumsal faydayı artırmak ve iyi yönetişim sağlamak için
              <strong> ESG</strong> ilkeleriyle hareket eder.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill icon={<ShieldCheck className="h-4 w-4" />} text="ESG Uyumlu" color="green" />
              <Pill icon={<BadgeCheck className="h-4 w-4" />} text="Bağımsız Denetim" color="green" />
              <Pill icon={<Globe2 className="h-4 w-4" />} text="SDG Hizalaması" color="amber" />
            </div>
          </div>

          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <Image
              src="/images/sustainability-hero.jpg"
              alt="Sürdürülebilirlik hero"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 border-2 border-gray-200 text-sm font-semibold text-gray-900 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-[#27ae60]" /> %100 İzlenebilir
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPI icon={<Wind className="h-5 w-5" />} title="Yenilenebilir Enerji" value="%60" sub="Üretim tesisleri" />
          <KPI icon={<Droplets className="h-5 w-5" />} title="Su Tasarrufu" value="%35" sub="Damla sulama / sensör" />
          <KPI icon={<Recycle className="h-5 w-5" />} title="Geri Dönüşüm Oranı" value="%92" sub="Paketleme hattı" />
          <KPI icon={<Factory className="h-5 w-5" />} title="Karbon Yoğunluğu" value="-18%" sub="Yıl bazlı azaltım" />
        </section>

        {/* ESG Sütunları */}
        <section className="mb-12 grid gap-6 md:grid-cols-3">
          <InfoCard icon={<Leaf className="h-5 w-5 text-white" />} title="Çevresel (E)" gradient="green">
            <ul className="space-y-2 text-gray-700">
              <li>• Rejeneratif tarım uygulamaları</li>
              <li>• Toprak sağlığı ve organik madde artışı</li>
              <li>• Su yönetimi ve verimlilik</li>
              <li>• Yenilenebilir enerji kullanımı</li>
            </ul>
          </InfoCard>

          <InfoCard icon={<Users className="h-5 w-5 text-white" />} title="Sosyal (S)" gradient="amber">
            <ul className="space-y-2 text-gray-700">
              <li>• Üretici eğitimleri ve teknik destek</li>
              <li>• İş sağlığı ve güvenliği protokolleri</li>
              <li>• Kooperatiflerle adil sözleşmeler</li>
              <li>• Toplumsal katkı programları</li>
            </ul>
          </InfoCard>

          <InfoCard icon={<ShieldCheck className="h-5 w-5 text-white" />} title="Yönetişim (G)" gradient="green">
            <ul className="space-y-2 text-gray-700">
              <li>• Şeffaf tedarik zinciri ve QR doğrulama</li>
              <li>• Etik tedarikçi standartları</li>
              <li>• Veri güvenliği ve KVKK uyumu</li>
              <li>• Bağımsız denetim ve raporlama</li>
            </ul>
          </InfoCard>
        </section>

        {/* Girişimler */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Sürdürülebilirlik Girişimleri</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INITIATIVES.map((i) => (
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
            {SDGS.map((s) => (
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
          <BarCard
            title="Yıllık Enerji Tüketimi (MWh)"
            bars={[
              { label: "2023", value: 100 },
              { label: "2024", value: 88 },
              { label: "2025", value: 80 },
            ]}
          />
          <BarCard
            title="Tatlı Su Kullanımı (m³)"
            bars={[
              { label: "2023", value: 120 },
              { label: "2024", value: 95 },
              { label: "2025", value: 78 },
            ]}
          />
        </section>

        {/* Sertifikalar */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Sertifikalar & Standartlar</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CERTS.map((c, i) => (
              <div
                key={i}
                className="group aspect-[3/2] rounded-2xl border-2 border-gray-200 bg-white hover:border-[#27ae60] hover:shadow-lg transition flex items-center justify-center text-sm font-semibold text-gray-700"
              >
                {c}
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
            {ROADMAP.map((r) => (
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

        {/* SSS */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h3>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm"
              >
                <button
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                  onClick={() => setFaqOpen((x) => (x === i ? null : i))}
                >
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      faqOpen === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {faqOpen === i && (
                  <p className="px-4 pb-4 text-sm text-gray-700">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- Küçük Bileşenler ---------------- */

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

function KPI({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
      <div className="flex items-center gap-2 text-gray-800">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b7f3a]/10 to-[#27ae60]/10 border border-[#27ae60]/30">
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
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
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f39c12]/10 to-[#d35400]/10 border border-[#f39c12]/30">
        {icon}
      </div>
      <h4 className="mt-3 font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-700 mt-1">{desc}</p>
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
  const max = Math.max(...bars.map((b) => b.value || 1));
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

/* ---------------- Dummy Data ---------------- */

const INITIATIVES = [
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
    desc: "Tesis çatılarında GES ve tedarikte yeşil enerji sözleşmeleri.",
  },
  {
    icon: <Recycle className="h-5 w-5 text-[#f39c12]" />,
    title: "Döngüsel Paketleme",
    desc: "Geri dönüştürülebilir/kompostlanabilir malzeme kullanımı ve atık azaltım programı.",
  },
];

const SDGS = [
  "SDG 2: Sıfır Açlık",
  "SDG 6: Temiz Su ve Sanitasyon",
  "SDG 7: Erişilebilir ve Temiz Enerji",
  "SDG 8: İnsana Yakışır İş ve Ekonomik Büyüme",
  "SDG 12: Sorumlu Tüketim ve Üretim",
  "SDG 13: İklim Eylemi",
  "SDG 15: Karasal Yaşam",
];

const CERTS = [
  "Organik Sertifika",
  "GLOBALG.A.P.",
  "ISO 14001",
  "ISO 22000",
  "HACCP",
  "İyi Tarım",
  "Fair Trade",
  "Non-GMO",
  "Yerel Tohum Kayıt",
  "Laboratuvar Akreditasyon",
];

const ROADMAP = [
  {
    q: "2025 Q4",
    title: "Enerji Verimliliği 2. Faz",
    items: ["GES kapasite artışı", "Soğuk depo ısı geri kazanım", "LED dönüşümü"],
  },
  {
    q: "2026 Q1",
    title: "Su Pozitif Operasyonlar",
    items: ["Gri su geri kazanım", "Yağmur suyu hasadı", "Sulama optimizasyonu"],
  },
  {
    q: "2026 Q2",
    title: "Atık Sıfır Hedefi",
    items: ["Paketleme yeniden tasarım", "Organik atık kompost", "Tedarikçi eğitimleri"],
  },
];

const FAQ = [
  { q: "Verileri nasıl doğruluyorsunuz?", a: "Üçüncü taraf denetimler, QR tabanlı kayıtlar ve iç denetim prosedürleri ile çapraz doğrulama yapılır." },
  { q: "Karbon ayak izini nasıl hesaplıyorsunuz?", a: "GHG Protokol metodolojisi kullanılır; kapsam 1-2 zorunlu, kapsam 3 kademeli olarak eklenir." },
  { q: "Çiftçilere ne tür destek sağlıyorsunuz?", a: "Eğitim, sertifikasyon rehberliği, finansmana erişim ve hasat garantisi modelleri uygulanır." },
];
