import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build sonrası statik export (çıktı: ./out)

  output: "export",

  // Statik export'ta next/image optimizasyonu çalışmaz; gerekliyse aç.
  images: {
    unoptimized: true,
  },

  // (Opsiyonel) Bazı statik sunucularda /path/ şeklinde linkler daha stabil olur.
  // trailingSlash: true,

  // (Opsiyonel) GH Pages gibi bir alt dizinden yayınlayacaksan:
  // assetPrefix: "/repo-adi/",
  // basePath: "/repo-adi",
};

export default nextConfig;
