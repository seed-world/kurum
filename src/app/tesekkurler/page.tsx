// app/tesekkurler/page.tsx
import { Suspense } from "react";
import TesekkurlerWrapper from "./TesekkurlerWrapper";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-medium text-gray-700">Sipariş özeti yükleniyor...</p>
          </div>
        </div>
      }
    >
      <TesekkurlerWrapper />
    </Suspense>
  );
}