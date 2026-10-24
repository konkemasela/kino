function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-xl ${className}`} />;
}

export default function Loading() {
  return (
    <div aria-label="Loading Kinooz" aria-busy="true" className="mx-auto min-h-screen max-w-[1600px] px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/50 p-6 sm:p-10 md:min-h-[420px] md:p-14">
        <SkeletonBlock className="h-3 w-28 rounded-full" />
        <SkeletonBlock className="mt-8 h-12 w-4/5 max-w-2xl md:h-20" />
        <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />
        <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-lg" />
        <div className="mt-8 flex gap-3"><SkeletonBlock className="h-11 w-32 rounded-full" /><SkeletonBlock className="h-11 w-28 rounded-full" /></div>
      </div>
      {[0, 1, 2].map((section) => (
        <section key={section} className="mt-12">
          <div className="mb-5 flex items-center justify-between"><SkeletonBlock className="h-7 w-44" /><SkeletonBlock className="h-3 w-20" /></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i}><SkeletonBlock className="aspect-[2/3] w-full rounded-xl" /><SkeletonBlock className="mt-3 h-3 w-4/5" /><SkeletonBlock className="mt-2 h-2 w-2/5" /></div>)}
          </div>
        </section>
      ))}
      <p className="sr-only">Loading movies, series, and recommendations…</p>
    </div>
  );
}
