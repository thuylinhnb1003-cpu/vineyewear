import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/gio-hang")({
  head: () => ({
    meta: [
      { title: "Giỏ hàng — Vin Eyewear" },
      { name: "description", content: "Xem lại sản phẩm kính mắt bạn đã chọn trước khi đặt hàng." },
      { property: "og:title", content: "Giỏ hàng — Vin Eyewear" },
      { property: "og:description", content: "Kiểm tra và đặt hàng kính mắt tại Vin Eyewear." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, remove } = useCart();

  return (
    <>
      <PageHero
        eyebrow="Đơn hàng"
        index="01"
        title="Giỏ hàng"
        lead={
          items.length === 0
            ? "Chưa có sản phẩm nào trong giỏ. Khám phá bộ sưu tập gọng kính mới nhất của Vin Eyewear."
            : `Bạn đang có ${items.length} sản phẩm. Kiểm tra lại trước khi đặt hàng.`
        }
        crumbs={[{ label: "Giỏ hàng" }]}
      />
    <div className="container-vin section-vin">
      {items.length === 0 ? (
        <div className="mx-auto max-w-lg border border-border bg-card p-10 text-center shadow-card">
          <ShoppingBag className="mx-auto h-10 w-10 text-primary/70" aria-hidden="true" />
          <p className="mt-5 font-display text-2xl">Giỏ hàng đang trống</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Hãy chọn một chiếc gọng bạn thích, hoặc thử kính ảo trước khi quyết định.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/san-pham">Mua sắm ngay</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/thu-ar">Thử kính AR</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ul className="border-t border-border">
            {items.map((item) => (
              <li
                key={item.productId}
                className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4"
              >
                <img
                  src={item.image ?? "/images/product-1.jpg"}
                  alt={item.name}
                  className="aspect-square w-[72px] shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <Link
                    to="/san-pham/$slug"
                    params={{ slug: item.slug }}
                    className="line-clamp-2 font-display text-lg hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-primary">{formatVnd(item.price)}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <button
                      aria-label="Giảm"
                      className="grid h-7 w-7 place-items-center rounded-sm border border-input"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      aria-label="Tăng"
                      className="grid h-7 w-7 place-items-center rounded-sm border border-input"
                      onClick={() => setQuantity(item.productId, Math.min(20, item.quantity + 1))}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatVnd(item.price * item.quantity)}</p>
                  <button
                    className="mt-2 inline-flex items-center gap-1 text-xs text-destructive"
                    onClick={() => remove(item.productId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border bg-card p-6 shadow-card lg:sticky lg:top-28">
            <h2 className="font-display text-xl">Tóm tắt đơn hàng</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tạm tính</dt>
                <dd className="font-semibold">{formatVnd(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phí vận chuyển</dt>
                <dd className="font-semibold">
                  {subtotal >= 1000000 ? "Miễn phí" : "Tính khi thanh toán"}
                </dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link to="/thanh-toan">Tiến hành đặt hàng</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
    </>
  );
}
