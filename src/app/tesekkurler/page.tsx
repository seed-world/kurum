"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, ShoppingBag, ArrowRight, Receipt, Home, BadgeCheck } from "lucide-react";

function fmtPrice(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return `${f} ₺`;
}

type OrderItem = {
  id: number;
  title: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  image_path: string | null;
};

type Order = {
  id: number;
  order_number: string;
  customer_type: "kurumsal" | "bireysel" | "katilimci";
  payment_method: "kredi-karti" | "havale";
  status: string;
  grand_total: number;
  email: string | null;
  contact_name: string | null;
  created_at: string;
  items?: OrderItem[];
};

export default function ThankYouPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const orderId = sp.get("id");
  const orderNoFromQS = sp.get("no") || undefined;
  const ctFromQS = sp.get("ct") as Order["customer_type"] | null;
  const pmFromQS = sp.get("pm") as Order["payment_method"] | null;

  const [loading, setLoading] = useState<boolean>(!!orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Sipariş bulunamadı");
        const data = (await res.json()) as Order;
        if (mounted) setOrder(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Beklenmeyen bir hata oluştu");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [orderId]);

  const title = useMemo(() => {
    if (loading) return "Siparişiniz işleniyor…";
    if (error) return "Bir şeyler ters gitti";
    return "Teşekkürler! Siparişiniz alındı.";
  }, [loading, error]);

  const finalOrderNumber = order?.order_number || orderNoFromQS || (orderId ? `#${orderId}` : "—");
  const finalCT = order?.customer_type || ctFromQS || undefined;
  const finalPM = order?.payment_method || pmFromQS || undefined;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }}
        aria-hidden
      />
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 shadow-2xl ring-1 ring-[#27ae60]/10"
        >
          <div className="flex items-start gap-5 mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#27ae60] to-[#1b7f3a] text-white shadow-xl"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{title}</h1>
              <p className="mt-2 text-lg text-gray-600">
                {loading
                  ? "Lütfen bekleyin, sipariş özeti hazırlanıyor."
                  : error
                  ? "Sayfayı yenilemeyi deneyebilir veya destekle iletişime geçebilirsiniz."
                  : "Sipariş özeti ve takip bilgileri aşağıda."}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-6 md:grid-cols-3 mb-10"
          >
            <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sipariş No</div>
              <div className="mt-2 text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BadgeCheck className="h-6 w-6 text-[#27ae60]" />
                {finalOrderNumber}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ödeme Yöntemi</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {finalPM ? (finalPM === "havale" ? "Banka Havalesi" : "Kredi Kartı") : "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Müşteri Tipi</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {finalCT ? finalCT.toUpperCase() : "—"}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-4 rounded-2xl border border-[#27ae60]/20 bg-gradient-to-br from-[#27ae60]/5 to-[#f39c12]/5 p-6 mb-10"
          >
            <div className="flex items-center gap-3 text-[#27ae60] font-semibold">
              <Mail className="h-6 w-6" />
              Özet e-postası
            </div>
            <p className="text-base text-gray-700">
              {order?.email ? (
                <>Sipariş özeti <b>{order.email}</b> adresine gönderilecektir. Gelen kutusu ve spam klasörünü kontrol etmeyi unutmayın.</>
              ) : (
                <>Bir e-posta adresi paylaşmadınız. İsterseniz{" "}
                  <Link href="/hesabim" className="text-[#27ae60] font-semibold underline decoration-[#27ae60]/30 underline-offset-4 hover:decoration-[#27ae60]/50">
                    Hesabım
                  </Link>{" "}
                  sayfasından iletişim bilgilerinizi ekleyebilirsiniz.</>
              )}
            </p>
          </motion.div>

          {order?.items?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Receipt className="h-6 w-6 text-[#f39c12]" />
                Sipariş Kalemleri
              </h2>
              <div className="divide-y rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-5 p-5 hover:bg-gray-50 transition-colors">
                    {it.image_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image_path} alt={it.title} className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gray-100 border border-gray-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{it.title}</div>
                      <div className="text-sm text-gray-600">Adet: {it.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{fmtPrice(it.unit_price)} / adet</div>
                      <div className="font-bold text-gray-900">{fmtPrice(it.line_total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid gap-3 sm:grid-cols-2 mb-10"
          >
            <Link href="/" className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-800 hover:bg-gray-50 hover:border-[#27ae60] transition-all hover:scale-105 shadow-sm hover:shadow-md">
              <Home className="h-5 w-5" />
              Ana Sayfa
            </Link>

            <Link href="/magaza" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] px-6 py-4 font-semibold text-white hover:from-[#1b7f3a] hover:to-[#27ae60] transition-all hover:scale-105 shadow-md hover:shadow-lg">
              <ShoppingBag className="h-5 w-5" />
              Alışverişe Devam Et
            </Link>

    
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-sm leading-relaxed text-gray-500 text-center"
          >
            Not: Ödeme yöntemi “banka havalesi” seçildiyse, dekontunuzu <b>destek@seedworld.com</b> adresine iletmeniz gerekir.
            Ödeme onayından sonra sipariş durumu güncellenecektir.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mx-auto mt-12 w-full max-w-5xl px-4"
        >
          <div className="rounded-3xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] p-6 md:p-8 text-white shadow-2xl ring-1 ring-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-2xl font-extrabold">Sorunuz mu var?</div>
                <p className="mt-2 text-white/90 text-base">
                  Sipariş ve teslimatla ilgili tüm sorularınız için destek ekibimiz hazır.
                </p>
              </div>
              <Link
                href="mailto:destek@seedworld.com?subject=Sipariş%20Desteği"
                className="inline-flex items-center gap-3 rounded-2xl bg-white text-[#27ae60] hover:bg-white/90 text-base font-bold px-8 py-4 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                E-posta ile İletişim 
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
