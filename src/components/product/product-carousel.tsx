import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard, Zoom } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import mediumZoom from "medium-zoom";
import type { Zoom as MediumZoom } from "medium-zoom";
import { ZoomIn } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";

/** Swiper carousel with touch swipe, thumbnails and click-to-zoom (medium-zoom). */
export function ProductCarousel({ images, name }: { images: string[]; name: string }) {
  const [thumbs, setThumbs] = React.useState<SwiperClass | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<MediumZoom | null>(null);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLImageElement>("img[data-zoomable]");
    const zoom = mediumZoom(targets, {
      background: "rgba(15, 15, 15, 0.92)",
      margin: 24,
    });
    zoomRef.current = zoom;
    return () => {
      zoom.detach();
      zoomRef.current = null;
    };
  }, [images]);

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-secondary">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Keyboard, Zoom]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          keyboard
          zoom={{ maxRatio: 3 }}
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          className="vin-swiper aspect-square w-full [&_.swiper-slide]:h-full [&_.swiper-wrapper]:h-full [&_.swiper-zoom-container]:!h-full [&_.swiper-zoom-container_img]:!max-h-none [&_.swiper-zoom-container_img]:!h-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <div className="swiper-zoom-container h-full w-full">
                <img
                  src={src}
                  data-zoomable
                  alt={`${name} — ảnh ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full cursor-zoom-in object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          onClick={() => zoomRef.current?.open()}
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-semibold shadow-[var(--shadow-card)] hover:text-primary"
        >
          <ZoomIn className="h-4 w-4" /> Phóng to cận cảnh
        </button>
      </div>

      {images.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbs}
          watchSlidesProgress
          slidesPerView={5}
          spaceBetween={8}
          className="vin-swiper-thumbs"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`thumb-${src}-${i}`} className="cursor-pointer">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="aspect-square w-full rounded-sm border-2 border-border object-cover opacity-70 transition [.swiper-slide-thumb-active_&]:border-primary [.swiper-slide-thumb-active_&]:opacity-100"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
