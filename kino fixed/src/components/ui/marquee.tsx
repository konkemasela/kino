import { Asterisk } from "lucide-react";

export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line bg-panel/30 py-4">
      <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-6" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-6">
                <span
                  className={
                    i % 2 === 0
                      ? "font-display text-2xl tracking-[0.14em] text-bone/90 uppercase md:text-3xl"
                      : "font-display text-2xl tracking-[0.14em] text-outline uppercase md:text-3xl"
                  }
                >
                  {item}
                </span>
                <Asterisk className="size-5 text-acid" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
