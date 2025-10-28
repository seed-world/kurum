"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [disabledUntil, setDisabledUntil] = useState<number>(0);
  const hpRef = useRef<HTMLInputElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

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
    if (hpRef.current?.value) return;
    if (disabledUntil && Date.now() < disabledUntil) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
        setDisabledUntil(Date.now() + 8000);
      }
    } catch {
      setStatus("err");
      setErrorMsg("Ağ hatası. Lütfen bağlantınızı kontrol edin.");
    } finally {
      btnRef.current?.setAttribute("aria-busy", "false");
    }
  }

  // GERÇEK BİLGİLER
  const COMPANY_EMAIL = "info@ggseedworld.com";
  const COMPANY_TEL_E164 = "+902167558850";
  const COMPANY_TEL_READABLE = "0216 755 88 50";
  const COMPANY_ADDRESS =
    "Üniversite Mah. Civan Sk. Allure Tower İstanbul Sitesi A Blok No:1 İç Kapı No:271, Avcılar / İstanbul";
  const MAP_QUERY = encodeURIComponent(COMPANY_ADDRESS);
  const WHATSAPP_LINK = "https://wa.me/902167558850";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-[#f8fdf9] to-white overflow-hidden">
      {/* Üst şerit */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      {/* Arka plan hafif dalga */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-contact" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M0,60 Q30,40 60,60 T120,60"
                fill="none"
                stroke="#27ae60"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-contact)" />
        </svg>
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent bg-[length:200%]"
            >
              İletişime
            </motion.span>{" "}
            <span className="text-gray-900">Geçin</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
          >
            Sorularınız, iş birlikleri ve distribütörlük talepleri için formu doldurun ya da aşağıdaki kanallardan bize ulaşın.
          </motion.p>
        </motion.section>

        {/* MAIN CONTENT */}
        <section className="mt-20 grid gap-12 lg:grid-cols-3">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="rounded-[40px] bg-gradient-to-br from-[#27ae60] via-[#1b7f3a] to-[#27ae60] p-1.5 shadow-2xl"
            >
              <div className="rounded-[38px] bg-white/95 backdrop-blur-md p-10 md:p-12">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3"
                >
                  <Sparkles className="h-8 w-8 text-[#f39c12]" />
                  Mesaj Gönderin
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                  <input ref={hpRef} tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" className="hidden" />

                  <div className="grid gap-7 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2.5">
                        Ad Soyad *
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-base outline-none focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Adınız ve soyadınız"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2.5">
                        E-posta *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        inputMode="email"
                        autoComplete="email"
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-base outline-none focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 transition-all duration-300 placeholder:text-gray-400"
                        placeholder="ornek@email.com"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2.5">
                      Konu
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      maxLength={120}
                      className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-base outline-none focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 transition-all duration-300 placeholder:text-gray-400"
                      placeholder="Mesajınızın konusu"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2.5">
                      Mesaj *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-base outline-none focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 transition-all duration-300 resize-none placeholder:text-gray-400"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <button
                      ref={btnRef}
                      type="submit"
                      disabled={status === "sending" || !!disabledUntil}
                      className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60] text-white font-extrabold px-8 py-4.5 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105"
                    >
                      {status === "sending" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Gönderiliyor…
                        </>
                      ) : (
                        <>
                          Mesajı Gönder
                          <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {disabledUntil && Date.now() < disabledUntil && (
                      <span className="text-sm text-gray-500 animate-pulse">
                        Kısa bir süre sonra tekrar gönderebilirsiniz.
                      </span>
                    )}

                    <AnimatePresence>
                      {status === "ok" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#27ae60]/10 to-[#f39c12]/10 border-2 border-[#27ae60]/30 px-5 py-3.5"
                        >
                          <CheckCircle2 className="h-6 w-6 text-[#27ae60]" />
                          <span className="font-bold text-[#1b7f3a]">Mesajınız alındı. Teşekkürler!</span>
                        </motion.div>
                      )}

                      {status === "err" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-3 rounded-2xl bg-red-50 border-2 border-red-200 px-5 py-3.5"
                        >
                          <AlertCircle className="h-6 w-6 text-red-600" />
                          <span className="font-bold text-red-700">
                            {errorMsg || "Gönderilemedi. Lütfen tekrar deneyin."}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="text-xs text-gray-500 leading-relaxed"
                  >
                    Gönder butonuna basarak{" "}
                    <a href="/kvkk" className="underline font-bold text-[#1b7f3a] hover:text-[#27ae60] transition-colors">
                      KVKK aydınlatma metnini
                    </a>{" "}
                    kabul etmiş olursunuz.
                  </motion.p>
                </form>
              </div>
            </motion.div>
          </motion.div>

          {/* İLETİŞİM BİLGİLERİ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="space-y-8"
          >
            {/* İletişim Kartı */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl border-2 border-[#27ae60]/20 bg-gradient-to-br from-white via-[#f8fdf9] to-[#fff8e1]/50 p-8 shadow-xl ring-1 ring-[#27ae60]/10"
            >
              <h2 className="text-2xl font-extrabold text-gray-900 mb-7 flex items-center gap-3">
                <MessageCircle className="h-7 w-7 text-[#f39c12]" />
                İletişim Bilgileri
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: <Mail size={22} />,
                    label: "E-posta",
                    value: COMPANY_EMAIL,
                    href: `mailto:${COMPANY_EMAIL}`,
                    gradient: "from-[#27ae60] to-[#1b7f3a]",
                  },
                  {
                    icon: <Phone size={22} />,
                    label: "Telefon",
                    value: COMPANY_TEL_READABLE,
                    href: `tel:${COMPANY_TEL_E164}`,
                    gradient: "from-[#f39c12] to-[#d35400]",
                  },
                  {
                    icon: <MapPin size={22} />,
                    label: "Adres",
                    value: COMPANY_ADDRESS,
                    href: null,
                    gradient: "from-[#3498db] to-[#2980b9]",
                  },
                  {
                    icon: <Clock size={22} />,
                    label: "Çalışma Saatleri",
                    value: "Hafta içi 09:00–18:00 (Cumartesi–Pazar kapalı)",
                    href: null,
                    gradient: "from-[#9b59b6] to-[#8e44ad]",
                  },
                ].map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href || undefined}
                    className={`group flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 ${
                      item.href ? "hover:bg-white/70 hover:shadow-md" : ""
                    }`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 + idx * 0.1 }}
                  >
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 mb-1">{item.label}</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Harita */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="rounded-3xl overflow-hidden border-2 border-[#27ae60]/20 shadow-2xl ring-1 ring-[#27ae60]/10"
            >
              <iframe
                title="GG SeedWorld - Konum"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* HIZLI İLETİŞİM KANALLARI */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-24"
        >
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="rounded-[40px] bg-gradient-to-br from-[#f39c12] via-[#27ae60] to-[#1b7f3a] p-1.5 shadow-2xl"
          >
            <div className="rounded-[38px] bg-white/95 backdrop-blur-md p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  Hızlı İletişim Kanalları
                </h2>
                <p className="text-xl text-gray-600">Size en uygun iletişim kanalını seçin ve bize ulaşın</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <Mail size={32} />,
                    title: "E-posta Gönder",
                    desc: "Detaylı sorularınız için",
                    href: `mailto:${COMPANY_EMAIL}`,
                    gradient: "from-[#27ae60] to-[#1b7f3a]",
                  },
                  {
                    icon: <Phone size={32} />,
                    title: "Telefon Et",
                    desc: "Hızlı çözümler için",
                    href: `tel:${COMPANY_TEL_E164}`,
                    gradient: "from-[#f39c12] to-[#d35400]",
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                      </svg>
                    ),
                    title: "WhatsApp",
                    desc: "Anlık mesajlaşma",
                    href: WHATSAPP_LINK,
                    gradient: "from-[#25d366] to-[#128c7e]",
                  },
                ].map((channel, idx) => (
                  <motion.a
                    key={idx}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-transparent hover:scale-105"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + idx * 0.15 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                    />
                    <div className="relative text-center">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${channel.gradient} text-white shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {channel.icon}
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{channel.title}</h3>
                      <p className="text-base text-gray-600 flex items-center justify-center gap-2">
                        {channel.desc}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}