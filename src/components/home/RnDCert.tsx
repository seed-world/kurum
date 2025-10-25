// File: app/(site)/_components/RnDCert.tsx
import Section from "./Section";

const certifications = [
  { name: "ISO 9001", icon: "🏆" },
  { name: "Organic EU", icon: "🌿" },
  { name: "USDA", icon: "✓" },
  { name: "GlobalGAP", icon: "🌍" },
  { name: "HACCP", icon: "🔬" },
  { name: "Blockchain Verified", icon: "⛓️" },
  { name: "Fair Trade", icon: "🤝" },
  { name: "Seed Quality", icon: "🌱" },
  { name: "GMP", icon: "⚙️" },
  { name: "Carbon Neutral", icon: "🍃" },
];

const stats = [
  { value: "15+", label: "Ar-Ge Projesi", icon: "🔬" },
  { value: "10+", label: "Sertifika", icon: "📜" },
  { value: "50+", label: "Çeşit Adaptasyonu", icon: "🌾" },
  { value: "%98", label: "Kalite Oranı", icon: "⭐" },
];

export default function RnDCert() {
  return (
    <section className="relative overflow-hidden bg-[#0b0f0c]">
      {/* Üst ince marka şeridi (örnek sayfalarla aynı) */}
      <div
        className="absolute top-0 left-0 right-0 z-10 h-1"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden="true"
      />

      {/* Arkaplan katmanları (video yok) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* 1) koyu degrade taban */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
        {/* 2) marka renk “wash” (eğimli yıkama) */}
        <div className="absolute -inset-x-16 -top-[18%] h-[55%] skew-y-6 opacity-35 blur-3xl bg-gradient-to-r from-[#1b7f3a]/45 via-[#27ae60]/40 to-[#f39c12]/40" />
        {/* 3) vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* 4) grid doku */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" aria-hidden="true">
            <pattern id="rdc-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#rdc-grid)" />
          </svg>
        </div>
      </div>

      <Section className="relative z-10 py-16 md:py-24 text-center text-white">
        {/* Başlık */}
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Ar-Ge{" "}
          <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
            & Sertifikalar
          </span>
        </h2>
        <p className="mt-3 text-white/85 max-w-2xl mx-auto">
          Bölgesel adaptasyon, kalite ve verimlilik için yenilikçi projeler yürütüyor;
          üretim süreçlerimizi bağımsız kurumlarla doğruluyoruz.
        </p>

        {/* İstatistik kutuları */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 transition-all hover:bg-white/15 hover:-translate-y-1"
            >
              {/* üst marka şeridi */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1b7f3a] to-[#27ae60]" />
              <div className="text-3xl mb-2 drop-shadow">{s.icon}</div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-sm text-white/80">{s.label}</div>
              {/* hover alt şerit */}
              <div className="absolute inset-x-6 bottom-4 h-[3px] rounded-full bg-gradient-to-r from-[#f39c12] to-[#d35400] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Sertifikalar grid */}
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {certifications.map((c, i) => (
            <div
              key={c.name}
              className="group relative aspect-[3/2] overflow-hidden rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-all hover:bg-white/15 hover:-translate-y-1"
            >
              {/* üst şerit: yeşil ↔ amber dönüşümlü */}
              <div
                className={`absolute inset-x-0 top-0 h-1 ${
                  i % 2 === 0
                    ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60]"
                    : "bg-gradient-to-r from-[#f39c12] to-[#d35400]"
                }`}
              />
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <div className="text-sm font-semibold text-white/90">{c.name}</div>

              {/* Onay rozeti (marka yeşili) */}
              <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#27ae60] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* iç ışık efekti */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 120%, rgba(243,156,18,.15), transparent 60%)",
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
