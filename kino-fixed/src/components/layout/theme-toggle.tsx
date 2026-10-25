"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  getSettings,
  onSettingsChange,
  patchSettings,
  type Theme,
} from "@/lib/settings-store";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
  withLabel = true,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setTheme(getSettings().theme);
    sync();
    return onSettingsChange(sync);
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => patchSettings({ theme: next })}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full border border-line bg-panel/60 text-fog transition-colors hover:border-bone/30 hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
        withLabel ? "h-9 px-3.5 text-[10px] font-bold tracking-[0.18em] uppercase" : "size-10",
        className,
      )}
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
      {withLabel && <span>{theme === "light" ? "Dark" : "Light"}</span>}
    </button>
  );
}
