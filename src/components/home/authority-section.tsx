import { AUTHORITY_STATS, PARTNER_BRANDS } from "@/lib/taxonomy";

export function AuthoritySection() {
  return (
    <section className="bg-ink py-16">
      <div className="container-vin">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {AUTHORITY_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-4xl font-semibold text-on-ink">{stat.value}</dt>
              <dd className="mt-2 text-2xs uppercase tracking-[0.1em] text-on-ink/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 border-t border-on-ink/15 pt-10">
          <p className="text-center text-2xs font-medium uppercase tracking-[0.16em] text-on-ink/55">
            Đối tác chính hãng
          </p>
          <div className="group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="marquee flex w-max gap-14 group-hover:[animation-play-state:paused]">
              {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, i) => (
                <span
                  key={`${brand}-${i}`}
                  className="whitespace-nowrap font-display text-2xl font-semibold tracking-[0.08em] text-on-ink/55 transition-colors duration-200 hover:text-on-ink"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
