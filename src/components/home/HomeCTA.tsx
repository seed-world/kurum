"use client";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
    
 

      {/* Arkaplan katmanları */}
      <div className="pointer-events-none absolute inset-0 -z-10">
    
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Grid doku */}
        <div className="absolute inset-0 opacity-[0.1]">
          <svg width="100%" height="100%" aria-hidden="true">
            <pattern id="cta-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
      </div>

      <Section className="relative z-10 py-12 md:py-16 text-center text-white">
        {/* Başlık */}
        <motion.h3
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 tracking-tight"
        >
          Ekosistemimize{" "}
          <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
            Katılın
          </span>
        </motion.h3>

        {/* Kısa açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-gray-600 max-w-xl mx-auto"
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
          className="mt-10 flex flex-wrap justify-center gap-6 text-base text-gray-600"
        >
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * i + 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all shadow-md hover:shadow-lg"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-xl ring-1 ring-white/20 ${i % 2 === 0 ? "bg-[#27ae60]/30" : "bg-[#f39c12]/30"
                  } group-hover:scale-105 transition-transform`}
              >
                <svg
                  className="w-5 h-5 text-white"
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
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-10 py-5 text-base font-semibold text-white shadow-xl shadow-emerald-900/30 ring-1 ring-white/20 hover:from-[#27ae60] hover:to-[#1b7f3a] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="flex items-center justify-center gap-2">
              İletişim
            </span>
          </Link>

          {/* Secondary — outline + amber vurgu */}
          <Link
            href="/basvuru"
            className="group inline-flex items-center justify-center rounded-2xl border-2 border-[#f39c12]/80 bg-white/5 backdrop-blur-lg px-10 py-5 text-base font-semibold text-white hover:bg-white/10 hover:border-[#f39c12] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2 text-gray-600">
              Başvuru Yap
            </span>
          </Link>
        </motion.div>

        {/* Alt ince marka çizgisi */}
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