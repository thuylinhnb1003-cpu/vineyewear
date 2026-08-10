export function formatVnd(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Liên hệ";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "Liên hệ";
  return `${n.toLocaleString("vi-VN")}đ`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const SERVICE_TYPES = [
  "Đo mắt / khúc xạ",
  "Tư vấn chọn gọng",
  "Lấy kính đã đặt",
  "Bảo hành - vệ sinh kính",
];
