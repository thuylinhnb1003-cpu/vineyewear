import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import { getEvents } from "@/lib/shop.functions";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/page-hero";


const eventsQuery = queryOptions({ queryKey: ["events"], queryFn: () => getEvents() });

const FILTERS = ["Tất cả", "TIN ƯU ĐÃI", "SỰ KIỆN", "SẢN PHẨM MỚI", "TRIỂN LÃM"] as const;
const FALLBACKS = [
  "/images/product-1.jpg",
  "/images/product-2.jpg",
  "/images/product-3.jpg",
  "/images/product-4.jpg",
  "/images/product-5.jpg",
  "/images/product-6.jpg",
];

export const Route = createFileRoute("/su-kien/")({
  head: () => ({
    meta: [
      { title: "Sự kiện & Tin tức — Vin Eyewear" },
      {
        name: "description",
        content:
          "Journal của Vin Eyewear: tin ưu đãi, sự kiện trải nghiệm, triển lãm và các bộ sưu tập kính mới nhất.",
      },
      { property: "og:title", content: "Sự kiện & Tin tức — Vin Eyewear" },
      {
        property: "og:description",
        content: "Những câu chuyện độc bản và cột mốc đáng nhớ trong hành trình của Vin Eyewear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(eventsQuery);
  },
  component: Events,
});

function Events() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const [active, setActive] = React.useState<string>("Tất cả");
  const [drawer, setDrawer] = React.useState(false);

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { "Tất cả": events.length };
    for (const f of FILTERS.slice(1)) {
      map[f] = events.filter((e) => (e.category ?? "SỰ KIỆN") === f).length;
    }
    return map;
  }, [events]);

  const list = React.useMemo(
    () =>
      active === "Tất cả"
        ? events
        : events.filter((e) => (e.category ?? "SỰ KIỆN") === active),
    [events, active],
  );

  function pick(f: string) {
    setActive(f);
    setDrawer(false);
  }

  const filterList = (
    <ul className="space-y-1">
      {FILTERS.map((f) => (
        <li key={f}>
          <button
            type="button"
            onClick={() => pick(f)}
            aria-pressed={active === f}
            className={cn(
              "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm font-medium uppercase tracking-[0.06em] transition-colors",
              active === f
                ? "bg-ink text-on-ink"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <span>{f}</span>
            <span className="text-2xs tabular-nums opacity-70">{counts[f] ?? 0}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <PageHero
        index="05"
        eyebrow="Journal"
        title="Sự kiện & Tin tức"
        crumbs={[{ label: "Tin tức & Sự kiện" }]}
        lead="Khám phá những câu chuyện độc bản và các cột mốc đáng nhớ trong hành trình của Vin Eyewear."
      />


      <div className="container-vin section-vin">
        {/* Mobile filter trigger */}
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:hidden">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            {list.length} bài viết · <span className="text-foreground">{active}</span>
          </p>
          <Button variant="secondary" size="sm" onClick={() => setDrawer(true)} className="shrink-0">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Bộ lọc
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em]">
                  Bộ lọc
                </h2>
              </div>
              <div className="mt-4">{filterList}</div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((event, i) => (
                <article key={event.id} className="group flex flex-col">
                  <Link
                    to="/su-kien/$slug"
                    params={{ slug: event.slug }}
                    className="relative block overflow-hidden rounded-sm bg-secondary"
                  >
                    <img
                      src={event.cover_image ?? FALLBACKS[i % FALLBACKS.length]}
                      alt={event.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-sm bg-card/95 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-primary">
                      {event.category ?? "SỰ KIỆN"}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col pt-5">
                    <p className="text-2xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      {formatDate(event.starts_at)}
                      {event.ends_at ? ` - ${formatDate(event.ends_at)}` : ""}
                    </p>
                    <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] font-display text-xl leading-snug">
                      <Link
                        to="/su-kien/$slug"
                        params={{ slug: event.slug }}
                        className="transition-colors hover:text-primary hover:underline hover:decoration-1 hover:underline-offset-4"
                      >
                        {event.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 min-h-[4rem] text-sm leading-relaxed text-muted-foreground">
                      {event.excerpt}
                    </p>

                    <Link
                      to="/su-kien/$slug"
                      params={{ slug: event.slug }}
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold uppercase tracking-[0.1em] text-primary"
                    >
                      Đọc tiếp
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {list.length === 0 && (
              <p className="rounded-sm border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Chưa có bài viết trong danh mục này.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-card p-5 shadow-[var(--shadow-pop)]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-3">
              <h2 className="min-w-0 truncate font-sans text-sm font-semibold uppercase tracking-[0.08em]">
                Bộ lọc
              </h2>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Đóng"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">{filterList}</div>
          </div>
        </div>
      )}
    </div>
  );
}
