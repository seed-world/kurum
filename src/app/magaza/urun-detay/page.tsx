// app/magaza/urun-detay/page.tsx
import { Suspense } from "react";
import UrunDetayWrapper from "./UrunDetayWrapper";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-medium text-gray-700">Ürün yükleniyor...</p>
          </div>
        </div>
      }
    >
      <UrunDetayWrapper />
    </Suspense>
  );
}