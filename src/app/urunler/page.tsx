"use client";

import { useMemo, useState } from "react";
import { Sprout, Shield, ShoppingCart, Minus, Plus, BadgePercent, Check, TrendingUp, Award } from "lucide-react";

const PRODUCTS = {
  "GG-SEED": [
    {
      id: "seedstart",
      title: "1.SeedStart",
      subtitle: "New beginning",
      seeds: 50,
      multiplier: "x15",
      duration: "3 yıl içinde",
      priceLabel: "SATIN AL",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      ribbon: "GG-SEED",
    },
    {
      id: "seedgrow",
      title: "2.SeedGrow",
      subtitle: "Scale up",
      seeds: 150,
      multiplier: "x20",
      duration: "3 yıl içinde",
      priceLabel: "SATIN AL",
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      ribbon: "GG-SEED",
    },
  ],
  "GG-AGRO": [
    {
      id: "agro-pass",
      title: "GG AGRO Satın Al",
      subtitle: "GlobalFarm - Geleceğin Lideri",
      description:
        "Öncelikli denetimler, özel raporlara erişim ve yeni ekosistemleri birlikte finanse etme şansı",
      price: "3.5",
      priceSub: "700.00 USD",
      promo: { label: "KAZAN", value: "10%", foot: "1 ay içinde" },
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
      ribbon: "GG-AGRO",
    },
  ],
} as const;

type TabKey = keyof typeof PRODUCTS;

export default function ProductsPage() {
  const [tab, setTab] = useState<TabKey>("GG-SEED");
  const [index, setIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const list = PRODUCTS[tab];
  const item = list[index] ?? list[0];

  const thumbs = useMemo(() => item.images ?? [], [item]);

  return (
    <div className="min-h-screen bg-white">
      {/* Gradient şerit */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }} />

      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Hero başlık */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
              Ürünler
            </span>
          </h1>
          
          {/* Banner kart */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1b7f3a] via-[#27ae60] to-[#f39c12] p-8 md:p-10 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-2xl md:text-3xl font-bold leading-snug mb-3">
                  Her tohum size GG SEED WORLD'de bir pay verir.
                </p>
                <p className="text-lg text-white/95 leading-relaxed">
                  Ne kadar çok tohumu toprakla buluşturursanız, o kadar çok tohum hissesine sahip olursunuz.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold border border-white/30">
                  <Sprout className="h-4 w-4" />
                  <span>Heirloom</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold border border-white/30">
                  <Shield className="h-4 w-4" />
                  <span>İzlenebilir</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="mb-8 flex items-center gap-3">
          <TabButton 
            active={tab === "GG-SEED"} 
            onClick={() => { setTab("GG-SEED"); setIndex(0); setActiveImage(0); }}
            color="green"
          >
            <Sprout className="h-4 w-4" /> GG-SEED
          </TabButton>
          <TabButton 
            active={tab === "GG-AGRO"} 
            onClick={() => { setTab("GG-AGRO"); setIndex(0); setActiveImage(0); }}
            color="amber"
          >
            <Shield className="h-4 w-4" /> GG-AGRO
          </TabButton>
        </div>

        {/* Ana ürün kartı */}
        <div className="mb-8">
          <div className="rounded-3xl border-2 border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Sol panel - Ürün bilgileri */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
                <Ribbon color={tab === "GG-SEED" ? "green" : "amber"}>
                  {item.ribbon}
                </Ribbon>

                <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                  {item.title}
                </h2>

                {"seeds" in item ? (
                  <>
                    <p className="text-gray-600 text-lg mt-2 mb-8">{(item as any).subtitle}</p>
                    
                    <div className="space-y-8">
                      {/* Seeds bilgisi */}
                      <div>
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1b7f3a]/10 to-[#27ae60]/10 border-2 border-[#27ae60]/30">
                          <Sprout className="h-6 w-6 text-[#27ae60]" />
                          <span className="text-4xl md:text-5xl font-bold text-gray-900">
                            {(item as any).seeds}
                          </span>
                          <span className="text-xl font-semibold text-gray-600">seeds</span>
                        </div>
                      </div>

                      {/* Multiplier */}
                      <div className="rounded-3xl bg-gradient-to-br from-[#1b7f3a] to-[#27ae60] p-6 text-white">
                        <div className="flex items-end gap-4">
                          <TrendingUp className="h-8 w-8 mb-2" />
                          <div className="text-6xl md:text-7xl font-black">
                            {(item as any).multiplier}
                          </div>
                        </div>
                        <p className="mt-3 text-white/90 text-lg font-medium">
                          {(item as any).duration}
                        </p>
                      </div>

                      <PurchaseRow cta={(item as any).priceLabel} color="green" />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl text-gray-700 mt-3 font-semibold">{(item as any).subtitle}</p>
                    <p className="text-gray-600 mt-3 leading-relaxed">{(item as any).description}</p>

                    <div className="space-y-6 mt-8">
                      {/* Fiyat */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{(item as any).priceSub}</div>
                        <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#f39c12] to-[#d35400] bg-clip-text text-transparent">
                          {(item as any).price}
                        </div>
                      </div>

                      {/* Promo */}
                      <div className="rounded-2xl bg-gradient-to-br from-[#f39c12]/10 to-[#d35400]/10 border-2 border-[#f39c12]/30 p-6">
                        <div className="flex items-center gap-4">
                          <Award className="h-6 w-6 text-[#f39c12]" />
                          <div className="text-sm font-semibold text-gray-600">
                            {(item as any).promo.label}
                          </div>
                          <div className="text-5xl font-black bg-gradient-to-r from-[#f39c12] to-[#d35400] bg-clip-text text-transparent">
                            {(item as any).promo.value}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            {(item as any).promo.foot}
                          </div>
                        </div>
                      </div>

                      <PurchaseRow cta="SATIN AL" color="amber" />
                    </div>
                  </>
                )}
              </div>

              {/* Sağ panel - Görsel */}
              <div className="relative min-h-[400px] md:min-h-[600px] bg-gray-100">
                <img 
                  src={thumbs[activeImage]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Thumbnail strip */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {thumbs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-20 flex-1 rounded-xl overflow-hidden transition-all ${
                        activeImage === i 
                          ? "ring-4 ring-white shadow-xl scale-105" 
                          : "ring-2 ring-white/50 hover:ring-white/80"
                      }`}
                    >
                      <img src={img} alt={`${item.title} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt navigasyon */}
        <div className="flex items-center justify-between gap-4">
         
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((p) => (p - 1 + list.length) % list.length)}
              className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white hover:shadow-lg transition-all hover:scale-105"
              aria-label="Önceki ürün"
            >
              <Minus className="h-5 w-5" />
            </button>
            <div className="text-sm font-semibold text-gray-600">
              {index + 1} / {list.length}
            </div>
            <button
              onClick={() => setIndex((p) => (p + 1) % list.length)}
              className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#f39c12] to-[#d35400] text-white hover:shadow-lg transition-all hover:scale-105"
              aria-label="Sonraki ürün"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({ 
  active, 
  children, 
  onClick, 
  color 
}: { 
  active?: boolean; 
  children: React.ReactNode; 
  onClick?: () => void;
  color: "green" | "amber";
}) {
  const activeClass = color === "green"
    ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow-lg"
    : "bg-gradient-to-r from-[#f39c12] to-[#d35400] text-white shadow-lg";
  
  const inactiveClass = "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
        active ? activeClass : inactiveClass
      }`}
    >
      {children}
    </button>
  );
}

function Ribbon({ children, color }: { children: React.ReactNode; color: "green" | "amber" }) {
  const gradientClass = color === "green"
    ? "from-[#1b7f3a] to-[#27ae60]"
    : "from-[#f39c12] to-[#d35400]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${gradientClass} px-4 py-2 text-xs font-bold text-white shadow-md`}>
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      {children}
    </span>
  );
}

function PurchaseRow({ cta, color }: { cta: string; color: "green" | "amber" }) {
  const [qty, setQty] = useState(1);
  
  const buttonGradient = color === "green"
    ? "from-[#1b7f3a] to-[#27ae60] hover:from-[#27ae60] hover:to-[#1b7f3a]"
    : "from-[#f39c12] to-[#d35400] hover:from-[#d35400] hover:to-[#f39c12]";

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Miktar seçici */}
      <div className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-12 w-12 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-2xl"
          aria-label="Azalt"
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="px-6 text-lg font-bold text-gray-900 tabular-nums min-w-[60px] text-center">
          {qty}
        </div>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="h-12 w-12 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-2xl"
          aria-label="Artır"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Satın al butonu */}
      <button className={`inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${buttonGradient} text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
        <ShoppingCart className="h-5 w-5" />
        <span>{cta}</span>
      </button>
    </div>
  );
}