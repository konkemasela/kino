import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Film size={36} className="text-acid" />
      <p className="font-display text-[clamp(5rem,18vw,12rem)] leading-none text-outline">
        404
      </p>
      <p className="max-w-md font-editorial text-xl italic text-fog">
        This reel is missing from the archive — the title may have moved or
        never existed.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-acid px-7 py-3 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform hover:scale-105"
      >
        Back to KINO.
      </Link>
    </div>
  );
}
