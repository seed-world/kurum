// File: app/izlenebilirlik/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  QrCode,
  BadgeCheck,
  MapPin,
  Factory,
  Truck,
  PackageOpen,
  Sprout,
  BookOpenCheck,
  Fingerprint,
  Search as SearchIcon,
  ShieldCheck,
  Clock4,
  ChevronDown,
  Leaf,
} from "lucide-react";

export default function TraceabilityPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [qrModal, setQrModal] = useState(false);
  const [query, setQuery] = useState("");

  const demoBatch = useMemo(
    () => ({
      id: "GG-TRC-24-09-AYR-001",
      variety: "Ayar Domates",
      lot: "LOT-2024-AYAR-0921",
      origin: "Balıkesir / Marmara",
      farmer: "Çiftçi Kooperatifi #12",
      harvest: "2024-09-21",
      certs: ["Organik", "GAP"],
      brix: 6.3,
    }),
    []
  );

  const steps = [
    {
      icon: <QrCode className="h-4 w-4" />,
      title: "QR'ı Tara",
      desc: "Paket üzerindeki kodu okutun veya parti numarasını girin.",
    },
    {
      icon: <Fingerprint className="h-4 w-4" />,
      title: "Partiyi Doğrula",
      desc: "Köken, üretici, analiz ve sertifikaları görün.",
    },
    {
      icon: <BookOpenCheck className="h-4 w-4" />,
      title: "Rehberi Aç",
      desc: "Çeşide özel yetiştirme kılavuzuna ulaşın.",
    },
  ];

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
              Tohumdan Sofraya
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Şeffaf Yolculuk
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              Her paket benzersiz bir <strong>QR kod</strong> taşır. Kodu tarayarak
              çeşidin kökeni, üretim koşulları, parti geçmişi, kalite analizleri ve
              yetiştirme kılavuzuna anında erişin.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill icon={<ShieldCheck className="h-4 w-4" />} text="Veri bütünlüğü" color="green" />
              <Pill icon={<BadgeCheck className="h-4 w-4" />} text="Bağımsız denetim" color="green" />
              <Pill icon={<Clock4 className="h-4 w-4" />} text="Gerçek zamanlı kayıt" color="amber" />
            </div>
          </div>

          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <Image
              src="/images/traceability-hero.jpg"
              alt="İzlenebilirlik hero"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setQrModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 font-semibold px-4 py-2 text-sm border-2 border-gray-200 hover:bg-gray-50"
              >
                <QrCode className="h-4 w-4" /> Örnek QR'ı Gör
              </button>
              <Link
                href="#sorgu"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#27ae60] text-[#1b7f3a] font-semibold px-4 py-2 text-sm hover:bg-[#27ae60]/5"
              >
                Sorgula
              </Link>
            </div>
            {/* Dekoratif üst bant */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </div>
        </section>

        {/* SEARCH / MANUAL LOOKUP */}
        <section id="sorgu" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
              Parti/LOT Sorgulama
            </span>
          </h2>

          <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
            <label className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative w-full md:flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Parti / LOT / QR kodu girin (örn. GG-TRC-24-09-AYR-001)"
                  className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none transition-colors"
                />
              </div>
              <button className="rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-bold px-6 py-3 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all">
                Sorgula
              </button>
            </label>

            {/* Demo sonucu */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <TraceCard batch={demoBatch} />
              <ChainCard />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpenCheck className="h-6 w-6 text-[#27ae60]" />
            <h3 className="text-2xl font-bold text-gray-900">Nasıl Çalışır?</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b7f3a]/10 to-[#27ae60]/10 border border-[#27ae60]/30">
                  {s.icon}
                </div>
                <h4 className="mt-3 font-bold text-gray-900">{s.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPLY TIMELINE */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-6 w-6 text-[#f39c12]" />
            <h3 className="text-2xl font-bold text-gray-900">Tedarik Zinciri</h3>
          </div>
          <div className="relative overflow-x-auto">
            <div className="min-w-[760px] rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
              <div className="grid grid-cols-6 gap-4 text-center text-xs">
                <Stage icon={<Sprout className="h-4 w-4" />} title="Tohum" color="green" />
                <Stage icon={<Factory className="h-4 w-4" />} title="Üretim" color="green" />
                <Stage icon={<Fingerprint className="h-4 w-4" />} title="Parti" color="amber" />
                <Stage icon={<PackageOpen className="h-4 w-4" />} title="Depo" color="amber" />
                <Stage icon={<Truck className="h-4 w-4" />} title="Dağıtım" color="green" />
                <Stage icon={<MapPin className="h-4 w-4" />} title="Mağaza" color="green" />
              </div>
              <div className="mt-5 h-1 rounded bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulanlar</h3>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm"
              >
                <button
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                  onClick={() => setOpen((x) => (x === i ? null : i))}
                >
                  <span className="font-semibold text-gray-900">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-4 pb-4 text-sm text-gray-700">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setQrModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-auto rounded-3xl border-2 border-gray-200 bg-white p-6 text-center shadow-2xl">
            <h4 className="text-lg font-bold text-gray-900">Örnek QR</h4>
            <div className="mt-4 relative mx-auto h-48 w-48 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white">
              <Image
                src="/images/qr-sample.png"
                alt="Örnek QR"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="mt-3 text-sm text-gray-700">
              Demo amaçlıdır. Gerçek partilerde farklı bilgiler yer alır.
            </p>
            <button
              onClick={() => setQrModal(false)}
              className="mt-4 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-bold px-5 py-2 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
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

function Stage({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: "green" | "amber";
}) {
  const ring =
    color === "green"
      ? "ring-[#27ae60]/30 bg-[#27ae60]/10"
      : "ring-[#f39c12]/30 bg-[#f39c12]/10";
  const dot =
    color === "green" ? "bg-[#27ae60]" : "bg-[#f39c12]";

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 ${ring}`}
      >
        {icon}
      </span>
      <span className="text-gray-800 font-semibold">{title}</span>
      <span className={`h-1 w-8 rounded-full ${dot}`} />
    </div>
  );
}

function TraceCard({ batch }: { batch: any }) {
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Parti Özeti</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
          <BadgeCheck className="h-3.5 w-3.5" /> Doğrulandı
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <li>
          <span className="text-gray-600">QR / Batch:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.id}</span>
        </li>
        <li>
          <span className="text-gray-600">Çeşit:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.variety}</span>
        </li>
        <li>
          <span className="text-gray-600">LOT:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.lot}</span>
        </li>
        <li>
          <span className="text-gray-600">Bölge:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.origin}</span>
        </li>
        <li>
          <span className="text-gray-600">Üretici:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.farmer}</span>
        </li>
        <li>
          <span className="text-gray-600">Hasat:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.harvest}</span>
        </li>
        <li className="col-span-2">
          <span className="text-gray-600">Sertifikalar:</span>{" "}
          <span className="font-semibold text-gray-900">
            {batch.certs.join(", ")}
          </span>
        </li>
        <li className="col-span-2">
          <span className="text-gray-600">Brix:</span>{" "}
          <span className="font-semibold text-gray-900">{batch.brix}</span>
        </li>
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/cesit-portfoyu"
          className="rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-bold px-4 py-2 text-xs hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
        >
          Çeşidi Gör
        </Link>
        <Link
          href="#"
          className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
        >
          Analiz Raporu
        </Link>
        <Link
          href="#"
          className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
        >
          Yetiştirme Rehberi
        </Link>
      </div>
    </div>
  );
}

function ChainCard() {
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-md">
      <h3 className="text-lg font-bold text-gray-900">Kayıt Akışı</h3>
      <ol className="mt-3 space-y-2 text-sm text-gray-700">
        <li>
          1) <b>Tohum Kaydı:</b> Çeşit, menşei ve ıslah bilgileri
        </li>
        <li>
          2) <b>Üretici & Lokasyon:</b> Çiftçi/kooperatif ve parsel koordinatları
        </li>
        <li>
          3) <b>Parti Oluşturma:</b> Ekim, bakım ve hasat zaman çizelgesi
        </li>
        <li>
          4) <b>Kalite Analizi:</b> Çimlenme, safiyet, nem, Brix
        </li>
        <li>
          5) <b>Paketleme & Depo:</b> Parti–LOT eşleşmesi
        </li>
        <li>
          6) <b>Dağıtım & Mağaza:</b> Raf ve müşteri doğrulaması
        </li>
      </ol>
    </div>
  );
}

const FAQ = [
  {
    q: "QR kodu okutmadan bilgiye ulaşabilir miyim?",
    a: "Evet, parti/LOT/QR kodunu manuel arama alanına girerek sorgulayabilirsiniz.",
  },
  {
    q: "Sertifika doğrulaması nasıl yapılıyor?",
    a: "Yetkili kuruluşların verdiği belgeler parti kaydına eklenir ve düzenli denetimler yapılır.",
  },
  {
    q: "Kişisel veriler saklanıyor mu?",
    a: "Tüketicinin kişisel verileri toplanmaz; üretici ve kalite süreci şeffaf şekilde kayıt altındadır.",
  },
];
