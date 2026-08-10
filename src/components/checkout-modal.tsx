import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  Minus,
  Plus,
  QrCode,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/vin-field";
import { formatVnd } from "@/lib/format";
import { createOrder } from "@/lib/shop.functions";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export type CheckoutItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  /** Tuỳ chọn: màu gọng, loại tròng… */
  variant?: string | null;
  /** Phụ phí tròng kính cho mỗi sản phẩm */
  addonPrice?: number;
  addonLabel?: string | null;
};

type PayMethod = "vietqr" | "momo" | "zalopay" | "cod";

const PAY_OPTIONS: {
  id: PayMethod;
  label: string;
  desc: string;
  icon: typeof QrCode;
}[] = [
  { id: "vietqr", label: "VietQR / Chuyển khoản", desc: "Quét mã QR, xác nhận tức thì.", icon: QrCode },
  { id: "momo", label: "Ví MoMo", desc: "Thanh toán qua ứng dụng MoMo.", icon: Wallet },
  { id: "zalopay", label: "ZaloPay", desc: "Thanh toán qua ví ZaloPay.", icon: Banknote },
  { id: "cod", label: "COD — thanh toán khi nhận", desc: "Kiểm tra hàng trước khi trả tiền.", icon: Truck },
];

/** Mã QR mô phỏng — hoa văn tạo từ chuỗi nội dung, không gọi dịch vụ ngoài. */
function QrMock({ seed }: { seed: string }) {
  const cells = React.useMemo(() => {
    const size = 21;
    let h = 2166136261;
    for (const ch of seed) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    const out: boolean[] = [];
    for (let i = 0; i < size * size; i++) {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      out.push((h & 7) > 3);
    }
    const isFinder = (r: number, c: number) => {
      const box = (r0: number, c0: number) =>
        r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
      const ring = (r0: number, c0: number) => {
        const dr = r - r0;
        const dc = c - c0;
        const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const core = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        return edge || core;
      };
      if (box(0, 0)) return ring(0, 0);
      if (box(0, size - 7)) return ring(0, size - 7);
      if (box(size - 7, 0)) return ring(size - 7, 0);
      return null;
    };
    return Array.from({ length: size * size }, (_, i) => {
      const r = Math.floor(i / size);
      const c = i % size;
      const f = isFinder(r, c);
      return f === null ? out[i]! : f;
    });
  }, [seed]);

  return (
    <div
      className="grid h-40 w-40 shrink-0 gap-px bg-background p-2"
      style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }}
      role="img"
      aria-label="Mã VietQR mô phỏng"
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-foreground" : "bg-transparent"} />
      ))}
    </div>
  );
}

export function CheckoutModal({
  item,
  open,
  onOpenChange,
  initialQuantity = 1,
}: {
  item: CheckoutItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuantity?: number;
}) {
  const { user } = useSession();
  const [quantity, setQuantity] = React.useState(initialQuantity);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [note, setNote] = React.useState("");
  const [pay, setPay] = React.useState<PayMethod>("vietqr");
  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
    address?: string;
    form?: string;
  }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState<{ code: string; total: number } | null>(null);

  React.useEffect(() => {
    if (open) {
      setQuantity(initialQuantity);
      setErrors({});
      setDone(null);
    }
  }, [open, initialQuantity]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open || !item) return null;

  const unit = item.price + (item.addonPrice ?? 0);
  const subtotal = unit * quantity;
  const shippingFee = pay === "cod" ? (subtotal < 1000000 ? 30000 : 0) : subtotal < 1000000 ? 30000 : 0;
  const total = subtotal + shippingFee;
  const eta = new Date(Date.now() + 3 * 86400000).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });

  function validate() {
    const next: { name?: string; phone?: string; address?: string } = {};
    if (name.trim().length < 2) next.name = "Vui lòng nhập họ và tên (tối thiểu 2 ký tự).";
    if (!/^0\d{8,10}$/.test(phone.replace(/\s/g, "")))
      next.phone = "Số điện thoại không hợp lệ (bắt đầu bằng 0, 9–11 số).";
    if (address.trim().length < 10) next.address = "Vui lòng nhập địa chỉ nhận hàng đầy đủ.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !item) return;
    setSubmitting(true);
    try {
      const notes = [
        item.addonLabel ? `Tròng kính: ${item.addonLabel}` : null,
        item.variant ? `Phân loại: ${item.variant}` : null,
        pay === "momo" || pay === "zalopay" ? `Ví điện tử: ${pay.toUpperCase()}` : null,
        note.trim() || null,
      ]
        .filter(Boolean)
        .join(" · ");

      const result = await createOrder({
        data: {
          customerName: name.trim(),
          customerPhone: phone.replace(/\s/g, ""),
          deliveryMethod: "shipping",
          shippingAddress: address.trim(),
          paymentMethod: pay === "cod" ? "cod" : "bank_transfer",
          note: notes || undefined,
          userId: user?.id ?? null,
          items: [{ productId: item.productId, quantity }],
        },
      });
      if (!result.ok) {
        setErrors({ form: result.error });
        return;
      }
      setDone({ code: result.code, total: result.total });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Không tạo được đơn hàng." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Đóng"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-foreground/50 overlay-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Thanh toán nhanh"
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden border border-border bg-background shadow-card sheet-up sm:max-w-3xl sm:modal-in"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow text-caption">Vin Eyewear</p>
            <h2 className="truncate font-display text-2xl leading-tight">
              {done ? "Đặt hàng thành công" : "Thanh toán nhanh"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
            className="grid h-9 w-9 shrink-0 place-items-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {done ? (
          <div className="overflow-y-auto px-6 py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
            <p className="mt-5 font-display text-3xl">Cảm ơn bạn!</p>
            <dl className="mx-auto mt-6 max-w-sm divide-y divide-border border-y border-border text-sm">
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Mã đơn hàng</dt>
                <dd className="font-semibold text-primary">{done.code}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Tổng thanh toán</dt>
                <dd className="font-semibold">{formatVnd(done.total)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Dự kiến nhận hàng</dt>
                <dd className="font-semibold">{eta} (1–3 ngày)</dd>
              </div>
            </dl>
            <p className="mx-auto mt-4 max-w-sm text-2xs leading-relaxed text-caption">
              Nhân viên Vin Eyewear sẽ gọi xác nhận trong vòng 24 giờ làm việc để thống nhất thời
              gian giao hàng và đo khúc xạ nếu cần.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={() => onOpenChange(false)}>Tiếp tục mua sắm</Button>
              <Button asChild variant="outline">
                <Link to="/tai-khoan" onClick={() => onOpenChange(false)}>
                  Xem đơn hàng
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="order-2 space-y-6 px-5 py-5 lg:order-1 lg:px-6">
              <section>
                <p className="micro-label text-caption">Thông tin nhận hàng</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="qc-name">Họ và tên *</Label>
                    <Input
                      id="qc-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      maxLength={120}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="mt-1 text-2xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="qc-phone">Số điện thoại *</Label>
                    <Input
                      id="qc-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={20}
                      placeholder="0901234567"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="mt-1 text-2xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="qc-address">Địa chỉ nhận hàng *</Label>
                  <Textarea
                    id="qc-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    maxLength={300}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <p className="mt-1 text-2xs text-destructive">{errors.address}</p>}
                </div>
                <div className="mt-4">
                  <Label htmlFor="qc-note">Ghi chú (không bắt buộc)</Label>
                  <Textarea
                    id="qc-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={500}
                    placeholder="Thời gian giao thuận tiện, đơn kính hiện tại…"
                  />
                </div>
              </section>

              <section>
                <p className="micro-label text-caption">Phương thức thanh toán</p>
                <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">
                  {PAY_OPTIONS.map(({ id, label, desc, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPay(id)}
                      aria-pressed={pay === id}
                      className={cn(
                        "flex items-start gap-3 p-4 text-left transition-colors duration-200",
                        pay === id ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary",
                      )}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{label}</span>
                        <span
                          className={cn(
                            "mt-0.5 block text-2xs leading-relaxed",
                            pay === id ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {desc}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                {pay === "vietqr" && (
                  <div className="mt-4 flex flex-wrap items-center gap-5 border border-border bg-card p-4">
                    <QrMock seed={`${item.productId}-${total}`} />
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-semibold">Quét VietQR để chuyển khoản</p>
                      <dl className="mt-2 space-y-1 text-2xs text-muted-foreground">
                        <div className="flex justify-between gap-3">
                          <dt>Chủ tài khoản</dt>
                          <dd className="font-semibold text-foreground">CTY TNHH VIN EYEWEAR</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt>Số tài khoản</dt>
                          <dd className="font-semibold text-foreground">0071 0009 8888 · Vietcombank</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt>Số tiền</dt>
                          <dd className="font-semibold text-primary">{formatVnd(total)}</dd>
                        </div>
                      </dl>
                      <p className="mt-2 text-2xs text-caption">
                        Mã QR minh hoạ — sau khi xác nhận, hệ thống sẽ gửi mã đơn để bạn ghi vào nội
                        dung chuyển khoản.
                      </p>
                    </div>
                  </div>
                )}
                {(pay === "momo" || pay === "zalopay") && (
                  <p className="mt-4 border border-border bg-card p-4 text-2xs leading-relaxed text-muted-foreground">
                    Sau khi xác nhận, nhân viên sẽ gửi link thanh toán{" "}
                    {pay === "momo" ? "MoMo" : "ZaloPay"} qua Zalo/SMS tới số điện thoại bạn cung cấp.
                  </p>
                )}
              </section>

              {errors.form && (
                <p className="bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors.form}</p>
              )}
            </div>

            <aside className="order-1 border-b border-border bg-card px-5 py-5 lg:order-2 lg:border-b-0 lg:border-l lg:px-6">
              <p className="micro-label text-caption">Đơn hàng của bạn</p>
              <div className="mt-3 flex gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="h-20 w-20 shrink-0 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                  {(item.variant || item.addonLabel) && (
                    <p className="mt-1 text-2xs text-muted-foreground">
                      {[item.variant, item.addonLabel].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-semibold text-primary">{formatVnd(unit)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-2xs uppercase tracking-[0.16em] text-caption">Số lượng</span>
                <div className="flex items-center border border-input">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Tăng số lượng"
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Tạm tính</dt>
                  <dd>{formatVnd(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Vận chuyển</dt>
                  <dd>{shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-2 text-base font-bold">
                  <dt>Tổng cộng</dt>
                  <dd className="text-primary">{formatVnd(total)}</dd>
                </div>
              </dl>

              <Button type="submit" size="lg" disabled={submitting} className="mt-5 w-full">
                {submitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>
              <p className="mt-2 text-2xs leading-relaxed text-caption">
                Dự kiến nhận hàng {eta} · Đổi trả 7 ngày · Bảo hành 12 tháng.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
