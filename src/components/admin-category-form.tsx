import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/vin-field";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type CategoryFormValues = {
  id?: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isVisible: boolean;
};

export function emptyCategory(): CategoryFormValues {
  return { slug: "", name: "", description: "", sortOrder: 0, isVisible: true };
}

export function toCategoryForm(c: CategoryRow): CategoryFormValues {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    sortOrder: c.sort_order,
    isVisible: c.is_visible,
  };
}

export function AdminCategoryForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: CategoryFormValues;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}) {
  const [form, setForm] = React.useState<CategoryFormValues>(value);
  React.useEffect(() => setForm(value), [value]);

  function set<K extends keyof CategoryFormValues>(key: K, v: CategoryFormValues[K]) {
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
        {form.id ? "Sửa danh mục" : "Thêm danh mục mới"}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Tên danh mục *</Label>
          <Input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-slug">Slug (đường dẫn) *</Label>
          <Input
            id="c-slug"
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c-sort">Thứ tự hiển thị</Label>
          <Input
            id="c-sort"
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="c-desc">Mô tả</Label>
        <Textarea
          id="c-desc"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.isVisible}
          onChange={(e) => set("isVisible", e.target.checked)}
        />
        Hiển thị trên website
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu danh mục"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}
