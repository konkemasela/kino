export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <p className="font-display text-4xl tracking-[0.2em] text-bone uppercase">
        KINO<span className="text-acid">.</span>
      </p>
      <div className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/2 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-acid" />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(320%); }
        }
      `}</style>
    </div>
  );
}
