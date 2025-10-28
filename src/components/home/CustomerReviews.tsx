"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

type Review = {
  id: number;
  name: string;
  title: string;
  comment: string;
  avatar: string; // /public içinden kök / ile
  rating: 1 | 2 | 3 | 4 | 5;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ali Yılmaz",
    title: "Tarım Girişimcisi",
    avatar: "/customer/1.jpg",
    rating: 5,
    comment:
      "SeedWorld’dan aldığımız fidanlar beklediğimizin üstünde çıktı. Paketleme, teslimat hızı ve destek süreci kusursuzdu.",
  },
  {
    id: 2,
    name: "Selin Kaya",
    title: "Peyzaj Mimarı",
    avatar: "/customer/2.jpg",
    rating: 5,
    comment:
      "Çeşitlilik çok iyi, ürün kartlarındaki bilgiler net. Büyük projelerde güvenle teklif verirken SeedWorld’ü referans gösteriyoruz.",
  },
  {
    id: 3,
    name: "Ahmed Al-Sabah",
    title: "Agriculture Entrepreneur (Kuveyt)",
    avatar: "/customer/3.jpg",
    rating: 4,
    comment:
      "السعر مقابل الأداء ممتاز جدًا. عندما كان لدينا سؤال، رد الفريق بسرعة؛ شكر خاص على الاهتمام بعد البيع.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} yıldız`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < n ? "fill-[#f39c12] text-[#f39c12]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Hafif doku efekti */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" aria-hidden="true">
          <pattern id="review-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#review-grid)" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Müşteri Yorumları
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            SeedWorld’ü tercih eden müşterilerimizin deneyimleri.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, idx) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-500 hover:shadow-xl hover:border-[#27ae60]/50 hover:scale-[1.02]"
            >
              {/* Üst gradient şerit */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27ae60] to-[#f39c12] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-gray-200 group-hover:ring-[#27ae60]/50 transition-all">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">
                    {r.name}
                  </div>
                  <div className="text-sm text-gray-500">{r.title}</div>
                </div>
              </div>

              <div className="mt-4">
                <Stars n={r.rating} />
              </div>

              <p className="mt-4 text-base text-gray-700 leading-relaxed">
                {r.comment}
              </p>

              {/* Hover alt çizgi */}
              <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-[#27ae60] to-[#f39c12] transition-all duration-300 group-hover:w-24" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}