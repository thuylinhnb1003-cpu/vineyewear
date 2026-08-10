import * as React from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

function nextDeadline() {
  const now = new Date();
  const end = new Date(now);
  const daysToSunday = (7 - now.getDay()) % 7;
  end.setDate(now.getDate() + daysToSunday);
  end.setHours(23, 59, 59, 999);
  if (end.getTime() <= now.getTime()) end.setDate(end.getDate() + 7);
  return end;
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Ngày", value: Math.floor(s / 86400) },
    { label: "Giờ", value: Math.floor((s % 86400) / 3600) },
    { label: "Phút", value: Math.floor((s % 3600) / 60) },
    { label: "Giây", value: s % 60 },
  ];
}

export function CountdownBanner() {
  const [remaining, setRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    const target = nextDeadline().getTime();
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const cells = parts(remaining ?? 0);

  return (
    <div className="border-l-2 border-primary bg-transparent pl-5">
      <p className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-primary">
        <Timer className="h-4 w-4" />
        Ưu đãi tặng gọng 0đ khi mua tròng cao cấp
      </p>
      <div className="mt-3 flex items-center gap-2 sm:gap-3">
        {cells.map((cell, i) => (
          <React.Fragment key={cell.label}>
            {i > 0 && <span className="font-display text-2xl text-muted-foreground/60">:</span>}
            <motion.div
              className="min-w-[54px] border border-border bg-card px-2 py-2 text-center sm:min-w-[62px]"
              animate={cell.label === "Giây" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              key={`${cell.label}-${cell.value}`}
            >
              <span className="block font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {remaining === null ? "--" : String(cell.value).padStart(2, "0")}
              </span>
              <span className="block text-2xs uppercase tracking-[0.16em] text-muted-foreground">
                {cell.label}
              </span>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
