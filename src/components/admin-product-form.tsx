import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/vin-field";

export type ProductRow = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string | null;
  frame_shape: string | null;
  material: string | null;
  color: string | null;
  gender: string | null;
  description: string | null;
  images: unknown;
  specs?: unknown;
  ar_model_url?: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  stock_quantity: number;
  status: string;
  is_featured: boolean;
  is_visible: boolean;
  category_id: string | null;
};

export type ProductFormValues = {
  id?: string;
  slug: string;
  sku: string;
  name: string;
  categoryId: string | null;
  brand: string | null;
  frameShape: string | null;
  material: string | null;
  color: string | null;
  gender: string | null;
  description: string | null;
  imagesText: string;
  spinImagesText: string;
  arModelUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "preorder";
  isFeatured: boolean;
  isVisible: boolean;
};

export const PRODUCT_STATUS = [
  { value: "in_stock", label: "Còn hàng" },
  { value: "low_stock", label: "Sắp hết" },
  { value: "out_of_stock", label: "Hết hàng" },
  { value: "preorder", label: "Đặt trước" },
] as const;

function imagesToText(images: unknown) {
  return Array.isArray(images) ? images.filter((v) => typeof v === "string").join("\n") : "";
}

export function emptyProduct(): ProductFormValues {
  return {
    slug: "",
    sku: "",
    name: "",
    categoryId: null,
    brand: "",
    frameShape: "",
    material: "",
    color: "",
    gender: "",
    description: "",
    imagesText: "",
    spinImagesText: "",
    arModelUrl: "",
    price: 0,
    compareAtPrice: null,
    stockQuantity: 0,
    status: "in_stock",
    isFeatured: false,
    isVisible: true,
  };
}

export function toProductForm(p: ProductRow): ProductFormValues {
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    categoryId: p.category_id,
    brand: p.brand ?? "",
    frameShape: p.frame_shape ?? "",
    material: p.material ?? "",
    color: p.color ?? "",
    gender: p.gender ?? "",
    description: p.description ?? "",
    imagesText: imagesToText(p.images),
    spinImagesText: imagesToText(
      p.specs && typeof p.specs === "object" && !Array.isArray(p.specs)
        ? (p.specs as { spin_images?: unknown }).spin_images
        : null,
    ),
    arModelUrl: p.ar_model_url ?? "",
    price: Number(p.price),
    compareAtPrice: p.compare_at_price === null ? null : Number(p.compare_at_price),
    stockQuantity: p.stock_quantity,
    status: (p.status as ProductFormValues["status"]) ?? "in_stock",
    isFeatured: p.is_featured,
    isVisible: p.is_visible,
  };
}

export function AdminProductForm({
  value,
  categories,
  saving,
  onCancel,
  onSubmit,
}: {
  value: ProductFormValues;
  categories: { id: string; name: string }[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void;
}) {
  const [form, setForm] = React.useState<ProductFormValues>(value);
  React.useEffect(() => setForm(value), [value]);

  function set<K extends keyof ProductFormValues>(key: K, v: ProductFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid gap-4 rounded-lg border border-border bg-background p-5"
    >
      <h3 className="text-base font-bold text-secondary-foreground">
        {form.id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Tên sản phẩm *</Label>
          <Input
            id="p-name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-slug">Slug (đường dẫn) *</Label>
          <Input
            id="p-slug"
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-sku">Mã SKU *</Label>
          <Input
            id="p-sku"
            required
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-cat">Danh mục</Label>
          <Select
            id="p-cat"
            value={form.categoryId ?? ""}
            onChange={(e) => set("categoryId", e.target.value || null)}
          >
            <option value="">— Không chọn —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="p-brand">Thương hiệu</Label>
          <Input
            id="p-brand"
            value={form.brand ?? ""}
            onChange={(e) => set("brand", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-shape">Dáng gọng</Label>
          <Input
            id="p-shape"
            value={form.frameShape ?? ""}
            onChange={(e) => set("frameShape", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-material">Chất liệu</Label>
          <Input
            id="p-material"
            value={form.material ?? ""}
            onChange={(e) => set("material", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-color">Màu sắc</Label>
          <Input
            id="p-color"
            value={form.color ?? ""}
            onChange={(e) => set("color", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="p-gender">Giới tính</Label>
          <Select
            id="p-gender"
            value={form.gender ?? ""}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option value="">— Không chọn —</option>
            <option value="unisex">Unisex</option>
            <option value="men">Nam</option>
            <option value="women">Nữ</option>
            <option value="kids">Trẻ em</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="p-status">Trạng thái</Label>
          <Select
            id="p-status"
            value={form.status}
            onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}
          >
            {PRODUCT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="p-price">Giá bán (đ) *</Label>
          <Input
            id="p-price"
            type="number"
            min={0}
            required
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="p-compare">Giá gốc (đ)</Label>
          <Input
            id="p-compare"
            type="number"
            min={0}
            value={form.compareAtPrice ?? ""}
            onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div>
          <Label htmlFor="p-stock">Tồn kho *</Label>
          <Input
            id="p-stock"
            type="number"
            min={0}
            required
            value={form.stockQuantity}
            onChange={(e) => set("stockQuantity", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="p-images">Ảnh (mỗi dòng một đường dẫn)</Label>
        <Textarea
          id="p-images"
          value={form.imagesText}
          onChange={(e) => set("imagesText", e.target.value)}
          placeholder="/assets/glasses-1.jpg"
        />
      </div>

      <div>
        <Label htmlFor="p-spin">
          Bộ ảnh xoay 360° (mỗi dòng một đường dẫn, chụp trên bàn xoay)
        </Label>
        <Textarea
          id="p-spin"
          value={form.spinImagesText}
          onChange={(e) => set("spinImagesText", e.target.value)}
          placeholder={"/images/spin/frame-01.jpg\n/images/spin/frame-02.jpg"}
        />
      </div>

      <div>
        <Label htmlFor="p-glb">Model 3D (.glb) cho xem AR trên điện thoại</Label>
        <Input
          id="p-glb"
          value={form.arModelUrl ?? ""}
          onChange={(e) => set("arModelUrl", e.target.value)}
          placeholder="https://.../gong-kinh.glb"
        />
      </div>

      <div>
        <Label htmlFor="p-desc">Mô tả</Label>
        <Textarea
          id="p-desc"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => set("isVisible", e.target.checked)}
          />
          Hiển thị trên website
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
          />
          Sản phẩm nổi bật
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}
