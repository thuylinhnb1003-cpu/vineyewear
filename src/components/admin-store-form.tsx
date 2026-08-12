import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/vin-field";
import type { StoreRow } from "@/lib/admin-queries";

export type { StoreRow };

export type StoreFormValues = {
  id?: string;
  code: string;
  name: string;
  address: string;
  phone: string | null;
  openHours: string | null;
  mapUrl: string | null;
  isActive: boolean;
};

export function emptyStore(): StoreFormValues {
  return { code: "", name: "", address: "", phone: "", openHours: "", mapUrl: "", isActive: true };
}

export function toStoreForm(s: StoreRow): StoreFormValues {
  return {
    id: s.id,
    code: s.code,
    name: s.name,
    address: s.address,
    phone: s.phone ?? "",
    openHours: s.open_hours ?? "",
    mapUrl: s.map_url ?? "",
    isActive: s.is_active,
  };
}

export function AdminStoreForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: StoreFormValues;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: StoreFormValues) => void;
}) {
  const [form, setForm] = React.useState<StoreFormValues>(value);
  React.useEffect(() => setForm(value), [value]);

  function set<K extends keyof StoreFormValues>(key: K, v: StoreFormValues[K]) {
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
        {form.id ? "Sửa cơ sở" : "Thêm cơ sở mới"}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="s-name">Tên cơ sở *</Label>
          <Input
            id="s-name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="s-code">Mã cơ sở *</Label>
          <Input
            id="s-code"
            required
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="s-phone">Điện thoại</Label>
          <Input
            id="s-phone"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="s-hours">Giờ mở cửa</Label>
          <Input
            id="s-hours"
            value={form.openHours ?? ""}
            onChange={(e) => set("openHours", e.target.value)}
            placeholder="08:00 - 21:00 hàng ngày"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="s-address">Địa chỉ *</Label>
        <Textarea
          id="s-address"
          required
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="s-map">Link Google Maps</Label>
        <Input
          id="s-map"
          value={form.mapUrl ?? ""}
          onChange={(e) => set("mapUrl", e.target.value)}
          placeholder="https://www.google.com/maps?q=..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
        />
        Đang hoạt động
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu cơ sở"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}
