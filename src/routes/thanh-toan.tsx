import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/vin-field";
import { useCart } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { createOrder } from "@/lib/shop.functions";
import { useSession } from "@/hooks/use-session";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/thanh-toan")({
  head: () => ({
    meta: [
      { title: "Đặt hàng — Vin Eyewear" },
      { name: "description", content: "Hoàn tất thông tin nhận hàng và đặt kính tại Vin Eyewear." },
      { property: "og:title", content: "Đặt hàng — Vin Eyewear" },
      { property: "og:description", content: "Thanh toán COD hoặc chuyển khoản, nhận tại cửa hàng hoặc giao hàng." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useSession();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [delivery, setDelivery] = React.useState<"pickup" | "shipping">("shipping");
  const [address, setAddress] = React.useState("");
  const [payment, setPayment] = React.useState<"cod" | "bank_transfer">("cod");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState<{ code: string; total: number } | null>(null);

  const shippingFee = delivery === "shipping" && subtotal < 1000000 ? 30000 : 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^0\d{8,10}$/.test(phone.replace(/\s/g, ""))) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    if (delivery === "shipping" && address.trim().length < 10) {
      setError("Vui lòng nhập địa chỉ giao hàng đầy đủ.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createOrder({
        data: {
          customerName: name,
          customerPhone: phone.replace(/\s/g, ""),
          customerEmail: email || undefined,
          deliveryMethod: delivery,
          shippingAddress: delivery === "shipping" ? address : undefined,
          paymentMethod: payment,
          note: note || undefined,
          userId: user?.id ?? null,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone({ code: result.code, total: result.total });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tạo được đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="container-vin section-vin">
        <div className="mx-auto max-w-lg border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
          <h1 className="mt-5 font-display text-3xl">Đặt hàng thành công</h1>
          <p className="mt-2 text-muted-foreground">
            Mã đơn hàng <strong className="text-primary">{done.code}</strong> — tổng tiền{" "}
            <strong>{formatVnd(done.total)}</strong>. Chúng tôi sẽ liên hệ xác nhận trong 24 giờ.
          </p>
          <Button asChild className="mt-6">
            <Link to="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-vin section-vin">
        <div className="mx-auto max-w-lg border border-border bg-card p-10 text-center shadow-card">
          <h1 className="font-display text-3xl">Chưa có sản phẩm để đặt</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thêm gọng kính vào giỏ hàng để tiếp tục đặt hàng.
          </p>
          <Button asChild className="mt-6">
            <Link to="/san-pham">Xem sản phẩm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Thanh toán"
        index="02"
        title="Thông tin đặt hàng"
        lead="Điền thông tin nhận hàng — chúng tôi sẽ gọi xác nhận trong vòng 24 giờ làm việc."
        crumbs={[{ label: "Giỏ hàng", to: "/gio-hang" }, { label: "Đặt hàng" }]}
      />
    <div className="container-vin section-vin">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSubmit} className="space-y-6 border border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="delivery">Hình thức nhận hàng *</Label>
              <Select
                id="delivery"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value as "pickup" | "shipping")}
              >
                <option value="shipping">Giao hàng tận nơi</option>
                <option value="pickup">Nhận tại cửa hàng</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment">Thanh toán *</Label>
              <Select
                id="payment"
                value={payment}
                onChange={(e) => setPayment(e.target.value as "cod" | "bank_transfer")}
              >
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
              </Select>
            </div>
          </div>
          {delivery === "shipping" && (
            <div>
              <Label htmlFor="address">Địa chỉ giao hàng *</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          )}
          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
          </Button>
        </form>

        <aside className="h-fit border border-border bg-card p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Đơn hàng</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold">{formatVnd(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tạm tính</dt>
              <dd>{formatVnd(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vận chuyển</dt>
              <dd>{shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <dt>Tổng cộng</dt>
              <dd className="text-primary">{formatVnd(subtotal + shippingFee)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
    </>
  );
}
