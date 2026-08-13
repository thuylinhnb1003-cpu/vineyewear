import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";
import { Heart, Minus, Plus, Star, ShieldCheck, RefreshCcw, Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, productImage } from "@/components/product-card";
import { ProductViewer } from "@/components/product/product-viewer";
import { getProductBySlug } from "@/lib/shop.functions";
import { formatVnd } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { CheckoutModal } from "@/components/checkout-modal";
import { toast } from "sonner";

const COMMITMENTS: { icon: typeof ShieldCheck; title: string; desc: string }[] = [
  {
    icon: Eye,
    title: "Đo khúc xạ miễn phí",
    desc: "Kỹ thuật viên chứng chỉ khúc xạ, đo tại showroom trong 20–30 phút.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành 24 tháng",
    desc: "Chính hãng, vệ sinh và cân chỉnh gọng miễn phí trọn đời.",
  },
  {
    icon: RefreshCcw,
    title: "Đổi trả 7 ngày",
    desc: "Đổi mẫu hoặc hoàn tiền nếu gọng còn nguyên trạng, đủ phụ kiện.",
  },
  {
    icon: Truck,
    title: "Miễn phí giao hàng",
    desc: "Áp dụng cho đơn từ 1.000.000đ, giao toàn quốc 1–3 ngày.",
  },
];

const SAMPLE_REVIEWS: { name: string; date: string; rating: number; content: string }[] = [
  {
    name: "Nguyễn Minh Anh",
    date: "12/07/2026",
    rating: 5,
    content:
      "Gọng kính rất nhẹ, đeo cả ngày không bị đau tai. Nhân viên tư vấn nhiệt tình, đo khúc xạ chính xác.",
  },
  {
    name: "Trần Phương Linh",
    date: "28/06/2026",
    rating: 5,
    content:
      "Chất lượng tròng tốt, chống ánh sáng xanh rõ rệt khi làm việc máy tính lâu. Đóng gói cẩn thận, giao nhanh.",
  },
  {
    name: "Lê Hoàng Nam",
    date: "15/06/2026",
    rating: 4,
    content:
      "Kiểu dáng đẹp, hợp khuôn mặt vuông. Giao hàng hơi chậm một chút nhưng chất lượng gọng xứng đáng.",
  },
];

const RATING_DISTRIBUTION = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/san-pham/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!result.product) throw notFound();
    return { name: result.product.name, description: result.product.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Sản phẩm"} — Vin Eyewear` },
      {
        name: "description",
        content:
          loaderData?.description?.slice(0, 155) ??
          "Chi tiết sản phẩm kính mắt chính hãng tại Vin Eyewear.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Sản phẩm"} — Vin Eyewear` },
      {
        property: "og:description",
        content: loaderData?.description?.slice(0, 155) ?? "Kính mắt chính hãng tại Vin Eyewear.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const product = data.product;
  if (!product) return null;

  const images = Array.isArray(product.images)
    ? (product.images.filter((i) => typeof i === "string") as string[])
    : [];
  const gallery = images.length > 0 ? images : [productImage(product.images)];
  const specs =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : {};
  const spinRaw = (specs as { spin_images?: unknown }).spin_images;
  const spinFrames = Array.isArray(spinRaw)
    ? (spinRaw.filter((i) => typeof i === "string") as string[])
    : gallery;
  const price = Number(product.price);
  const compare = product.compare_at_price ? Number(product.compare_at_price) : null;
  const outOfStock = product.status !== "in_stock";

  const addCurrent = () =>
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price,
        image: gallery[0] ?? null,
      },
      quantity,
    );

  return (
    <div className="container-vin section-vin">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link to="/san-pham" className="hover:text-primary">
          Sản phẩm
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ProductViewer
          images={gallery}
          spinFrames={spinFrames}
          modelUrl={product.ar_model_url ?? null}
          name={product.name}
        />

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-caption">
            {product.brand ?? "Vin Eyewear"} · SKU {product.sku}
          </p>
          <h1 className="mt-2 display-section">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {Number(product.rating ?? 0).toFixed(1)}
            </span>
            · {product.review_count ?? 0} đánh giá ·{" "}
            <span className={outOfStock ? "text-destructive" : "text-success"}>
              {outOfStock ? "Tạm hết hàng" : `Còn ${product.stock_quantity} sản phẩm`}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatVnd(price)}</span>
            {compare && compare > price && (
              <span className="text-lg text-caption line-through">{formatVnd(compare)}</span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-input">
              <button
                className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" disabled={outOfStock} onClick={() => setCheckoutOpen(true)}>
              {outOfStock ? "Tạm hết hàng" : "Mua ngay"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              disabled={outOfStock}
              onClick={() => {
                addCurrent();
                toast.success("Đã thêm vào giỏ hàng");
              }}
            >
              Thêm vào giỏ
            </Button>
            {/* <Link to="/dat-lich" className="text-primary hover:underline">
              Đặt lịch đo khúc xạ
            </Link> */}
            {/* <Button variant="ghost" size="icon" aria-label="Yêu thích">
              <Heart className="h-5 w-5" />
            </Button> */}
          </div>

          {/* Khối cam kết */}
          <ul className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
            {COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-3 bg-background p-4">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-2xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Đánh giá sản phẩm */}
      <section className="mt-14 border-t border-border pt-10">
        <p className="micro-label text-caption">Phản hồi khách hàng</p>
        <h2 className="head-title display-section">Đánh giá sản phẩm</h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="text-center sm:text-left">
            <p className="font-display text-5xl font-bold text-primary">
              {Number(product.rating ?? 5).toFixed(1)}
            </p>
            <div className="mt-2 flex justify-center gap-0.5 sm:justify-start" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(Number(product.rating ?? 5))
                      ? "h-4 w-4 fill-primary text-primary"
                      : "h-4 w-4 text-border"
                  }
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.review_count ?? 0} đánh giá
            </p>
          </div>

          <div className="space-y-1.5">
            {RATING_DISTRIBUTION.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-3 shrink-0 tabular-nums">{row.stars}</span>
                <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" aria-hidden="true" />
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${row.pct}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-2xs tabular-nums">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-10 divide-y divide-border">
          {SAMPLE_REVIEWS.map((review) => (
            <li key={review.name} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
              <div className="mt-1.5 flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "h-3.5 w-3.5 fill-primary text-primary"
                        : "h-3.5 w-3.5 text-border"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 border border-dashed border-border p-6 text-center">
          <p className="font-semibold">Bạn đã mua sản phẩm này?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Chia sẻ trải nghiệm của bạn để giúp khách hàng khác lựa chọn dễ dàng hơn.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/auth" search={{ next: `/san-pham/${product.slug}` }}>
              Đăng nhập để đánh giá
            </Link>
          </Button>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="mt-14">
          <h2>Sản phẩm liên quan</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      <CheckoutModal
        item={{
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price,
          image: gallery[0] ?? null,
          variant: product.color ?? null,
        }}
        initialQuantity={quantity}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </div>
  );
}
