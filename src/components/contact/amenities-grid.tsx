import { AMENITIES } from "@/lib/contact-data";

export function AmenitiesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {AMENITIES.map(({ icon: Icon, label, note }) => (
        <div
          key={label}
          className="rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/60"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <h4 className="mt-3 text-sm font-semibold">{label}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{note}</p>
        </div>
      ))}
    </div>
  );
}
