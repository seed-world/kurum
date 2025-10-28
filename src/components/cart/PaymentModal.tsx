"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  X,
  Building2,
  User2,
  Users2,
  Check,
  CreditCard,
  Landmark,
} from "lucide-react";
import type { ReactNode } from "react";

export type PaymentModalItem = {
  title: string;
  imageUrl?: string | null;
  qty: number;
  price: number;
};

export type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  items: PaymentModalItem[];
  total: number;
};

type MusteriTipi = "kurumsal" | "bireysel" | "katilimci";
type OdemeYontemi = "kredi-karti" | "havale";

function fmtPrice(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const f = Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${f} ₺`;
}

export default function PaymentModal({
  open,
  onClose,
  items,
  total,
}: PaymentModalProps) {
  const [selectedMusteri, setSelectedMusteri] =
    useState<MusteriTipi | null>(null);
  const [selectedYontem, setSelectedYontem] =
    useState<OdemeYontemi | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedMusteri(null);
      setSelectedYontem(null);
    }
  }, [open]);

  if (!open) return null;

  const first = items[0];
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.backdrop === "1") onClose();
  };

  // 🔢 Dinamik fiyatlar
  const baseTotal = Number(total) || 0;
  const kurumsalFinal = Math.max(0, baseTotal * 0.85);   // %15 indirim
  const katilimciFinal = Math.max(0, baseTotal * 0.75);  // %25 indirim

  const bothSelected = !!(selectedMusteri && selectedYontem);
  const hrefWhenReady = bothSelected
    ? `/odeme?musteriTipi=${selectedMusteri}&yontem=${selectedYontem}`
    : "#";

  return (
    <div className="fixed inset-0 z-[70] pointer-events-auto">
      {/* Backdrop */}
      <div
        data-backdrop="1"
        onClick={onBackdropClick}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Panel */}
      <div className="absolute left-1/2 top-1/2 w-[150vw] max-w-[450px] max-h-[95vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-2xl border border-gray-200/50 bg-white/95 backdrop-blur-md ring-1 ring-[#27ae60]/10 scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-2 border-b border-gray-100/50 bg-gradient-to-b from-white to-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Ödeme Seçenekleri</h3>
          <button onClick={onClose} aria-label="Kapat" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Müşteri tipi */}
        <div className="px-6 pt-4">
          <div className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-3">Müşteri Tipi Seçin</div>

          <OptionCard
            active={selectedMusteri === "kurumsal"}
            onClick={() => setSelectedMusteri("kurumsal")}
            icon={<Building2 className="text-[#27ae60]" size={24} />}
            title="Kurumsal"
            desc="Toplu alım ve özel fiyatlar"
            right={
              <Badge tone="emerald">
                %15 İndirim <span className="opacity-70 ml-1">→ {fmtPrice(kurumsalFinal)}</span>
              </Badge>
            }
          />

          <OptionCard
            active={selectedMusteri === "bireysel"}
            onClick={() => setSelectedMusteri("bireysel")}
            icon={<User2 className="text-[#27ae60]" size={24} />}
            title="Bireysel"
            desc="Kişisel bahçe ve hobi"
            right={<Badge tone="slate">Standart Fiyat</Badge>}
          />

          <OptionCard
            active={selectedMusteri === "katilimci"}
            onClick={() => setSelectedMusteri("katilimci")}
            icon={<Users2 className="text-[#27ae60]" size={24} />}
            title="Katılımcı"
            desc="İş modeline katılım"
            right={
              <Badge tone="amber">
                %25 İndirim <span className="opacity-70 ml-1">→ {fmtPrice(katilimciFinal)}</span>
              </Badge>
            }
          />
        </div>

        {/* Ödeme yöntemi */}
        <div className="px-6 pt-5 pb-3">
          <div className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-3">Ödeme Yöntemi Seçin</div>

          <OptionCard
            active={selectedYontem === "kredi-karti"}
            onClick={() => setSelectedYontem("kredi-karti")}
            icon={<CreditCard className="text-[#27ae60]" size={24} />}
            title="Kredi Kartı"
            desc="Visa, Mastercard, American Express"
            right={<Badge tone="slate">Güvenli</Badge>}
          />

          <OptionCard
            active={selectedYontem === "havale"}
            onClick={() => setSelectedYontem("havale")}
            icon={<Landmark className="text-[#27ae60]" size={24} />}
            title="Banka Havalesi"
            desc="EFT/Havale ile ödeme"
            right={<Badge tone="emerald">Komisyonsuz</Badge>}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 px-6 pb-6 pt-3 bg-gradient-to-t from-white to-transparent">
          {bothSelected ? (
            <Link
              href={hrefWhenReady}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#27ae60] to-[#1b7f3a] hover:from-[#1b7f3a] hover:to-[#27ae60] text-white font-semibold py-4 transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              Devam Et
          
            </Link>
          ) : (
            <button
              disabled
              className="w-full rounded-2xl bg-gray-200 text-gray-500 font-semibold py-4 cursor-not-allowed"
              title="Önce müşteri tipini ve ödeme yöntemini seçin"
            >
              Müşteri Tipi ve Ödeme Yöntemi Seçin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* yardımcı bileşenler */
type BadgeTone = "emerald" | "amber" | "slate";

function Badge({ children, tone = "emerald" }: { children: ReactNode; tone?: BadgeTone }) {
  const map: Record<BadgeTone, string> = {
    emerald: "bg-[#27ae60]/10 text-[#27ae60] border-[#27ae60]/20",
    amber: "bg-[#f39c12]/10 text-[#f39c12] border-[#f39c12]/20",
    slate: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`text-xs px-3 py-1.5 rounded-full border ${map[tone]}`}>{children}</span>;
}

function OptionCard({
  active,
  onClick,
  icon,
  title,
  desc,
  right,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  desc: string;
  right?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer w-full text-left mb-1 rounded-2xl border p-3 transition-all ${
        active
          ? "border-[#27ae60] bg-[#27ae60]/5 shadow-[0_0_0_3px_rgba(39,174,96,0.15)]"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-gray-100">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{desc}</div>
        </div>
        {right}
      </div>
    </button>
  );
}