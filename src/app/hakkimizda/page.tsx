// File: app/hakkimizda/page.tsx
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, Target, Shield, TrendingUp, Users, Award, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda | Seed World",
  description:
    "Ata tohumu odaklı, izlenebilir tedarik zinciri ve sürdürülebilir tarım ekosistemi hakkında.",
  openGraph: {
    title: "Hakkımızda | Seed World",
    description:
      "Heirloom çeşitler, uçtan uca izlenebilirlik ve sürdürülebilir üretim standartları.",
    images: ["/images/fields-hero.jpg"],
  },
};

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
  variant?: "default" | "gradient";
}) {
  const base = "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all";
  const v =
    variant === "gradient"
      ? "bg-gradient-to-r from-green-500 to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105"
      : "bg-gradient-to-br from-green-50 to-amber-50 text-green-800 border border-green-200/50 hover:border-green-300 hover:scale-105";
  return <span className={`${base} ${v}`}>{children}</span>;
}

export default function AboutPage() {
  return (
    <div className="pb-20 bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* üst ince degrade şerit */}
      <div
        className="h-1 w-full shadow-sm"
        style={{
          background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden
      />

      {/* HERO */}
      <Section className="pt-16 pb-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
        

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
              Ata Tohumu ile
              <br />
              <span className="bg-gradient-to-r from-green-600 via-green-500 to-amber-500 bg-clip-text text-transparent">
                İzlenebilir
              </span>{" "}
              Ekosistem
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed">
              Heirloom çeşitler, uçtan uca izlenebilir tedarik ve sürdürülebilir üretim
              standartları ile çiftçiden sofraya şeffaflık sağlıyoruz. Her paketteki{" "}
              <span className="font-semibold text-green-700">QR kod</span> ile tohum geçmişi, üretim bilgileri ve yetiştirme rehberi görüntülenebilir.
            </p>

            <div className="flex flex-wrap gap-3" aria-label="Öne çıkan özellik etiketleri">
              <Chip>🌱 Heirloom</Chip>
              <Chip>🏅 Organik &amp; GAP</Chip>
              <Chip>📱 QR Kod Takip</Chip>
              <Chip>♻️ Sürdürülebilir</Chip>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/magaza"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold px-6 py-3.5 shadow-lg hover:shadow-xl transition-all"
                aria-label="Mağazaya git"
              >
                Mağazaya Git
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-green-200 hover:border-green-400 bg-white hover:bg-green-50 text-green-700 text-sm font-bold px-6 py-3.5 transition-all"
                aria-label="RFQ talebi oluştur"
              >
                RFQ Talebi
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-amber-400 rounded-3xl opacity-20 blur-2xl" aria-hidden />
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border-2 border-green-200/60 shadow-2xl">
              <Image
                src="/images/fields-hero.jpg"
                alt="Sürdürülebilir tarım ve izlenebilir tedarik"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2.5 shadow-lg border-2 border-white">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-sm font-bold text-gray-800">%100 İzlenebilir</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* BİZ KİMİZ */}
      <Section className="py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-amber-500 rounded-full" aria-hidden />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Biz Kimiz?</h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Yerel tohumların korunması ve çoğaltılması için çalışan, dünya
              standartlarında izlenebilirlik sunan bir tohum ekosistemi kuruyoruz.
              Kurumsal tarım işletmelerinden bireysel üreticilere kadar herkese;
              tedarikten hasat garantisine uzanan uçtan uca çözümler sağlıyoruz.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, text: "Heirloom çeşitlerde uzmanlık" },
                { icon: Shield, text: "Coğrafi köken bilgisinin korunması" },
                { icon: Award, text: "Organik & kalite sertifikaları" },
                { icon: TrendingUp, text: "Şeffaf QR kod takip sistemi" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-white to-green-50/50 border-2 border-green-200/60 p-5 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <item.icon size={20} aria-hidden />
                  </div>
                  <span className="text-sm font-medium text-gray-700 pt-2">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative">
            <div className="sticky top-24 rounded-3xl border-2 border-green-200/60 bg-gradient-to-br from-white via-green-50/30 to-amber-50/30 p-8 shadow-xl">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-green-500 to-amber-500 text-white shadow-lg mb-4" aria-hidden>
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Değer Önerimiz</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tohumun hikâyesi şeffaftır: üretici, bölge, parti ve kalite süreci tek bir QR
                kodda toplanır. Eğitim ve teknik destekle verimi birlikte artırırız.
              </p>
              <div className="space-y-3">
                <Chip variant="gradient">✓ İzlenebilir Tedarik</Chip>
                <Chip variant="gradient">✓ Teknik Destek</Chip>
                <Chip variant="gradient">✓ Kalite Garantisi</Chip>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* İZLENEBİLİRLİK BLOĞU */}
      <Section className="py-20">
        <div className="rounded-[32px] bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-1 shadow-2xl">
          <div className="rounded-[30px] bg-gradient-to-br from-green-50/95 to-amber-50/95 backdrop-blur-xl p-10 md:p-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">İzlenebilir Tedarik Zinciri</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Her çeşidin orijinal coğrafi kökeni ve üretim geçmişi kayıt altındadır.
                  Paketteki QR kodu okutarak parti geçmişi ve yetiştirme kılavuzuna anında erişebilirsiniz.
                </p>
                <ul className="space-y-5" aria-label="İzlenebilirlik özellikleri">
                  {[
                    { icon: "🌍", t: "Coğrafi Köken", d: "Orijinal bölge ve üretici bilgisi" },
                    { icon: "🏆", t: "Kalite Sertifikaları", d: "Uluslararası organik & kalite standartları" },
                    { icon: "📱", t: "QR Kod Sistemi", d: "Parti geçmişi ve yetiştirme rehberi" },
                  ].map((f) => (
                    <li key={f.t} className="flex items-start gap-4 group">
                      <div className="flex items-center justify-center text-2xl w-14 h-14 rounded-2xl bg-white border-2 border-green-200 shadow-md group-hover:scale-110 group-hover:border-green-400 transition-all">
                        <span aria-hidden>{f.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{f.t}</p>
                        <p className="text-sm text-gray-700 mt-1">{f.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-green-400 rounded-3xl opacity-30 blur-2xl" aria-hidden />
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border-2 border-white/60 shadow-2xl">
                  <Image
                    src="/images/traceability.jpg"
                    alt="İzlenebilir tedarik zinciri görseli"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2.5 shadow-lg border-2 border-green-200">
                    <CheckCircle2 className="text-green-600" size={18} />
                    <span className="text-sm font-bold text-green-800">%100 İzlenebilir</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* AR-GE & SERTİFİKALAR */}
      <Section className="py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ar-Ge &amp; Sertifikalar</h2>
          <p className="text-lg text-gray-700">
            Bölgesel adaptasyon, verimlilik ve kalite projeleri yürütüyor; süreçlerimizi bağımsız kuruluşlarla denetliyoruz.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="group aspect-[3/2] rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-green-300 hover:shadow-lg flex items-center justify-center text-gray-400 hover:text-green-600 text-sm font-medium transition-all"
              aria-label={`Sertifika/partner logo ${i + 1}`}
            >
              Logo {i + 1}
            </div>
          ))}
        </div>
      </Section>

      {/* İŞ MODELİNE KATILIM */}
      <Section className="py-20">
        <div className="rounded-[32px] bg-gradient-to-br from-amber-100 via-green-100 to-green-200 p-1 shadow-2xl">
          <div className="rounded-[30px] bg-white p-10 md:p-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">İş Modeline Katılım</h2>
              <p className="text-lg text-gray-700">
                Kurumsal ortaklık, bireysel üretici desteği ve katılımcı programlarıyla ekosistemimize katılın.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: "🏢",
                  gradient: "from-blue-500 to-blue-600",
                  title: "Kurumsal Ortaklık",
                  items: ["Toplu tohum tedariği", "Teknik destek", "Özel fiyatlandırma", "Kalite garantisi"],
                  href: "/basvuru",
                },
                {
                  icon: "👨‍🌾",
                  gradient: "from-green-500 to-green-600",
                  title: "Bireysel Üretici",
                  items: ["Eğitim programları", "Tohum kredisi", "Hasat garantisi", "Pazarlama desteği"],
                  href: "/basvuru",
                },
                {
                  icon: "🤝",
                  gradient: "from-amber-500 to-orange-600",
                  title: "Katılımcı Program",
                  items: ["Franchise sistemi", "Bölgesel distribütörlük", "Eğitim & sertifikasyon", "Sürekli gelir"],
                  href: "/basvuru",
                },
              ].map((card) => (
                <div key={card.title} className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity`} aria-hidden />
                  <div className="relative rounded-3xl bg-white border-2 border-gray-200 hover:border-transparent p-8 shadow-lg hover:shadow-2xl transition-all">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} text-white text-3xl shadow-lg mb-5`} aria-hidden>
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                    <ul className="space-y-3 mb-6">
                      {card.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" aria-hidden />
                          <span className="text-sm">{it}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={card.href}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-sm font-bold py-3.5 transition-all"
                      aria-label={`${card.title} başvuru`}
                    >
                      Başvuru Yap
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SATIŞ KANALLARI */}
      <Section className="py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-amber-500 rounded-full" aria-hidden />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Satış Kanalları</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🏪", title: "GG Market – KWI", subtitle: "Kuveyt", href: "/gg-market-kwi", color: "from-blue-500 to-blue-600" },
            { icon: "🍽️", title: "Lezzet Kapında", subtitle: "Yerel Dağıtım", href: "/lezzet-kapinda", color: "from-orange-500 to-red-600" },
            { icon: "🛒", title: "Online Mağaza", subtitle: "E-Ticaret", href: "/magaza", color: "from-green-500 to-green-600" },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white hover:border-transparent p-8 shadow-lg hover:shadow-2xl transition-all"
              aria-label={`${c.title} detay`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-10 transition-opacity`} aria-hidden />
              <div className="relative">
                <div className="text-5xl mb-4" aria-hidden>
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{c.subtitle}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 group-hover:text-green-700">
                  Detaylı Bilgi
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
