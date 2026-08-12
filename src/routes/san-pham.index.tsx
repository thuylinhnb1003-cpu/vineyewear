import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { getCatalog } from "@/lib/shop.functions";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/vin-field";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PageHero } from "@/components/page-hero";

type Search = {
  q?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  shape?: string | undefined;
  material?: string | undefined;
  gender?: string | undefined;
  sort?: string | undefined;
  max?: number | undefined;
};

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

export const Route = createFileRoute("/san-pham/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
    shape: typeof search["shape"] === "string" ? search["shape"] : undefined,
    material: typeof search["material"] === "string" ? search["material"] : undefined,
    gender: typeof search["gender"] === "string" ? search["gender"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    max: search["max"] ? Number(search["max"]) : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Sản phẩm kính mắt — Vin Eyewear" },
      {
        name: "description",
        content:
          "Danh sách gọng kính, kính mát, tròng kính và kính áp tròng chính hãng với bộ lọc theo thương hiệu, dáng gọng và giá.",
      },
      { property: "og:title", content: "Sản phẩm kính mắt — Vin Eyewear" },
      {
        property: "og:description",
        content: "Lọc và tìm gọng kính, kính mát, tròng kính chính hãng tại Vin Eyewear.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQuery);
  },
  component: ProductList,
});

const PAGE_SIZE = 12;

function ProductList() {
  const { data } = useSuspenseQuery(catalogQuery);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [page, setPage] = React.useState(1);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  React.useEffect(() => setPage(1), [search]);

  const brands = Array.from(new Set(data.products.map((p) => p.brand).filter(Boolean))) as string[];
  const shapes = Array.from(
    new Set(data.products.map((p) => p.frame_shape).filter(Boolean)),
  ) as string[];
  const materials = Array.from(
    new Set(data.products.map((p) => p.material).filter(Boolean)),
  ) as string[];

  const categoryId = data.categories.find((c) => c.slug === search.category)?.id;

  const filtered = data.products.filter((p) => {
    if (search.q) {
      const hay = `${p.name} ${p.brand ?? ""} ${p.sku ?? ""}`.toLowerCase();
      if (!hay.includes(search.q.toLowerCase())) return false;
    }
    if (categoryId && p.category_id !== categoryId) return false;
    if (search.brand && p.brand !== search.brand) return false;
    if (search.shape && p.frame_shape !== search.shape) return false;
    if (search.material && p.material !== search.material) return false;
    if (search.gender && p.gender !== search.gender) return false;
    if (search.max && Number(p.price) > search.max) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (search.sort === "price-asc") return Number(a.price) - Number(b.price);
    if (search.sort === "price-desc") return Number(b.price) - Number(a.price);
    if (search.sort === "rating") return Number(b.rating ?? 0) - Number(a.rating ?? 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const visible = sorted.slice(0, page * PAGE_SIZE);

  const activeCount = [
    search.category,
    search.brand,
    search.shape,
    search.material,
    search.gender,
    search.max,
  ].filter(Boolean).length;

  function update(patch: Partial<Search>) {
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });
  }

  const filterPanel = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="q">Tìm kiếm</Label>
        <Input
          id="q"
          value={search.q ?? ""}
          onChange={(e) => update({ q: e.target.value || undefined })}
          placeholder="Tên sản phẩm, thương hiệu..."
        />
      </div>
      <div>
        <Label htmlFor="category">Danh mục</Label>
        <Select
          id="category"
          value={search.category ?? ""}
          onChange={(e) => update({ category: e.target.value || undefined })}
        >
          <option value="">Tất cả</option>
          {data.categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="brand">Thương hiệu</Label>
        <Select
          id="brand"
          value={search.brand ?? ""}
          onChange={(e) => update({ brand: e.target.value || undefined })}
        >
          <option value="">Tất cả</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="shape">Dáng gọng</Label>
        <Select
          id="shape"
          value={search.shape ?? ""}
          onChange={(e) => update({ shape: e.target.value || undefined })}
        >
          <option value="">Tất cả</option>
          {shapes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="material">Chất liệu</Label>
        <Select
          id="material"
          value={search.material ?? ""}
          onChange={(e) => update({ material: e.target.value || undefined })}
        >
          <option value="">Tất cả</option>
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="gender">Đối tượng</Label>
        <Select
          id="gender"
          value={search.gender ?? ""}
          onChange={(e) => update({ gender: e.target.value || undefined })}
        >
          <option value="">Tất cả</option>
          <option value="unisex">Unisex</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="kids">Trẻ em</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="max">Giá tối đa (đ)</Label>
        <Input
          id="max"
          type="number"
          min={0}
          step={100000}
          value={search.max ?? ""}
          onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Ví dụ: 2000000"
        />
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate({ search: {} as Search })}
      >
        Xoá bộ lọc
      </Button>
    </div>
  );

  return (
    <div>
      <PageHero
        index="02"
        eyebrow="Bộ sưu tập"
        title="Sản phẩm"
        crumbs={[{ label: "Sản phẩm" }]}
        lead={`${sorted.length} thiết kế gọng & tròng kính được tuyển chọn${search.q ? ` cho “${search.q}”` : ""}. Lọc theo dáng gọng, chất liệu và nhu cầu sử dụng.`}
      />

      <div className="container-vin section-vin">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-40 lg:block lg:self-start">
            {filterPanel}
          </aside>

          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="sm" className="shrink-0 lg:hidden">
                      <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                      Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ""}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">{filterPanel}</div>
                  </SheetContent>
                </Sheet>
                <p className="min-w-0 truncate text-sm text-muted-foreground">
                  Hiển thị {visible.length}/{sorted.length}
                </p>
              </div>
              <Select
                aria-label="Sắp xếp"
                className="w-auto"
                value={search.sort ?? "newest"}
                onChange={(e) => update({ sort: e.target.value })}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao</option>
              </Select>
            </div>

            {visible.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
                <p className="font-semibold">Không tìm thấy sản phẩm phù hợp</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thử xoá một vài bộ lọc hoặc tìm với từ khoá khác.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {visible.length < sorted.length && (
              <div className="mt-8 text-center">
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
