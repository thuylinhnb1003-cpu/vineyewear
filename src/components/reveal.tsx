import * as React from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Trễ hiệu ứng (ms) để tạo nhịp staggered */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Hiện dần nội dung khi cuộn tới. Tôn trọng prefers-reduced-motion
 * (CSS đã vô hiệu transition) và luôn hiển thị nội dung nếu JS chưa chạy.
 */
export function Reveal({ delay = 0, as = "div", className, children, ...rest }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Comp = as as any;

  return (
    <Comp
      ref={ref}
      className={cn("reveal", shown && "reveal-in", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
