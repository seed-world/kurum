"use client";

import { useState } from "react";
import {
  FlaskConical,
  ScanSearch,
  Factory,
  BadgeCheck,
  ShieldCheck,
  QrCode,
  BookOpenCheck,
  CalendarDays,
  Users,
  ChevronDown,
  Leaf,
  CircleCheckBig,
} from "lucide-react";

/**
 * RandDPage — diğer 3 sayfanın tasarım/düzen prensiplerine göre yeniden yazılmıştır:
 * - Aydınlık tema, üstte gradient şerit
 * - max-w-7xl ızgara düzeni
 * - Beyaz zeminli, border-2 kartlar; yeşil/amber gradient aksanlar
 * - Başlıklar: gradient text
 * - Bileşenler: InfoCard, Ribbon, Pill, QAAccordion
 */

export default function RandDPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Veriye Dayalı Tarım,
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Şeffaf ve İzlenebilir Kalite
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              Bölgesel adaptasyon, verimlilik ve kalite projeleri yürütüyor;
              üretimimizi bağımsız kuruluşlarla düzenli olarak denetliyoruz. Her
              paketteki <strong>QR kod</strong> ile tarladan sofraya tam
              şeffaflık.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill icon={<QrCode className="h-4 w-4" />} text="%100 İzlenebilir" color="green" />
              <Pill icon={<ShieldCheck className="h-4 w-4" />} text="Organik & GAP" color="green" />
              <Pill icon={<BadgeCheck className="h-4 w-4" />} text="Bağımsız Denetim" color="amber" />
            </div>
          </div>

          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <img
              src="/images/rnd-hero.jpg"
              alt="Ar-Ge hero"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 shadow-xl border border-gray-200">
              <CircleCheckBig className="h-5 w-5 text-[#27ae60]" />
              <span className="font-semibold text-gray-900">Bağımsız Denetimle Onaylı</span>
            </div>

            {/* Dekoratif gradient kenar bandı */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </div>
        </section>

        {/* LABORATUVAR & ALTYAPI */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
              Altyapı ve Yetkinlikler
            </span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              gradient="green"
              icon={FlaskConical}
              title="Tohumculuk Laboratuvarı"
            >
              <ul className="space-y-2 text-gray-700">
                <li>• Çimlenme, nem, safiyet ölçümleri</li>
                <li>• Parti bazlı numune analizi & arşiv</li>
                <li>• Genetik karakterizasyon (marker tabanlı)</li>
              </ul>
            </InfoCard>

            <InfoCard
              gradient="green"
              icon={ScanSearch}
              title="İzlenebilirlik Altyapısı"
            >
              <ul className="space-y-2 text-gray-700">
                <li>• QR ile köken, üretici, kalite süreçleri</li>
                <li>• Parti & lokasyon bazlı dijital kayıt</li>
                <li>• Hasat sonrası izleme & raporlar</li>
              </ul>
            </InfoCard>

            <InfoCard
              gradient="amber"
              icon={Factory}
              title="Üretim & Denetim"
            >
              <ul className="space-y-2 text-gray-700">
                <li>• Organik & GAP sertifikalı tedarikçiler ağı</li>
                <li>• Periyodik bağımsız kalite denetimleri</li>
                <li>• Soğuk zincir & parti bazlı depolama</li>
              </ul>
            </InfoCard>
          </div>
        </section>

        {/* PROJELER */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpenCheck className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">
              Devam Eden Projeler
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl hover:border-[#27ae60] transition-all"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold border border-gray-200">
                    <Leaf className="h-4 w-4 text-[#27ae60]" />
                    {p.pillar}
                  </span>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900">{p.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t, i) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold px-3 py-1 rounded-full"
                        style={{
                          background:
                            i % 2 === 0
                              ? "linear-gradient(135deg, rgba(27,127,58,0.08) 0%, rgba(39,174,96,0.08) 100%)"
                              : "linear-gradient(135deg, rgba(243,156,18,0.08) 0%, rgba(211,84,0,0.08) 100%)",
                          color: i % 2 === 0 ? "#1b7f3a" : "#d35400",
                          border: `1px solid ${i % 2 === 0 ? "#27ae60" : "#f39c12"}`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SERTİFİKALAR */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">
              Sertifikalar & Standartlar
            </h3>
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

        {/* YOL HARİTASI */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Ar-Ge Yol Haritası</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ROADMAP.map((r) => (
              <div
                key={r.q}
                className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md"
              >
                <span className="text-xs font-semibold text-gray-500">{r.q}</span>
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

        {/* İŞ BİRLİKLERİ */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">
              Üniversite & Laboratuvar İş Birlikleri
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="group aspect-[3/2] rounded-2xl border-2 border-gray-200 bg-white hover:border-[#27ae60] hover:shadow-lg transition flex items-center justify-center text-xs font-semibold text-gray-700"
              >
                Partner Logo {i + 1}
              </div>
            ))}
          </div>
        </section>

        {/* SSS */}
        <section className="mb-4">
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

/* ---------------- Components ---------------- */

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

function InfoCard({
  icon: Icon,
  title,
  gradient,
  children,
}: {
  icon: any;
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
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ---------------- Dummy Content ---------------- */

type Project = {
  id: string;
  title: string;
  desc: string;
  pillar: string;
  img: string;
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Bölgesel Adaptasyon Denemeleri",
    desc: "Farklı iklim bölgelerinde heirloom çeşitlerin fenolojik performans analizi.",
    pillar: "Adaptasyon",
    img: "/images/projects/adaptation.jpg",
    tags: ["Fenoloji", "Verim", "Dayanıklılık"],
  },
  {
    id: "p2",
    title: "Kalite & Brix Optimizasyonu",
    desc: "Hasat zamanı ve depolama koşullarına göre Brix profilinin çıkarılması.",
    pillar: "Kalite",
    img: "/images/projects/brix.jpg",
    tags: ["Brix", "Hasat", "Depolama"],
  },
  {
    id: "p3",
    title: "İzlenebilirlik Veri Modeli",
    desc: "Parti, lokasyon ve üretici ilişkilerini yöneten QR tabanlı veri şeması.",
    pillar: "İzlenebilirlik",
    img: "/images/projects/trace.jpg",
    tags: ["QR", "Veri Şeması", "Raporlama"],
  },
];

const CERTS = [
  "Organik Sertifika",
  "GAP",
  "ISO 22000",
  "GLOBALG.A.P.",
  "HACCP",
  "Fair Trade",
  "Non-GMO",
  "İyi Tarım",
  "Yerel Tohum Kayıt",
  "Laboratuvar Akreditasyon",
];

const ROADMAP = [
  {
    q: "2025 Q4",
    title: "Saha Denemeleri 2. Faz",
    items: [
      "Yeni lokasyon eklemeleri",
      "Verim–brix korelasyon modeli",
      "Hasat sonrası protokol",
    ],
  },
  {
    q: "2026 Q1",
    title: "Blockchain Entegrasyon PoC",
    items: [
      "Parti hareket kaydı",
      "Sertifika doğrulama",
      "Kullanıcı QR akışları",
    ],
  },
  {
    q: "2026 Q2",
    title: "Uluslararası Sertifikasyon Genişlemesi",
    items: [
      "GLOBALG.A.P. kapsamı",
      "Laboratuvar akreditasyonu",
      "İhracat uyumluluğu",
    ],
  },
];

const FAQ = [
  {
    q: "QR kod ile neleri görebilirim?",
    a: "Çeşidin köken bilgisi, üretici/bölge, parti numarası, kalite test sonuçları ve yetiştirme rehberi.",
  },
  {
    q: "Brix ölçümü nasıl yapılıyor?",
    a: "Numune refraktometre ile ölçülür; saha ve laboratuvar değerleri eşleştirilir.",
  },
  {
    q: "Organik/GAP denetimleri ne sıklıkta?",
    a: "Yıl içinde planlı ve habersiz olmak üzere periyodik denetimler yapılır.",
  },
];
