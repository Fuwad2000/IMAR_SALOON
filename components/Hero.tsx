import { heroContent } from "@/app/Content/HeroContent";
import Image from "next/image";
import Link from "next/link";

const {
  businessName,
  badge,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  image,
  stats,
} = heroContent;

export default function Hero() {
  return (
    <section className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg-zoom object-cover object-[72%_8%] sm:object-[68%_10%]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.88)_42%,rgba(0,0,0,0.45)_68%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.14),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="hero-grain absolute inset-0 opacity-[0.35]" aria-hidden="true" />
      </div>

      <div
        className="pointer-events-none absolute -left-8 top-24 hidden select-none text-[10rem] font-black uppercase leading-none tracking-tighter text-white/[0.03] lg:block xl:text-[12rem]"
        aria-hidden="true"
      >
        {businessName.name}
      </div>

      <div
        className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none lg:block"
        aria-hidden="true"
      >
        <p className="[writing-mode:vertical-rl] rotate-180 text-xs font-semibold uppercase tracking-[0.55em] text-gold/40">
          {businessName.tagline}
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-36 pt-16 sm:px-6 sm:pb-40 sm:pt-20 lg:px-8 lg:pb-44">
        <div className="hero-fade-up max-w-3xl" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-black/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-light backdrop-blur-sm sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-gold-glow" />
            {badge}
          </span>
        </div>

        <div className="hero-fade-up mt-8" style={{ animationDelay: "0.2s" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-light/90 sm:text-sm">
            {businessName.tagline}
          </p>
          <h1 className="mt-3 font-black uppercase leading-[0.82] tracking-tight">
            <span className="block text-[clamp(4.5rem,16vw,9.5rem)] bg-[linear-gradient(135deg,#f5d060_0%,#d4af37_45%,#a8862a_100%)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(212,175,55,0.35)]">
              {businessName.name}
            </span>
            <span className="mt-1 block text-[clamp(1.5rem,4.5vw,3.25rem)] font-light tracking-[0.35em] text-white/90">
              {businessName.type}
            </span>
          </h1>
        </div>

        <div
          className="hero-fade-up mt-8 flex items-center gap-4"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/50">
            {headline.line1}{" "}
            <span className="text-gold-light">{headline.line2}</span>
          </p>
        </div>

        <p
          className="hero-fade-up mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg"
          style={{ animationDelay: "0.45s" }}
        >
          {subheadline}
        </p>

        <div
          className="hero-fade-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          style={{ animationDelay: "0.55s" }}
        >
          <Link
            href={primaryCta.href}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_28px_rgba(212,175,55,0.5)]"
          >
            <span className="relative z-10">{primaryCta.label}</span>
            <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:text-gold-light"
          >
            {secondaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-gold/25 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-gold/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="hero-fade-up flex flex-col items-start px-6 py-5 sm:items-center sm:px-4 sm:py-6 sm:text-center"
              style={{ animationDelay: `${0.65 + index * 0.1}s` }}
            >
              <p className="text-2xl font-bold text-gold-light sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-[7.5rem] left-0 right-0 z-10 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block"
        aria-hidden="true"
      />
    </section>
  );
}
