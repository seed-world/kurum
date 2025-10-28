"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Lock,
  Mail,
  Building2,
  Info,
  CalendarDays,
  Globe2,
  Link as LinkIcon,
  ArrowUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const UPDATED = "29 Ekim 2025";

type SectionDef = { id: string; title: string; icon?: React.ReactNode };

export default function KVKKPage() {
  const sections: SectionDef[] = useMemo(
    () => [
      { id: "purpose", title: "Amaç ve Kapsam", icon: <Info className="h-5 w-5" /> },
      { id: "controller", title: "Veri Sorumlusu Bilgileri", icon: <Building2 className="h-5 w-5" /> },
      { id: "categories", title: "İşlenen Kişisel Veri Kategorileri", icon: <Lock className="h-5 w-5" /> },
      { id: "legal", title: "İşleme Amaçları ve Hukuki Sebepler", icon: <Info className="h-5 w-5" /> },
      { id: "share", title: "Aktarımlar ve Alıcı Grupları", icon: <Globe2 className="h-5 w-5" /> },
      { id: "retention", title: "Saklama Süreleri", icon: <CalendarDays className="h-5 w-5" /> },
      { id: "rights", title: "KVKK Madde 11 Kapsamındaki Haklarınız", icon: <ShieldCheck className="h-5 w-5" /> },
      { id: "apply", title: "Başvuru Yöntemleri", icon: <FileText className="h-5 w-5" /> },
      { id: "cookies", title: "Çerezler (Cookies)", icon: <Info className="h-5 w-5" /> },
      { id: "security", title: "Güvenlik Önlemleri", icon: <Lock className="h-5 w-5" /> },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>(sections[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function copyAnchor(id: string) {
    const url = new URL(window.location.href);
    url.hash = id;
    navigator.clipboard?.writeText(url.toString());
  }

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

      {/* Arka plan animasyonlu dalga */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M0,50 Q25,30 50,50 T100,50"
                fill="none"
                stroke="#27ae60"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
        {/* HERO + TOC */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-10 md:grid-cols-[1fr_420px] md:items-start"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
            >
              Kişisel Verilerin Korunması
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="block mt-3 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent bg-[length:200%] animate-gradient"
              >
                Aydınlatma Metni
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed"
            >
              Bu metin, 6698 sayılı KVK Kanunu uyarınca kişisel verilerin işlenmesine ilişkin
              usul ve esaslar hakkında <b>GG SeedWorld</b> ekosistemi kullanıcılarını bilgilendirmek için hazırlanmıştır.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 flex items-center gap-3 text-sm text-gray-600"
            >
              <CalendarDays className="h-5 w-5 text-[#27ae60]" />
              <span>Son güncelleme:</span>
              <span className="font-bold text-gray-900">{UPDATED}</span>
            </motion.div>
          </div>

          {/* Hızlı Erişim */}
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="md:sticky md:top-8"
          >
            <div className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-md p-7 shadow-xl ring-1 ring-[#27ae60]/10">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#f39c12]" />
                Hızlı Erişim
              </h3>
              <ul className="mt-5 space-y-2">
                {sections.map((s, idx) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + idx * 0.05 }}
                  >
                    <a
                      href={`#${s.id}`}
                      className={`group flex items-center gap-3 rounded-2xl p-3 transition-all duration-300 ${
                        activeId === s.id
                          ? "bg-gradient-to-r from-[#27ae60]/10 to-[#f39c12]/10 border-2 border-[#27ae60]/30 shadow-md"
                          : "bg-white border-2 border-transparent hover:border-[#27ae60]/20 hover:shadow-sm"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${activeId === s.id ? "bg-[#27ae60] text-white" : "bg-gray-100 text-[#27ae60]"} transition-colors`}>
                        {s.icon}
                      </div>
                      <span className={`font-medium ${activeId === s.id ? "text-[#1b7f3a]" : "text-gray-800"}`}>
                        {s.title}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <a
                  href="/documents/kvkk.pdf"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-5 py-3 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <FileText className="h-5 w-5" /> PDF İndir
                </a>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#27ae60] bg-white px-5 py-3 text-[#1b7f3a] font-bold hover:bg-[#27ae60]/5 hover:scale-105 transition-all"
                >
                  <Mail className="h-5 w-5" /> Soru Sor
                </Link>
              </motion.div>
            </div>
          </motion.aside>
        </motion.section>

        {/* CONTENT */}
        <section className="mt-16 space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Glass
                id={section.id}
                title={section.title}
                icon={section.icon}
                onCopyLink={copyAnchor}
                isActive={activeId === section.id}
              >
                {getSectionContent(section.id)}
              </Glass>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Yukarı Çık */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] p-4 text-white shadow-2xl hover:shadow-[#27ae60]/50 transition-all"
            aria-label="Sayfa başına dön"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- İçerik Fonksiyonu ----------------- */
function getSectionContent(id: string) {
  switch (id) {
    case "purpose":
      return (
        <p className="text-gray-700 leading-relaxed">
          GG SeedWorld (“Platform”) ve <b>Global Nexus Sağlık Kozmetik Gıda ve Ticaret A.Ş.</b> (“Şirket”)
          kapsamında elde edilen kişisel veriler; KVKK, ikincil mevzuat ve Kurul kararları
          doğrultusunda işlenir. Bu metin, veri işleme faaliyetlerimizin <b>kapsamını, amaçlarını ve haklarınızı</b> açıklar.
        </p>
      );

    case "controller":
      return (
        <ul className="grid gap-3 md:grid-cols-2 text-gray-700">
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>Unvan:</b> Global Nexus Sağlık Kozmetik Gıda ve Ticaret A.Ş.</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>MERSİS:</b> 0396168976800001</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>Vergi Dairesi / No:</b> Avcılar / 3961689768</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>Adres:</b> Üniversite Mah. Civan Sk. Allure Tower İstanbul Sitesi A Blok No:1 İç Kapı No:271 Avcılar / İstanbul</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>Telefon:</b> 0216 755 88 50</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>Web:</b> www.ggseedworld.com</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-[#27ae60] mt-0.5 flex-shrink-0" /><span><b>E-posta:</b> <a className="underline text-[#1b7f3a] font-bold" href="mailto:info@ggseedworld.com">info@ggseedworld.com</a></span></li>
        </ul>
      );

    case "categories":
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Kimlik", items: ["ad-soyad", "TCKN/Vergi No (B2B)", "unvan"] },
            { title: "İletişim", items: ["e-posta", "telefon", "adres"] },
            { title: "İşlem", items: ["üyelik/sipariş", "ödeme", "teslimat kayıtları"] },
            { title: "Müşteri İşlem", items: ["talep/şikâyet", "destek yazışmaları"] },
            { title: "Pazarlama", items: ["tercih", "kampanya etkileşimi", "çerez verileri"] },
            { title: "Görsel/İşitsel", items: ["çağrı/etkinlik görselleri (varsa)"] },
          ].map((cat) => (
            <div key={cat.title} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4">
              <h4 className="font-bold text-[#1b7f3a]">{cat.title}</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#27ae60]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "legal":
      return (
        <>
          <p className="text-gray-700 mb-4">
            Kişisel verileriniz aşağıdaki amaçlarla ve <b>KVKK m.5/2 veya m.6</b> hükümlerine dayanarak işlenir:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Sözleşmenin ifası / öncesi adımlar", items: ["Üyelik, sipariş, teslimat ve iade süreçleri", "Tedarik, lojistik ve müşteri destek operasyonları"] },
              { title: "Hukuki yükümlülük", items: ["Finans/vergisel kayıtların tutulması", "Yetkili kurum taleplerine yanıt"] },
              { title: "Meşru menfaat", items: ["Dolandırıcılık/abuse önleme, güvenlik", "İş/iç denetim, raporlama ve geliştirme"] },
              { title: "Açık rıza (gerekli haller)", items: ["Elektronik ticari ileti izinleri", "Pazarlama amaçlı profil oluşturma/çerezler"] },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-extrabold text-[#1b7f3a] text-lg">{card.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#27ae60] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </>
      );

    case "share":
      return (
        <>
          <p className="text-gray-700">
            Verileriniz, KVKK m.8–9 uyarınca; amaçla sınırlı, ölçülü ve gerekli güvenlik tedbirleri alınarak aşağıdaki alıcı gruplarıyla paylaşılabilir:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-3">
            <li>Yetkili kamu kurum ve kuruluşları</li>
            <li>Lojistik, kargo, depolama ve çağrı merkezi hizmet sağlayıcıları</li>
            <li>Ödeme kuruluşları, bankalar, mali müşavirlik/denetim</li>
            <li>BT, bulut, siber güvenlik ve danışmanlık tedarikçileri</li>
            <li>Pazarlama/iletişim hizmet sağlayıcılar (açık rıza varsa)</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Yurt dışına aktarım gereken hallerde KVKK m.9/2 şartları ve Kurul kararlarına uyulur.
          </p>
        </>
      );

    case "retention":
      return (
        <>
          <p className="text-gray-700">
            Veriler, ilgili mevzuatta öngörülen süreler ve şirket içi saklama-imha politikaları doğrultusunda muhafaza edilir.
            Süre sona erdiğinde veriler; <b>silme, yok etme veya anonim hale getirme</b> yöntemleriyle işlenemez hale getirilir.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-3 text-sm">
            <li>Finans/defter kayıtları: Vergi Usul Kanunu ve TTK süreleri</li>
            <li>Sözleşme/işlem kayıtları: Zamanaşımı süreleri boyunca</li>
            <li>Pazarlama iletileri: Rıza geri alınıncaya kadar veya azami saklama</li>
          </ul>
        </>
      );

    case "rights":
      return (
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>İşlenip işlenmediğini ve işlendi ise buna ilişkin bilgileri öğrenme</li>
          <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde/dışında aktarılan üçüncü kişileri bilme</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
          <li>KVKK’ya aykırı işlenmişse silinmesini/yok edilmesini isteme</li>
          <li>Otomatik sistemlerle analiz sonucu aleyhe sonuca itiraz</li>
          <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep</li>
        </ul>
      );

    case "apply":
      return (
        <>
          <p className="text-gray-700">KVKK kapsamındaki taleplerinizi aşağıdaki yöntemlerle iletebilirsiniz:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
            <li>
              E-posta:{" "}
              <a className="underline text-[#1b7f3a] font-semibold" href="mailto:info@ggseedworld.com">
                info@ggseedworld.com
              </a>
            </li>
            <li>Posta: Üniversite Mah. Civan Sk. Allure Tower İstanbul Sitesi A Blok No:1 İç Kapı No:271 Avcılar / İstanbul</li>
            <li>
              Web:{" "}
              <Link className="underline text-[#1b7f3a] font-semibold" href="/iletisim">
                İletişim Formu
              </Link>
            </li>
          </ul>
          <p className="text-gray-500 text-sm mt-2">
            Başvurular, niteliğine göre en geç 30 gün içinde sonuçlandırılır. Ücret talep edilmesi halinde KVK Kurulu tarifesi uygulanır.
          </p>
        </>
      );

    case "cookies":
      return (
        <p className="text-gray-700">
          Sitemizde <b>zorunlu çerezler</b> (oturum/performance) ve açık rızanıza bağlı <b>analitik/pazarlama çerezleri</b> kullanılabilir.
          Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilir, rızayı verebilir veya geri alabilirsiniz.
          Detaylar için{" "}
          <Link className="underline text-[#1b7f3a] font-semibold" href="/cerez-politikasi">
            Çerez Politikası
          </Link>{" "}
          sayfasını ziyaret edin.
        </p>
      );

    case "security":
      return (
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>İdari: Erişim yetki matrisi, gizlilik sözleşmeleri, eğitim</li>
          <li>Teknik: Şifreleme, TLS, güvenlik duvarı, loglama, yedekleme</li>
          <li>Periyodik: Zafiyet taraması, denetimler, veri minimizasyonu</li>
        </ul>
      );

    default:
      return <p className="text-gray-700">İçerik yükleniyor...</p>;
  }
}

/* ----------------- Glass Card ----------------- */
function Glass({
  id,
  title,
  icon,
  children,
  onCopyLink,
  isActive,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onCopyLink?: (id: string) => void;
  isActive?: boolean;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`rounded-3xl border-2 p-7 md:p-8 shadow-xl transition-all duration-500 scroll-mt-32 ${
        isActive
          ? "border-[#27ae60]/40 bg-gradient-to-br from-white via-[#f8fdf9] to-white ring-2 ring-[#27ae60]/20"
          : "border-gray-200 bg-white/90 backdrop-blur-sm"
      }`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className={`p-2 rounded-xl ${isActive ? "bg-[#27ae60] text-white" : "bg-gray-100 text-[#27ae60]"}`}
          >
            {icon}
          </motion.div>
          <h2 id={id ? `${id}-title` : undefined} className="text-xl md:text-2xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
  
      </div>
      <div className="mt-5 leading-relaxed text-gray-700 text-base md:text-lg">
        {children}
      </div>
    </motion.section>
  );
}
