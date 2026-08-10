import titanium from "@/assets/ar/frame-titanium.png";
import acetate from "@/assets/ar/frame-acetate.png";
import aviator from "@/assets/ar/frame-aviator.png";
import cateye from "@/assets/ar/frame-cateye.png";

export type ArColor = { id: string; label: string; filter: string; swatch: string };

export const AR_COLORS: ArColor[] = [
  { id: "origin", label: "Nguyên bản", filter: "none", swatch: "#8b8b8b" },
  { id: "black", label: "Đen nhám", filter: "grayscale(1) brightness(0.5)", swatch: "#1a1214" },
  { id: "gold", label: "Vàng gold", filter: "sepia(1) saturate(2.4) hue-rotate(-12deg)", swatch: "#c9962f" },
  { id: "crimson", label: "Đỏ đô", filter: "sepia(1) saturate(4) hue-rotate(-32deg) brightness(0.85)", swatch: "#801a20" },
  { id: "blue", label: "Xanh navy", filter: "sepia(1) saturate(3) hue-rotate(165deg)", swatch: "#22355c" },
];

export type ArFrame = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  material: string;
  size: string;
  price: number;
  compareAt: number;
  shape: string;
  image: string;
};

export const AR_FRAMES: ArFrame[] = [
  {
    id: "ar-titanium",
    slug: "gong-kinh-titan-vin-t01",
    name: "Gọng Titanium VE-T210",
    brand: "Vin Eyewear",
    material: "Titanium",
    size: "52-18-140",
    price: 2890000,
    compareAt: 3500000,
    shape: "Square",
    image: titanium,
  },
  {
    id: "ar-acetate",
    slug: "gong-kinh-acetate-vin-a02",
    name: "Gọng Acetate VE-A305",
    brand: "Vin Eyewear",
    material: "Acetate",
    size: "50-20-145",
    price: 1690000,
    compareAt: 1990000,
    shape: "Round",
    image: acetate,
  },
  {
    id: "ar-rayban",
    slug: "kinh-mat-polarized-vin-s03",
    name: "Ray-Ban Aviator RB3025",
    brand: "Ray-Ban",
    material: "Kim loại",
    size: "58-14-135",
    price: 4590000,
    compareAt: 5390000,
    shape: "Aviator",
    image: aviator,
  },
  {
    id: "ar-bolon",
    slug: "kinh-mat-mat-meo-vin-s04",
    name: "Bolon Cat-eye BL5062",
    brand: "Bolon",
    material: "Acetate",
    size: "54-17-142",
    price: 2390000,
    compareAt: 2890000,
    shape: "Cat-eye",
    image: cateye,
  },
];
