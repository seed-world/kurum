export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

export function absImage(p?: string | null) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  // Görselleri origin ile birleştir (kökten servis ediliyor)
  return `${API_ORIGIN}${p.startsWith("/") ? p : `/${p}`}`;
}
