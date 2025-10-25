// File: app/(site)/_components/HomeCTA.tsx
import Link from "next/link";
import Section from "./Section";

export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0b0f0c]">
      {/* Üst ince marka şeridi (opsiyonel, sayfa geneliyle uyumluysa saklayın) */}
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
            <pattern id="cta-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
      </div>

      <Section className="relative z-10 py-20 text-center text-white">
        {/* Başlık */}
        <h3 className="text-3xl md:text-5xl font-bold leading-tight">
          Ekosistemimize{" "}
          <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
            Katılın
          </span>
        </h3>

        {/* kısa açıklama */}
        <p className="mt-4 max-w-2xl mx-auto text-white/85">
          Ortaklık, tedarik ya da distribütörlük için bizimle iletişime geçin.
          Sürdürülebilir tarımın geleceğini birlikte inşa edelim.
        </p>

        {/* Özellik satırları */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/90">
          {["Blockchain Entegrasyon", "Kurumsal Çözümler", "Teknik Destek"].map(
            (item, i) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ring-1 ring-white/15 ${
                    i % 2 === 0 ? "bg-[#27ae60]/25" : "bg-[#f39c12]/25"
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>{item}</span>
              </div>
            )
          )}
        </div>

        {/* Butonlar */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* Primary — marka yeşili */}
          <Link
            href="/iletisim"
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-8 py-4 text-white font-semibold shadow-lg shadow-emerald-900/20 ring-1 ring-white/10 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              İletişim
        
            </span>
          </Link>

          {/* Secondary — outline + amber vurgu */}
          <Link
            href="/basvuru"
            className="group inline-flex items-center justify-center rounded-2xl border-2 border-[#f39c12]/70 bg-white/10 backdrop-blur-md px-8 py-4 text-white font-semibold hover:bg-white/15 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              Başvuru Yap
       
            </span>
          </Link>
        </div>

        {/* alt ince marka çizgisi (görsel denge) */}
        <div
          className="mx-auto mt-10 h-[3px] w-40 rounded-full"
          style={{
            background:
              "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
          }}
          aria-hidden="true"
        />
      </Section>
    </section>
  );
}
