import { motion } from "framer-motion";
import { Newspaper, Quote } from "lucide-react";
import { PRESS_MENTIONS } from "@/lib/trust-data";

export function PressSection() {
  return (
    <section className="section-vin bg-secondary">
      <div className="container-vin">
        <p className="eyebrow">Truyền thông</p>
        <h2 className="head-title max-w-xl display-section">Báo chí nói về Vin Eyewear</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRESS_MENTIONS.map((item, i) => (
            <motion.a
              key={item.outlet}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-lg border border-border bg-card p-7 transition-colors hover:border-primary"
            >
              <span className="flex items-center gap-2 text-primary">
                <Newspaper className="h-4 w-4" />
                <span className="font-display text-2xl font-semibold">{item.outlet}</span>
              </span>
              <span className="mt-1 text-2xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {item.topic}
              </span>
              <Quote className="mt-6 h-5 w-5 text-primary/50" />
              <p className="mt-3 lead-sm">“{item.quote}”</p>
              <span className="mt-6 text-sm font-semibold text-primary underline underline-offset-[3px]">
                Đọc bài viết →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
