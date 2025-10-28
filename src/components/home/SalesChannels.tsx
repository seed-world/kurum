// File: app/(site)/_components/SalesChannels.tsx
import Link from "next/link";
import Section from "./Section";

const channels = [
  {
    title: "GG Market – KWI (Kuveyt)",
    href: "/gg-market-kwi",
    description: "Bölgesel dağıtım ve e-ticaret",
    
    // Marka yeşili
    gradient: "from-[#1b7f3a] to-[#27ae60]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Lezzet Kapında",
    href: "/lezzet-kapinda",
    description: "Bölgesel dağıtım ve e-ticaret",
   
    // Yeşil → Amber geçiş
    gradient: "from-[#27ae60] to-[#f39c12]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Online Mağaza",
    href: "/magaza",
    description: "Bölgesel dağıtım ve e-ticaret",
    
    // Marka amberi
    gradient: "from-[#f39c12] to-[#d35400]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

export default function SalesChannels() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* NOT: Video kaldırıldı. Arkaplan örnek sayfa gibi açık zemin. */}

      <Section className="relative py-8 md:py-20">
        {/* Başlık */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            Satış{" "}
            <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              Kanalları
            </span>
          </h2>
          <p className="mt-3 text-gray-700">
            Ürünlerimize global pazarlardan yerel e-ticaret platformlarına kadar birçok kanaldan ulaşın.
          </p>
        </div>

        {/* Kartlar — açık tema */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {channels.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 text-gray-900 shadow-lg transition-all hover:shadow-2xl hover:border-[#27ae60]"
            >
              {/* üst marka şeridi */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.gradient}`} />

         

              {/* ikon + başlık */}
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shadow-lg ring-1 ring-black/5`}>
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold">{c.title}</h3>
              </div>

              {/* açıklama */}
              <p className="mt-4 text-sm text-gray-700">{c.description}</p>

              {/* mini özellikler */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200">
                    <svg className="w-3 h-3 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Blockchain doğrulamalı</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-5 h-5 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200">
                    <svg className="w-3 h-3 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Hızlı teslimat</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Kanala Git</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* alt CTA (outline — açık tema) */}
        <div className="mt-10 text-center">
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1b7f3a] bg-white px-8 py-4 text-sm font-semibold text-[#1b7f3a] hover:bg-emerald-50 transition-all"
          >
            Distribütör Olmak İstiyorum
          </Link>
        </div>
      </Section>
    </section>
  );
}
