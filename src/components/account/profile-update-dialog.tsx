import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/vin-field";
import { updateMyProfile, updateMyPrescription } from "@/lib/shop.functions";

type Profile = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
} | null;

type Prescription = {
  od_sph: number | null;
  od_cyl: number | null;
  os_sph: number | null;
  os_cyl: number | null;
} | null;

function numToStr(v: number | null | undefined): string {
  return v === null || v === undefined ? "" : String(v);
}

/** Form Cập nhật hồ sơ cá nhân (UC 3.2.2.2) — gồm thông tin cá nhân và hồ sơ khúc xạ. */
export function ProfileUpdateDialog({
  open,
  onOpenChange,
  profile,
  email,
  prescription,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  email: string | null | undefined;
  prescription: Prescription;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [odSph, setOdSph] = React.useState("");
  const [odCyl, setOdCyl] = React.useState("");
  const [osSph, setOsSph] = React.useState("");
  const [osCyl, setOsCyl] = React.useState("");
  const [errors, setErrors] = React.useState<{ fullName?: string; phone?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setAddress(profile?.address ?? "");
    setDateOfBirth(profile?.date_of_birth ?? "");
    setOdSph(numToStr(prescription?.od_sph));
    setOdCyl(numToStr(prescription?.od_cyl));
    setOsSph(numToStr(prescription?.os_sph));
    setOsCyl(numToStr(prescription?.os_cyl));
    setErrors({});
  }, [open, profile, prescription]);

  function validate() {
    const next: { fullName?: string; phone?: string } = {};
    if (fullName.trim().length < 2) next.fullName = "Họ tên phải có ít nhất 2 ký tự.";
    if (!/^0\d{8,10}$/.test(phone.replace(/\s/g, "")))
      next.phone = "Số điện thoại không hợp lệ (bắt đầu bằng 0, 9–11 số).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await updateMyProfile({
        data: {
          fullName: fullName.trim(),
          phone: phone.replace(/\s/g, ""),
          address: address.trim() || null,
          dateOfBirth: dateOfBirth || null,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      const hasRxInput = [odSph, odCyl, osSph, osCyl].some((v) => v.trim() !== "");
      if (hasRxInput) {
        const rxResult = await updateMyPrescription({
          data: {
            odSph: odSph.trim() ? Number(odSph) : null,
            odCyl: odCyl.trim() ? Number(odCyl) : null,
            osSph: osSph.trim() ? Number(osSph) : null,
            osCyl: osCyl.trim() ? Number(osCyl) : null,
          },
        });
        if (!rxResult.ok) {
          toast.error(rxResult.error);
          return;
        }
      }

      toast.success("Cập nhật hồ sơ thành công.");
      onSaved();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Cập nhật hồ sơ cá nhân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin liên hệ và hồ sơ khúc xạ để thuận tiện khi mua kính.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="pu-name">Họ và tên *</Label>
              <Input
                id="pu-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="mt-1 text-2xs text-destructive">{errors.fullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="pu-email">Email</Label>
              <Input id="pu-email" value={email ?? ""} disabled readOnly />
            </div>
            <div>
              <Label htmlFor="pu-phone">Số điện thoại *</Label>
              <Input
                id="pu-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="0901234567"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-1 text-2xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="pu-dob">Ngày sinh</Label>
              <Input
                id="pu-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="pu-address">Địa chỉ</Label>
              <Textarea
                id="pu-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              />
            </div>
          </section>

          <section className="border-t border-border pt-4">
            <p className="micro-label text-caption">Hồ sơ khúc xạ</p>
            <p className="mt-1 text-2xs leading-relaxed text-caption">
              Nhập theo đơn kính/phiếu đo mắt gần nhất — để trống nếu chưa có.
            </p>
            <div className="mt-3 grid grid-cols-[2.5rem_repeat(2,1fr)] items-center gap-2">
              <span />
              <span className="text-center text-2xs font-semibold uppercase text-caption">
                SPH
              </span>
              <span className="text-center text-2xs font-semibold uppercase text-caption">
                CYL
              </span>
              <span className="text-2xs font-bold uppercase text-caption">OD (phải)</span>
              <Input
                value={odSph}
                onChange={(e) => setOdSph(e.target.value)}
                type="number"
                step="0.25"
                aria-label="OD — độ cầu SPH"
                className="text-center"
              />
              <Input
                value={odCyl}
                onChange={(e) => setOdCyl(e.target.value)}
                type="number"
                step="0.25"
                aria-label="OD — độ loạn CYL"
                className="text-center"
              />
              <span className="text-2xs font-bold uppercase text-caption">OS (trái)</span>
              <Input
                value={osSph}
                onChange={(e) => setOsSph(e.target.value)}
                type="number"
                step="0.25"
                aria-label="OS — độ cầu SPH"
                className="text-center"
              />
              <Input
                value={osCyl}
                onChange={(e) => setOsCyl(e.target.value)}
                type="number"
                step="0.25"
                aria-label="OS — độ loạn CYL"
                className="text-center"
              />
            </div>
          </section>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
