/** Dữ liệu phân loại đa chiều dùng cho mega menu & các widget trang chủ. */

export type MenuLink = { label: string; search: Record<string, string> };

export const FRAME_STYLES: MenuLink[] = [
  { label: "Vuông (Square)", search: { shape: "Square" } },
  { label: "Tròn (Round)", search: { shape: "Round" } },
  { label: "Mắt mèo (Cat-eye)", search: { shape: "Cat-eye" } },
  { label: "Phi công (Aviator)", search: { shape: "Aviator" } },
  { label: "Hình học (Geometric)", search: { shape: "Geometric" } },
  { label: "Oval", search: { shape: "Oval" } },
  { label: "Wayfarer", search: { shape: "Wayfarer" } },
];

export const MATERIALS: MenuLink[] = [
  { label: "Titanium", search: { q: "titanium" } },
  { label: "Acetate", search: { q: "acetate" } },
  { label: "TR90", search: { q: "tr90" } },
  { label: "Thép không gỉ", search: { q: "stainless" } },
  { label: "Ultem", search: { q: "ultem" } },
];

export const LENS_FUNCTIONS: MenuLink[] = [
  { label: "Chống ánh sáng xanh", search: { q: "blue" } },
  { label: "Đổi màu (Photochromic)", search: { q: "photochromic" } },
  { label: "Chiết suất cao 1.56 – 1.74", search: { q: "index" } },
  { label: "Chống chói (Anti-glare)", search: { q: "anti-glare" } },
  { label: "Đa tròng (Progressive)", search: { q: "progressive" } },
];

export const AUDIENCES: MenuLink[] = [
  { label: "Nam", search: { gender: "male" } },
  { label: "Nữ", search: { gender: "female" } },
  { label: "Unisex", search: { gender: "unisex" } },
  { label: "Trẻ em", search: { gender: "kids" } },
];

export const TOP_BRANDS = [
  "Ray-Ban",
  "Essilor",
  "Zeiss",
  "Nikon",
  "Chemi",
  "Oakley",
  "Gucci",
  "Lindberg",
];

/** Gói tròng kính khách có thể cắt kèm khi mua gọng. */
export const LENS_PACKAGES = [
  {
    id: "blue-156",
    name: "Tròng chống ánh sáng xanh 1.56",
    desc: "Phù hợp độ nhẹ, làm việc máy tính nhiều.",
    price: 450000,
  },
  {
    id: "photochromic",
    name: "Tròng đổi màu Photochromic",
    desc: "Tự động sẫm màu ngoài trời, chống UV400.",
    price: 1250000,
  },
  {
    id: "index-167",
    name: "Tròng chiết suất cao 1.67",
    desc: "Mỏng nhẹ cho độ cao trên 4.00.",
    price: 1650000,
  },
  {
    id: "progressive",
    name: "Tròng đa tròng Progressive",
    desc: "Nhìn xa – trung – gần trên một tròng kính.",
    price: 2900000,
  },
];

export const FACE_SHAPES = [
  {
    id: "oval",
    label: "Trái xoan",
    hint: "Cân đối, hợp hầu hết dáng gọng.",
    recommend: ["Wayfarer", "Aviator", "Square"],
  },
  {
    id: "round",
    label: "Tròn",
    hint: "Cần dáng gọng góc cạnh để tạo nét.",
    recommend: ["Square", "Geometric", "Wayfarer"],
  },
  {
    id: "square",
    label: "Vuông",
    hint: "Ưu tiên đường bo mềm mại.",
    recommend: ["Round", "Oval", "Aviator"],
  },
  {
    id: "heart",
    label: "Trái tim",
    hint: "Gọng nhẹ phần trên, mở rộng phần dưới.",
    recommend: ["Aviator", "Oval", "Round"],
  },
  {
    id: "long",
    label: "Dài",
    hint: "Gọng bản to giúp cân tỉ lệ.",
    recommend: ["Wayfarer", "Cat-eye", "Square"],
  },
  {
    id: "diamond",
    label: "Kim cương",
    hint: "Nhấn ở đường viền trên của gọng.",
    recommend: ["Cat-eye", "Oval", "Round"],
  },
];

export const AUTHORITY_STATS = [
  { value: "10+", label: "Năm kinh nghiệm khúc xạ" },
  { value: "100.000+", label: "Khách hàng đã tin chọn" },
  { value: "50+", label: "Thương hiệu toàn cầu" },
  { value: "4.9/5", label: "Điểm đánh giá Google" },
];

export const GOOGLE_REVIEWS = [
  {
    name: "Nguyễn Thu Hà",
    store: "CS1 · 261 Ngọc Lâm",
    rating: 5,
    text: "Kỹ thuật viên đo rất kỹ, giải thích từng chỉ số. Gọng titanium nhẹ, đeo cả ngày không đau tai.",
  },
  {
    name: "Trần Minh Quân",
    store: "CS2 · 46 Hoàng Hoa Thám",
    rating: 5,
    text: "Cắt tròng chống ánh sáng xanh sau 45 phút là xong. Nhân viên nắn chỉnh lại gọng miễn phí.",
  },
  {
    name: "Lê Phương Anh",
    store: "CS1 · 261 Ngọc Lâm",
    rating: 5,
    text: "Được thử hơn 10 mẫu, tư vấn theo dáng mặt rất hợp. Giá tốt hơn hẳn mấy chỗ mình từng mua.",
  },
  {
    name: "Phạm Đức Long",
    store: "CS2 · 46 Hoàng Hoa Thám",
    rating: 4,
    text: "Không gian đẹp, quy trình chuyên nghiệp. Đặt lịch online nhanh, đến là được đo ngay.",
  },
];

export const PARTNER_BRANDS = [
  "Essilor",
  "ZEISS",
  "NIKON",
  "CHEMI",
  "Ray-Ban",
  "HOYA",
  "Oakley",
  "Transitions",
];
