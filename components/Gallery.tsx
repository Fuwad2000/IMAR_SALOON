"use client";

import {
  galleryContent,
  type GalleryFilterId,
  type GalleryImage,
  type GalleryItem,
} from "@/app/Content/GalleryContent";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const { header, intro, filters, cta, media } = galleryContent;

function isImage(item: GalleryItem): item is GalleryImage {
  return item.type === "image";
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilterId>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filteredMedia = useMemo(() => {
    if (activeFilter === "all") return media;
    if (activeFilter === "photos") return media.filter(isImage);
    return media.filter((item) => item.type === "video");
  }, [activeFilter]);

  const photoCount = media.filter(isImage).length;
  const videoCount = media.filter((item) => item.type === "video").length;

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
            {intro}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
            {photoCount} photos · {videoCount} videos
          </p>
        </div>
      </section>

      <section className="border-b border-gold/15 bg-black px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gold text-[#0a0a0a] shadow-[0_0_16px_rgba(212,175,55,0.35)]"
                  : "border border-gold/25 text-white/60 hover:border-gold/50 hover:text-gold-light"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMedia.map((item) =>
            item.type === "video" ? (
              <article
                key={item.src}
                className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03] sm:col-span-2 lg:col-span-1"
              >
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[4/5] w-full bg-black object-cover object-center sm:aspect-video"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="border-t border-gold/15 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    Video
                  </p>
                  <h2 className="mt-1 text-base font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/55">{item.description}</p>
                </div>
              </article>
            ) : (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightboxImage(item)}
                className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-white/[0.02] text-left transition-all duration-300 hover:border-gold/45 hover:shadow-[0_0_28px_rgba(212,175,55,0.12)]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="absolute bottom-3 right-3 rounded-full border border-gold/40 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-light opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  View
                </span>
              </button>
            ),
          )}
        </div>
      </section>

      <section className="border-t border-gold/15 bg-white/[0.02] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-gold/20 bg-[linear-gradient(135deg,rgba(212,175,55,0.1),transparent)] p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {cta.text}
          </p>
          <Link
            href={cta.href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(212,175,55,0.45)]"
          >
            {cta.label}
          </Link>
        </div>
      </section>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 rounded-full border border-gold/30 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-light backdrop-blur-sm transition-colors hover:border-gold hover:text-white"
          >
            Close
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-gold/30 shadow-[0_0_48px_rgba(212,175,55,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              width={1200}
              height={1200}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
