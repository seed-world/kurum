import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" border-t border-black/5 bg-gradient-to-br from-[#0a1208] via-[#0f1a12] to-[#0a1208] text-white">
      <div className="h-1 w-full" style={{background:"linear-gradient(90deg,#1b7f3a 0%,#27ae60 35%,#f39c12 70%,#d35400 100%)"}}/>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block group" aria-label="Seed World">
              <Image src="/logo/logo_color.svg" alt="Seed World" width={70} height={70}
                className="rounded-xl object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Heirloom çeşitler, izlenebilir tedarik zinciri ve sürdürülebilir tarım ekosistemi.
            </p>
            <div className="mt-6 space-y-3">
              <a href="https://ggseedworld.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm text-white/70 hover:text-green-400 transition-colors group">
                <Globe size={16} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span>ggseedworld.com</span>
              </a>
              <a href="tel:+902167558850"
                 className="flex items-center gap-2 text-sm text-white/70 hover:text-green-400 transition-colors group">
                <Phone size={16} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span>0216 755 88 50</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin size={16} className="text-green-500" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Projeler */}
          <div>
            <h5 className="text-sm font-bold tracking-wider text-white uppercase mb-5 relative inline-block">
              Projeler
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-amber-500" />
            </h5>
            <ul className="space-y-3">
              <li><Link href="/seed" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                SEED – Organik Tarım Süreci
              </Link></li>
              <li><Link href="/agro" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                AGRO – Küresel Ticaret Süreci
              </Link></li>
            </ul>
          </div>

          {/* Satış Kanalları */}
          <div>
            <h5 className="text-sm font-bold tracking-wider text-white uppercase mb-5 relative inline-block">
              Satış Kanalları
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-amber-500" />
            </h5>
            <ul className="space-y-3">
              <li><Link href="/gg-market-kwi" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                GG Market – KWI (Kuveyt)
              </Link></li>
              <li><Link href="/lezzet-kapinda" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                Lezzet Kapında
              </Link></li>
              <li><Link href="/magaza" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                Online Mağaza
              </Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h5 className="text-sm font-bold tracking-wider text-white uppercase mb-5 relative inline-block">
              Kurumsal
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-amber-500" />
            </h5>
            <ul className="space-y-3">
              <li><Link href="/hakkimizda" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                Hakkımızda
              </Link></li>
              <li><Link href="/kvkk" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                KVKK & Gizlilik
              </Link></li>
              <li><Link href="/iletisim" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                İletişim
              </Link></li>
              <li><Link href="/cerez-politikasi" className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-amber-500 transition-colors" />
                Çerez Politikası
              </Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-white/50">
              © {new Date().getFullYear()} <span className="text-white/70 font-medium">Seed World</span>. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/kullanim-kosullari" className="text-white/50 hover:text-green-400 transition-colors">Kullanım Koşulları</Link>
              <span className="text-white/20">•</span>
              <Link href="/gizlilik" className="text-white/50 hover:text-green-400 transition-colors">Gizlilik Politikası</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
