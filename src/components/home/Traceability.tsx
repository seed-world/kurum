"use client";

import { motion } from "framer-motion";
import Section from "./Section";

export default function Traceability() {
  const items = [
    {
      t: "Coğrafi Köken",
      d: "Orijinal bölge ve üretici bilgisi.",
      gradient: "from-[#1b7f3a] to-[#27ae60]",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      t: "QR Kod Sistemi",
      d: "Parti geçmişi ve yetiştirme rehberi.",
      gradient: "from-[#27ae60] to-[#f39c12]",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h3v3h-3v-3zm-3 3h2v2h-2v-2zm3 0h2v5h-2v-5zm2 0h3v2h-3v-2zm0 3h2v2h-2v-2z" />
        </svg>
      ),
    },
    {
      t: "Kalite Sertifikaları",
      d: "Organik ve kalite standartlarına uygunluk.",
      gradient: "from-[#f39c12] to-[#d35400]",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },

  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Üst ince marka şeridi */}
      <div
        className="absolute top-0 left-0 right-0 z-10 h-1"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden="true"
      />

      {/* Vignette efekti */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Hafif grid doku */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] -z-10">
        <svg width="100%" height="100%" aria-hidden="true">
          <pattern id="tinygrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#tinygrid)" />
        </svg>
      </div>

      <Section className="relative z-20 py-12 md:py-16">
        {/* Başlık & kısa açıklama */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
            İzlenebilir{" "}
            <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              Tedarik Zinciri
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Her çeşidin kökeni, üretimi ve kalite süreci şeffaf.
          </p>
        </motion.div>

        {/* Özellikler: modern kartlar */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {items.map((it, idx) => (
            <motion.div
              key={it.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-500 hover:shadow-xl hover:border-transparent hover:ring-2 hover:ring-[#27ae60]/50"
            >
              {/* Üst gradient şerit */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${it.gradient}`} />

              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${it.gradient} text-white shadow-lg group-hover:scale-105 transition-transform`}>
                  {it.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-gray-900">{it.t}</p>
                  <p className="text-base text-gray-600 mt-2">{it.d}</p>
                </div>
              </div>

              {/* Hover efekti: alt çizgi */}
              <div className={`absolute inset-x-8 bottom-4 h-1 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r ${it.gradient} blur-sm`} />
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}