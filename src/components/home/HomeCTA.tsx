"use client";

// File: app/(site)/_components/HomeCTA.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import Section from "./Section";

export default function HomeCTA() {
  const items = [
    "Blockchain Entegrasyon",
    "Kurumsal Çözümler",
    "Teknik Destek",
  ];

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />
        {/* 2) marka renk “wash” (eğimli yıkama) */}
        <div className="absolute -inset-x-20 -top-[20%] h-[60%] skew-y-6 opacity-40 blur-3xl bg-gradient-to-r from-[#1b7f3a]/50 via-[#27ae60]/45 to-[#f39c12]/45" />
        {/* 3) vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* 4) grid doku */}
        <div className="absolute inset-0 opacity-[0.1]">
          <svg width="100%" height="100%" aria-hidden="true">
            <pattern id="cta-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
      </div>

      <Section className="relative z-10 py-24 md:py-32 text-center text-white">
        {/* Başlık */}
        <motion.h3
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
        >
          Ekosistemimize{" "}
          <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
            Katılın
          </span>
        </motion.h3>

        {/* kısa açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-6 max-w-3xl mx-auto text-lg text-white/90"
        >
          Ortaklık, tedarik ya da distribütörlük için bizimle iletişime geçin.
          Sürdürülebilir tarımın geleceğini birlikte inşa edelim.
        </motion.p>

        {/* Özellik satırları */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-base text-white/90"
        >
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * i + 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-1 ring-white/15 ${
                  i % 2 === 0 ? "bg-[#27ae60]/30" : "bg-[#f39c12]/30"
                }`}
              >
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="font-medium">{item}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {/* Primary — marka yeşili */}
          <Link
            href="/iletisim"
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-10 py-5 text-base font-semibold text-white shadow-xl shadow-emerald-900/30 ring-1 ring-white/20 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              İletişim
            </span>
          </Link>

          {/* Secondary — outline + amber vurgu */}
          <Link
            href="/basvuru"
            className="group inline-flex items-center justify-center rounded-2xl border-2 border-[#f39c12]/80 bg-white/5 backdrop-blur-lg px-10 py-5 text-base font-semibold text-white hover:bg-white/10 hover:border-[#f39c12] transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              Başvuru Yap
            </span>
          </Link>
        </motion.div>

        {/* alt ince marka çizgisi (görsel denge) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mx-auto mt-12 h-[3px] w-48 rounded-full"
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