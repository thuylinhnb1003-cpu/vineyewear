import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrustBar } from "@/components/home/trust-bar";
import { FaceShapeGuide } from "@/components/home/face-shape-guide";
import { LensSpotlight } from "@/components/home/lens-spotlight";
import { AuthoritySection } from "@/components/home/authority-section";
import { GoogleReviews } from "@/components/home/google-reviews";
import { PressSection } from "@/components/home/press-section";
import { LensPartners } from "@/components/home/lens-partners";
import { getCatalog, getEvents } from "@/lib/shop.functions";
import { formatDate } from "@/lib/format";
import storeImage from "@/assets/store-interior.jpg";


const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => {
    const [catalog, events] = await Promise.all([getCatalog(), getEvents()]);
    return { ...catalog, events };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vin Eyewear — Kính mắt chính hãng & đo khúc xạ tại Hà Nội" },
      {
        name: "description",
        content:
          "Mua gọng kính, kính mát, tròng kính chính hãng và đặt lịch đo khúc xạ miễn phí tại Vin Eyewear.",
      },
      { property: "og:title", content: "Vin Eyewear — Kính mắt chính hãng & đo khúc xạ tại Hà Nội" },
      {
        property: "og:description",
        content: "Mua gọng kính, kính mát, tròng kính chính hãng và đặt lịch đo khúc xạ miễn phí tại Vin Eyewear.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(homeQuery);
  },
  component: Home,
});


const PROCESS = [
  { step: "01", title: "Tiếp nhận & khai thác", desc: "Ghi nhận tiền sử thị lực và nhu cầu sử dụng." },
  { step: "02", title: "Đo khúc xạ", desc: "Máy đo tự động kết hợp thử kính chủ quan." },
  { step: "03", title: "Thử tròng & tư vấn gọng", desc: "Chọn chất liệu tròng và dáng gọng phù hợp." },
  { step: "04", title: "Lắp kính & hiệu chỉnh", desc: "Cân chỉnh trục, tâm mắt và lưu hồ sơ khúc xạ." },
];

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const featured = data.products.filter((p) => p.is_featured).slice(0, 4);
  const newest = data.products.slice(0, 8);
  const upcoming = data.events.slice(0, 3);

  return (
    <>
      <HeroCarousel />
      <TrustBar />

      {/* Danh mục */}
      <section className="section-vin bg-background" aria-labelledby="home-categories">
        <div className="container-vin">
          <Reveal className="grid gap-8 lg:grid-cols-[38fr_62fr]">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-primary" aria-hidden="true" />
                <p className="micro-label">Danh mục</p>
              </div>
              <h2 id="home-categories" className="head-title display-section">
                Chọn đúng loại kính cho <span className="italic text-primary">nhu cầu</span> của bạn
              </h2>
            </div>
            <p className="max-w-md self-end text-base leading-[1.8] text-muted-foreground lg:justify-self-end">
              Bốn nhóm sản phẩm chính, mỗi nhóm được chuyên viên khúc xạ chọn lọc theo chất liệu,
              dáng gọng và công nghệ tròng phù hợp.
            </p>
          </Reveal>
          <ul className="mt-14 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.categories.map((category, i) => (
              <Reveal as="li" key={category.id} delay={i * 80} className="lg:even:translate-y-8">
                <Link
                  to="/san-pham"
                  search={{ category: category.slug }}
                  className="group flex h-full flex-col border-t border-ink/80 bg-transparent pt-6 transition-colors duration-300 ease-out hover:border-primary"
                >
                  <h3 className="font-display text-3xl font-semibold leading-tight">
                    {category.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <span className="mt-6 text-sm font-semibold text-primary underline decoration-transparent underline-offset-[3px] transition-colors group-hover:decoration-current">
                    Khám phá <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FaceShapeGuide />

      {/* Best-seller */}
      {featured.length > 0 && (
        <section className="section-vin bg-background" aria-labelledby="home-bestseller">
          <div className="container-vin">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-primary" aria-hidden="true" />
                  <p className="micro-label">Bán chạy nhất</p>
                </div>
                <h2 id="home-bestseller" className="head-title display-section">
                  Gọng kính <span className="italic text-primary">best-seller</span>
                </h2>
              </div>
              <Link
                to="/san-pham"
                className="link-underline text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Xem tất cả gọng kính
              </Link>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={i * 70} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <LensSpotlight />

      {/* Dịch vụ đo khám */}
      <section className="section-vin bg-background" aria-labelledby="home-process">
        <div className="container-vin grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="overflow-hidden bg-secondary lg:-mt-16">
            <img
              src={storeImage}
              alt="Không gian đo khúc xạ tại cửa hàng Vin Eyewear"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              <p className="micro-label">Dịch vụ đo khám thị lực</p>
            </div>
            <h2 id="home-process" className="head-title display-section">
              Quy trình 4 bước, <span className="italic text-primary">chuẩn phòng khúc xạ</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Kết quả đo được lưu trong hồ sơ khúc xạ cá nhân để bạn theo dõi độ mắt theo thời gian
              và đặt lại tròng kính chỉ trong vài phút.
            </p>
            <ol className="mt-10 space-y-7">
              {PROCESS.map((item) => (
                <li key={item.step} className="flex gap-5 border-t border-border pt-6">
                  <span className="font-display text-3xl font-semibold italic text-primary">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold">{item.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild size="lg" className="mt-10 rounded-none">
              <Link to="/dat-lich">Đặt Lịch Đo Mắt Miễn Phí</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Kính mát & thời trang */}
      <section className="section-vin bg-secondary" aria-labelledby="home-sunglasses">
        <div className="container-vin">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-primary" aria-hidden="true" />
                <p className="micro-label">Sunglasses &amp; Fashion</p>
              </div>
              <h2 id="home-sunglasses" className="head-title display-section">
                Kính mát &amp; bộ sưu tập <span className="italic text-primary">thời trang</span>
              </h2>
            </div>
            <Link
              to="/san-pham"
              className="link-underline text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Xem tất cả kính mát
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 70} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LensPartners />
      <GoogleReviews />
      <PressSection />
      <AuthoritySection />

      {/* Sự kiện */}
      {upcoming.length > 0 && (
        <section className="section-vin bg-background" aria-labelledby="home-events">
          <div className="container-vin">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-primary" aria-hidden="true" />
                  <p className="micro-label">Sự kiện & khuyến mãi</p>
                </div>
                <h2 id="home-events" className="head-title display-section">
                  Sắp <span className="italic text-primary">diễn ra</span>
                </h2>
              </div>
              <Link
                to="/su-kien"
                className="link-underline text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Tất cả sự kiện
              </Link>
            </Reveal>
            <ul className="mt-12 grid list-none gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {upcoming.map((event, i) => (
                <Reveal as="li" key={event.id} delay={i * 90} className="flex">
                  <Link
                    to="/su-kien/$slug"
                    params={{ slug: event.slug }}
                    className="group flex h-full w-full flex-col border-t border-ink/80 bg-transparent pt-5 transition-colors duration-300 ease-out hover:border-primary"
                  >
                    <div className="overflow-hidden bg-secondary">
                      <img
                        src={event.cover_image ?? "/images/product-2.jpg"}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[3/2] w-full object-cover transition-transform duration-[350ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col pt-5">
                      <p className="micro-label">{formatDate(event.starts_at)}</p>
                      <h3 className="mt-2 line-clamp-2 min-h-[3.25rem] font-display text-xl font-semibold">
                        {event.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm text-muted-foreground">
                        {event.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>

          </div>
        </section>
      )}

      {/* CTA tối */}
      <section className="bg-ink py-20" aria-labelledby="home-cta">
        <div className="container-vin flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 id="home-cta" className="text-on-ink">
              Đến thử kính, ra về với đôi mắt được chăm đúng cách
            </h2>
            <p className="mt-4 text-on-ink/70">
              Hai cơ sở tại Hà Nội, mở cửa 9:00 – 21:00 mỗi ngày. Đo khúc xạ miễn phí, không cần đặt
              cọc.
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-4 sm:w-auto">
            <Button asChild size="lg" variant="onDark" className="flex-1 rounded-none sm:flex-none">
              <Link to="/dat-lich">Đặt Lịch Ngay</Link>
            </Button>
            <Button asChild size="lg" variant="onDark" className="flex-1 rounded-none sm:flex-none">
              <Link to="/lien-he">Xem Cơ Sở</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

