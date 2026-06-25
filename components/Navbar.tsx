"use client";

import { navbarContent } from "@/app/Content/NavBarContent";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const { brand, links, cta, aria } = navbarContent;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-black text-white transition-all duration-500 ${
        scrolled
          ? "shadow-[0_8px_32px_rgba(212,175,55,0.12)] backdrop-blur-md"
          : ""
      }`}
    >
      <div
        className={`w-full bg-[#d4af37] transition-all duration-500 ${
          scrolled ? "h-[1px]" : "h-[2px]"
        }`}
        aria-hidden="true"
      />

      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
        aria-label={aria.mainNav}
      >
        <Link
          href={brand.href}
          className="group relative inline-flex shrink-0 items-center transition-all duration-500"
          aria-label={brand.logo.alt}
          onClick={closeMenu}
        >
          <span
            className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[2px] shadow-[0_0_10px_rgba(212,175,55,0.35)] transition-all duration-500 group-hover:shadow-[0_0_18px_rgba(212,175,55,0.55)] ${
              scrolled ? "h-10 w-10" : "h-12 w-12"
            }`}
          >
            <span className="relative h-full w-full overflow-hidden rounded-full bg-white ring-1 ring-gold/30 ring-inset">
              <Image
                src={brand.logo.src}
                alt={brand.logo.alt}
                width={96}
                height={96}
                priority
                className="h-full w-full scale-[1.35] object-cover object-[center_12%]"
              />
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`group relative bg-transparent font-medium tracking-wide text-white/60 shadow-none transition-all duration-500 hover:text-[#f5d060] focus-visible:outline-none ${
                  scrolled ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
                }`}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[linear-gradient(to_right,transparent,#d4af37,transparent)] opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
          <li className="ml-4">
            <Link
              href={cta.href}
              className={`rounded-full bg-[#d4af37] font-bold tracking-wide text-[#0a0a0a] transition-all duration-500 hover:bg-[#f5d060] hover:shadow-[0_0_16px_rgba(212,175,55,0.4)] ${
                scrolled ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
              }`}
            >
              {cta.label}
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className={`relative inline-flex items-center justify-center rounded-lg text-gold transition-all duration-500 hover:bg-gold/10 md:hidden ${
            scrolled ? "h-8 w-8" : "h-10 w-10"
          }`}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? aria.closeMenu : aria.openMenu}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">
            {isOpen ? aria.closeMenu : aria.openMenu}
          </span>
          <span className={`relative flex flex-col items-center justify-center transition-all duration-500 ${
            scrolled ? "h-4 w-5" : "h-5 w-6"
          }`}>
            <span
              className={`absolute rounded-full bg-gold transition-all duration-300 ${
                scrolled ? "h-[1.5px] w-5" : "h-0.5 w-6"
              } ${isOpen ? "translate-y-0 rotate-45" : scrolled ? "-translate-y-1.5" : "-translate-y-2"}`}
            />
            <span
              className={`absolute rounded-full bg-gold transition-all duration-300 ${
                scrolled ? "h-[1.5px] w-5" : "h-0.5 w-6"
              } ${isOpen ? "opacity-0 scale-0" : "opacity-100"}`}
            />
            <span
              className={`absolute rounded-full bg-gold transition-all duration-300 ${
                scrolled ? "h-[1.5px] w-5" : "h-0.5 w-6"
              } ${isOpen ? "translate-y-0 -rotate-45" : scrolled ? "translate-y-1.5" : "translate-y-2"}`}
            />
          </span>
        </button>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-menu"
        className={`relative z-50 overflow-hidden border-t border-gold/20 bg-black transition-all duration-500 ease-out md:hidden ${
          isOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mx-auto max-w-6xl space-y-1 px-4 py-4 sm:px-6">
          {links.map((link, index) => (
            <li
              key={link.href}
              className={isOpen ? "animate-slide-down" : ""}
              style={{ animationDelay: isOpen ? `${index * 60}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="block bg-transparent px-4 py-3 text-base font-medium tracking-wide text-white/60 shadow-none transition-colors duration-300 hover:text-[#f5d060] focus-visible:outline-none"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            className={`pt-3 ${isOpen ? "animate-slide-down" : ""}`}
            style={{ animationDelay: isOpen ? `${links.length * 60}ms` : "0ms" }}
          >
            <Link
              href={cta.href}
              className="block rounded-full bg-[#d4af37] px-4 py-3 text-center text-base font-bold tracking-wide text-[#0a0a0a] transition-all duration-300 hover:bg-[#f5d060] hover:shadow-[0_0_16px_rgba(212,175,55,0.4)]"
              onClick={closeMenu}
            >
              {cta.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
