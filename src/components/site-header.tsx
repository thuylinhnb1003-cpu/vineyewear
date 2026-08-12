import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/vin-field";
import { MegaMenu, MegaMenuMobile } from "@/components/mega-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useSession } from "@/hooks/use-session";
import { COMPANY_LEGAL } from "@/lib/trust-data";

const NAV = [
  { to: "/", label: "Trang chủ" },
  { to: "/thu-ar", label: "Thử kính AR" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/su-kien", label: "Sự kiện" },
  { to: "/lien-he", label: "Liên hệ" },
  { to: "/chinh-sach", label: "Chính sách & FAQ" },
] as const;

const navLinkClass =
  "relative px-3 py-2 text-2xs font-semibold uppercase tracking-[0.18em] text-foreground/65 transition-colors duration-200 hover:bg-secondary hover:text-primary [&.active]:bg-primary [&.active]:text-primary-foreground [&.active]:shadow-sm after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 [&.active]:after:scale-x-0";

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    // Ngưỡng lệch nhau (32 khi bật / 12 khi tắt) để tránh lật trạng thái liên tục
    // ("giật") lúc con lăn dao động quanh đúng một mốc duy nhất.
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => (prev ? y > 12 : y > 32));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/san-pham", search: { q: keyword || undefined } });
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-border bg-background/92 text-foreground backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_16px_rgb(26_18_20/0.08)]" : ""
      }`}
    >
      <div
        className={`overflow-hidden bg-ink text-on-ink/85 transition-[max-height,padding,opacity] duration-300 ease-[var(--ease-out-soft)] ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-16 py-2 opacity-100"
        }`}
      >
        <p className="container-vin text-center text-2xs font-semibold uppercase leading-relaxed tracking-[0.18em] sm:tracking-[0.22em]">
          Đo khúc xạ miễn phí tại 2 cơ sở Hà Nội ·{" "}
          <a
            href={COMPANY_LEGAL.hotlineHref}
            className="whitespace-nowrap underline decoration-primary-light/60 underline-offset-2 transition-colors hover:text-primary-light"
          >
            Hotline {COMPANY_LEGAL.hotline}
          </a>
        </p>
      </div>

      {/* Hàng chính — bất đối xứng: tìm kiếm bên trái, wordmark lệch giữa, tác vụ bên phải */}
      <div
        className={`container-vin grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-[padding] duration-300 ease-[var(--ease-out-soft)] sm:gap-6 lg:grid-cols-[1fr_auto_1fr] ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <form onSubmit={onSearch} role="search" className="hidden max-w-[260px] lg:block">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm gọng, tròng kính..."
              className="h-9 rounded-none border-0 border-b border-border bg-transparent pl-6 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0"
              aria-label="Tìm kiếm sản phẩm"
            />
          </div>
        </form>

        <Link to="/" aria-label="Vin Eyewear — về trang chủ" className="min-w-0 lg:text-center">
          <span
            className={`block truncate font-display font-semibold leading-none tracking-[0.02em] text-ink transition-[font-size] duration-300 ${
              scrolled ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
            }`}
          >
            Vin <span className="italic text-primary">Eyewear</span>
          </span>
          <span className="mt-1.5 block text-2xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
            Hanoi · Since 2014
          </span>
        </Link>

        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <Button asChild variant="ghost" size="icon" className="tap-target">
            <Link to={user ? "/tai-khoan" : "/auth"}>
              <User className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">{user ? "Tài khoản của tôi" : "Đăng nhập"}</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="tap-target relative">
            <Link to="/gio-hang">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              {count > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-2xs font-bold text-primary-foreground"
                >
                  {count}
                </span>
              )}
              <span className="sr-only">Giỏ hàng, {count} sản phẩm</span>
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="tap-target lg:hidden">
                <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                <span className="sr-only">Mở menu điều hướng</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[88vw] max-w-sm flex-col gap-0 overflow-y-auto bg-background"
            >
              <SheetHeader>
                <SheetTitle className="text-left font-display text-2xl">
                  Vin <span className="italic text-primary">Eyewear</span>
                </SheetTitle>
              </SheetHeader>

              <form onSubmit={onSearch} role="search" className="mt-4">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="h-11 rounded-none"
                  aria-label="Tìm kiếm sản phẩm"
                />
              </form>

              <nav aria-label="Điều hướng chính" className="mt-5 flex flex-col">
                <MegaMenuMobile onNavigate={() => setOpen(false)} />
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    {...(item.to === "/" ? { activeOptions: { exact: true } } : {})}
                    activeProps={{ "aria-current": "page" }}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center border-b border-border px-3 text-2xs font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:bg-secondary hover:text-primary [&.active]:bg-primary [&.active]:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="sticky bottom-0 mt-auto border-t border-border bg-background pb-2 pt-4">
                <Button asChild className="h-12 w-full rounded-none">
                  <Link to="/dat-lich" onClick={() => setOpen(false)}>
                    Đặt Lịch Đo Mắt
                  </Link>
                </Button>
                <a
                  href={COMPANY_LEGAL.hotlineHref}
                  className="mt-2 flex h-11 items-center justify-center border border-border text-2xs font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:border-primary hover:text-primary"
                >
                  Gọi {COMPANY_LEGAL.hotline}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <nav aria-label="Điều hướng chính" className="hidden border-t border-border lg:block">
        <div className="container-vin flex w-full items-center justify-center gap-2 py-2">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ "aria-current": "page" }}
            className={navLinkClass}
          >
            Trang chủ
          </Link>
          <MegaMenu />
          {NAV.filter((item) => item.to !== "/").map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ "aria-current": "page" }}
              className={navLinkClass}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
