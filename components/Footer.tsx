export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold/20 bg-black text-white">
      <div
        className="h-[2px] w-full bg-[linear-gradient(to_right,transparent,#d4af37,transparent)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <p className="text-sm tracking-wide text-white/60">
          © {year} Eagles Development Team. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
