// File: app/(auth)/auth/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

/**
 * Auth — GG SEED WORLD
 * - Video arkaplan, üst gradient şerit
 * - LOGIN: form SAĞDA
 * - REGISTER: form SOLDa
 * - Renk uyumu (tüm sayfalarla aynı mantık):
 *   Yeşil:  #1b7f3a → #27ae60
 *   Amber:  #f39c12 → #d35400
 * - Cam efektli kartlar, erişilebilirlik odak stiller
 */
export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isLogin = mode === "login";

  // Cross-fade + slide animasyon varyantları
  const panelVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: 40 * direction,
      filter: "blur(6px)",
    }),
    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: -40 * direction,
      filter: "blur(6px)",
      transition: { duration: 0.18 },
    }),
  } as const;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-neutral-950">
      {/* Üst ince gradient şerit (site geneliyle uyumlu) */}
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      {/* Arkaplan video */}
      <video
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover"
        src="/videos/auth.mp4"
        poster="/images/auth-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      {/* okunabilirlik degrade örtüsü */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/35 to-black/65"
      />

      {/* İçerik */}
      <main className="relative mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Bilgi / Pazarlama paneli (formun karşısında) */}
          <AnimatePresence mode="popLayout" initial={false}>
            {isLogin ? (
              <motion.aside
                key="info-login-left"
                custom={-1}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="order-1 md:order-1"
              >
                <InfoPanel mode="login" />
              </motion.aside>
            ) : (
              <motion.aside
                key="info-register-right"
                custom={1}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="order-2 md:order-2"
              >
                <InfoPanel mode="register" />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Form paneli — LOGIN sağ, REGISTER sol */}
          <AnimatePresence mode="popLayout" initial={false}>
            {isLogin ? (
              <motion.section
                key="form-login-right"
                custom={1}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="order-2 md:order-2"
              >
                <AuthCard title="Giriş Yap" subtitle="Hesabınıza erişin">
                  <LoginForm />
                  <SwitchText
                    text="Hesabınız yok mu?"
                    action="Kayıt Ol"
                    onClick={() => setMode("register")}
                  />
                </AuthCard>
              </motion.section>
            ) : (
              <motion.section
                key="form-register-left"
                custom={-1}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="order-1 md:order-1"
              >
                <AuthCard title="Kayıt Ol" subtitle="Ekosisteme katılın">
                  <RegisterForm />
                  <SwitchText
                    text="Zaten üye misiniz?"
                    action="Giriş Yap"
                    onClick={() => setMode("login")}
                  />
                </AuthCard>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ----------------- Bileşenler ----------------- */
function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-[28px] border border-white/20 bg-white/10 p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl">
      {/* Glow kenar — marka gradyanı */}
      <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[30px] bg-[conic-gradient(at_50%_50%,#1b7f3a22,#27ae6022,#f39c1222,#d3540022,#1b7f3a22)] blur-xl" />
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-white/85 text-sm md:text-base">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Field label="E-posta" name="email" type="email" icon={<Mail size={18} />} />
      <Field label="Şifre" name="password" type="password" icon={<Lock size={18} />} />

      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/30 bg-white/10 text-[#27ae60] focus:ring-[#27ae60]/40"
          />
          <span className="text-white/85">Beni hatırla</span>
        </label>
        <Link href="/sifre-sifirla" className="text-[#27ae60] hover:text-white">
          Şifremi unuttum
        </Link>
      </div>

      <button
        type="submit"
        className="cursor-pointer group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-5 py-3 font-semibold text-white shadow-lg transition-all hover:from-[#27ae60] hover:to-[#1b7f3a] hover:shadow-xl"
      >
        Giriş Yap
      </button>
    </form>
  );
}

function RegisterForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Field label="Ad Soyad" name="name" icon={<User size={18} />} />
      <Field label="E-posta" name="email" type="email" icon={<Mail size={18} />} />
      <Field label="Şifre" name="password" type="password" icon={<Lock size={18} />} />
      <Field label="Şifre (Tekrar)" name="confirm" type="password" icon={<Lock size={18} />} />

      <button
        type="submit"
        className="cursor-pointer group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f39c12] to-[#d35400] px-5 py-3 font-semibold text-white shadow-lg transition-all hover:from-[#d35400] hover:to-[#f39c12] hover:shadow-xl"
      >
        Kayıt Ol
      </button>

      <p className="mt-2 text-xs text-white/70">
        Kayıt olarak{" "}
        <Link href="/kvkk" className="underline decoration-[#27ae60] underline-offset-4 hover:text-white">
          KVKK
        </Link>{" "}
        ve{" "}
        <Link href="/kosullar" className="underline decoration-[#27ae60] underline-offset-4 hover:text-white">
          Kullanım Koşulları
        </Link>
        'nı kabul etmiş olursunuz.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-white/90">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-white placeholder-white/60 outline-none backdrop-blur-md transition focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/25"
          placeholder={label}
        />
      </div>
    </div>
  );
}

function SwitchText({
  text,
  action,
  onClick,
}: {
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="mt-4 text-sm text-white/85">
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer font-bold underline decoration-[#27ae60] underline-offset-4 hover:text-white"
      >
        {action}
      </button>
    </p>
  );
}

function InfoPanel({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="relative rounded-[28px] border border-white/20 bg-white/5 p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl">
      {/* Marka ışığı: yeşil→amber karışım */}
      <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[30px] bg-[conic-gradient(at_50%_50%,#1b7f3a26,#27ae6026,#f39c1226,#d3540026,#1b7f3a26)] blur-xl" />

      <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">
        {mode === "login" ? (
          <>
            Ata Tohumu <span className="text-[#27ae60]">İzlenebilir</span> ekosisteme giriş yapın
          </>
        ) : (
          <>
            Seed World'e <span className="text-[#f39c12]">kayıt</span> olun
          </>
        )}
      </h2>

      <p className="mt-3 text-white/85">
        {mode === "login"
          ? "Hesabınızla mağaza, RFQ talepleri ve sipariş geçmişinize erişin."
          : "Üretici ve kurumsal çözümlerimize erişmek, mağazadan alışveriş yapmak ve izlenebilirlik araçlarını denemek için hızlıca hesap oluşturun."}
      </p>

      <ul className="mt-5 grid gap-2 text-sm text-white/85">
        {mode === "login" ? (
          <>
            <li className="flex items-center gap-2">
              <Check /> Sipariş ve RFQ yönetimi
            </li>
            <li className="flex items-center gap-2">
              <Check /> Hızlı ödeme ve adres kaydı
            </li>
            <li className="flex items-center gap-2">
              <Check /> İzlenebilirlik geçmişi
            </li>
          </>
        ) : (
          <>
            <li className="flex items-center gap-2">
              <Check /> Heirloom çeşitlere erişim
            </li>
            <li className="flex items-center gap-2">
              <Check /> Eğitim ve teknik destek
            </li>
            <li className="flex items-center gap-2">
              <Check /> Kurumsal fiyatlandırma seçenekleri
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="h-4 w-4 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
