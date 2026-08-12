import * as React from "react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  STORE_COORDS,
  haversineKm,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  openStatus,
} from "@/lib/contact-data";

export type StoreRow = {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string | null;
  open_hours: string | null;
  map_url: string | null;
};

export function StoreLocator({
  stores,
  activeId,
  onSelect,
}: {
  stores: StoreRow[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = React.useState<"idle" | "asking" | "denied">("idle");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  function locate() {
    if (!navigator.geolocation) return setGeoState("denied");
    setGeoState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("idle");
      },
      () => setGeoState("denied"),
    );
  }

  const active = stores.find((s) => s.id === activeId) ?? stores[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{stores.length} cơ sở tại Hà Nội</p>
          <button
            type="button"
            onClick={locate}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {geoState === "asking"
              ? "Đang định vị..."
              : geoState === "denied"
                ? "Không lấy được vị trí"
                : "Tìm cơ sở gần tôi"}
          </button>
        </div>

        <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {stores.map((store) => {
            const status = openStatus(store.open_hours);
            const isOpen = mounted && status.isOpen;
            const c = STORE_COORDS[store.code];
            const distance = coords && c ? haversineKm(coords, c) : null;
            const isActive = store.id === active?.id;
            return (
              <div
                key={store.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(store.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelect(store.id);
                }}
                className={cn(
                  "w-full cursor-pointer rounded-lg border p-4 text-left transition-all",
                  isActive
                    ? "border-primary bg-primary-soft shadow-card-hover"
                    : "border-border bg-background hover:border-primary/50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">{store.name}</h3>
                  {distance !== null && (
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-2xs font-semibold text-secondary-foreground">
                      Cách bạn {distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {store.address}
                </p>
                {store.phone && (
                  <p className="mt-1 flex gap-2 text-sm text-muted-foreground">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {store.phone}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-semibold",
                      isOpen ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isOpen ? "bg-success" : "bg-muted-foreground",
                      )}
                    />
                    {mounted ? (isOpen ? "Mở cửa" : "Đã đóng") : "Giờ mở cửa"} • {status.range}
                  </span>
                  <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={mapsDirectionsUrl(store.address)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Chỉ đường
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        {active && (
          <iframe
            key={active.id}
            title={`Bản đồ ${active.name}`}
            src={active.map_url ?? mapsEmbedUrl(active.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border-0 lg:h-full lg:min-h-[520px]"
          />
        )}
        {active && (
          <div className="flex items-center gap-2 border-t border-border bg-secondary px-4 py-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-secondary-foreground">
              Đang xem: <strong>{active.name}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
