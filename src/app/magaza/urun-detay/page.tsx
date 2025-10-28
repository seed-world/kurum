"use client";

import { useSearchParams } from "next/navigation";
import UrunDetay from "./UrunDetay";

export default function Page() {
  const sp = useSearchParams();
  const idParam = sp.get("id") ?? "";
  const id = /^\d+$/.test(idParam) ? Number(idParam) : null;

  if (id === null) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-red-700 bg-red-50 border border-red-200 rounded-2xl">
        Geçersiz ürün bağlantısı (id eksik veya hatalı).
      </div>
    );
  }

  return <UrunDetay id={id} />;
}
