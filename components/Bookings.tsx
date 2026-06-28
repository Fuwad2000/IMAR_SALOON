import { bookingsContent } from "@/app/Content/BookingsContent";
import BookingFlow from "@/components/BookingFlow";
import Link from "next/link";

const { header, availability, sidebar } = bookingsContent;

export default function Bookings() {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-hidden bg-black text-white">
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

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/15 bg-white/[0.03] p-5 text-center sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {availability.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">{availability.value}</p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-white/[0.03] p-5 text-center sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Hours
            </p>
            <p className="mt-2 text-lg font-semibold text-white">{availability.hours}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <BookingFlow />
          </div>

          <aside className="min-w-0 rounded-2xl border border-gold/15 bg-white/[0.03] p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold tracking-tight text-white">
              {sidebar.title}
            </h2>
            <ul className="mt-5 space-y-4">
              {sidebar.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/60">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-gold/10 bg-black/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                {sidebar.location.label}
              </p>
              <p className="mt-2 text-sm text-white/70">{sidebar.location.value}</p>
              <Link
                href={sidebar.location.href}
                className="mt-3 inline-flex text-sm font-medium text-gold transition-colors hover:text-gold-light"
              >
                View on contact page →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
