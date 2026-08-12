import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { COMPANY_LEGAL, QUICK_CHANNELS } from "@/lib/trust-data";

const CATEGORIES = ["Gọng kính", "Kính mát", "Tròng kính", "Kính áp tròng"];

const SUPPORT = [
  { label: "Chính sách bán hàng", to: "/chinh-sach" },
  { label: "Đổi trả & bảo hành", to: "/chinh-sach" },
  { label: "Đặt lịch đo mắt", to: "/dat-lich" },
  { label: "Liên hệ", to: "/lien-he" },
] as const;

const SOCIALS = [
  { icon: Facebook, label: "Facebook Vin Eyewear", href: "https://facebook.com/vineyewear" },
  { icon: Instagram, label: "Instagram Vin Eyewear", href: "https://instagram.com/vineyewear" },
  { icon: Youtube, label: "YouTube Vin Eyewear", href: "https://youtube.com/@vineyewear" },
  { icon: Mail, label: "Messenger Vin Eyewear", href: QUICK_CHANNELS.messenger },
] as const;

const headingClass = "text-2xs font-bold uppercase tracking-[0.22em] text-primary-light";
const linkClass =
  "inline-block py-0.5 transition-colors hover:text-primary-light focus-visible:text-primary-light";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-ink">
      <div className="container-vin grid gap-10 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <p className="font-display text-3xl font-semibold leading-tight md:text-4xl">
            Vin <span className="italic text-primary-light">Eyewear</span>
          </p>
          <p className="mt-2 text-2xs font-semibold uppercase tracking-[0.3em] text-on-ink/55">
            Hanoi
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-ink/70">
            Gọng kính, tròng kính và kính áp tròng chính hãng, đo khúc xạ chuẩn xác bởi kỹ thuật
            viên nhiều năm kinh nghiệm.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-on-ink/25 text-on-ink/80 transition-colors hover:border-primary-light hover:text-primary-light"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h4 className={headingClass}>Cơ sở</h4>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-on-ink/70">
            {COMPANY_LEGAL.stores.map((store) => (
              <li key={store} className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
                <span className="min-w-0">{store.replace(/^Cơ sở \d+: /, "")}</span>
              </li>
            ))}
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
              <a href={COMPANY_LEGAL.hotlineHref} className={linkClass}>
                {COMPANY_LEGAL.hotline}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
              <a href={`mailto:${COMPANY_LEGAL.email}`} className={`${linkClass} break-all`}>
                {COMPANY_LEGAL.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className={headingClass}>Danh mục</h4>
          <ul className="mt-4 space-y-1.5 text-sm text-on-ink/70">
            {CATEGORIES.map((label) => (
              <li key={label}>
                <Link to="/san-pham" className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className={headingClass}>Hỗ trợ</h4>
          <ul className="mt-4 space-y-1.5 text-sm text-on-ink/70">
            {SUPPORT.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-on-ink/12">
        <div className="container-vin grid gap-4 py-8 text-xs leading-relaxed text-on-ink/60 md:grid-cols-2 md:gap-10">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold text-on-ink">{COMPANY_LEGAL.name}</p>
            <p>{COMPANY_LEGAL.license}</p>
            <p>Mã số thuế: {COMPANY_LEGAL.taxCode}</p>
          </div>
          <div className="min-w-0 space-y-1 md:text-right">
            {COMPANY_LEGAL.stores.map((store) => (
              <p key={store}>{store}</p>
            ))}
            <p>
              Hotline:{" "}
              <a href={COMPANY_LEGAL.hotlineHref} className="text-primary-light hover:underline">
                {COMPANY_LEGAL.hotline}
              </a>{" "}
              · Email CSKH:{" "}
              <a
                href={`mailto:${COMPANY_LEGAL.email}`}
                className="text-primary-light hover:underline"
              >
                {COMPANY_LEGAL.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-on-ink/12">
        <div className="container-vin flex flex-col items-center justify-between gap-2 py-5 text-xs text-on-ink/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Vin Eyewear. Bản quyền thuộc {COMPANY_LEGAL.name}.
          </p>
          <nav aria-label="Liên kết pháp lý" className="flex items-center gap-4">
            <Link to="/chinh-sach" className="transition-colors hover:text-primary-light">
              Bảo mật
            </Link>
            <Link to="/chinh-sach" className="transition-colors hover:text-primary-light">
              Điều khoản
            </Link>
            <Link to="/lien-he" className="transition-colors hover:text-primary-light">
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
