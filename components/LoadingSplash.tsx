"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_KEY = "imar-splash-seen";
const MAX_SPLASH_MS = 2000;

export default function LoadingSplash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      return;
    }

    setVisible(true);
    let hidden = false;

    const hide = () => {
      if (hidden) return;
      hidden = true;
      setFadeOut(true);
      sessionStorage.setItem(SPLASH_KEY, "1");
      window.setTimeout(() => setVisible(false), 300);
    };

    const failsafe = window.setTimeout(hide, MAX_SPLASH_MS);

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
    }

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("load", hide);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden={fadeOut}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[2px] shadow-[0_0_24px_rgba(212,175,55,0.4)]">
          <span className="relative h-full w-full overflow-hidden rounded-full bg-white ring-1 ring-gold/30 ring-inset">
            <Image
              src="/images/logo.jpeg"
              alt=""
              width={80}
              height={80}
              priority
              className="h-full w-full scale-[1.35] object-cover object-[center_12%]"
            />
          </span>
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold-light">
          Young Legend
        </p>
        <p className="mt-2 text-lg font-bold uppercase tracking-[0.12em] text-gold">
          IMAR Saloon
        </p>
        <span className="mt-8 h-1 w-12 overflow-hidden rounded-full bg-gold/20">
          <span className="block h-full w-1/2 animate-pulse rounded-full bg-gold" />
        </span>
      </div>
    </div>
  );
}
