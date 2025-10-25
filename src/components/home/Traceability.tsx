// File: app/(site)/_components/Traceability.tsx
import Section from "./Section";

export default function Traceability() {
  const items = [
    {
      t: "Coğrafi Köken",
      d: "Orijinal bölge ve üretici bilgisi.",
      gradient: "from-[#1b7f3a] to-[#27ae60]",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      t: "Kalite Sertifikaları",
      d: "Organik ve kalite standartlarına uygunluk.",
      gradient: "from-[#f39c12] to-[#d35400]",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      t: "QR Kod Sistemi",
      d: "Parti geçmişi ve yetiştirme rehberi.",
      gradient: "from-[#27ae60] to-[#f39c12]",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h3v3h-3v-3zm-3 3h2v2h-2v-2zm3 0h2v5h-2v-5zm2 0h3v2h-3v-2zm0 3h2v2h-2v-2z"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Üst ince marka şeridi (örnek sayfalarla aynı) */}
      <div
        className="absolute top-0 left-0 right-0 z-10 h-1"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden="true"
      />

      {/* Arka plan video (motion-reduce'de gizli) */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
        src="/videos/trace.mp4"
        poster="/images/trace-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Koyu overlay + marka renk yıkaması + vignette + doku */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* 1) temel koyu degrade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        {/* 2) eğimli marka renk yıkaması (wash) */}
        <div className="absolute -inset-x-10 -top-[15%] h-[55%] transform skew-y-6 opacity-35 blur-3xl bg-gradient-to-r from-[#1b7f3a]/45 via-[#27ae60]/40 to-[#f39c12]/40" />
        {/* 3) vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* 4) grid doku */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" aria-hidden="true">
            <pattern id="tinygrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tinygrid)" />
          </svg>
        </div>
      </div>

      <Section className="relative z-20 py-16 md:py-24">
        {/* Başlık & kısa açıklama */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            İzlenebilir{" "}
            <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              Tedarik Zinciri
            </span>
          </h2>
          <p className="mt-3 text-white/85">
            Her çeşidin kökeni, üretimi ve kalite süreci şeffaf.
          </p>
        </div>

        {/* Özellikler: cam efektli kartlar */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {items.map((it) => (
            <div
              key={it.t}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white transition-all duration-300 hover:bg-white/15"
            >
              {/* üst marka şeridi */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${it.gradient}`} />
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${it.gradient} text-white shadow-lg ring-1 ring-white/10`}>
                  {it.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{it.t}</p>
                  <p className="text-sm text-white/85 mt-1">{it.d}</p>
                </div>
              </div>
              {/* hover alt çizgi efekti */}
              <div className={`pointer-events-none absolute inset-x-6 bottom-4 h-[3px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r ${it.gradient}`} />
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
