import { Car, CreditCard, Eye, Wrench, type LucideIcon } from "lucide-react";

/** Approximate coordinates per store code — used for distance display only. */
export const STORE_COORDS: Record<string, { lat: number; lng: number }> = {
  TAYHO: { lat: 21.043, lng: 105.833 },
  LONGBIEN: { lat: 21.0421, lng: 105.8746 },
};

export const BOOKING_SERVICES = [
  "Đo mắt cận/loạn",
  "Tư vấn & Thử gọng",
  "Cắt tròng lấy liền",
  "Bảo hành / Vệ sinh kính",
];

export const AMENITIES: { icon: LucideIcon; label: string; note: string }[] = [
  { icon: Car, label: "Bãi đỗ ô tô miễn phí", note: "Ngay trước cửa hàng" },
  { icon: Eye, label: "Phòng đo khúc xạ chuyên sâu", note: "Quy trình 14 bước" },
  { icon: CreditCard, label: "Thanh toán QR / Thẻ / Trả góp", note: "0% qua thẻ tín dụng" },
  { icon: Wrench, label: "Vệ sinh & nắn chỉnh trọn đời", note: "Miễn phí mọi lần ghé" },
];

export const HOTLINE = "0901234567";
export const ZALO_URL = "https://zalo.me/0901234567";
export const MESSENGER_URL = "https://m.me/vineyewear";

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Reads "08:00 - 21:00 ..." and tells whether the store is open right now. */
export function openStatus(openHours: string | null | undefined) {
  const match = /(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/.exec(openHours ?? "");
  if (!match) return { isOpen: true, range: openHours ?? "" };
  const [, oh, om, ch, cm] = match;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = Number(oh) * 60 + Number(om);
  const close = Number(ch) * 60 + Number(cm);
  return {
    isOpen: minutes >= open && minutes < close,
    range: `${oh?.padStart(2, "0")}:${om} - ${ch?.padStart(2, "0")}:${cm}`,
  };
}

export function mapsEmbedUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
}

export function mapsDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
