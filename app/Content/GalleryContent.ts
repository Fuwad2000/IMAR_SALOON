export type GalleryImage = {
  type: "image";
  src: string;
  alt: string;
};

export type GalleryVideo = {
  type: "video";
  src: string;
  poster: string;
  title: string;
  description: string;
};

export type GalleryItem = GalleryImage | GalleryVideo;

const galleryImageFiles = [
  "hero_barber.jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.44 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.44 PM (1).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.44 PM (2).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.45 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.45 PM (1).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (1).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (2).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (3).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (4).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (5).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (6).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (7).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.46 PM (8).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (1).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (2).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (3).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (4).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (5).jpeg",
  "WhatsApp Image 2026-06-21 at 11.23.47 PM (6).jpeg",

  "WhatsApp Image 2026-06-21 at 11.23.47 PM (8).jpeg",
  "WhatsApp Image 2026-06-21 at 11.24.37 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.24.38 PM.jpeg",
  "WhatsApp Image 2026-06-21 at 11.24.38 PM (1).jpeg",
  "WhatsApp Image 2026-06-21 at 11.24.38 PM (2).jpeg",
] as const;

const imageAltOverrides: Record<string, string> = {
  "hero_barber.jpeg":
    "Barber trimming a client's beard in the studio",
  "about_barber.jpeg":
    "Omar seated in the barber chair with professional clippers",
};

const videoPoster = "/images/logo.jpeg";

const galleryVideos: GalleryVideo[] = [
  {
    type: "video",
    src: "/video/black_client.mp4",
    poster: videoPoster,
    title: "Client Session",
    description:
      "A look at the precision and care behind every cut in the chair.",
  },
  {
    type: "video",
    src: "/video/brown_client.mp4",
    poster: videoPoster,
    title: "Fresh Fade",
    description:
      "Clean lines, sharp fades, and confident results — watch the craft in action.",
  },
];

const galleryImages: GalleryImage[] = galleryImageFiles.map((file) => ({
  type: "image",
  src: `/images/${file}`,
  alt:
    imageAltOverrides[file] ??
    "Barbering work at Imar Young Legend Barber Shop",
}));

export const galleryContent = {
  header: {
    title: "Gallery",
    tagline: "Real cuts. Real clients. Real confidence.",
  },
  intro:
    "Browse photos and videos from the chair — skin fades, beard work, line-ups, and transformations for clients of every age, hair type, and style. Every image reflects the detail, consistency, and personal touch Omar brings to every appointment.",
  filters: [
    { id: "all", label: "All" },
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
  ] as const,
  cta: {
    text: "Like what you see? Book your seat and leave the chair looking sharp.",
    label: "Book Now",
    href: "/bookings",
  },
  videos: galleryVideos,
  images: galleryImages,
  media: [...galleryVideos, ...galleryImages] satisfies GalleryItem[],
};

export type GalleryFilterId = (typeof galleryContent.filters)[number]["id"];
