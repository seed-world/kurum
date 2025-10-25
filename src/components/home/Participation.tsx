// File: app/(site)/_components/Participation.tsx
import Link from "next/link";
import Section from "./Section";

const cards = [
  {
    title: "Kurumsal Ortaklık",
    items: ["Toplu tohum tedariği", "Teknik destek", "Özel fiyatlandırma", "Kalite garantisi"],
    // Marka yeşili
    gradient: "from-[#1b7f3a] to-[#27ae60]",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Bireysel Üretici",
    items: ["Eğitim programları", "Tohum kredisi", "Hasat garantisi", "Pazarlama desteği"],
    // Yeşil → Amber geçiş
    gradient: "from-[#27ae60] to-[#f39c12]",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Katılımcı Program",
    items: ["Franchise sistemi", "Bölgesel distribütörlük", "Eğitim & sertifikasyon", "Sürekli gelir"],
    // Marka amberi
    gradient: "from-[#f39c12] to-[#d35400]",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function Participation() {
  return (
    <section className="relative overflow-hidden">
      {/* Arkaplan video (motion-reduce'de gizlenir) */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden"
        src="/videos/participation.mp4"
        poster="/images/participation-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Okunabilirlik için koyu degrade */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />

      <Section className="relative z-10 py-16 md:py-24 text-center">
        {/* Başlık */}
        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
          İş Modeline{" "}
          <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
            Katılım
          </span>
        </h2>
        <p className="mt-3 text-white/85 max-w-2xl mx-auto">
          Kurumsal, bireysel ve katılımcı modellerden size uygun olanı seçin.
        </p>

        {/* Kartlar */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative rounded-b-3xl bg-white/10 border border-white/20 backdrop-blur-md p-7 text-left text-white transition-all hover:bg-white/15 hover:-translate-y-1"
            >
              {/* üst marka şeridi */}
              <div className={`absolute inset-x-0 top-0 h-1 rounded-b-3xl bg-gradient-to-r ${card.gradient}`} />
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg ring-1 ring-white/10`}>
                  {card.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold">{card.title}</h3>
              </div>

              <ul className="mt-5 space-y-3">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                    <div className="mt-0.5 w-5 h-5 flex items-center justify-center rounded-md bg-white/15">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Primary CTA — marka yeşili */}
              <Link
                href="/basvuru"
                className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white font-semibold py-3 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all shadow-lg shadow-emerald-900/20 ring-1 ring-white/10"
              >
                Başvuru Yap
              </Link>
            </div>
          ))}
        </div>

        {/* Alt CTA (outline — amber vurgulu) */}
        <div className="mt-10">
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-[#f39c12]/70 bg-white/10 px-8 py-4 text-sm font-semibold text-white hover:bg-white/15 transition-all"
          >
            Detaylı Bilgi Al
          </Link>
        </div>
      </Section>
    </section>
  );
}
