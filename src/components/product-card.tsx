import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Layers, Ruler, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { QuickBuyDialog } from "@/components/quick-buy-dialog";

export type ProductLike = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  images: unknown;
  status: string | null;
  rating: number | string | null;
  review_count: number | null;
  material?: string | null;
  specs?: unknown;
};

export function productImage(images: unknown): string {
  if (Array.isArray(images) && typeof images[0] === "string") return images[0];
  return "/images/product-1.jpg";
}

function secondImage(images: unknown): string | null {
  if (Array.isArray(images) && typeof images[1] === "string") return images[1];
  return null;
}

function frameSize(specs: unknown): string | null {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return null;
  const s = specs as Record<string, unknown>;
  const raw = s["size"] ?? s["kich_thuoc"] ?? s["Kích thước"] ?? s["frame_size"];
  return typeof raw === "string" || typeof raw === "number" ? String(raw) : null;
}

export function ProductCard({ product }: { product: ProductLike }) {
  const [quickBuy, setQuickBuy] = React.useState(false);
  const price = Number(product.price);
  const compare = product.compare_at_price ? Number(product.compare_at_price) : null;
  const discount = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
  const outOfStock = product.status !== "in_stock";
  const image = productImage(product.images);
  const hoverImage = secondImage(product.images);
  const rating = Number(product.rating ?? 5);
  const size = frameSize(product.specs);

  return (
    <article className="group flex h-full flex-col border-b border-border bg-transparent pb-5 transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-primary">
      <Link
        to="/san-pham/$slug"
        params={{ slug: product.slug }}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-all duration-[500ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05] ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[500ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05] group-hover:opacity-100"
          />
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.16em] text-primary-foreground">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 bg-background px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Hết hàng
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 pt-5">
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {product.brand ?? "VIN Eyewear"}
        </p>
        <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight">
          <Link
            to="/san-pham/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        {(product.material || size) && (
          <ul className="flex list-none flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-muted-foreground">
            {product.material && (
              <li className="inline-flex min-w-0 items-center gap-1">
                <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Chất liệu: {product.material}</span>
              </li>
            )}
            {size && (
              <li className="inline-flex min-w-0 items-center gap-1">
                <Ruler className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Size: {size}</span>
              </li>
            )}
          </ul>
        )}

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="flex" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={
                  i < Math.round(rating)
                    ? "h-3.5 w-3.5 fill-primary text-primary"
                    : "h-3.5 w-3.5 text-border"
                }
              />
            ))}
          </span>
          <span className="sr-only">
            Đánh giá {rating.toFixed(1)} trên 5, {product.review_count ?? 0} nhận xét
          </span>
          <span aria-hidden="true">({product.review_count ?? 0})</span>
        </p>

        <p className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          <span className="text-xl font-bold text-primary">
            <span className="sr-only">Giá bán </span>
            {formatVnd(price)}
          </span>
          {compare && compare > price && (
            <span className="text-sm text-muted-foreground line-through">
              <span className="sr-only">Giá gốc </span>
              {formatVnd(compare)}
            </span>
          )}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="primary"
            className="h-11 rounded-none lg:h-9"
            disabled={outOfStock}
            onClick={() => setQuickBuy(true)}
          >
            {outOfStock ? "Hết hàng" : "Mua ngay"}
            <span className="sr-only"> — {product.name}</span>
          </Button>
          <Button size="sm" variant="secondary" asChild className="h-11 rounded-none lg:h-9">
            <Link to="/san-pham/$slug" params={{ slug: product.slug }}>
              Chi tiết
              <span className="sr-only"> {product.name}</span>
            </Link>
          </Button>
        </div>
      </div>

      <QuickBuyDialog
        product={{ id: product.id, slug: product.slug, name: product.name, price, image }}
        open={quickBuy}
        onOpenChange={setQuickBuy}
      />
    </article>
  );
}
