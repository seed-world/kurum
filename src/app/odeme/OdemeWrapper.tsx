// app/odeme/OdemeWrapper.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  CreditCard,
  Landmark,
  Building2,
  User2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";

type MusteriTipi = "kurumsal" | "bireysel" | "katilimci";
type OdemeYontemi = "kredi-karti" | "havale";

function fmtPrice(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  return `${f} ₺`;
}
const applyDiscount = (total: number, tip: MusteriTipi | null) =>
  tip === "kurumsal" ? total * 0.85 : tip === "katilimci" ? total * 0.75 : total;

export default function OdemeWrapper() {
  const router = useRouter();
  const sp = useSearchParams();
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const musteriTipi = (sp.get("musteriTipi") as MusteriTipi) || null;
  const yontem = (sp.get("yontem") as OdemeYontemi) || null;

  // Katılımcı → dış linke yönlendir
  useEffect(() => {
    if (musteriTipi === "katilimci") {
      router.replace("https://ornek-partner-sayfasi.com/katilim");
    }
  }, [musteriTipi, router]);

  // Adım çubuğu
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  useEffect(() => {
    if (!musteriTipi || !yontem) setStep(1);
  }, [musteriTipi, yontem]);

  // Form state
  const [kurumsal, setKurumsal] = useState({
    unvan: "",
    vergiNo: "",
    vergiDairesi: "",
    yetkiliAdSoyad: "",
    email: "",
    telefon: "",
    adres: "",
    faturaNotu: "",
  });
  const [bireysel, setBireysel] = useState({
    adSoyad: "",
    tckn: "",
    email: "",
    telefon: "",
    adres: "",
    faturaNotu: "",
  });

  // Kredi kartı
  const [kk, setKk] = useState({
    adSoyad: "",
    kartNo: "",
    ay: "",
    yil: "",
    cvc: "",
  });

  const indirimliToplam = useMemo(
    () => applyDiscount(total, musteriTipi),
    [total, musteriTipi]
  );

  // Doğrulama
  const infoValid =
    musteriTipi === "kurumsal"
      ? kurumsal.unvan && kurumsal.vergiNo && kurumsal.email && kurumsal.telefon && kurumsal.adres
      : musteriTipi === "bireysel"
        ? bireysel.adSoyad && bireysel.email && bireysel.telefon && bireysel.adres
        : false;

  const paymentValid =
    yontem === "havale"
      ? true
      : kk.adSoyad && kk.kartNo.replace(/\s/g, "").length >= 12 && kk.ay && kk.yil && kk.cvc.length >= 3;

  const canNextFromStep2 = infoValid;
  const canNextFromStep3 = paymentValid;

  // Sipariş oluştur
  const placeOrder = async () => {
    if (!items.length) {
      alert("Sepetiniz boş!");
      return;
    }

    setLoading(true);

    const payload = {
      user_id: null,
      guest_key: localStorage.getItem("guest_key") || null,
      customer_type: musteriTipi!,
      payment_method: yontem!,
      status: "pending",
      currency: "TRY",
      subtotal: total,
      discount_total:
        musteriTipi === "kurumsal" ? total * 0.15 :
          musteriTipi === "katilimci" ? total * 0.25 : 0,
      shipping_total: 0,
      tax_total: 0,
      grand_total: indirimliToplam,
      company_title: kurumsal.unvan || null,
      tax_number: (musteriTipi === "kurumsal" ? kurumsal.vergiNo : bireysel.tckn) || null,
      tax_office: kurumsal.vergiDairesi || null,
      contact_name: (musteriTipi === "kurumsal" ? kurumsal.yetkiliAdSoyad : bireysel.adSoyad) || null,
      email: (musteriTipi === "kurumsal" ? kurumsal.email : bireysel.email) || null,
      phone: (musteriTipi === "kurumsal" ? kurumsal.telefon : bireysel.telefon) || null,
      address_text: (musteriTipi === "kurumsal" ? kurumsal.adres : bireysel.adres) || null,
      note: (musteriTipi === "kurumsal" ? kurumsal.faturaNotu : bireysel.faturaNotu) || null,
      payment_snapshot: yontem === "havale"
        ? "HAVALE"
        : { name: kk.adSoyad, last4: kk.kartNo.slice(-4) },
      cart_id: null,
      domain: typeof window !== "undefined" ? window.location.hostname : null,
      items: items.map(it => ({
        product_id: it.productId,
        code: it.code ?? null,
        title: it.title,
        unit_price: it.price,
        quantity: it.qty,
        currency: "TRY",
        line_total: it.price * it.qty,
        image_path: it.imageUrl ?? null,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert("Sipariş oluşturulamadı: " + (e?.error ?? res.statusText));
        return;
      }

      const json = await res.json();
      const order = json?.data ?? json;

      clear(); // Sepeti boşalt

      const q = new URLSearchParams({
        id: String(order.id),
        no: String(order.order_number || ""),
        ct: String(order.customer_type || ""),
        pm: String(order.payment_method || ""),
      });
      router.push(`/tesekkurler?${q.toString()}`);
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ödeme İşlemi</h1>
          </div>
          <p className="text-gray-600 mb-8 flex items-center gap-2 text-sm md:text-base">
            <AlertCircle className="h-5 w-5 text-[#f39c12]" />
            {musteriTipi ? `Seçilen Tip: ${musteriTipi.toUpperCase()} · Yöntem: ${(yontem || "").replace("-", " ").toUpperCase()}` : "Önce ödeme penceresinden tip & yöntem seçip gelmelisin."}
          </p>

          {/* Stepper */}
          <div className="mb-10">
            <div className="grid grid-cols-4 gap-4">
              {["Sepet", "Bilgiler", "Ödeme", "Onay"].map((t, i) => (
                <motion.div
                  key={t}
                  className="relative flex flex-col items-center"
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: step >= (i + 1) ? 1.05 : 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${step >= (i + 1) ? "bg-gradient-to-br from-[#27ae60] to-[#1b7f3a]" : "bg-gray-300"}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs mt-2 font-medium text-gray-700">{t}</p>
                  {i < 3 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -z-10" style={{ transform: "translateX(50%)" }} />
                  )}
                  {step > (i + 1) && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] -z-10" style={{ transform: "translateX(50%)" }} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sepet özeti */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="h-6 w-6 text-[#f39c12]" />
              <h2 className="text-xl font-semibold text-gray-900">Sepet Özeti</h2>
            </div>
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between text-sm border-b pb-2 border-gray-100">
                  <div className="truncate pr-4 text-gray-600">{it.title} <span className="text-gray-500">×{it.qty}</span></div>
                  <div className="font-semibold whitespace-nowrap text-black">{fmtPrice(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Ara Toplam</span><span className="font-semibold text-gray-600">{fmtPrice(total)}</span></div>
              {musteriTipi === "kurumsal" && (
                <div className="flex justify-between text-[#27ae60] mt-1"><span>Kurumsal İndirim (%15)</span><span>- {fmtPrice(total - indirimliToplam)}</span></div>
              )}
              {musteriTipi === "katilimci" && (
                <div className="flex justify-between text-[#f39c12] mt-1"><span>Katılımcı İndirim (%25)</span><span>- {fmtPrice(total - indirimliToplam)}</span></div>
              )}
              <div className="flex justify-between text-lg mt-2"><span className="font-semibold text-gray-600">Ödenecek</span><span className="font-extrabold text-[#27ae60] ">{fmtPrice(indirimliToplam)}</span></div>
            </div>
          </motion.section>

          {/* STEP 1 → 2 */}
          {step === 1 && (
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                disabled={!musteriTipi || !yontem}
                className={`cursor-pointer rounded-xl px-6 py-3 text-white font-semibold shadow-md transition-all ${musteriTipi && yontem ? "bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60]" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Bilgilere Geç
              </motion.button>
            </div>
          )}

          {/* STEP 2: Bilgiler */}
          {step === 2 && musteriTipi && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                {musteriTipi === "kurumsal" ? <Building2 className="h-6 w-6 text-[#27ae60]" /> : <User2 className="h-6 w-6 text-[#27ae60]" />}
                <h2 className="text-xl font-semibold text-gray-900">
                  {musteriTipi === "kurumsal" ? "Firma Bilgileri" : "Kişisel Bilgiler"}
                </h2>
              </div>

              {musteriTipi === "kurumsal" ? (
                <div className="grid md:grid-cols-2 gap-4 text-black">
                  <Input label="Ticari Unvan" value={kurumsal.unvan} onChange={(v) => setKurumsal(s => ({ ...s, unvan: v }))} />
                  <Input label="Vergi No" value={kurumsal.vergiNo} onChange={(v) => setKurumsal(s => ({ ...s, vergiNo: v }))} />
                  <Input label="Vergi Dairesi" value={kurumsal.vergiDairesi} onChange={(v) => setKurumsal(s => ({ ...s, vergiDairesi: v }))} />
                  <Input label="Yetkili Ad Soyad" value={kurumsal.yetkiliAdSoyad} onChange={(v) => setKurumsal(s => ({ ...s, yetkiliAdSoyad: v }))} />
                  <Input type="email" label="E-posta" value={kurumsal.email} onChange={(v) => setKurumsal(s => ({ ...s, email: v }))} />
                  <Input label="Telefon" value={kurumsal.telefon} onChange={(v) => setKurumsal(s => ({ ...s, telefon: v }))} />
                  <Textarea className="md:col-span-2" label="Adres" value={kurumsal.adres} onChange={(v) => setKurumsal(s => ({ ...s, adres: v }))} />
                  <Textarea className="md:col-span-2" label="Fatura Notu (isteğe bağlı)" value={kurumsal.faturaNotu} onChange={(v) => setKurumsal(s => ({ ...s, faturaNotu: v }))} />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 text-black">
                  <Input label="Ad Soyad" value={bireysel.adSoyad} onChange={(v) => setBireysel(s => ({ ...s, adSoyad: v }))} />
                  <Input label="T.C. Kimlik No" value={bireysel.tckn} onChange={(v) => setBireysel(s => ({ ...s, tckn: v }))} />
                  <Input type="email" label="E-posta" value={bireysel.email} onChange={(v) => setBireysel(s => ({ ...s, email: v }))} />
                  <Input label="Telefon" value={bireysel.telefon} onChange={(v) => setBireysel(s => ({ ...s, telefon: v }))} />
                  <Textarea className="md:col-span-2" label="Adres" value={bireysel.adres} onChange={(v) => setBireysel(s => ({ ...s, adres: v }))} />
                  <Textarea className="md:col-span-2" label="Fatura Notu (isteğe bağlı)" value={bireysel.faturaNotu} onChange={(v) => setBireysel(s => ({ ...s, faturaNotu: v }))} />
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" /> Geri
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  disabled={!canNextFromStep2}
                  className={`cursor-pointer flex items-center gap-2 rounded-xl px-6 py-3 text-white font-semibold shadow-md transition-all ${canNextFromStep2 ? "bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60]" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  Ödeme Adımına Geç
                </motion.button>
              </div>
            </motion.section>
          )}

          {/* STEP 3: Ödeme */}
          {step === 3 && yontem && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                {yontem === "havale" ? <Landmark className="h-6 w-6 text-[#f39c12]" /> : <CreditCard className="h-6 w-6 text-[#f39c12]" />}
                <h2 className="text-xl font-semibold text-gray-900">
                  {yontem === "havale" ? "Banka Havalesi" : "Kredi Kartı"}
                </h2>
              </div>

              {yontem === "havale" ? (
                <div className="space-y-4">
                  <p className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <Banknote className="h-5 w-5 text-[#27ae60]" />
                    Ödemenizi aşağıdaki IBAN’a, açıklamaya <b>sipariş ad-soyad</b> yazarak yapın:
                  </p>
                  <div className="rounded-2xl bg-gradient-to-br from-[#27ae60]/10 to-[#1b7f3a]/10 border border-[#27ae60]/20 p-5 space-y-2 text-sm md:text-base text-black">
                    <div className="flex gap-2"><span className="font-medium">Banka:</span> T.C. Ziraat Bankası</div>
                    <div className="flex gap-2"><span className="font-medium">IBAN (USD):</span> TR1100 0100 1798 9797 9952 5003</div>
                    <div className="flex gap-2"><span className="font-medium">IBAN (EUR):</span> TR8100 0100 1798 9797 9952 5004</div>
                    <div className="flex gap-2"><span className="font-medium">SWIFT (BIC):</span> TCZBTR2AXXX</div>
                    <div className="flex gap-2"><span className="font-medium">CHIPS (USD):</span> 409993</div>
                    <div className="flex gap-2"><span className="font-medium">Alıcı:</span> Global Nexus Sağlık Kozmetik Gıda ve Ticaret A.Ş.</div>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#f39c12]" />
                    Tüm ödemeler yalnızca bu hesaplar üzerinden kabul edilir. Dekontu <b>destek@seedworld.com</b> adresine iletebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 text-black">
                  <Input label="Kart Üzerindeki İsim" value={kk.adSoyad} onChange={(v) => setKk(s => ({ ...s, adSoyad: v }))} />
                  <Input label="Kart Numarası" value={kk.kartNo} onChange={(v) => setKk(s => ({ ...s, kartNo: v }))} placeholder="XXXX XXXX XXXX XXXX" />
                  <Input label="Ay" value={kk.ay} onChange={(v) => setKk(s => ({ ...s, ay: v }))} placeholder="MM" />
                  <Input label="Yıl" value={kk.yil} onChange={(v) => setKk(s => ({ ...s, yil: v }))} placeholder="YY" />
                  <Input label="CVC" value={kk.cvc} onChange={(v) => setKk(s => ({ ...s, cvc: v }))} placeholder="XXX" className="md:col-span-2" />
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" /> Geri
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(4)}
                  disabled={!canNextFromStep3}
                  className={`cursor-pointer flex items-center gap-2 rounded-xl px-6 py-3 text-white font-semibold shadow-md transition-all ${canNextFromStep3 ? "bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60]" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  Özete Geç
                </motion.button>
              </div>
            </motion.section>
          )}

          {/* STEP 4: Onay */}
          {step === 4 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Check className="h-6 w-6 text-[#27ae60]" />
                <h2 className="text-xl font-semibold text-gray-900">Son Kontrol & Onay</h2>
              </div>
              <ul className="space-y-3 text-sm md:text-base text-gray-700">
                <li className="flex justify-between"><span>Müşteri Tipi</span><span className="font-semibold">{musteriTipi?.toUpperCase()}</span></li>
                <li className="flex justify-between"><span>Ödeme Yöntemi</span><span className="font-semibold">{(yontem || "").replace("-", " ").toUpperCase()}</span></li>
                <li className="flex justify-between border-t pt-2"><span>Ödenecek Tutar</span><span className="font-extrabold text-[#27ae60]">{fmtPrice(indirimliToplam)}</span></li>
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" /> Geri
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={placeOrder}
                  disabled={loading}
                  className="cursor-pointer flex items-center gap-2 rounded-xl px-6 py-3 text-white font-semibold bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60] shadow-md transition-all disabled:opacity-70"
                >
                  {loading ? "İşleniyor..." : "Siparişi Ver"}
                </motion.button>
              </div>

              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                “Siparişi Ver”e tıklayarak Mesafeli Satış Sözleşmesi ve KVKK metinlerini kabul etmiş olursunuz.
              </p>
            </motion.section>
          )}

          <div className="mt-8 text-center text-sm text-gray-600">
            Yanlış tip/yöntem seçtiysen, <Link href="/" className="text-[#27ae60] hover:underline font-medium">geri dön</Link> ve yeniden seç.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* Yardımcı Input & Textarea */
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-1.5">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder ?? label}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/20 transition-all placeholder-gray-400 shadow-sm"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-1.5">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/20 transition-all placeholder-gray-400 resize-none shadow-sm"
      />
    </label>
  );
}