"use client";

import { useState } from "react";
import { Building2, Leaf, ShieldCheck, Sparkles, Users2, Globe2, Mail, MapPin, Phone, CalendarDays, BadgeCheck, Handshake, Target, Lightbulb, HeartHandshake, Award, TrendingUp } from "lucide-react";

export default function CorporatePage() {
    const [yearOpen, setYearOpen] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white">
            {/* Üst gradient şerit */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }} />

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                {/* HERO SECTION */}
                <section className="grid gap-10 md:grid-cols-2 md:items-center mb-16">
                    <div>

                        <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                            Sürdürülebilir Tarım için
                            <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                                Şeffaf ve İzlenebilir Ekosistem
                            </span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-700 leading-relaxed">
                            GG SEED WORLD; ata tohumu, izlenebilir tedarik ve akıllı tarım çözümleriyle çiftçiden sofraya şeffaflık sağlar. Her pakette QR kod ile köken, üretim ve kalite süreçlerini görünür kılıyoruz.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a href="#misyon" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] hover:from-[#27ae60] hover:to-[#1b7f3a] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all">
                                Daha Fazla Keşfet
                            </a>
                            <a href="/iletisim" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1b7f3a] px-6 py-3 text-sm font-semibold text-[#1b7f3a] hover:bg-[#1b7f3a] hover:text-white transition-all">
                                İletişime Geçin
                            </a>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1b7f3a]/20 to-[#f39c12]/20" />
                            <img src="/api/placeholder/800/600" alt="Kurumsal hero" className="object-cover w-full h-full" />
                            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur px-4 py-2 shadow-xl">
                                <BadgeCheck className="h-5 w-5 text-[#27ae60]" />
                                <span className="font-semibold text-gray-900">%100 İzlenebilir</span>
                            </div>
                        </div>
                        {/* Dekoratif elementler */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#f39c12] to-[#d35400] rounded-full blur-2xl opacity-20" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#1b7f3a] to-[#27ae60] rounded-full blur-2xl opacity-20" />
                    </div>
                </section>

                {/* MİSYON, VİZYON, DEĞERLER */}
                <section id="misyon" className="mb-16">
                    <div className="grid gap-6 md:grid-cols-3">
                        <GreenCard icon={Target} title="Misyonumuz" color="green">
                            <p className="text-gray-700 leading-relaxed">
                                Doğal çeşitliliği koruyarak, teknolojiyi üreticinin hizmetine sunmak ve her tohumun hikâyesini kayıt altına almak.
                            </p>
                        </GreenCard>
                        <GreenCard icon={Lightbulb} title="Vizyonumuz" color="amber">
                            <p className="text-gray-700 leading-relaxed">
                                Bölgesel adaptasyonu yüksek, sürdürülebilir üretimle dünyanın her yerinde erişilebilir ve izlenebilir tohum ekosistemi kurmak.
                            </p>
                        </GreenCard>
                        <GreenCard icon={HeartHandshake} title="Değerlerimiz" color="green">
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <Leaf className="h-4 w-4 text-[#27ae60]" />
                                    <span>Sürdürülebilirlik</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-[#27ae60]" />
                                    <span>Şeffaflık & Güven</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-[#f39c12]" />
                                    <span>Yenilikçilik</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Handshake className="h-4 w-4 text-[#f39c12]" />
                                    <span>Paydaş Odaklılık</span>
                                </li>
                            </ul>
                        </GreenCard>
                    </div>
                </section>

                {/* İSTATİSTİKLER */}
                <section className="mb-16 rounded-3xl bg-gradient-to-r from-[#0a1208] via-[#0f1a12] to-[#0a1208] p-8 md:p-12 text-white">
                    <div className="grid gap-8 md:grid-cols-4 text-center">
                        <StatBox number="2024" label="Kuruluş Yılı" icon={CalendarDays} />
                        <StatBox number="100+" label="Çiftçi Ortağı" icon={Users2} />
                        <StatBox number="50+" label="Ürün Çeşidi" icon={Award} />
                        <StatBox number="%100" label="İzlenebilirlik" icon={TrendingUp} />
                    </div>
                </section>

                {/* ŞİRKET BİLGİLERİ */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
                            Şirket Bilgileri
                        </span>
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <InfoCard icon={Globe2} title="Genel Bilgiler" gradient="green">
                            <ul className="space-y-2 text-gray-700">
                                <li>• Kuruluş: 2024</li>
                                <li>• Merkez: İstanbul, Türkiye</li>
                                <li>• Faaliyet: Tohumculuk, izlenebilirlik</li>
                                <li>• Sektör: Akıllı tarım çözümleri</li>
                            </ul>
                        </InfoCard>
                        <InfoCard icon={Phone} title="İletişim Bilgileri" gradient="amber">
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#f39c12]" />
                                    info@ggseedworld.com
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-[#f39c12]" />
                                    0216 755 88 50
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#f39c12]" />
                                    İstanbul, Türkiye
                                </li>
                            </ul>
                        </InfoCard>
                        <InfoCard icon={ShieldCheck} title="Uyum & Belgeler" gradient="green">
                            <ul className="space-y-2 text-gray-700">
                                <li>• KVKK Uyumluluğu</li>
                                <li>• Gizlilik Politikası</li>
                                <li>• Organik Sertifikalar</li>
                                <li>• GAP Standartları</li>
                                <li>• QR İzlenebilirlik</li>
                            </ul>
                        </InfoCard>
                    </div>
                </section>

                {/* ZAMAN ÇİZGİSİ */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-[#27ae60]" />
                        <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
                            Kısa Tarihçe
                        </span>
                    </h2>
                    <div className="relative pl-8">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1b7f3a] via-[#27ae60] to-[#f39c12]" />
                        {TIMELINE.map((e) => (
                            <button
                                key={e.year}
                                onClick={() => setYearOpen((y) => (y === e.year ? null : e.year))}
                                className="relative mb-6 w-full text-left group"
                            >
                                <div className="absolute -left-[21px] mt-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#27ae60] to-[#f39c12] shadow-lg ring-4 ring-white" />
                                <div className="rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 shadow-md hover:shadow-xl hover:border-[#27ae60] transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] bg-clip-text text-transparent">
                                            {e.year}
                                        </span>
                                        <span className="text-xs font-semibold text-[#f39c12]">
                                            {yearOpen === e.year ? "Gizle ▲" : "Detay ▼"}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{e.title}</p>
                                    {yearOpen === e.year && (
                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                            {e.desc}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* TAKIM */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <Users2 className="h-8 w-8 text-[#27ae60]" />
                        <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
                            Takımımız
                        </span>
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {TEAM.map((p) => (
                            <div key={p.name} className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-lg hover:shadow-2xl transition-all hover:border-[#27ae60]">
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img src="/api/placeholder/400/400" alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h4 className="text-xl font-bold text-white">{p.name}</h4>
                                        <p className="text-sm text-white/90">{p.role}</p>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-wrap gap-2">
                                        {p.tags.map((t, i) => (
                                            <span
                                                key={t}
                                                className="text-xs font-medium px-3 py-1 rounded-full"
                                                style={{
                                                    background: i % 2 === 0
                                                        ? "linear-gradient(135deg, rgba(27,127,58,0.1) 0%, rgba(39,174,96,0.1) 100%)"
                                                        : "linear-gradient(135deg, rgba(243,156,18,0.1) 0%, rgba(211,84,0,0.1) 100%)",
                                                    color: i % 2 === 0 ? "#1b7f3a" : "#d35400",
                                                    border: `1px solid ${i % 2 === 0 ? "#27ae60" : "#f39c12"}`
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="rounded-3xl bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] p-8 md:p-12 text-white shadow-2xl">
                    <div className="grid gap-8 md:grid-cols-2 md:items-center">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                Ekosistemimize Katılın
                            </h3>
                            <p className="text-lg text-white/95 leading-relaxed">
                                Kurumsal ortaklıklar, üretici destek programları ve katılımcı model hakkında bilgi alın.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 md:justify-end">
                            <a href="/iletisim" className="inline-flex items-center justify-center rounded-xl bg-white text-[#1b7f3a] font-bold px-8 py-4 hover:bg-gray-100 transition-all shadow-lg">
                                İletişime Geçin
                            </a>
                            <a href="/basvuru" className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-white/10 backdrop-blur text-white font-bold px-8 py-4 hover:bg-white/20 transition-all">
                                Başvuru Yapın
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function GreenCard({ icon: Icon, title, color, children }: { icon: any; title: string; color: "green" | "amber"; children: React.ReactNode }) {
    const gradientClass = color === "green"
        ? "from-[#1b7f3a] to-[#27ae60]"
        : "from-[#f39c12] to-[#d35400]";
    const iconColor = color === "green" ? "#27ae60" : "#f39c12";

    return (
        <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-lg hover:shadow-2xl transition-all hover:border-transparent">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6" style={{ color: iconColor }} />
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                {children}
            </div>
        </div>
    );
}

function InfoCard({ icon: Icon, title, gradient, children }: { icon: any; title: string; gradient: "green" | "amber"; children: React.ReactNode }) {
    const gradientClass = gradient === "green"
        ? "from-[#1b7f3a] to-[#27ae60]"
        : "from-[#f39c12] to-[#d35400]";

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all">
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

function StatBox({ number, label, icon: Icon }: { number: string; label: string; icon: any }) {
    return (
        <div className="group">
            <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur group-hover:bg-white/20 transition-all">
                <Icon className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {number}
            </div>
            <div className="text-sm text-white/80 font-medium">{label}</div>
        </div>
    );
}

const TIMELINE = [
    {
        year: "2024",
        title: "GG SEED WORLD kuruldu; izlenebilir QR altyapısı ilk ürünlerle buluştu.",
        desc: "İlk yıl odak: ata tohumu çoğaltımı, bölgesel adaptasyon denemeleri ve tedarik kayıt sistemi.",
    },
    {
        year: "2025",
        title: "Kurumsal ortaklık programı ve üretici destek hattı yayına alındı.",
        desc: "Eğitim modülleri, hasat garantisi ve parti bazlı kalite doğrulama süreçleri devreye girdi.",
    },
    {
        year: "2026",
        title: "Bölgesel distribütörlük ağı ve ihracat kanalları genişletiliyor.",
        desc: "Yeni pazarlara giriş; organik ve GAP sertifikasyon kapsamı büyütülecek.",
    },
];

const TEAM = [
    {
        name: "Ayşe K. Demir",
        role: "Kurucu Ortak / Operasyon",
        tags: ["İzlenebilirlik", "Operasyon", "GAP"],
    },
    {
        name: "Mehmet Yıldız",
        role: "Ar-Ge ve Kalite",
        tags: ["Heirloom", "Organik", "Sertifikalar"],
    },
    {
        name: "Elif Arslan",
        role: "İş Geliştirme",
        tags: ["Ortaklıklar", "Distribütörlük", "RFQ"],
    },
];