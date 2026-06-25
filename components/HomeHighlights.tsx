import { heroContent } from "@/app/Content/HeroContent";

const { highlights } = heroContent;

export default function HomeHighlights() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.08),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Why Imar
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            More than a haircut.
            <span className="block text-gold-light">A signature experience.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-white/[0.03] p-6 transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.06] hover:shadow-[0_0_32px_rgba(212,175,55,0.12)]"
            >
              <span className="text-5xl font-black leading-none text-gold/10 transition-colors duration-500 group-hover:text-gold/20">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {item.description}
              </p>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
