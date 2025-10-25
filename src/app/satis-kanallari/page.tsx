// File: app/satis-kanallari/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Store,
  Globe2,
  Truck,
  MapPin,
  ShoppingCart,
  Phone,
  MessageCircle,
  BadgeCheck,
  ChevronDown,
  ArrowRight,
  Search as SearchIcon,
} from "lucide-react";

export default function SalesChannelsPage() {
  const [tab, setTab] = useState<TabKey>("domestic");
  const [q, setQ] = useState("");

  const channels = useMemo(() => {
    const base = DATA[tab];
    if (!q) return base;
    const qq = q.toLowerCase();
    return base.filter((c) =>
      [c.title, c.city, c.region, c.type].join(" ").toLowerCase().includes(qq)
    );
  }, [tab, q]);

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
            <h1 className="mt-1 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Heirloom Çeşitler için
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Esnek Dağıtım Ağı
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              GG SEED WORLD ürünlerine online mağaza, yerel dağıtım ve yurt dışı
              perakende ortakları üzerinden ulaşabilirsiniz.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill icon={<BadgeCheck className="h-4 w-4" />} text="Yetkili bayi ağı" color="green" />
              <Pill icon={<Truck className="h-4 w-4" />} text="Hızlı sevkiyat" color="green" />
              <Pill icon={<Globe2 className="h-4 w-4" />} text="Uluslararası erişim" color="amber" />
            </div>
          </div>

          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <Image
              src="/images/sales-hero.jpg"
              alt="Satış kanalları hero"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 border-2 border-gray-200 text-sm font-semibold text-gray-900 shadow-lg">
              <ShoppingCart className="h-4 w-4 text-[#27ae60]" /> Online + Perakende
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </div>
        </section>

        {/* TABLAR + ARAMA */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Tab active={tab === "domestic"} onClick={() => setTab("domestic")} icon={<Store className="h-4 w-4" />}>
              Yurt İçi
            </Tab>
            <Tab active={tab === "international"} onClick={() => setTab("international")} icon={<Globe2 className="h-4 w-4" />}>
              Yurt Dışı
            </Tab>

            <div className="ml-auto w-full sm:w-80">
              <label className="relative block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Şehir, kanal, tür ara..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:outline-none transition-colors"
                />
              </label>
            </div>
          </div>

          {/* GRID */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => (
              <ChannelCard key={c.id} c={c} />
            ))}
            {channels.length === 0 && (
              <div className="col-span-full rounded-3xl border-2 border-gray-200 bg-white p-6 text-gray-700">
                Aramanızla eşleşen kanal bulunamadı.
              </div>
            )}
          </div>
        </section>

        {/* HARİTA BLOKLARI */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <MapCard title="Türkiye Dağıtım" src="https://www.google.com/maps?q=Istanbul&output=embed" />
          <MapCard title="Kuveyt Ortak Noktalar" src="https://www.google.com/maps?q=Kuwait+City&output=embed" />
        </section>

        {/* BAYİ / DİSTRİBÜTÖR OL CTA */}
        <section className="mb-12 rounded-3xl border-2 border-gray-200 bg-white p-6 md:p-8 shadow-2xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Bayi / Distribütör Olun</h3>
              <p className="mt-2 text-gray-700">
                Bölgesel satış noktası, franchise veya distribütörlük için başvuru yapın.
                Eğitim, tanıtım desteği ve izlenebilirlik altyapısı birlikte.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/basvuru"
                className="rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-bold px-5 py-3 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
              >
                Başvuru Yap
              </Link>
              <Link
                href="/iletisim"
                className="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
              >
                İletişim
              </Link>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h3>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Accordion key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ----------------- Bileşenler ----------------- */

function Tab({
  active,
  children,
  onClick,
  icon,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const activeClass =
    "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-lg border-transparent";
  const inactiveClass =
    "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
        active ? activeClass : inactiveClass
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

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

function ChannelCard({ c }: { c: Channel }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl hover:border-[#27ae60] transition-all">
      <div className="relative h-44 w-full overflow-hidden">
        <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1 text-[11px] font-semibold border border-gray-200">
          <MapPin className="h-3.5 w-3.5 text-[#27ae60]" /> {c.city}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{c.title}</h4>
            <p className="text-xs text-gray-600">{c.subtitle}</p>
          </div>
          <span className="rounded-full border-2 border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-800">
            {c.type}
          </span>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {c.tags.map((t, i) => (
            <li
              key={t}
              className="font-semibold px-2 py-0.5 rounded-full"
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
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {c.href && (
            <Link
              href={c.href}
              className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-4 py-2 text-sm font-bold hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all"
            >
              Git
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          )}
          {c.phone && (
            <a
              href={`tel:${c.phone}`}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" /> Ara
            </a>
          )}
          {c.whatsapp && (
            <a
              href={`https://wa.me/${c.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function MapCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-3xl overflow-hidden border-2 border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="rounded-full border-2 border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-800">
          Harita
        </span>
      </div>
      <iframe
        title={title}
        className="h-64 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />
    </div>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-gray-900">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <p className="px-4 pb-4 text-sm text-gray-700">{a}</p>}
    </div>
  );
}

/* ----------------- Veri ----------------- */

type TabKey = "domestic" | "international";

type Channel = {
  id: string;
  title: string;
  subtitle: string;
  type: "Online Mağaza" | "Yerel Dağıtım" | "Perakende" | "Distribütör";
  city: string;
  region: string;
  tags: string[];
  image: string;
  href?: string;
  phone?: string;
  whatsapp?: string;
};

const DATA: Record<TabKey, Channel[]> = {
  domestic: [
    {
      id: "online-shop",
      title: "Online Mağaza",
      subtitle: "Resmi e-ticaret kanalımız",
      type: "Online Mağaza",
      city: "İstanbul",
      region: "Marmara",
      tags: ["Heirloom", "İzlenebilir", "Hızlı Kargo"],
      image: "/images/channels/online.jpg",
      href: "/magaza",
      whatsapp: "902167558850",
    },
    {
      id: "lezzet-kapinda",
      title: "Lezzet Kapında",
      subtitle: "Yerel dağıtım ağı",
      type: "Yerel Dağıtım",
      city: "İstanbul",
      region: "Marmara",
      tags: ["Taze Teslimat", "Soğuk Zincir"],
      image: "/images/channels/lezzet.jpg",
      href: "/lezzet-kapinda",
      phone: "+902167558850",
    },
  ],
  international: [
    {
      id: "gg-market-kwi",
      title: "GG Market – KWI",
      subtitle: "Kuveyt perakende ortağı",
      type: "Perakende",
      city: "Kuwait City",
      region: "Kuveyt",
      tags: ["İhracat", "Heirloom", "Premium"],
      image: "/images/channels/kwi.jpg",
      href: "/gg-market-kwi",
    },
    {
      id: "m-e-distributor",
      title: "MENA Distribütör Ağı",
      subtitle: "Bölgesel distribütörlük",
      type: "Distribütör",
      city: "Dubai",
      region: "BAE",
      tags: ["B2B", "RFQ", "Soğuk Zincir"],
      image: "/images/channels/mena.jpg",
      href: "/rfq",
    },
  ],
};

/* ----------------- SSS ----------------- */
const FAQ = [
  {
    q: "Online mağazadan hangi ülkelere gönderim var?",
    a: "Şu an Türkiye geneli kargo mevcuttur. Yurt dışı gönderimler için RFQ üzerinden talep alıyoruz.",
  },
  {
    q: "Distribütörlük şartları neler?",
    a: "Bölgesel soğuk zincir kapasitesi, showroom/mağaza alanı ve satış sonrası destek kriterleri değerlendirilmektedir.",
  },
  {
    q: "Yerel dağıtım saatleri?",
    a: "Hafta içi 09:00–18:00, Cumartesi 10:00–15:00 (bölgeler arası farklılık gösterebilir).",
  },
];
