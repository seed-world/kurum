// app/magaza/kategori-urunler/page.tsx
import { Suspense } from "react";
import KategoriUrunlerWrapper from "./KategoriUrunlerWrapper";

export default function Page() {
  return (
    <Suspense
      fallback={
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-64 mb-4" />
              <div className="h-5 bg-gray-200 rounded w-96 mb-8" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </section>
      }
    >
      <KategoriUrunlerWrapper />
    </Suspense>
  );
}