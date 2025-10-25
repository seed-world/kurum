// File: app/rfq/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User2,
  Package,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Paperclip,
} from "lucide-react";

/**
 * RFQ (Request For Quotation) — Çok adımlı form
 * Yeni tasarım: Aydınlık tema, beyaz kartlar, border-2, yeşil/amber aksanlar.
 * /api/rfq endpoint'ine POST atar (multipart/form-data).
 */

const STEPS = [
  { key: "company", label: "Şirket" },
  { key: "contact", label: "İletişim" },
  { key: "request", label: "Talep" },
  { key: "review", label: "Onay" },
] as const;

type StepKey = typeof STEPS[number]["key"];

export default function RFQPage() {
  const [step, setStep] = useState<StepKey>("company");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState({
    // Company
    companyName: "",
    vat: "",
    country: "Türkiye",
    website: "",
    // Contact
    fullName: "",
    email: "",
    phone: "",
    // Request
    products: "",
    quantity: "",
    unit: "kg",
    incoterm: "EXW",
    deliveryCity: "",
    deliveryCountry: "Türkiye",
    targetDate: "",
    budget: "",
    notes: "",
    consent: false,
  });

  const [files, setFiles] = useState<File[]>([]);

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validateCurrentStep(): boolean {
    const e: Record<string, string> = {};
    if (step === "company") {
      if (!data.companyName.trim()) e.companyName = "Şirket adı gerekli";
      if (!data.country.trim()) e.country = "Ülke gerekli";
    }
    if (step === "contact") {
      if (!data.fullName.trim()) e.fullName = "Ad soyad gerekli";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Geçerli e-posta girin";
      if (!data.phone.trim()) e.phone = "Telefon gerekli";
    }
    if (step === "request") {
      if (!data.products.trim()) e.products = "Talep edilen ürün(ler)i girin";
      if (!Number(data.quantity)) e.quantity = "Geçerli miktar girin";
      if (!data.deliveryCity.trim()) e.deliveryCity = "Teslimat şehri gerekli";
      if (!data.targetDate) e.targetDate = "Hedef tarih gerekli";
    }
    if (step === "review") {
      if (!data.consent) e.consent = "Aydınlatma metnini onaylayın";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateCurrentStep()) return;
    const i = STEPS.findIndex((s) => s.key === step);
    setStep(STEPS[Math.min(i + 1, STEPS.length - 1)].key);
  }

  function back() {
    const i = STEPS.findIndex((s) => s.key === step);
    setStep(STEPS[Math.max(i - 1, 0)].key);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("review");
    if (!validateCurrentStep()) return;

    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("payload", new Blob([JSON.stringify(data)], { type: "application/json" }));
      files.forEach((f) => fd.append("files", f, f.name));

      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) {
        setFiles([]);
        setData({
          companyName: "",
          vat: "",
          country: "Türkiye",
          website: "",
          fullName: "",
          email: "",
          phone: "",
          products: "",
          quantity: "",
          unit: "kg",
          incoterm: "EXW",
          deliveryCity: "",
          deliveryCountry: "Türkiye",
          targetDate: "",
          budget: "",
          notes: "",
          consent: false,
        });
        setStep("company");
      }
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Üst gradient şerit */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)" }}
      />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* HERO */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mt-1 text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
              Tedarik ve Toplu Alımlar için
              <span className="block bg-gradient-to-r from-[#1b7f3a] to-[#f39c12] bg-clip-text text-transparent">
                Teklif Talep Edin
              </span>
            </h1>
            <p className="mt-4 text-gray-700">
              Kurumsal satın alma, distribütörlük ve proje bazlı talepleriniz için formu doldurun, ekleri yükleyin; hızlı dönüş yapalım.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a]/10 to-[#27ae60]/10 border border-[#27ae60]/30 px-3 py-1.5 text-xs font-semibold text-[#1b7f3a]">
              PDF / XLSX / CSV / görsel / şartname yükleyebilirsiniz.
            </div>
          </div>

          <div className="relative h-56 md:h-80 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-2xl">
            <Image src="/images/rfq-hero.jpg" alt="RFQ hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 border-2 border-gray-200 text-sm font-semibold text-gray-800 shadow">
              B2B & Proje Satış
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="mt-10">
          <div className="rounded-3xl border-2 border-gray-200 bg-white p-4 md:p-6 shadow-sm">
            <ol className="grid grid-cols-4 gap-2 text-center text-xs">
              {STEPS.map((s, i) => {
                const idx = STEPS.findIndex((x) => x.key === step);
                const active = i <= idx;
                return (
                  <li
                    key={s.key}
                    className={`rounded-xl px-2 py-2 font-semibold ${
                      active
                        ? "bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white shadow"
                        : "border-2 border-gray-200 text-gray-700"
                    }`}
                  >
                    {s.label}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 md:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-6">
            <Card
              title="Şirket Bilgileri"
              icon={<Building2 className="h-5 w-5 text-[#27ae60]" />}
              hidden={step !== "company"}
            >
              <Field label="Şirket Adı *" name="companyName" value={data.companyName} onChange={(v) => update("companyName", v)} error={errors.companyName} />
              <Field label="Vergi No / VAT" name="vat" value={data.vat} onChange={(v) => update("vat", v)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Ülke *" name="country" value={data.country} onChange={(v) => update("country", v)} error={errors.country} />
                <Field label="Web Sitesi" name="website" value={data.website} onChange={(v) => update("website", v)} placeholder="https://" />
              </div>
            </Card>

            <Card
              title="Talep Detayları"
              icon={<Package className="h-5 w-5 text-[#27ae60]" />}
              hidden={step !== "request"}
            >
              <Field
                as="textarea"
                rows={4}
                label="Ürün(ler) *"
                name="products"
                value={data.products}
                onChange={(v) => update("products", v)}
                placeholder="Örn: Ayar domates 50 kg, Kırmızı biber 100 kg"
                error={errors.products}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Miktar *" name="quantity" value={data.quantity} onChange={(v) => update("quantity", v)} error={errors.quantity} />
                <Select label="Birim" value={data.unit} onChange={(v) => update("unit", v)} options={["kg", "adet", "paket"]} />
                <Select label="Incoterm" value={data.incoterm} onChange={(v) => update("incoterm", v)} options={["EXW", "FCA", "FOB", "CIF", "DAP", "DDP"]} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Teslimat Şehri *" name="deliveryCity" value={data.deliveryCity} onChange={(v) => update("deliveryCity", v)} error={errors.deliveryCity} />
                <Field label="Teslimat Ülkesi" name="deliveryCountry" value={data.deliveryCountry} onChange={(v) => update("deliveryCountry", v)} />
                <Field label="Hedef Tarih *" name="targetDate" type="date" value={data.targetDate} onChange={(v) => update("targetDate", v)} error={errors.targetDate} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Bütçe (opsiyonel)" name="budget" value={data.budget} onChange={(v) => update("budget", v)} />
                <Field as="textarea" rows={3} label="Notlar" name="notes" value={data.notes} onChange={(v) => update("notes", v)} />
              </div>

              <Uploader files={files} setFiles={setFiles} />
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card
              title="İletişim Bilgileri"
              icon={<User2 className="h-5 w-5 text-[#27ae60]" />}
              hidden={step !== "contact"}
            >
              <Field label="Ad Soyad *" name="fullName" value={data.fullName} onChange={(v) => update("fullName", v)} error={errors.fullName} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="E-posta *" name="email" type="email" value={data.email} onChange={(v) => update("email", v)} error={errors.email} />
                <Field label="Telefon *" name="phone" value={data.phone} onChange={(v) => update("phone", v)} error={errors.phone} />
              </div>
            </Card>

            <Card
              title="Onay & Gönder"
              icon={<CheckCircle2 className="h-5 w-5 text-[#27ae60]" />}
              hidden={step !== "review"}
            >
              <p className="text-sm text-gray-700">
                Aşağıdaki onayı vererek, bilgilerinizin teklif çalışması için işlenmesini kabul etmiş olursunuz. Detaylar için{" "}
                <Link href="/kvkk" className="underline text-[#1b7f3a]">KVKK</Link> sayfamıza göz atın.
              </p>
              <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#27ae60] focus:ring-[#27ae60]"
                />
                Onaylıyorum
              </label>
              {errors.consent && <p className="text-xs text-amber-600 mt-1">{errors.consent}</p>}

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={back} className="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  Geri
                </button>
                <button type="submit" disabled={status === "sending"} className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] text-white px-5 py-3 text-sm font-bold disabled:opacity-60">
                  Gönder
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="mt-4 min-h-[40px]">
                {status === "sending" && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 border-2 border-gray-200 text-sm text-gray-800">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" /> Gönderiliyor…
                  </div>
                )}
                {status === "ok" && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 border-2 border-green-300 text-sm text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Talebiniz alındı. Teşekkürler!
                  </div>
                )}
                {status === "err" && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 border-2 border-red-300 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" /> Gönderilemedi. Lütfen tekrar deneyin.
                  </div>
                )}
              </div>
            </Card>

            {/* Step Controls */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-700">
                  Adım: <b>{STEPS.findIndex((s) => s.key === step) + 1} / {STEPS.length}</b>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={back} className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                    Geri
                  </button>
                  {step !== "review" ? (
                    <button type="button" onClick={next} className="rounded-xl bg-gradient-to-r from-[#f39c12] to-[#d35400] px-4 py-2 text-sm font-bold text-white hover:from-[#d35400] hover:to-[#f39c12]">
                      İleri
                    </button>
                  ) : (
                    <button type="submit" className="rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-4 py-2 text-sm font-bold text-white">
                      Gönder
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Yardım */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-4 text-sm text-gray-700">
              Sorular için{" "}
              <Link href="/iletisim" className="underline text-[#1b7f3a]">İletişim</Link>{" "}
              sayfamızı kullanabilir veya{" "}
              <a href="mailto:info@ggseedworld.com" className="underline text-[#1b7f3a]">info@ggseedworld.com</a>{" "}
              adresinden bize ulaşabilirsiniz.
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ----------------- Küçük Bileşenler ----------------- */

function Card({
  title,
  icon,
  children,
  hidden,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hidden?: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <div className="mt-4 grid gap-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  as,
  rows,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  as?: "textarea";
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows ?? 4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#27ae60] ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-white px-3 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#27ae60] ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        />
      )}
      {error && <p className="mt-1 text-xs text-amber-600">{error}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-3 py-3 text-gray-900 outline-none focus:border-[#27ae60] cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ArrowRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-gray-500" />
      </div>
    </div>
  );
}

function Uploader({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: (f: File[]) => void;
}) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    if (list.length) setFiles([...(files || []), ...list]);
  }
  function remove(i: number) {
    setFiles(files.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">
        Dosyalar (opsiyonel)
      </label>
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4">
        <input
          id="rfq-files"
          type="file"
          multiple
          onChange={onChange}
          className="hidden"
          accept=".pdf,.xlsx,.xls,.csv,image/*"
        />
        <label
          htmlFor="rfq-files"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
        >
          <Paperclip className="h-4 w-4 text-[#f39c12]" /> Dosya Ekle
        </label>
        <p className="mt-2 text-xs text-gray-600">
          PDF, XLSX/CSV, görseller desteklenir. Maks. 10 dosya önerilir.
        </p>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-3 py-2"
              >
                <span className="truncate max-w-[70%] text-gray-800">{f.name}</span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Notlar ----------
POST /api/rfq (multipart/form-data)
- payload: JSON (company/contact/request alanlarını içerir)
- files: bir veya daha fazla dosya

Örnek JSON (payload):
{
  "companyName": "Acme A.Ş.",
  "vat": "TR1234567890",
  "country": "Türkiye",
  "website": "https://acme.com",
  "fullName": "Ada Yılmaz",
  "email": "ada@example.com",
  "phone": "+90 212 000 0000",
  "products": "Ayar domates 50 kg; Kırmızı biber 100 kg",
  "quantity": "150",
  "unit": "kg",
  "incoterm": "DAP",
  "deliveryCity": "İstanbul",
  "deliveryCountry": "Türkiye",
  "targetDate": "2025-11-01",
  "budget": "",
  "notes": "12C soğuk zincir tercih edilir.",
  "consent": true
}
*/
