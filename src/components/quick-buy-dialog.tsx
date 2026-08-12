import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Check, Glasses, ScanEye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { LENS_PACKAGES } from "@/lib/taxonomy";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { CheckoutModal, type CheckoutItem } from "@/components/checkout-modal";

type QuickBuyProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export function QuickBuyDialog({
  product,
  open,
  onOpenChange,
}: {
  product: QuickBuyProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { add } = useCart();
  const [mode, setMode] = React.useState<"frame" | "lens">("frame");
  const [lensId, setLensId] = React.useState(LENS_PACKAGES[0]!.id);
  const [checkout, setCheckout] = React.useState<CheckoutItem | null>(null);

  const lens = LENS_PACKAGES.find((l) => l.id === lensId) ?? LENS_PACKAGES[0]!;
  const total = mode === "frame" ? product.price : product.price + lens.price;

  function addToCart() {
    add({
      productId: product.id,
      slug: product.slug,
      name: mode === "frame" ? product.name : `${product.name} + ${lens.name}`,
      price: total,
      image: product.image,
    });
  }

  function confirm() {
    addToCart();
    toast.success(
      mode === "frame" ? "Đã thêm gọng vào giỏ hàng" : "Đã thêm gọng kèm tròng vào giỏ hàng",
    );
    onOpenChange(false);
  }

  function buyNow() {
    setCheckout({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: mode === "frame" ? "Chỉ mua gọng" : null,
      addonPrice: mode === "lens" ? lens.price : 0,
      addonLabel: mode === "lens" ? lens.name : null,
    });
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Mua nhanh</DialogTitle>
            <DialogDescription>
              Chọn hình thức mua cho{" "}
              <span className="font-medium text-foreground">{product.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => setMode("frame")}
              className={cn(
                "flex items-start gap-3 rounded-md border p-4 text-left transition-colors duration-200",
                mode === "frame"
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary",
              )}
            >
              <Glasses className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Mua gọng lẻ</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Chỉ mua gọng, bạn có thể cắt tròng sau tại cửa hàng.
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-primary">
                {formatVnd(product.price)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("lens")}
              className={cn(
                "flex items-start gap-3 rounded-md border p-4 text-left transition-colors duration-200",
                mode === "lens"
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary",
              )}
            >
              <ScanEye className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Cắt kèm tròng theo độ</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Đo khúc xạ miễn phí, lắp tròng theo đơn kính của bạn.
                </span>
              </span>
            </button>

            {mode === "lens" && (
              <div className="grid gap-2 rounded-md border border-border bg-card p-3">
                {LENS_PACKAGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLensId(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors",
                      lensId === item.id ? "bg-primary-soft" : "hover:bg-secondary",
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        lensId === item.id ? "text-primary" : "text-transparent",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">{item.desc}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">+{formatVnd(item.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="eyebrow">Tổng tạm tính</p>
              <p className="font-display text-2xl font-semibold text-primary">{formatVnd(total)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link
                  to="/san-pham/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => onOpenChange(false)}
                >
                  Chi tiết
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={confirm}>
                Thêm vào giỏ
              </Button>
              <Button size="sm" onClick={buyNow}>
                Mua ngay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <CheckoutModal
        item={checkout}
        open={checkout !== null}
        onOpenChange={(o) => !o && setCheckout(null)}
      />
    </>
  );
}
