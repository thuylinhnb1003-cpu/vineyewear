import * as React from "react";
import { Link } from "@tanstack/react-router";

type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  index,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  index?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/10 bg-ink text-on-ink">
      <div className="container-vin py-12 md:py-16 lg:py-20">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-2xs uppercase tracking-[0.18em] text-on-ink/50">
              <li>
                <Link to="/" className="transition-colors hover:text-on-ink">
                  Trang chủ
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {c.to ? (
                    <Link to={c.to as never} className="transition-colors hover:text-on-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-on-ink/80">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div className="min-w-0">
            {eyebrow && (
              <p className="micro-label !text-on-ink/60">
                {index ? `${index} — ` : ""}
                {eyebrow}
              </p>
            )}
            <h1 className="head-title max-w-[22ch] display-hero text-on-ink">{title}</h1>
          </div>
          {(lead || children) && (
            <div className="min-w-0 border-l-0 border-on-ink/15 pl-0 lg:border-l lg:pb-2 lg:pl-8">
              {lead && <p className="lead-vin !text-on-ink/65">{lead}</p>}
              {children && <div className="mt-5">{children}</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
