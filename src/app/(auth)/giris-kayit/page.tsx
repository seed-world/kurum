// File: app/(auth)/auth/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Leaf, Shield, Globe, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const isLogin = mode === "login";

  // Gelişmiş animasyon varyantları
  const panelVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: 60 * direction,
      scale: 0.95,
      filter: "blur(8px)",
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 130, damping: 18 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: -60 * direction,
      scale: 0.95,
      filter: "blur(8px)",
      transition: { duration: 0.22, ease: "easeIn" },
    }),
  } as const;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-neutral-950">
      {/* Üst ince gradient şerit */}
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
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
        src="/videos/auth.mp4"
        poster="/images/auth-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      {/* Koyu overlay + marka yıkama + vignette + doku */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="absolute -inset-x-20 -top-[20%] h-[60%] skew-y-6 opacity-40 blur-3xl bg-gradient-to-r from-[#1b7f3a]/50 via-[#27ae60]/45 to-[#f39c12]/45" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" aria-hidden>
            <pattern id="auth-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>
      </div>

      {/* İçerik */}
      <main className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          {/* Bilgi / Pazarlama paneli */}
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

          {/* Form paneli */}
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-[32px] border border-white/15 bg-white/8 p-8 md:p-10 text-white shadow-2xl backdrop-blur-2xl overflow-hidden"
    >
      {/* Glow kenar — marka gradyanı */}
      <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[34px] bg-[conic-gradient(at_50%_50%,#1b7f3a33,#27ae6033,#f39c1233,#d3540033,#1b7f3a33)] blur-2xl opacity-70" />
      
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-white/80 text-base md:text-lg">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </motion.div>
  );
}

function LoginForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Field label="E-posta" name="email" type="email" icon={<Mail size={20} />} />
      <Field label="Şifre" name="password" type="password" icon={<Lock size={20} />} />

      <div className="flex items-center justify-end text-sm">
 
        <Link href="/sifre-sifirla" className="text-[#27ae60] hover:text-white transition-colors font-medium">
          Şifremi unuttum
        </Link>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="cursor-pointer group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-6 py-4 font-bold text-white shadow-xl transition-all hover:from-[#27ae60] hover:to-[#1b7f3a] hover:shadow-2xl"
      >
        Giriş Yap
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </form>
  );
}

function RegisterForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Field label="Ad Soyad" name="name" icon={<User size={20} />} />
      <Field label="E-posta" name="email" type="email" icon={<Mail size={20} />} />
      <Field label="Şifre" name="password" type="password" icon={<Lock size={20} />} />
      <Field label="Şifre (Tekrar)" name="confirm" type="password" icon={<Lock size={20} />} />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="cursor-pointer group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f39c12] to-[#d35400] px-6 py-4 font-bold text-white shadow-xl transition-all hover:from-[#d35400] hover:to-[#f39c12] hover:shadow-2xl"
      >
        Kayıt Ol
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <p className="mt-3 text-xs text-white/70 leading-relaxed">
        Kayıt olarak{" "}
        <Link href="/kvkk" className="underline decoration-[#27ae60]/50 underline-offset-4 hover:text-white transition-colors">
          KVKK
        </Link>{" "}
        ve{" "}
        <Link href="/kosullar" className="underline decoration-[#27ae60]/50 underline-offset-4 hover:text-white transition-colors">
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
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-white/95">
        {label}
      </label>
      <div className="relative group">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#27ae60] transition-colors">
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          required
          className="w-full rounded-2xl border border-white/20 bg-white/8 px-12 py-4 text-white placeholder-white/50 outline-none backdrop-blur-md transition-all focus:border-[#27ae60] focus:ring-4 focus:ring-[#27ae60]/20 focus:bg-white/12"
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
    <p className="mt-6 text-center text-sm text-white/90">
      {text}{" "}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onClick}
        className="cursor-pointer font-bold text-[#27ae60] underline decoration-2 underline-offset-4 hover:text-white transition-all"
      >
        {action}
      </motion.button>
    </p>
  );
}

function InfoPanel({ mode }: { mode: "login" | "register" }) {
  const features = mode === "login" ? [
    { ico: <Leaf className="w-5 h-5" />, text: "Sipariş ve RFQ yönetimi" },
    { ico: <Shield className="w-5 h-5" />, text: "Hızlı ödeme ve adres kaydı" },
    { ico: <Globe className="w-5 h-5" />, text: "İzlenebilirlik geçmişi" },
  ] : [
    { ico: <Leaf className="w-5 h-5" />, text: "Heirloom çeşitlere erişim" },
    { ico: <Shield className="w-5 h-5" />, text: "Eğitim ve teknik destek" },
    { ico: <Globe className="w-5 h-5" />, text: "Kurumsal fiyatlandırma seçenekleri" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-[32px] border border-white/15 bg-white/8 p-8 md:p-10 text-white shadow-2xl backdrop-blur-2xl"
    >
      {/* Glow kenar */}
      <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[34px] bg-[conic-gradient(at_50%_50%,#1b7f3a30,#27ae6030,#f39c1230,#d3540030,#1b7f3a30)] blur-2xl opacity-70" />
      
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
          {mode === "login" ? (
            <>
              Ata Tohumu <span className="bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] bg-clip-text text-transparent">İzlenebilir</span> ekosisteme giriş yapın
            </>
          ) : (
            <>
              Seed World'e <span className="bg-gradient-to-r from-[#f39c12] to-[#d35400] bg-clip-text text-transparent">kayıt</span> olun
            </>
          )}
        </h2>

        <p className="mt-4 text-white/90 text-base md:text-lg leading-relaxed">
          {mode === "login"
            ? "Hesabınızla mağaza, RFQ talepleri ve sipariş geçmişinize anında erişin."
            : "Üretici ve kurumsal çözümlerimize erişmek, mağazadan alışveriş yapmak ve izlenebilirlik araçlarını denemek için hızlıca hesap oluşturun."}
        </p>

        <ul className="mt-8 space-y-4">
          {features.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="flex items-center gap-3 text-white/90"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${
                mode === "login" ? "from-[#27ae60]/20 to-[#1b7f3a]/20" : "from-[#f39c12]/20 to-[#d35400]/20"
              } backdrop-blur-sm border border-white/10`}>
                {f.ico}
              </div>
              <span className="font-medium">{f.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}