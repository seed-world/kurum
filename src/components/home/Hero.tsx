"use client"

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "./Section";

export default function Hero() {
  const slides = useMemo(
    () => [
      {
        id: 1,
        image: "/hero/1.jpg",
        titleLines: [
          {
            text: "ATA TOHUMU",
            variant: "default",
          },
          {
            text: "TİCARETİNDE DÜNYA LİDERİ",
            variant: "gradient",
          },
        ],
        subtitle: "Heirloom çeşitler • İzlenebilir tedarik • Yerel tohum koruma • Sürdürülebilir tarım",
      },
      {
        id: 2,
        image: "/hero/2.jpg",
        titleLines: [
          { text: "DOĞAL TARIM", variant: "default" },
          { text: "SÜRDÜRÜLEBİLİR GELECEK", variant: "gradient" },
        ],
        subtitle: "Yerel çeşitler • Ekolojik denge • Biyoçeşitlilik • Gelecek nesillere miras",
      },
      {
        id: 3,
        image: "/hero/3.jpg",
        titleLines: [
          { text: "ORGANİK SERTİFİKALI", variant: "default" },
          { text: "TOHUM ÇEŞİTLERİ", variant: "gradient" },
        ],
        subtitle: "2000+ çeşit • 80+ ülkeye ihracat • 30+ yıllık deneyim • 50K+ mutlu müşteri",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Otomatik geçiş (6sn), hover'da duraklat
  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function start() {
    stop();
    intervalRef.current = setTimeout(() => setIndex((i) => (i + 1) % slides.length), 6000);
  }
  function stop() {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    intervalRef.current = null;
  }

  return (
    <>
      {/* Üst ince marka şeridi (layout'ı etkilemesin diye absolute) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-30 h-1" aria-hidden="true" />

      {/* Tam ekran hero */}
      <Section
        className="relative overflow-hidden bg-black min-h-screen min-h-[100svh] min-h-[100dvh] h-screen h-[100svh] h-[100dvh]"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {/* Slides */}
        <div className="absolute inset-0 -z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[index].id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
              aria-hidden
            >
              {/* Responsive arkaplan görseli */}
              <img
                src={slides[index].image}
                alt=""
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Okunabilirlik örtüsü */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* İçerik */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="w-full max-w-5xl px-4">
            {/* Başlık */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              {slides[index].titleLines.map((line, i) => (
                <span key={i} className="block">
                  <TitleSpan variant={line.variant}>{line.text}</TitleSpan>
                </span>
              ))}
            </h1>

            {/* Alt yazı */}
            {slides[index].subtitle && (
              <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl mx-auto">
                {slides[index].subtitle}
              </p>
            )}

            {/* Butonlar — tüm slidelarda sabit */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/docs/gg-seed-world-sunumu.pdf"
                target="_blank"
                className="group inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur hover:bg-white/15 text-white text-sm font-semibold px-8 py-4 ring-1 ring-white/20 transition-all duration-300"
                download
              >
                Sunumu İndir
              </Link>

              <Link
                href="/magaza"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] hover:from-[#27ae60] hover:to-[#1b7f3a] text-white text-sm font-semibold px-8 py-4 shadow-lg shadow-emerald-900/20 ring-1 ring-white/10 transition-all duration-300"
              >
                Mağaza
              </Link>
            </div>
          </div>
        </div>

        {/* İndikatörler */}
        <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Slayt ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                index === i ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

function TitleSpan({ variant, children }: { variant?: "default" | "gradient" | "accent"; children: React.ReactNode }) {
  if (variant === "gradient") {
    return (
      <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
        {children}
      </span>
    );
  }
  if (variant === "accent") {
    return (
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f39c12] to-[#f39c12]">
        {children}
      </span>
    );
  }
  return <span className="text-white">{children}</span>;
}