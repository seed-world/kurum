"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, Microscope, Leaf, Truck, Headset, Recycle, LineChart } from "lucide-react";

export default function WhyGGSeedWorld() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Sertifikalı & İzlenebilir",
      desc: "Tohum tedarik zinciri boyunca parti bazlı izlenebilirlik ve belgelendirme.",
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Ar-Ge Destekli Kalite",
      desc: "Çimlenme oranı, hastalık dayanımı ve verim için düzenli laboratuvar testleri.",
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Yerel İklim Uyumu",
      desc: "Bölgenize uygun çeşit önerileri ve saha verilerine dayalı karar desteği.",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Hızlı Teslimat",
      desc: "Soğuk-zincir hassasiyetinde, 24-72 saat arası kargolama opsiyonları.",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Seçkin Çeşit Portföyü",
      desc: "Pazar talebine göre kârlı çeşitler ve düzenli stok güncellemeleri.",
    },
    {
      icon: <Headset className="h-6 w-6" />,
      title: "Uzman Destek",
      desc: "Satış sonrası yetiştiricilik danışmanlığı ve hızlı çözüm hattı.",
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      title: "Sürdürülebilirlik",
      desc: "Çevresel etkimizi azaltan paketleme ve operasyon süreçleri.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Veriyle Yönetim",
      desc: "Talep tahmini, stok planlama ve fiyat/performans analizleri.",
    },
  ];



  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
   

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* Başlık & Açıklama */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
              Neden GG SEED WORLD?
            </span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Veriye dayalı seçki, sertifikalı kalite ve sahada kanıtlanmış performans ile tedarikte yeni standart.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/magaza"
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-8 py-4 text-base font-semibold text-white hover:from-[#1b7f3a] hover:to-[#27ae60] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Mağazayı Keşfet
            </Link>
            <Link
              href="/hakkimizda"
              className="inline-flex items-center rounded-2xl border-2 border-[#27ae60] px-8 py-4 text-base font-semibold text-[#27ae60] hover:bg-[#27ae60]/5 hover:border-[#1b7f3a] transition-all duration-300 hover:scale-105"
            >
              Hakkımızda
            </Link>
          </motion.div>
        </motion.div>

        {/* Özellik Kartları */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-2xl hover:border-[#27ae60]/50 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Üst gradient şerit */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27ae60] to-[#f39c12] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="inline-flex items-center justify-center rounded-2xl p-3 text-[#27ae60] bg-[#27ae60]/10 shadow-md group-hover:bg-[#27ae60]/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{f.desc}</p>

              {/* Hover alt çizgi */}
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-[#27ae60] to-[#f39c12] transition-all duration-300 group-hover:w-24" />
            </motion.div>
          ))}
        </motion.div>

    
      </div>

    
    </section>
  );
}