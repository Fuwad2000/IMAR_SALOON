export type NavLink = {
  href: string;
  label: string;
};

export const navbarContent = {
  brand: {
    href: "/",
    logo: {
      src: "/images/logo.jpeg",
      alt: "IMAR Barbershop",
    },
  },
  links: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ] satisfies NavLink[],
  cta: {
    label: "Book Now",
    href: "/bookings",
  },
  aria: {
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};
