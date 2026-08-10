import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FACE_SHAPES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export function FaceShapeGuide() {
  const [activeId, setActiveId] = React.useState(FACE_SHAPES[0]!.id);
  const active = FACE_SHAPES.find((f) => f.id === activeId)!;

  return (
    <section className="section-vin bg-secondary">
      <div className="container-vin">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-primary" />
          <p className="micro-label">Công cụ gợi ý</p>
        </div>
        <h2 className="head-title max-w-xl display-section">
          Chọn gọng theo <span className="italic text-primary">dáng mặt</span> của bạn
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Chọn dáng mặt bên dưới, chúng tôi gợi ý những dáng gọng cân đối nhất với đường nét khuôn
          mặt bạn.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FACE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => setActiveId(shape.id)}
                aria-pressed={shape.id === activeId}
                className={cn(
                  "flex h-full min-h-[7.5rem] flex-col justify-center border p-5 text-left transition-colors duration-300 ease-[var(--ease-out-soft)]",
                  shape.id === activeId
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-card hover:border-primary",
                )}
              >
                <span className="block font-display text-xl font-semibold leading-tight">
                  {shape.label}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                  {shape.hint}
                </span>
              </button>
            ))}
          </div>


          <div className="self-start border border-border bg-card p-8">
            <p className="micro-label">Gợi ý cho mặt {active.label.toLowerCase()}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Dáng gọng phù hợp</h3>
            <ul className="mt-5 space-y-2">
              {active.recommend.map((shape) => (
                <li key={shape}>
                  <Link
                    to="/san-pham"
                    search={{ shape }}
                    className="flex items-center justify-between border-b border-border py-2.5 text-sm font-medium transition-colors hover:text-primary"
                  >
                    {shape}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 w-full rounded-none">
              <Link to="/dat-lich">Nhờ chuyên viên tư vấn trực tiếp</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
