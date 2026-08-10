import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LENS_TECH } from "@/lib/trust-data";

export function LensPartners() {
  return (
    <section className="section-vin bg-background">
      <div className="container-vin">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Đối tác tròng kính chính hãng</p>
            <h2 className="head-title max-w-xl display-section">Công nghệ tròng kính cao cấp tại Vin Eyewear</h2>
          </div>
          <Button asChild variant="secondary">
            <Link to="/san-pham" search={{ category: "trong-kinh" }}>
              Xem tròng kính
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LENS_TECH.map((lens, i) => (
            <motion.article
              key={`${lens.brand}-${lens.name}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-lg border border-border bg-card p-7"
            >
              <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {lens.brand}
              </span>
              <h3 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">
                {lens.name}
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
              </h3>
              <p className="mt-3 lead-sm">{lens.tagline}</p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5">
                {lens.specs.map((spec) => (
                  <li key={spec} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{spec}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
