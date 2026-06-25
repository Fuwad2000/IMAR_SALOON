import { heroContent } from "@/app/Content/HeroContent";

const { marquee } = heroContent;
const items = [...marquee, ...marquee];

export default function HomeMarquee() {
  return (
    <div className="overflow-hidden border-y border-gold/20 bg-black py-4">
      <div className="hero-marquee-track flex w-max gap-10">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-10 text-xs font-semibold uppercase tracking-[0.35em] text-gold/70"
          >
            {item}
            <span className="text-gold/30" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
