import { Eye, ShieldCheck, Sparkles, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Miễn phí đơn từ 1.000.000đ" },
  { icon: Eye, title: "Đo khám mắt miễn phí", desc: "Máy đo khúc xạ tự động" },
  { icon: ShieldCheck, title: "Bảo hành 24 tháng", desc: "Chính hãng, đổi trả 7 ngày" },
  { icon: Sparkles, title: "Vệ sinh & nắn chỉnh trọn đời", desc: "Miễn phí tại cả 2 cơ sở" },
];

export function TrustBar() {
  return (
    <section aria-label="Cam kết dịch vụ" className="border-b border-border bg-secondary">
      <ul className="container-vin grid list-none grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <li
            key={title}
            className="flex min-w-0 items-start gap-3 px-0 py-6 lg:min-h-[92px] lg:px-7 lg:first:pl-0"
          >
            <Icon
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              strokeWidth={1.5}
            />
            <div className="min-w-0">
              <p className="text-2xs font-bold uppercase leading-snug tracking-[0.14em] text-ink">
                {title}
              </p>
              <p className="mt-1.5 text-2xs leading-snug text-muted-foreground">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
