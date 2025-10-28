// File: app/satis-kanallari/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Globe2,
  Truck,
  MapPin,
  ShoppingCart,
  Phone,
  MessageCircle,
  BadgeCheck,
  ArrowRight,
  Search as SearchIcon,
  Package,
  Users,
} from "lucide-react";

/* ================= Types & Data ================= */

type TabKey = "domestic" | "international";
type ChannelType = "Online Mağaza" | "Yerel Dağıtım" | "Perakende" | "Distribütör";

type Channel = {
  id: string;
  title: string;
  subtitle: string;
  type: ChannelType;
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
      id: "istanbul-bayi",
      title: "İstanbul Yerel Dağıtım",
      subtitle: "Avcılar merkezli bölgesel dağıtım",
      type: "Yerel Dağıtım",
      city: "İstanbul",
      region: "Marmara",
      tags: ["Soğuk Zincir", "Aynı Gün"],
      image: "/images/channels/istanbul.jpg",
      phone: "+902167558850",
      whatsapp: "902167558850",
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
      id: "mena-distributor",
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

/* ================= Page ================= */

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

  const COMPANY_ADDRESS =
    "Üniversite Mah. Civan Sk. Allure Tower İstanbul Sitesi A Blok No:1 İç Kapı No:271, Avcılar / İstanbul";
  const MAP_TR = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_ADDRESS)}&output=embed`;
  const MAP_KWT = "https://www.google.com/maps?q=Kuwait+City&output=embed";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-[#f8fdf9] to-white overflow-hidden">
      {/* Üst şerit */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      {/* Arka plan hafif dalga */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-sales" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
              <path d="M0,70 Q35,50 70,70 T140,70" fill="none" stroke="#27ae60" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-sales)" />
        </svg>
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-12 md:grid-cols-2 md:items-center mb-20"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
            >
              Heirloom Çeşitler için
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="block mt-3 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent bg-[length:200%]"
              >
                Esnek Dağıtım Ağı
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl text-gray-700 leading-relaxed max-w-2xl"
            >
              GG SEED WORLD ürünlerine <b>resmi online mağaza</b>, İstanbul merkezli <b>yerel dağıtım</b> ve seçili <b>yurt dışı perakende ortakları</b> üzerinden ulaşabilirsiniz.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Pill icon={<BadgeCheck className="h-5 w-5" />} text="Yetkili bayi ağı" color="green" />
              <Pill icon={<Truck className="h-5 w-5" />} text="Hızlı sevkiyat" color="green" />
              <Pill icon={<Globe2 className="h-5 w-5" />} text="Uluslararası erişim" color="amber" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="relative h-80 md:h-96 rounded-3xl overflow-hidden border-2 border-[#27ae60]/20 shadow-2xl ring-1 ring-[#27ae60]/10"
          >
            <Image src="/pages/1.png" alt="Satış kanalları hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="absolute bottom-6 left-6 inline-flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md px-6 py-3.5 border-2 border-[#27ae60]/30 text-base font-bold text-gray-900 shadow-xl"
            >
              <ShoppingCart className="h-6 w-6 text-[#27ae60]" />
              Online + Perakende
            </motion.div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
          </motion.div>
        </motion.section>

        {/* TABLAR + ARAMA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-3">
              <Tab active={tab === "domestic"} onClick={() => setTab("domestic")} icon={<Store className="h-5 w-5" />}>
                Yurt İçi
              </Tab>
              <Tab active={tab === "international"} onClick={() => setTab("international")} icon={<Globe2 className="h-5 w-5" />}>
                Yurt Dışı
              </Tab>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="w-full sm:w-96"
            >
              <label className="relative block">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Şehir, kanal, tür ara..."
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-5 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 transition-all duration-300"
                />
              </label>
            </motion.div>
          </div>

          {/* GRID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="wait">
              {channels.length > 0 ? (
                channels.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <ChannelCard c={c} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50 p-12 text-center"
                >
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-700">Aramanızla eşleşen kanal bulunamadı.</p>
                  <p className="text-sm text-gray-500 mt-2">Farklı bir arama terimi deneyin.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* HARİTA BLOKLARI */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mb-20 grid gap-8 md:grid-cols-2"
        >
          <MapCard title="Türkiye Dağıtım (Merkez: Avcılar / İstanbul)" src={MAP_TR} icon={<MapPin className="h-6 w-6" />} />
          <MapCard title="Kuveyt Ortak Noktalar (Kuwait City)" src={MAP_KWT} icon={<Globe2 className="h-6 w-6" />} />
        </motion.section>

        {/* BAYİ / DİSTRİBÜTÖR OL CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mb-12"
        >
          <motion.div whileHover={{ scale: 1.005 }} className="rounded-[40px] bg-gradient-to-br from-[#27ae60] via-[#1b7f3a] to-[#27ae60] p-1.5 shadow-2xl">
            <div className="rounded-[38px] bg-white/95 backdrop-blur-md p-10 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                    className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3"
                  >
                    <Users className="h-9 w-9 text-[#f39c12]" />
                    Bayi / Distribütör Olun
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2.3 }}
                    className="mt-4 text-lg text-gray-700 leading-relaxed"
                  >
                    Bölgesel satış noktası, franchise veya distribütörlük için başvuru yapın. Eğitim, tanıtım desteği ve izlenebilirlik altyapısı birlikte.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.4 }}
                  className="flex flex-col sm:flex-row gap-4 md:justify-end"
                >
                  <Link
                    href="/basvuru"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] hover:from-[#27ae60] hover:to-[#1b7f3a] text-white font-extrabold px-8 py-4.5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Başvuru Yap
                  </Link>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[#27ae60] bg-white px-8 py-4.5 text-[#1b7f3a] font-extrabold hover:bg-[#27ae60]/5 hover:scale-105 transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                    İletişim
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}

/* ================= Components ================= */

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
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 text-base font-extrabold transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-xl border-2 border-transparent"
          : "border-2 border-gray-200 text-gray-700 bg-white hover:border-[#27ae60]/30 hover:shadow-md"
      }`}
    >
      {icon}
      {children}
    </motion.button>
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
  const gradientClass = color === "green" ? "from-[#1b7f3a] to-[#27ae60]" : "from-[#f39c12] to-[#d35400]";
  return (
    <motion.span whileHover={{ scale: 1.1 }} className={`inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r ${gradientClass} px-4 py-2 text-sm font-bold text-white shadow-lg`}>
      {icon}
      {text}
    </motion.span>
  );
}

function ChannelCard({ c }: { c: Channel }) {
  return (
    <motion.article whileHover={{ y: -8, scale: 1.02 }} className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl hover:shadow-2xl hover:border-[#27ae60]/40 transition-all duration-500">
      <div className="relative h-52 w-full overflow-hidden">
        <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 text-sm font-bold border border-[#27ae60]/30 shadow-lg">
          <MapPin className="h-4 w-4 text-[#27ae60]" />
          {c.city}
        </motion.div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="text-xl font-extrabold text-gray-900">{c.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{c.subtitle}</p>
          </div>
          <span className="rounded-full border-2 border-[#27ae60]/30 bg-gradient-to-br from-[#27ae60]/10 to-[#f39c12]/10 px-3 py-1 text-xs font-bold text-[#1b7f3a]">
            {c.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {c.tags.map((t, i) => (
            <motion.span
              key={t}
              whileHover={{ scale: 1.1 }}
              className="text-xs font-bold px-3 py-1.5 rounded-full border"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, rgba(27,127,58,0.1) 0%, rgba(39,174,96,0.1) 100%)"
                    : "linear-gradient(135deg, rgba(243,156,18,0.1) 0%, rgba(211,84,0,0.1) 100%)",
                color: i % 2 === 0 ? "#1b7f3a" : "#d35400",
                borderColor: i % 2 === 0 ? "#27ae60" : "#f39c12",
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {c.href && (
            <Link href={c.href} className="group/btn inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-5 py-3 text-sm font-extrabold hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all hover:scale-105">
              Git
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
          {c.phone && (
            <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:border-[#27ae60]/30 transition-all">
              <Phone className="h-4 w-4" />
              Ara
            </a>
          )}
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:border-[#27ae60]/30 transition-all">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function MapCard({ title, src, icon }: { title: string; src: string; icon: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-3xl overflow-hidden border-2 border-[#27ae60]/20 bg-white shadow-2xl ring-1 ring-[#27ae60]/10">
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#27ae60]/5 to-[#f39c12]/5">
        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
          {icon}
          {title}
        </h3>
        <span className="rounded-full border-2 border-[#27ae60]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#1b7f3a]">
          Harita
        </span>
      </div>
      <iframe title={title} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={src} />
    </motion.div>
  );
}
