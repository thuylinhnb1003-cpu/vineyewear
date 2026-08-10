import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/vin-field";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_visible: boolean;
};

export type EventFormValues = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  location: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isVisible: boolean;
};

function toLocalInput(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function emptyEvent(): EventFormValues {
  return {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    location: "",
    startsAt: "",
    endsAt: "",
    isVisible: true,
  };
}

export function toEventForm(e: EventRow): EventFormValues {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    excerpt: e.excerpt ?? "",
    content: e.content ?? "",
    coverImage: e.cover_image ?? "",
    location: e.location ?? "",
    startsAt: toLocalInput(e.starts_at),
    endsAt: toLocalInput(e.ends_at),
    isVisible: e.is_visible,
  };
}

export function AdminEventForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: EventFormValues;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: EventFormValues) => void;
}) {
  const [form, setForm] = React.useState<EventFormValues>(value);
  React.useEffect(() => setForm(value), [value]);

  function set<K extends keyof EventFormValues>(key: K, v: EventFormValues[K]) {
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
        {form.id ? "Sửa sự kiện" : "Thêm sự kiện mới"}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="e-title">Tiêu đề *</Label>
          <Input
            id="e-title"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="e-slug">Slug *</Label>
          <Input
            id="e-slug"
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="e-start">Bắt đầu</Label>
          <Input
            id="e-start"
            type="datetime-local"
            value={form.startsAt ?? ""}
            onChange={(e) => set("startsAt", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="e-end">Kết thúc</Label>
          <Input
            id="e-end"
            type="datetime-local"
            value={form.endsAt ?? ""}
            onChange={(e) => set("endsAt", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="e-loc">Địa điểm</Label>
          <Input
            id="e-loc"
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="e-cover">Ảnh bìa (đường dẫn)</Label>
          <Input
            id="e-cover"
            value={form.coverImage ?? ""}
            onChange={(e) => set("coverImage", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="e-excerpt">Mô tả ngắn</Label>
        <Textarea
          id="e-excerpt"
          value={form.excerpt ?? ""}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="e-content">Nội dung</Label>
        <Textarea
          id="e-content"
          className="min-h-40"
          value={form.content ?? ""}
          onChange={(e) => set("content", e.target.value)}
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
          {saving ? "Đang lưu..." : "Lưu sự kiện"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}
