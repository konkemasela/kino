export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <span className="text-sm font-semibold tracking-wide text-bone">KINO</span>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-line"><div className="h-full w-1/2 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-acid" /></div>
      <span className="text-sm text-fog">Loading page…</span>
      <style>{`@keyframes loading-bar { 0% { transform: translateX(-110%); } 100% { transform: translateX(320%); } }`}</style>
    </div>
  );
}
