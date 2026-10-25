import { Clapperboard } from "lucide-react";
import Rail, { RailItem } from "@/components/ui/rail";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function CastRail({ cast }: { cast: string[] }) {
  const top = cast.slice(0, 18);
  if (top.length === 0) return null;

  return (
    <Rail title="Top" accent="billed cast">
      {top.map((name, i) => (
        <RailItem key={`${name}-${i}`} className="w-[110px] md:w-[130px]">
          <div className="relative flex aspect-square items-center justify-center rounded-full bg-gradient-to-br from-panel2 to-panel ring-1 ring-line transition-all duration-500 hover:ring-acid/60 hover:shadow-[0_0_40px_rgba(215,246,55,0.15)]">
            <span className="font-display text-4xl tracking-[0.06em] text-bone/80 md:text-5xl">
              {initials(name)}
            </span>
            <Clapperboard
              size={16}
              className="absolute bottom-3 text-acid/50"
            />
          </div>
          <p className="mt-3 truncate text-center text-[13px] font-semibold text-bone/90">
            {name}
          </p>
        </RailItem>
      ))}
    </Rail>
  );
}
