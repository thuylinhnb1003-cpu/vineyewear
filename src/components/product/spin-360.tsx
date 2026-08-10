import * as React from "react";
import { RotateCcw } from "lucide-react";

/**
 * Xoay 360° bằng bộ ảnh chụp trên bàn xoay: kéo chuột / vuốt để chuyển frame.
 */
export function Spin360({ frames, name }: { frames: string[]; name: string }) {
  const [index, setIndex] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef<{ x: number; start: number } | null>(null);
  const total = frames.length;

  const move = React.useCallback(
    (clientX: number) => {
      if (!drag.current || total < 2) return;
      const delta = clientX - drag.current.x;
      const step = Math.round(delta / 12);
      setIndex((((drag.current.start + step) % total) + total) % total);
    },
    [total],
  );

  const start = (clientX: number) => {
    drag.current = { x: clientX, start: index };
    setDragging(true);
  };
  const end = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative select-none overflow-hidden rounded-lg border border-border bg-secondary ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start(e.clientX);
        }}
        onPointerMove={(e) => dragging && move(e.clientX)}
        onPointerUp={end}
        onPointerCancel={end}
        style={{ touchAction: "pan-y" }}
      >
        {frames.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === index ? `${name} — góc xoay ${i + 1}/${total}` : ""}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            className={`aspect-square w-full object-cover ${i === index ? "" : "hidden"}`}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-background/85 to-transparent p-3 text-xs font-semibold">
          <RotateCcw className="h-4 w-4 text-primary" />
          Kéo hoặc vuốt ngang để xoay 360°
          <span className="text-caption">
            ({index + 1}/{total})
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={total - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        aria-label="Góc xoay sản phẩm"
        className="w-full accent-primary"
      />
    </div>
  );
}
