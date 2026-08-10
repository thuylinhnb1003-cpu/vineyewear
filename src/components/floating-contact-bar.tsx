import * as React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { QUICK_CHANNELS } from "@/lib/trust-data";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { href: QUICK_CHANNELS.hotline, label: "Gọi hotline 1900 6868", icon: Phone, external: false },
  { href: QUICK_CHANNELS.zalo, label: "Chat Zalo", icon: MessageCircle, external: true },
  {
    href: QUICK_CHANNELS.messenger,
    label: "Chat Messenger",
    icon: MessageCircle,
    external: true,
  },
];

export function FloatingContactBar() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {open &&
        ACTIONS.map((action, i) => (
          <motion.a
            key={action.label}
            href={action.href}
            {...(action.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            aria-label={action.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group flex items-center gap-2 rounded-full bg-primary py-2 pl-2 pr-3 text-primary-foreground shadow-[0_8px_24px_rgba(26,18,20,.28)] transition-colors hover:bg-primary-dark",
              i === 1 && "bg-[#0068ff] hover:bg-[#0055d4]",
              i === 2 && "bg-ink hover:bg-ink/85 text-on-ink",
            )}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15">
              <action.icon className="h-4 w-4" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-300 group-hover:max-w-[180px] sm:max-w-[180px]">
              {action.label}
            </span>
          </motion.a>
        ))}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Ẩn liên hệ nhanh" : "Mở liên hệ nhanh"}
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full shadow-[0_10px_28px_rgba(26,18,20,.28)] transition-colors",
          open
            ? "border border-border bg-card text-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary-dark",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
      </button>
    </div>
  );
}
