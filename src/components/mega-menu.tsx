import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  FRAME_STYLES,
  MATERIALS,
  LENS_FUNCTIONS,
  AUDIENCES,
  TOP_BRANDS,
  type MenuLink,
} from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; links: MenuLink[] }[] = [
  { title: "Theo dáng gọng", links: FRAME_STYLES },
  { title: "Theo chất liệu", links: MATERIALS },
  { title: "Theo tính năng tròng", links: LENS_FUNCTIONS },
  { title: "Theo đối tượng", links: AUDIENCES },
];

function LinkList({ links, onNavigate }: { links: MenuLink[]; onNavigate?: () => void }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to="/san-pham"
            search={link.search}
            onClick={onNavigate}
            className="block text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Mega menu desktop — hiện khi hover vào "Sản phẩm". */
export function MegaMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to="/san-pham"
        className={cn(
          "relative flex items-center gap-1 px-3 py-2 text-2xs font-semibold uppercase tracking-[0.18em] text-foreground/65 transition-colors duration-200 hover:bg-secondary hover:text-primary [&.active]:bg-primary [&.active]:text-primary-foreground [&.active]:shadow-sm after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 [&.active]:after:scale-x-0",
          open && "bg-secondary text-primary after:scale-x-100",
        )}
      >
        Sản phẩm
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </Link>

      <div
        className={cn(
          "fixed left-0 right-0 z-50 border-y border-border bg-background text-foreground shadow-[var(--shadow-pop)] transition-all duration-200 ease-[var(--ease-out-soft)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="container-vin grid gap-10 py-9 lg:grid-cols-5">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="micro-label">{group.title}</p>
              <LinkList links={group.links} onNavigate={() => setOpen(false)} />
            </div>
          ))}
          <div>
            <p className="micro-label">Thương hiệu nổi bật</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {TOP_BRANDS.map((brand) => (
                <li key={brand}>
                  <Link
                    to="/san-pham"
                    search={{ brand }}
                    onClick={() => setOpen(false)}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Danh mục đa chiều dạng accordion cho menu mobile. */
export function MegaMenuMobile({ onNavigate }: { onNavigate: () => void }) {
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);

  return (
    <div className="border-y border-border">
      {[
        ...GROUPS,
        {
          title: "Thương hiệu nổi bật",
          links: TOP_BRANDS.map((b) => ({ label: b, search: { brand: b } })),
        },
      ].map((group) => {
        const isOpen = openGroup === group.title;
        return (
          <div key={group.title} className="border-b border-border last:border-0">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.title)}
              className="flex w-full items-center justify-between py-3 text-2xs font-semibold uppercase tracking-[0.18em] text-foreground/75"
            >
              {group.title}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <ul className="pb-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to="/san-pham"
                      search={link.search}
                      onClick={onNavigate}
                      className="block py-1.5 pl-4 text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
