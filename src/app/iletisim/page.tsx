// File: app/iletisim/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";


export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [disabledUntil, setDisabledUntil] = useState<number>(0);
  const hpRef = useRef<HTMLInputElement | null>(null); // honeypot
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Basit rate-limit (önleyen değil; UI'da ikaz için)
  useEffect(() => {
    if (!disabledUntil) return;
    const t = setInterval(() => {
      if (Date.now() > disabledUntil) {
        setDisabledUntil(0);
        clearInterval(t);
      }
    }, 300);
    return () => clearInterval(t);
  }, [disabledUntil]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hpRef.current?.value) {
      // Bot olasılığı
      return;
    }
    if (disabledUntil && Date.now() < disabledUntil) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basit ön-doğrulama
    const email = String(data.email || "");
    const message = String(data.message || "");
    const name = String(data.name || "");
    if (!name.trim() || !message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Lütfen geçerli bir ad, e-posta ve mesaj girin.");
      setStatus("err");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    btnRef.current?.setAttribute("aria-busy", "true");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setStatus(res.ok ? "ok" : "err");
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setErrorMsg(text || "Gönderilemedi. Lütfen tekrar deneyin.");
      }
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        // Çift tıklamayı önlemek için 8 sn kilitle
        setDisabledUntil(Date.now() + 8000);
      }
    } catch {
      setStatus("err");
      setErrorMsg("Ağ hatası. Lütfen bağlantınızı kontrol edin.");
    } finally {
      btnRef.current?.setAttribute("aria-busy", "false");
    }
  }

  return (
    <div className="pb-20 bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* üst ince degrade şerit */}
      <div
        className="h-1.5 w-full shadow-sm"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
        aria-hidden
      />

      {/* HERO SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-black text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-amber-500 bg-clip-text text-transparent">
              İletişime
            </span>{" "}
            Geçin
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Sorularınız, iş birlikleri ve distribütörlük talepleri için formu
            doldurun ya da aşağıdaki kanallardan bize ulaşın.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="rounded-[32px] bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-1 shadow-2xl">
              <div className="rounded-[30px] bg-white p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Mesaj Gönderin
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot alanı (görünmez) */}
                  <input
                    ref={hpRef}
                    tabIndex={-1}
                    autoComplete="off"
                    name="website"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Ad Soyad *
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        E-posta *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        inputMode="email"
                        autoComplete="email"
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Konu
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      maxLength={120}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Mesaj *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                    <p className="sr-only" id="form-status" aria-live="polite" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button
                      ref={btnRef}
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={status === "sending" || !!disabledUntil}
                      aria-disabled={status === "sending" || !!disabledUntil}
                      aria-describedby="submit-help"
                    >
                      {status === "sending" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Gönderiliyor…
                        </>
                      ) : (
                        <>
                          Mesajı Gönder
                          <Send
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>

                    <span
                      id="submit-help"
                      className="text-xs text-gray-500"
                      aria-live="polite"
                    >
                      {disabledUntil && Date.now() < disabledUntil
                        ? "Kısa bir süre sonra tekrar gönderebilirsiniz."
                        : ""}
                    </span>

                    {status === "ok" && (
                      <div
                        className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3"
                        role="status"
                        aria-live="polite"
                      >
                        <CheckCircle2
                          className="text-green-600 flex-shrink-0"
                          size={20}
                        />
                        <span className="text-sm font-medium text-green-700">
                          Mesajınız alındı. Teşekkürler!
                        </span>
                      </div>
                    )}

                    {status === "err" && (
                      <div
                        className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3"
                        role="alert"
                        aria-live="assertive"
                      >
                        <AlertCircle
                          className="text-red-600 flex-shrink-0"
                          size={20}
                        />
                        <span className="text-sm font-medium text-red-700">
                          {errorMsg ||
                            "Gönderilemedi. Lütfen tekrar deneyin."}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Gönder butonuna basarak{" "}
                    <a
                      className="underline"
                      href="/kvkk"
                      target="_self"
                      rel="noopener"
                    >
                      KVKK aydınlatma metnini
                    </a>{" "}
                    kabul etmiş olursunuz.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* İLETİŞİM BİLGİLERİ */}
          <div className="space-y-6">
            {/* İletişim Kartı */}
            <div className="rounded-3xl border-2 border-green-200/50 bg-gradient-to-br from-white via-green-50/30 to-amber-50/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                İletişim Bilgileri
              </h2>

              <div className="space-y-5">
                <a
                  href="mailto:info@ggseedworld.com"
                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <Mail size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      E-posta
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      info@ggseedworld.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+902167558850"
                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <Phone size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Telefon
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      0216 755 88 50
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                    <MapPin size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Adres
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                    <Clock size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Çalışma Saatleri
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      Hafta içi 09:00–18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Harita */}
            <div className="rounded-3xl overflow-hidden border-2 border-green-200/50 shadow-xl">
              <iframe
                title="Harita"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Istanbul&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HIZLI İLETİŞİM KANALLARI */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="rounded-[32px] bg-gradient-to-br from-amber-100 via-green-100 to-green-200 p-1 shadow-2xl">
          <div className="rounded-[30px] bg-white p-10 md:p-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hızlı İletişim Kanalları
              </h2>
              <p className="text-lg text-gray-600">
                Size en uygun iletişim kanalını seçin ve bize ulaşın
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="mailto:info@ggseedworld.com"
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white hover:border-transparent p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                aria-label="E-posta gönder"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg mb-4">
                    <Mail size={28} aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    E-posta Gönder
                  </h3>
                  <p className="text-sm text-gray-600">Detaylı sorularınız için</p>
                </div>
              </a>

              <a
                href="tel:+902167558850"
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white hover:border-transparent p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                aria-label="Telefon et"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg mb-4">
                    <Phone size={28} aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Telefon Et
                  </h3>
                  <p className="text-sm text-gray-600">Hızlı çözümler için</p>
                </div>
              </a>

              <a
                href="https://wa.me/902167558850"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white hover:border-transparent p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                aria-label="WhatsApp ile yaz"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg mb-4">
                    <svg
                      className="w-7 h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Anlık mesajlaşma</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
