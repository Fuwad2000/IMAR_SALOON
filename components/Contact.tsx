import { contactContent } from "@/app/Content/ContactContent";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

const { header, phone, email, address, hours } = contactContent;

const contactMethods = [
  {
    label: phone.label,
    href: phone.href,
    value: phone.display,
    external: false,
  },
  {
    label: email.label,
    href: email.href,
    value: email.display,
    external: false,
  },
  {
    label: address.label,
    href: address.mapsHref,
    value: address.display,
    subvalue: address.city,
    external: true,
  },
];

export default function Contact() {
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
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            {header.description}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {contactMethods.map((method) => (
            <Link
              key={method.label}
              href={method.href}
              {...(method.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group rounded-2xl border border-gold/15 bg-white/[0.03] p-6 transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.06] hover:shadow-[0_0_28px_rgba(212,175,55,0.1)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {method.label}
              </p>
              <p className="mt-3 text-base font-semibold text-white transition-colors group-hover:text-gold-light">
                {method.value}
              </p>
              {method.subvalue && (
                <p className="mt-1 text-sm text-white/55">{method.subvalue}</p>
              )}
              <span className="mt-4 inline-block text-xs uppercase tracking-[0.15em] text-white/35 transition-colors group-hover:text-gold/70">
                {method.external ? "Open in Maps →" : "Tap to contact →"}
              </span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-6xl text-center text-xs uppercase tracking-[0.2em] text-white/40">
          {hours.label}: {hours.value}
        </p>
      </section>

      <section className="border-t border-gold/15 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <div className="flex h-full flex-col">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Find us
            </h2>
            <p className="mt-2 text-sm text-white/55">
              Visit the shop in Brampton — tap the address above for directions.
            </p>
            <div className="mt-6 flex min-h-[22rem] flex-1 flex-col">
              <div className="relative min-h-[22rem] flex-1 overflow-hidden rounded-2xl border-2 border-gold/30 bg-black shadow-[0_0_32px_rgba(212,175,55,0.12)]">
                <iframe
                  title={`Map showing ${address.full}`}
                  src={address.embedSrc}
                  className="contact-map-frame absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <Link
                href={address.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-light"
              >
                Open in Google Maps →
              </Link>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
