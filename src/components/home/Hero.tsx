// File: app/(site)/_components/Hero.tsx
import Link from "next/link";
import Section from "./Section";

/**
 * Hero — GG SEED WORLD
 * Full-viewport: min-h-screen + 100svh + 100dvh fallback zinciri
 */
export default function Hero() {
  return (
    <>
      {/* Üst ince marka şeridi (layout'ı etkilemesin diye absolute) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 z-30 h-1"

        aria-hidden="true"
      />

      {/* Tam ekran hero */}
      <Section
        className="
          relative overflow-hidden bg-[#0b0f0c]
    
          min-h-screen min-h-[100svh] min-h-[100dvh]
       
          grid place-items-center
        "
      >
        {/* Arkaplan video (reduced-motion'da gizli) */}
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden"
          src="/videos/vvvv.mp4"
          poster="/images/hero-fallback.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />

        {/* Okunabilirlik için örtüler */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />
       
        </div>

        {/* İçerik */}
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            Ata Tohumu{" "}
            <span className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              İzlenebilir
            </span>{" "}
            Ekosistem
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl mx-auto">
            Heirloom çeşitler ve uçtan uca izlenebilir tedarik.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/magaza"
              className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] hover:from-[#27ae60] hover:to-[#1b7f3a] text-white text-sm font-semibold px-8 py-4 shadow-lg shadow-emerald-900/20 ring-1 ring-white/10 transition-all duration-300"
            >
              Mağaza
            </Link>

            <Link
              href="/rfq"
              className="group inline-flex items-center justify-center rounded-2xl border-2 border-[#f39c12]/70 bg-white/10 backdrop-blur hover:bg-white/15 text-white text-sm font-semibold px-8 py-4 transition-all duration-300"
            >
              RFQ Talebi
            </Link>
          </div>


        </div>
      </Section>
    </>
  );
}
