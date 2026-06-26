export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6">
        <div className="h-3 w-32 rounded-full bg-gold/20" />
        <div className="h-10 w-64 max-w-full rounded-xl bg-white/10" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full max-w-xl rounded-lg bg-white/5" />
          <div className="h-4 w-full max-w-lg rounded-lg bg-white/5" />
          <div className="h-4 w-2/3 max-w-md rounded-lg bg-white/5" />
        </div>
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-32 rounded-2xl border border-gold/10 bg-white/[0.03]" />
          <div className="h-32 rounded-2xl border border-gold/10 bg-white/[0.03]" />
          <div className="hidden h-32 rounded-2xl border border-gold/10 bg-white/[0.03] sm:block" />
        </div>
      </div>
    </div>
  );
}
