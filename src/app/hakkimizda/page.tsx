/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Target,
  TrendingUp,
  Award,
  Factory,
  Landmark,
  Globe,
  QrCode,
  AwardIcon,
} from "lucide-react";

function Section({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <section className={`mx-auto w-full max-w-7xl px-4 ${className}`}>{children}</section>;
}

function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "gradient" | "dark";
}) {
  const base =
    "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all";
  const v =
    variant === "gradient"
      ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-md hover:shadow-lg hover:scale-105"
      : variant === "dark"
      ? "bg-gray-900 text-white hover:brightness-110"
      : "bg-gradient-to-br from-green-50 to-amber-50 text-green-800 border border-green-200/60 hover:border-green-300 hover:scale-105";
  return <span className={`${base} ${v}`}>{children}</span>;
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Üst ince degrade şerit */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden
      />

      {/* HERO — tam ekran kaplayan görsel */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="/about/about.jpg"
          alt="GG Seed World - Sürdürülebilir tarım ekosistemi"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
        >
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <Chip variant="gradient">🌱 Heirloom (Ata Tohumu)</Chip>
              <Chip variant="gradient">📱 QR Kod & İzlenebilirlik</Chip>
              <Chip variant="gradient">♻️ Sürdürülebilir Üretim</Chip>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white tracking-tight drop-shadow-lg">
              Tohumdan Sofraya
              <br />
              <span className="bg-gradient-to-r from-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Şeffaf ve İzlenebilir
              </span>{" "}
              Ekosistem
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md max-w-3xl mx-auto">
              Yerel miras tohumları koruyor, izlenebilir üretimle şeffaflık sağlıyor ve
              teknolojiyle (blockchain & akıllı tarım) sürdürülebilir bir gelecek inşa ediyoruz.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/magaza"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-8 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all duration-300 hover:scale-105"
                aria-label="Mağazaya git"
              >
                Mağazaya Git
              </Link>
              <Link
                href="/izlenebilirlik"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-white/50 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                aria-label="İzlenebilirlik"
              >
                İzlenebilirlik
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Biz Kimiz */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-12 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-2 rounded-full bg-gradient-to-b from-[#27ae60] to-[#f39c12]" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Biz Kimiz?</h2>
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              GG Seed World; yerel ata tohumlarını çoğaltan, her partiyi{" "}
              <strong>QR kod</strong> ve kayıtlı süreçlerle izlenebilir kılan, sürdürülebilir tarım
              üretimini teknolojinin şeffaflığıyla birleştiren bir ekosistemdir. Amaç; gıda
              bağımsızlığına katkı sunmak ve doğal döngüye saygılı üretimi ölçeklemektir.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Target, text: "Heirloom çeşitlerde uzmanlık" },
                { icon: Shield, text: "Coğrafi kökenin korunması" },
                { icon: Award, text: "Organik ve kalite odaklı süreçler" },
                { icon: TrendingUp, text: "Blockchain tabanlı izlenebilirlik" },
              ].map((i, idx) => (
                <motion.div
                  key={i.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex items-center gap-4 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 transition-all hover:border-[#27ae60] hover:scale-105 hover:shadow-lg"
                >
                  <div className="rounded-xl bg-gradient-to-br from-[#27ae60] to-[#f39c12] p-3 text-white shadow-md transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <i.icon size={24} />
                  </div>
                  <span className="text-base font-medium text-gray-900">{i.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Kurumsal kutu */}
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-[#27ae60] to-[#f39c12] p-4 text-white shadow-lg">
              <Landmark size={32} />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Kurumsal</h3>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
              <li>
                <strong>Unvan:</strong> Global Nexus Sağlık Kozmetik Gıda ve Ticaret A.Ş.
              </li>
              <li>
                <strong>MERSİS:</strong> 0396168976800001
              </li>
              <li>
                <strong>Adres:</strong> Üniversite Mah. Civan Sk. Allure Tower İstanbul Sitesi A
                Blok No:1, Daire:271 Avcılar / İstanbul
              </li>
              <li>
                <strong>Yetkili:</strong> Yönetim Kurulu Başkanı Adem Karaveli
              </li>
            </ul>
            <div className="mt-6">
              <Chip variant="gradient">Resmî Bilgiler</Chip>
            </div>
          </motion.aside>
        </motion.div>
      </Section>

      {/* İzlenebilir Tedarik Zinciri */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-[32px] bg-gradient-to-br from-[#27ae60] via-[#f39c12] to-[#d35400] p-1 shadow-2xl"
        >
          <div className="rounded-[30px] bg-white p-10 md:p-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  İzlenebilir Tedarik Zinciri
                </h2>
                <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                  Her çeşit; coğrafi köken, üretim geçmişi ve kalite kayıtlarıyla etiketlenir. Paket
                  üzerindeki QR kodla parti geçmişi ve yetiştirme rehberine anında erişim sağlanır.
                </p>
                <ul className="space-y-6">
                  {[
                    { icon: Globe, t: "Coğrafi Köken", d: "Orijin ve üretici bilgisi kayıtlı" },
                    { icon: AwardIcon, t: "Kalite & Sertifika", d: "Bağımsız denetim ve standartlar" },
                    { icon: QrCode, t: "QR Kod", d: "Parti geçmişi & yetiştirme kılavuzu" },
                  ].map((f, idx) => (
                    <motion.li
                      key={f.t}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      viewport={{ once: true }}
                      className="group flex items-center gap-6 rounded-2xl p-6 transition-all hover:bg-gray-50 hover:shadow-md"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#27ae60] to-[#f39c12] text-white shadow-lg transition-transform group-hover:scale-110">
                        <f.icon size={32} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">{f.t}</p>
                        <p className="mt-1 text-base text-gray-600">{f.d}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-[#f39c12]/20 to-[#27ae60]/20 opacity-50 blur-3xl" />
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-gray-200/50">
                  <Image
                    src="/about/two.png"
                    alt="İzlenebilir tedarik zinciri görseli"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
             
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Hikâyemiz / Zaman Çizelgesi */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">Hikâyemiz</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Ata yadigârı tohumların koruma ve çoğaltımından, bugün blockchain tabanlı izlenebilir
            üretim ekosistemine…
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#27ae60] to-[#f39c12]" />
          <ul className="space-y-12 md:space-y-16">
            {[
              {
                y: "2022",
                t: "Koleksiyonun Filizlenmesi",
                d: "Ata tohumlarının farklı tür ve çeşitleri laboratuvar denemeleri ile yeniden canlandırıldı.",
              },
              {
                y: "2023–2024",
                t: "Deneme Alanları & Süreç Kayıtları",
                d: "Tarla/sera üretimleri, kayıt ve etiketleme sistemiyle ölçeklendi.",
              },
              {
                y: "2025",
                t: "Global Nexus A.Ş. & GG Ekosistem",
                d: "Kurumsal yapılanma ve GG SeedWorld ile izlenebilir üretim modeli yaygınlaştırıldı.",
              },
            ].map((n, idx) => (
              <motion.li
                key={n.t}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex ${idx % 2 === 0 ? "flex-row-reverse" : ""} items-center justify-between md:gap-8`}
              >
                <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="inline-block rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:scale-105">
                    <div className="text-sm font-bold text-[#27ae60]">{n.y}</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">{n.t}</div>
                    <div className="mt-2 text-base text-gray-600">{n.d}</div>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-4 ring-[#27ae60] md:flex hidden" />
              </motion.li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Yönetim & Ekip */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">Yönetim & Ekip</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Tarım, sağlık, finans ve hukuk alanlarında deneyimli kadro ile süreç yönetimi.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Adem Karaveli", role: "YKB & CEO" },
            { name: "Dr. Yusuf Maraşlı", role: "Yönetim Kurulu Üyesi – Bilimsel İnovasyon" },
            { name: "İbrahim Aydoğdu", role: "Finans & Muhasebe" },
            { name: "Av. Barış Kerim", role: "Hukuk Danışmanı" },
            { name: "Muammer Bilgiç", role: "Sertifikalı Üretim Müdürü" },
            { name: "Züleyha Ozan", role: "Ziraat Mühendisi" },
          ].map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:border-[#27ae60] hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#27ae60]/0 to-[#f39c12]/0 group-hover:from-[#27ae60]/5 group-hover:to-[#f39c12]/5 transition-all" />
              <div className="text-2xl font-bold text-gray-900">{p.name}</div>
              <div className="mt-1 text-base text-gray-600">{p.role}</div>
           
            </motion.div>
          ))}
        </div>
      </Section>

      {/* İş Modeline Katılım */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-[32px] bg-gradient-to-br from-gray-50 to-white p-1 shadow-2xl ring-1 ring-gray-200/50"
        >
          <div className="rounded-[30px] bg-gradient-to-br from-white to-gray-50 p-10 md:p-16">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">İş Modeline Katılım</h2>
              <p className="text-lg md:text-xl text-gray-600">
                Kurumsal ortaklık, bireysel üretici desteği ve katılımcı programlarıyla ekosistemimize katılın.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: "🏢",
                  gradient: "from-[#1b7f3a] to-[#27ae60]",
                  title: "Kurumsal Ortaklık",
                  items: ["Toplu tedarik", "Teknik destek", "Özel fiyat", "Kalite garantisi"],
                  href: "/basvuru",
                },
                {
                  icon: "👨‍🌾",
                  gradient: "from-[#27ae60] to-[#f39c12]",
                  title: "Bireysel Üretici",
                  items: ["Eğitim", "Tohum kredisi", "Hasat garantisi", "Pazarlama desteği"],
                  href: "/basvuru",
                },
                {
                  icon: "🤝",
                  gradient: "from-[#f39c12] to-[#d35400]",
                  title: "Katılımcı Program",
                  items: ["Franchise", "Distribütörlük", "Sertifikasyon", "Sürekli gelir"],
                  href: "/basvuru",
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${card.gradient} text-4xl text-white shadow-xl transition-transform group-hover:scale-110`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">{card.title}</h3>
                  <ul className="mb-8 space-y-3">
                    {card.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 size={20} className="text-[#27ae60]" />
                        <span className="text-base">{it}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#f39c12] py-4 text-base font-bold text-white transition-all hover:from-[#f39c12] hover:to-[#27ae60] hover:scale-105"
                    aria-label={`${card.title} başvuru`}
                  >
                    Başvuru Yap
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Satış Kanalları */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-16 w-2 rounded-full bg-gradient-to-b from-[#27ae60] to-[#f39c12]" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Satış Kanalları</h2>
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🏪",
              title: "GG Market – KWI",
              subtitle: "Kuveyt",
              href: "/gg-market-kwi",
              color: "from-[#1b7f3a] to-[#27ae60]",
            },
            {
              icon: "🍽️",
              title: "Lezzet Kapında",
              subtitle: "Yerel Dağıtım",
              href: "/lezzet-kapinda",
              color: "from-[#f39c12] to-[#d35400]",
            },
            {
              icon: "🛒",
              title: "Online Mağaza",
              subtitle: "E-Ticaret",
              href: "/magaza",
              color: "from-[#27ae60] to-[#f39c12]",
            },
          ].map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:border-[#27ae60] hover:shadow-2xl hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="text-6xl mb-6">{c.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900">{c.title}</h3>
              <p className="mt-1 text-base text-gray-600">{c.subtitle}</p>
              <Link
                href={c.href}
                className="mt-6 flex items-center gap-2 text-base font-semibold text-[#27ae60] transition-transform group-hover:translate-x-2 group-hover:text-[#1b7f3a]"
              >
                Detaylı Bilgi
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 text-base text-gray-500 text-center"
        >
          Not: Ticaret süreçleri, ilgili bakanlık ve mevzuatlara uygun biçimde kayıt altına alınır.
        </motion.p>
      </Section>

  
    </div>
  );
}