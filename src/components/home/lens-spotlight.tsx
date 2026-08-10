import { Link } from "@tanstack/react-router";
import { Glasses, ScanEye, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { LENS_PACKAGES } from "@/lib/taxonomy";

const TECH = [
  {
    icon: Zap,
    title: "Chống ánh sáng xanh",
    desc: "Giảm mỏi mắt khi dùng máy tính, điện thoại trên 6 giờ mỗi ngày.",
  },
  {
    icon: Sun,
    title: "Đổi màu Photochromic",
    desc: "Tự động sẫm màu ngoài trời, trở lại trong suốt khi vào bóng râm.",
  },
  {
    icon: ScanEye,
    title: "Chiết suất cao 1.61 – 1.74",
    desc: "Mỏng và nhẹ hơn tới 40%, hạn chế méo hình cho độ cao.",
  },
  {
    icon: Glasses,
    title: "Đa tròng Progressive",
    desc: "Nhìn xa – trung – gần liền mạch, không đường phân cách.",
  },
];

export function LensSpotlight() {
  return (
    <section className="section-vin bg-secondary">
      <div className="container-vin grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Công nghệ tròng kính</p>
          <h2 className="head-title display-section">Tròng kính chuyên biệt cho từng nhu cầu</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Chọn gọng bạn thích, chúng tôi cắt tròng theo đúng đơn kính của bạn ngay tại cửa hàng —
            đo khúc xạ miễn phí trước khi lắp.
          </p>
          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            {TECH.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <h4 className="text-base font-semibold">{title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <h3 className="font-display text-2xl font-semibold">Bảng giá gói tròng phổ biến</h3>
          <ul className="mt-6">
            {LENS_PACKAGES.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">
                  {formatVnd(item.price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/san-pham">Chọn Gọng & Cắt Tròng</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/dat-lich">Đo Khúc Xạ Miễn Phí</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
