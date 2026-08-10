import * as React from "react";
import { Smartphone, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Nhúng model 3D (.glb) qua @google/model-viewer, kèm nút
 * "Xem trong không gian của bạn" (AR Quick Look iOS / Scene Viewer Android).
 */
export function Model3dViewer({
  src,
  poster,
  name,
}: {
  src: string;
  poster?: string | null;
  name: string;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    import("@google/model-viewer").then(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-lg border border-border bg-secondary text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Box className="h-4 w-4 animate-pulse text-primary" /> Đang tải model 3D…
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-secondary">
      {React.createElement(
        "model-viewer",
        {
          src,
          poster: poster ?? undefined,
          alt: `Model 3D của ${name}`,
          ar: true,
          "ar-modes": "webxr scene-viewer quick-look",
          "camera-controls": true,
          "touch-action": "pan-y",
          "shadow-intensity": "1",
          "environment-image": "neutral",
          "auto-rotate": true,
          style: { width: "100%", height: "100%", backgroundColor: "transparent" },
        },
        <Button slot="ar-button" size="sm" className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Smartphone className="mr-2 h-4 w-4" /> Xem trong không gian của bạn
        </Button>,
      )}
    </div>
  );
}
