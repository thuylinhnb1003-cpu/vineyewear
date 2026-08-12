import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CountdownBanner } from "@/components/home/countdown-banner";
import heroImage from "@/assets/hero-eyewear.jpg";
import storeImage from "@/assets/store-interior.jpg";

const SLIDES = [
  {
    image: heroImage,
    eyebrow: "Bộ sưu tập 2026",
    title: "Nhìn rõ hơn,",
    accent: "tự tin hơn.",
    desc: "Gọng titanium & acetate chính hãng, đo khúc xạ miễn phí cùng chuyên viên trước khi bạn chốt đơn.",
    primary: { label: "Khám Phá Bộ Sưu Tập", to: "/san-pham" as const },
  },
  {
    image: storeImage,
    eyebrow: "Ưu đãi tháng này",
    title: "Giảm đến 30%",
    accent: "khi cắt kèm tròng.",
    desc: "Áp dụng cho tròng chống ánh sáng xanh, đổi màu Photochromic và chiết suất cao 1.67 – 1.74.",
    primary: { label: "Xem Ưu Đãi", to: "/su-kien" as const },
  },
  {
    image: heroImage,
    eyebrow: "Hàng mới về",
    title: "Kính mát 2026",
    accent: "UV400 phân cực.",
    desc: "Bộ sưu tập Aviator, Wayfarer và Cat-eye mới nhất từ các thương hiệu toàn cầu.",
    primary: { label: "Mua Kính Mắt", to: "/san-pham" as const },
  },
];

export function HeroCarousel() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[index]!;

  return (
    <section className="border-b border-border bg-background">
      <div className="grid lg:grid-cols-[45fr_55fr]">
        {/* Cột nội dung */}
        <div className="order-2 flex flex-col justify-center gap-12 px-[clamp(20px,5vw,72px)] py-[clamp(40px,6vw,88px)] lg:order-1">
          <div key={index} className="reveal-up">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-primary" />
              <p className="micro-label">{slide.eyebrow}</p>
            </div>
            <h1 className="mt-7 max-w-xl text-ink">
              {slide.title}
              <br />
              <span className="italic text-primary">{slide.accent}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-[1.8] text-muted-foreground">
              {slide.desc}
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-auto min-h-12 rounded-none whitespace-normal px-6 py-3 text-center leading-snug"
                >
                  <Link to={slide.primary.to}>{slide.primary.label}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-12 rounded-none whitespace-normal px-6 py-3 text-center leading-snug"
                >
                  <Link to="/dat-lich">Đặt Lịch Đo Mắt Miễn Phí</Link>
                </Button>
              </div>

              <Link
                to="/thu-ar"
                className="link-underline self-start text-sm font-semibold text-ink"
              >
                Hoặc thử kính ảo bằng camera (AR) →
              </Link>
              <p className="text-2xs uppercase tracking-[0.16em] text-muted-foreground">
                Đo khúc xạ miễn phí · Đổi trả 7 ngày · Bảo hành 24 tháng
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="max-w-md border-t border-border pt-6">
              <CountdownBanner />
            </div>

            <div className="flex items-center gap-5 border-t border-border pt-6">
              <span className="editorial-index">
                {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Banner trước"
                  onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
                  className="grid h-9 w-9 place-items-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Banner sau"
                  onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
                  className="grid h-9 w-9 place-items-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-1 gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.eyebrow}
                    type="button"
                    aria-label={`Banner ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-px flex-1 transition-colors duration-300",
                      i === index ? "bg-primary" : "bg-border",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cột ảnh */}
        <div className="relative order-1 isolate min-h-[46vh] overflow-hidden bg-ink lg:order-2 lg:min-h-[640px]">
          {SLIDES.map((s, i) => (
            <img
              key={i}
              src={s.image}
              alt={s.eyebrow}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out-soft)]",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <span className="absolute bottom-0 left-0 hidden bg-background px-6 py-4 font-display text-sm italic text-ink lg:block">
            Đo khúc xạ chuẩn phòng khám · Hà Nội
          </span>
        </div>
      </div>
    </section>
  );
}
