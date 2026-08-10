import { MapPin, Star } from "lucide-react";
import { GOOGLE_REVIEWS } from "@/lib/taxonomy";

export function GoogleReviews() {
  return (
    <section className="section-vin bg-background">
      <div className="container-vin">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Đánh giá Google</p>
            <h2 className="head-title display-section">Khách hàng nói về Vin Eyewear</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </span>
            4.9/5 · 1.240 đánh giá
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GOOGLE_REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-lg border border-border bg-card p-6 transition-[box-shadow,border-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="flex" aria-label={`${review.rating} sao`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "h-4 w-4 fill-primary text-primary"
                        : "h-4 w-4 text-border"
                    }
                  />
                ))}
              </span>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="mt-1 flex items-center gap-1 text-2xs uppercase tracking-[0.08em] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {review.store}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
