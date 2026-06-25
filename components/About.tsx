import { aboutContent } from "@/app/Content/AboutContent";
import Image from "next/image";
import Link from "next/link";

const { header, image, name, intro, services, whyChoose, closing, shortBio } =
  aboutContent;

export default function About() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <section className="relative overflow-hidden border-b border-gold/20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            {header.tagline}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {header.title}
          </h1>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-3xl border border-gold/20 bg-[linear-gradient(135deg,rgba(212,175,55,0.15),transparent)]"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border-2 border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={800}
                className="aspect-[4/5] w-full object-cover object-center"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
                  Meet {name}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {shortBio.title}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                {shortBio.text}
              </p>
            </div>

            {intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed text-white/65 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-white/[0.02] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {services.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.map((item) => (
              <div
                key={item}
                className="group rounded-xl border border-gold/15 bg-black/40 px-4 py-4 transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.04]"
              >
                <span
                  className="mb-2 inline-block h-1 w-6 rounded-full bg-gold/60 transition-all duration-300 group-hover:w-10 group-hover:bg-gold"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {whyChoose.title}
            </h2>
            <ul className="mt-8 space-y-4">
              {whyChoose.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs text-gold-light"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed text-white/70 sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold/25 bg-[linear-gradient(135deg,rgba(212,175,55,0.12),rgba(0,0,0,0.4))] p-8 sm:p-10">
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">
              {closing.text}
            </p>
            <Link
              href={closing.cta.href}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)]"
            >
              {closing.cta.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
