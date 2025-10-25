
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
  ChevronDown,
  CalendarDays,
  Globe2,
  Link as LinkIcon,
  ArrowUp,
} from "lucide-react";

/**
 * KVKK — Aydınlatma Metni (TR)
 * Not: Bu metin örnek/şablondur. Gerçek uygulama için hukuk danışmanınızla gözden geçirin.
 */

const UPDATED = "25 Ekim 2025"; // gerektiğinde güncelleyin

type SectionDef = { id: string; title: string; icon?: React.ReactNode };

export default function KVKKPage() {
  const [open, setOpen] = useState<number | null>(null);

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

  // Aktif bölüm vurgusu (TOC için)
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

  // "Yukarı" butonu görünürlüğü
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
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
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Üst gradient şerit (tüm sayfalarla uyumlu) */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)",
        }}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* HERO + TOC */}
        <section className="grid gap-8 md:grid-cols-[1fr_420px] md:items-start">
          {/* Başlık */}
          <div>
          
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Kişisel Verilerin Korunması
              <span className="block mt-2 bg-gradient-to-r from-[#1b7f3a] via-[#27ae60] to-[#f39c12] bg-clip-text text-transparent">
                Aydınlatma Metni
              </span>
            </h1>

            <p className="mt-4 text-lg text-gray-700 max-w-2xl">
              Bu metin, 6698 sayılı KVK Kanunu uyarınca kişisel verilerin işlenmesine
              ilişkin usul ve esaslar hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600" aria-live="polite">
              <CalendarDays className="h-4 w-4 text-[#27ae60]" />
              Son güncelleme: <span className="font-semibold text-gray-900">{UPDATED}</span>
            </div>
          </div>

          {/* Yapışkan Hızlı Erişim */}
          <aside className="md:sticky md:top-6">
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900">Hızlı Erişim</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`group flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        activeId === s.id ? "ring-2 ring-emerald-300/60 border-transparent" : ""
                      }`}
                    >
                      {s.icon ?? <Info className="h-4 w-4 text-[#27ae60]" />}
                      <span className="truncate">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a
                  href="/documents/kvkk.pdf"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b7f3a] to-[#27ae60] px-4 py-2 text-white font-semibold shadow-md hover:shadow-lg"
                  target="_blank"
                  rel="noopener"
                >
                  <FileText className="h-4 w-4" /> PDF İndir
                </a>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#27ae60] bg-white/80 px-4 py-2 text-[#1b7f3a] font-semibold hover:bg-[#27ae60]/5"
                >
                  <Mail className="h-4 w-4" /> Sorunuz mu var?
                </Link>
              </div>
            </div>
          </aside>
        </section>

        {/* CONTENT */}
        <section className="mt-10 space-y-6">
          <Glass id="purpose" title="Amaç ve Kapsam" onCopyLink={copyAnchor}>
            GG SEED WORLD (“Şirket”), web sitemiz, mağaza ve iş süreçlerimiz kapsamında elde edilen
            kişisel verileri; KVKK, ikincil mevzuat ve Kurul kararları çerçevesinde işlemektedir.
            Bu metin, veri işleme faaliyetlerimizin kapsamını, amaçlarını ve haklarınızı açıklar.
          </Glass>

          <Glass
            id="controller"
            title="Veri Sorumlusu Bilgileri"
            icon={<Building2 className="h-5 w-5 text-[#1b7f3a]" />}
            onCopyLink={copyAnchor}
          >
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Unvan: GG SEED WORLD (örnek)</li>
              <li>Adres: İstanbul, Türkiye</li>
              <li>
                E-posta:{" "}
                <a className="underline text-[#1b7f3a] font-semibold" href="mailto:info@ggseedworld.com">
                  info@ggseedworld.com
                </a>
              </li>
              <li>Telefon: 0216 755 88 50</li>
            </ul>
          </Glass>

          <Glass
            id="categories"
            title="İşlenen Kişisel Veri Kategorileri"
            icon={<Lock className="h-5 w-5 text-[#27ae60]" />}
            onCopyLink={copyAnchor}
          >
            <ul className="grid gap-2 md:grid-cols-2 text-gray-700">
              <li>
                <b>Kimlik:</b> ad-soyad, TCKN/Vergi No (B2B), unvan
              </li>
              <li>
                <b>İletişim:</b> e-posta, telefon, adres
              </li>
              <li>
                <b>İşlem:</b> sipariş/ödeme/teslimat kayıtları
              </li>
              <li>
                <b>Müşteri İşlem:</b> talep/şikayet, destek yazışmaları
              </li>
              <li>
                <b>Pazarlama:</b> tercih, çerez verileri (aşağıda)
              </li>
              <li>
                <b>Görsel/İşitsel:</b> çağrı/etkinlik görselleri (varsa)
              </li>
            </ul>
          </Glass>

          <Glass
            id="legal"
            title="İşleme Amaçları ve Hukuki Sebepler"
            icon={<Info className="h-5 w-5 text-[#27ae60]" />}
            onCopyLink={copyAnchor}
          >
            <p className="text-gray-700">
              Kişisel verileriniz aşağıdaki amaçlarla ve KVKK m.5/2 veya m.6 hükümlerine dayanarak işlenmektedir:
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Card>
                <h4 className="font-semibold text-gray-900">Sözleşmenin ifası / öncesi adımlar</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>Üyelik, mağaza sipariş ve teslimat süreçleri</li>
                  <li>RFQ teklifi, tedarik & lojistik yönetimi</li>
                </ul>
              </Card>
              <Card>
                <h4 className="font-semibold text-gray-900">Hukuki yükümlülük</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>Finans/vergisel kayıtların tutulması</li>
                  <li>Yetkili kurum taleplerine yanıt</li>
                </ul>
              </Card>
              <Card>
                <h4 className="font-semibold text-gray-900">Meşru menfaat</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>Dolandırıcılık/abuse önleme, güvenlik</li>
                  <li>İş/iç denetim ve raporlama</li>
                </ul>
              </Card>
              <Card>
                <h4 className="font-semibold text-gray-900">Açık rıza (gerekli haller)</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>Elektronik ticari ileti izinleri</li>
                  <li>Pazarlama amaçlı profil çıkarma/çerezler</li>
                </ul>
              </Card>
            </div>
          </Glass>

          <Glass
            id="share"
            title="Aktarımlar ve Alıcı Grupları"
            icon={<Globe2 className="h-5 w-5 text-[#f39c12]" />}
            onCopyLink={copyAnchor}
          >
            <p className="text-gray-700">
              Verileriniz, aşağıdaki alıcı gruplarıyla; KVKK m.8-9 hükümleri uyarınca, amaçla sınırlı ve gerekli güvenlik
              önlemleri alınarak paylaşılabilir:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
              <li>Yetkili kamu kurum ve kuruluşları</li>
              <li>Lojistik, kargo ve depolama hizmet sağlayıcılar</li>
              <li>Ödeme kuruluşları, bankalar, mali müşavirlik</li>
              <li>BT/altyapı, bulut, güvenlik ve danışmanlık tedarikçileri</li>
              <li>Pazarlama/iletişim hizmet sağlayıcılar (açık rıza varsa)</li>
            </ul>
            <p className="text-gray-500 text-xs mt-2">
              Yurt dışına aktarım gereken durumlarda KVKK m.9/2 ve Kurul kararlarındaki şartlara uyulur.
            </p>
          </Glass>

          <Glass
            id="retention"
            title="Saklama Süreleri"
            icon={<CalendarDays className="h-5 w-5 text-[#27ae60]" />}
            onCopyLink={copyAnchor}
          >
            <p className="text-gray-700">
              Veriler, ilgili mevzuatta öngörülen süreler ve şirket politika/prosedürleri doğrultusunda saklanır.
              Süre sona erdiğinde silme, yok etme veya anonim hale getirme yöntemleri uygulanır.
            </p>
          </Glass>

          <Glass
            id="rights"
            title="KVKK Madde 11 Kapsamındaki Haklarınız"
            icon={<ShieldCheck className="h-5 w-5 text-[#1b7f3a]" />}
            onCopyLink={copyAnchor}
          >
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>İşlenip işlenmediğini öğrenme, bilgi talep etme</li>
              <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde/dışında aktarılan üçüncü kişileri bilme</li>
              <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
              <li>KVKK’ya aykırı işlenmişse silinmesini/yok edilmesini isteme</li>
              <li>Otomatik sistemlerle analiz sonucu aleyhe sonuca itiraz</li>
              <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep</li>
            </ul>
          </Glass>

          <Glass
            id="apply"
            title="Başvuru Yöntemleri"
            icon={<FileText className="h-5 w-5 text-[#f39c12]" />}
            onCopyLink={copyAnchor}
          >
            <p className="text-gray-700">KVKK kapsamındaki taleplerinizi aşağıdaki yöntemlerle iletebilirsiniz:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
              <li>
                E-posta:{" "}
                <a className="underline text-[#1b7f3a] font-semibold" href="mailto:info@ggseedworld.com">
                  info@ggseedworld.com
                </a>
              </li>
              <li>Posta: İstanbul, Türkiye (Islak imzalı başvuru)</li>
              <li>
                Web:{" "}
                <Link className="underline text-[#1b7f3a] font-semibold" href="/iletisim">
                  İletişim Formu
                </Link>
              </li>
            </ul>
            <p className="text-gray-500 text-sm mt-2">
              Başvurular, niteliğine göre en geç 30 gün içinde sonuçlandırılır. Ücret talep edilmesi halinde, KVK
              Kurulu’nca belirlenen tarifeye uyulur.
            </p>
          </Glass>

          <Glass
            id="cookies"
            title="Çerezler (Cookies)"
            icon={<Info className="h-5 w-5 text-[#f39c12]" />}
            onCopyLink={copyAnchor}
          >
            <p className="text-gray-700">
              Sitemizde zorunlu çerezler (oturum/sayfa performansı) ve açık rızanıza bağlı pazarlama/analitik çerezler
              kullanılabilir. Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilir, rıza verebilir veya geri
              alabilirsiniz. Detaylı politika için{" "}
              <Link className="underline text-[#1b7f3a] font-semibold" href="/cerez-politikasi">
                Çerez Politikası
              </Link>{" "}
              sayfasını ziyaret edin.
            </p>
          </Glass>

          <Glass
            id="security"
            title="Güvenlik Önlemleri"
            icon={<Lock className="h-5 w-5 text-[#27ae60]" />}
            onCopyLink={copyAnchor}
          >
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>İdari: Erişim yetki matrisi, gizlilik sözleşmeleri, eğitim</li>
              <li>Teknik: Şifreleme, TLS, güvenlik duvarı, loglama, yedekleme</li>
              <li>Periyodik: Zafiyet taraması, denetimler, veri minimizasyonu</li>
            </ul>
          </Glass>
        </section>

 
      </main>

      {/* Yukarı Çık Butonu */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-lg hover:bg-gray-50"
            aria-label="Sayfa başına dön"
          >
            <ArrowUp className="h-4 w-4 text-[#27ae60]" /> Yukarı
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- Bileşenler ----------------- */
function Glass({
  id,
  title,
  icon,
  children,
  onCopyLink,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onCopyLink?: (id: string) => void;
}) {
  return (
    <section
      id={id}
      className="rounded-3xl border-2 border-gray-200 bg-white p-6 md:p-7 shadow-lg scroll-mt-24"
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 id={id ? `${id}-title` : undefined} className="text-lg md:text-xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
        {id && (
          <button
            onClick={() => onCopyLink?.(id)}
            className="inline-flex items-center gap-1 rounded-lg border-2 border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
            title="Bölüm bağlantısını kopyala"
            aria-label={`${title} bölümü bağlantısını kopyala`}
          >
            <LinkIcon className="h-3.5 w-3.5 text-[#27ae60]" /> Kopyala
          </button>
        )}
      </div>
      <div className="mt-3 leading-relaxed text-gray-700 text-sm md:text-base">{children}</div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-4">
      {children}
    </div>
  );
}

/* ----------------- SSS ----------------- */
const FAQ = [
  {
    q: "Açık rızamı nasıl geri alırım?",
    a: "İletişim kanallarımızdan bize ulaşarak veya çerez tercihlerinizi değiştirerek dilediğiniz zaman geri alabilirsiniz.",
  },
  {
    q: "Veri aktarımı yurtdışına yapılıyor mu?",
    a: "Bulut hizmetleri veya tedarikçilerimiz yurtdışında ise, KVKK m.9 kapsamındaki şartlar ve Kurul kararlarına uygun şekilde aktarım yapılabilir.",
  },
  {
    q: "Verilerim ne kadar süre saklanır?",
    a: "İlgili mevzuat ve şirket içi saklama/imha politikaları çerçevesinde gerekli süre kadar saklanır; süresi dolan veriler güvenli şekilde silinir veya anonim hale getirilir.",
  },
];
