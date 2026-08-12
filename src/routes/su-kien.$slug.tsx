import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/shop.functions";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

const eventQuery = (slug: string) =>
  queryOptions({ queryKey: ["event", slug], queryFn: () => getEventBySlug({ data: { slug } }) });

export const Route = createFileRoute("/su-kien/$slug")({
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventQuery(params.slug));
    if (!event) throw notFound();
    return { title: event.title, excerpt: event.excerpt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Sự kiện"} — Vin Eyewear` },
      {
        name: "description",
        content: loaderData?.excerpt?.slice(0, 155) ?? "Sự kiện Vin Eyewear.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Sự kiện"} — Vin Eyewear` },
      {
        property: "og:description",
        content: loaderData?.excerpt?.slice(0, 155) ?? "Sự kiện và ưu đãi tại Vin Eyewear.",
      },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const { data: event } = useSuspenseQuery(eventQuery(slug));
  if (!event) return null;

  return (
    <article className="container-vin section-vin">
      <nav className="text-sm text-muted-foreground">
        <Link to="/su-kien" className="hover:text-primary">
          Sự kiện
        </Link>{" "}
        / <span className="text-foreground">{event.title}</span>
      </nav>
      <h1 className="mt-3">{event.title}</h1>
      <p className="mt-2 text-sm font-semibold text-primary">
        {formatDate(event.starts_at)}
        {event.ends_at ? ` — ${formatDate(event.ends_at)}` : ""} · {event.location}
      </p>
      <img
        src={event.cover_image ?? "/images/product-4.jpg"}
        alt={event.title}
        className="mt-5 aspect-[16/7] w-full rounded-xl object-cover"
      />
      <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground">
        {(event.content ?? event.excerpt ?? "").split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <Button asChild className="mt-6">
        <Link to="/dat-lich">Đặt lịch tham gia</Link>
      </Button>
    </article>
  );
}
