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
    title: "Bảo hành 12 tháng",
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

const EXAM_STEPS: { title: string; desc: string }[] = [
  {
    title: "Khai thác nhu cầu",
    desc: "Ghi nhận tiền sử thị lực, nghề nghiệp và thói quen dùng mắt.",
  },
  {
    title: "Đo thị lực sơ bộ",
    desc: "Kiểm tra thị lực xa – gần bằng bảng chuẩn và máy đo tự động.",
  },
  {
    title: "Khúc xạ chủ quan",
    desc: "Thử kính trên forophoter để xác định độ cầu, độ loạn và trục loạn.",
  },
  {
    title: "Kiểm tra thị giác hai mắt",
    desc: "Đánh giá cân bằng hai mắt, quy tụ và điều tiết để tránh mỏi mắt.",
  },
  {
    title: "Tư vấn tròng kính",
    desc: "Chọn chiết suất, chống ánh sáng xanh, đổi màu hoặc đa tròng phù hợp.",
  },
  {
    title: "Cắt lắp & cân chỉnh",
    desc: "Đo khoảng cách đồng tử, lắp tròng và tinh chỉnh gọng theo khuôn mặt.",
  },
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

  const specValue = (key: string) => {
    const v = specs[key];
    return v === undefined || v === null || v === "" ? null : String(v);
  };
  const baseSpecs: [string, string | null, string?][] = [
    ["Thương hiệu", product.brand ?? "Vin Eyewear"],
    ["Dáng gọng", product.frame_shape],
    ["Chất liệu gọng", product.material],
    ["Màu sắc", product.color],
    ["Đối tượng", product.gender],
    ["Rộng tròng", specValue("lens_width") ?? specValue("Rộng tròng"), "mm"],
    ["Cầu mũi", specValue("bridge") ?? specValue("Cầu mũi"), "mm"],
    ["Dài càng", specValue("temple_length") ?? specValue("Dài càng"), "mm"],
    ["Trọng lượng", specValue("weight") ?? specValue("Trọng lượng")],
    ["Tròng kèm theo", specValue("lens") ?? "Tròng chống ánh sáng xanh (tuỳ chọn nâng cấp)"],
    ["Mã sản phẩm", product.sku],
  ];
  const usedKeys = new Set([
    "spin_images",
    "lens_width",
    "bridge",
    "temple_length",
    "weight",
    "lens",
    "Rộng tròng",
    "Cầu mũi",
    "Dài càng",
    "Trọng lượng",
  ]);
  for (const [key, value] of Object.entries(specs)) {
    if (!usedKeys.has(key)) baseSpecs.push([key, String(value)]);
  }

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

          {/* Thông số kính */}
          <div className="mt-7 border-t border-border pt-5">
            <p className="micro-label text-caption">Thông số kính</p>
            <dl className="mt-3 divide-y divide-border border-y border-border">
              {baseSpecs.map(([label, value, hint]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-muted-foreground">
                    {label}
                    {hint ? <span className="ml-1 text-2xs text-caption">({hint})</span> : null}
                  </dt>
                  <dd className="text-right text-sm font-semibold">{value ?? "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-2xs leading-relaxed text-caption">
              Số đo gọng đọc theo chuẩn quốc tế: rộng tròng – cầu mũi – dài càng (mm). Kỹ thuật viên
              Vin Eyewear sẽ tinh chỉnh càng và đệm mũi miễn phí để gọng ôm đúng khuôn mặt bạn.
            </p>
          </div>

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
            <Button variant="ghost" size="icon" aria-label="Yêu thích">
              <Heart className="h-5 w-5" />
            </Button>
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

      {/* Quy trình đo khúc xạ */}
      <section className="mt-14 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="micro-label text-caption">Dịch vụ đi kèm</p>
            <h2 className="head-title display-section">Quy trình đo khúc xạ 6 bước</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Mỗi sản phẩm đều được cắt lắp sau khi đo thị lực trực tiếp tại showroom — miễn phí,
              khoảng 20–30 phút, thực hiện bởi kỹ thuật viên khúc xạ được cấp chứng chỉ.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dat-lich">Đặt lịch miễn phí</Link>
          </Button>
        </div>
        <ol className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {EXAM_STEPS.map((step, i) => (
            <li key={step.title} className="bg-background p-5">
              <span className="editorial-index text-caption">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-display text-xl">{step.title}</p>
              <p className="mt-1.5 lead-sm">{step.desc}</p>
            </li>
          ))}
        </ol>
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
