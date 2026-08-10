import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Eye, HeartHandshake } from "lucide-react";
import storeImage from "@/assets/store-interior.jpg";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Giới thiệu Vin Eyewear — Chuyên gia kính cận" },
      {
        name: "description",
        content:
          "Câu chuyện thương hiệu, quy trình đo khúc xạ 5 bước và cam kết chất lượng của Vin Eyewear.",
      },
      { property: "og:title", content: "Giới thiệu Vin Eyewear" },
      { property: "og:description", content: "Chuyên gia kính cận với hai cơ sở tại Hà Nội." },
    ],
  }),
  component: About,
});

const STEPS: [string, string][] = [
  ["Tiếp nhận", "Ghi nhận nhu cầu và tiền sử thị lực của khách."],
  ["Đo khúc xạ", "Đo tự động kết hợp thử kính chủ quan để xác định độ chính xác."],
  ["Thử tròng", "Khách trải nghiệm tròng kính phù hợp trong 10-15 phút."],
  ["Tư vấn gọng", "Chọn dáng gọng theo khuôn mặt, chất liệu và ngân sách."],
  ["Lắp & hiệu chỉnh", "Lắp tròng, cân chỉnh gọng và hướng dẫn bảo quản."],
];

const STATS: [string, string][] = [
  ["2014", "Năm thành lập"],
  ["02", "Cơ sở tại Hà Nội"],
  ["50k+", "Lượt đo khúc xạ"],
  ["4.9/5", "Đánh giá khách hàng"],
];

const VALUES: [typeof Eye, string, string][] = [
  [Eye, "Đo mắt chuẩn xác", "Thiết bị hiện đại và kỹ thuật viên nhiều năm kinh nghiệm."],
  [Award, "Sản phẩm chính hãng", "Gọng và tròng kính nhập khẩu, có tem bảo hành đầy đủ."],
  [HeartHandshake, "Hậu mãi trọn đời", "Cân chỉnh, vệ sinh và siết ốc miễn phí không giới hạn."],
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Về chúng tôi"
        index="01"
        title="Nhìn rõ hơn, sống đẹp hơn"
        lead="Vin Eyewear ra đời với mong muốn giúp mọi người tiếp cận dịch vụ chăm sóc thị lực chuẩn xác và sản phẩm kính mắt chính hãng ở mức giá minh bạch."
        crumbs={[{ label: "Giới thiệu" }]}
      />

      <section className="container-vin section-vin" aria-labelledby="story-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal className="min-w-0">
            <p className="micro-label">Câu chuyện</p>
            <h2 id="story-title" className="head-title display-section">
              Một cửa hàng kính vận hành như một phòng khám
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                Chúng tôi kết hợp thiết bị đo khúc xạ hiện đại với đội ngũ kỹ thuật viên được đào
                tạo bài bản, đồng thời tuyển chọn gọng kính và tròng kính từ các thương hiệu uy tín.
              </p>
              <p>
                Mỗi khách hàng đều được đo khúc xạ miễn phí, tư vấn dáng gọng theo khuôn mặt và bàn
                giao kính sau khi cân chỉnh hoàn chỉnh.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
              {STATS.map(([value, label]) => (
                <div key={label} className="rule-hair pt-4">
                  <dt className="font-display text-3xl leading-none text-primary tabular-nums">
                    {value}
                  </dt>
                  <dd className="mt-2 text-2xs uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="min-w-0 lg:mt-12">
            <figure>
              <img
                src={storeImage}
                alt="Không gian trưng bày gọng kính tại showroom Vin Eyewear"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-2xs uppercase tracking-[0.16em] text-muted-foreground">
                Showroom Tây Hồ — Hà Nội
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50" aria-labelledby="values-title">
        <div className="container-vin py-16 md:py-20">
          <p className="micro-label">02 — Cam kết</p>
          <h2 id="values-title" className="head-title max-w-2xl display-section">
            Ba điều chúng tôi không thoả hiệp
          </h2>
          <ul className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
            {VALUES.map(([Icon, title, desc], i) => (
              <li key={title} className="bg-background p-6 md:p-8">
                <span className="editorial-index">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="mt-5 h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl">{title}</h3>
                <p className="mt-2 lead-sm">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-vin section-vin" aria-labelledby="process-title">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="micro-label">03 — Quy trình</p>
            <h2 id="process-title" className="head-title display-section">
              Đo mắt 5 bước
            </h2>
            <p className="head-lead max-w-sm lead-sm">
              Toàn bộ quy trình diễn ra trong 25–40 phút, hoàn toàn miễn phí kể cả khi bạn chưa mua
              kính.
            </p>
            <Button asChild className="mt-8">
              <Link to="/dat-lich">Đặt lịch đo mắt</Link>
            </Button>
          </div>

          <ol className="min-w-0">
            {STEPS.map(([title, desc], i) => (
              <Reveal
                key={title}
                as="li"
                delay={i * 60}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-border py-6 last:border-b"
              >
                <span className="font-display text-2xl leading-none text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl">{title}</h3>
                  <p className="mt-1 lead-sm">{desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
