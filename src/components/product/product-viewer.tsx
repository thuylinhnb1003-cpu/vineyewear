import * as React from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Box, Images, Palette, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCarousel } from "./product-carousel";
import { Spin360 } from "./spin-360";
import { Model3dViewer } from "./model-3d-viewer";

const FrameCustomizer = React.lazy(() => import("./frame-customizer"));

type Tab = "carousel" | "spin" | "model" | "customize";

function Fallback({ label }: { label: string }) {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-lg border border-border bg-secondary text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ProductViewer({
  images,
  spinFrames,
  modelUrl,
  name,
}: {
  images: string[];
  spinFrames: string[];
  modelUrl: string | null;
  name: string;
}) {
  const [tab, setTab] = React.useState<Tab>("carousel");

  const tabs: { id: Tab; label: string; icon: typeof Images; enabled: boolean }[] = [
    { id: "carousel", label: "Ảnh sản phẩm", icon: Images, enabled: true },
    { id: "spin", label: "Xoay 360°", icon: RotateCcw, enabled: spinFrames.length > 1 },
    { id: "model", label: "3D & AR", icon: Box, enabled: Boolean(modelUrl) },
    { id: "customize", label: "Tùy biến gọng", icon: Palette, enabled: true },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {tabs
          .filter((t) => t.enabled)
          .map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition",
                tab === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
      </div>

      <ClientOnly fallback={<Fallback label="Đang tải trình xem sản phẩm…" />}>
        {tab === "carousel" && <ProductCarousel images={images} name={name} />}
        {tab === "spin" && spinFrames.length > 1 && <Spin360 frames={spinFrames} name={name} />}
        {tab === "model" && modelUrl && (
          <Model3dViewer src={modelUrl} poster={images[0] ?? null} name={name} />
        )}
        {tab === "customize" && (
          <React.Suspense fallback={<Fallback label="Đang tải model 3D tùy biến…" />}>
            <FrameCustomizer />
          </React.Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
