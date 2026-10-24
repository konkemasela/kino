"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Clapperboard,
  Database,
  Monitor,
  RotateCcw,
  Settings2,
} from "lucide-react";
import {
  ANIME_SERVERS,
  STREAM_SERVERS,
} from "@/features/watch/servers";
import {
  clearHistory,
  clearList,
  getHistory,
  getList,
} from "@/lib/library-store";
import {
  DEFAULT_SETTINGS,
  getSettings,
  onSettingsChange,
  patchSettings,
  resetSettings,
  type KinoSettings,
} from "@/lib/settings-store";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-11 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
        checked ? "border-acid bg-acid" : "border-line bg-void",
      )}
    >
      <span
        className={cn(
          "inline-block size-6 rounded-full transition-transform",
          checked ? "translate-x-[26px] bg-void" : "translate-x-1.5 bg-fog",
        )}
      />
    </button>
  );
}

function Row({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-line px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-bone">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-fog">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsView() {
  const [settings, setSettingsState] = useState<KinoSettings>(DEFAULT_SETTINGS);
  const [historyCount, setHistoryCount] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [notice, setNotice] = useState("");

  const refreshCounts = useCallback(() => {
    setHistoryCount(getHistory().length);
    setListCount(getList().length);
  }, []);

  useEffect(() => {
    const sync = () => {
      queueMicrotask(() => {
        setSettingsState(getSettings());
        refreshCounts();
      });
    };
    sync();
    return onSettingsChange(sync);
  }, [refreshCounts]);

  const update = (partial: Partial<KinoSettings>) => {
    setSettingsState(patchSettings(partial));
    setNotice("Saved on this device");
  };

  const flash = (message: string) => {
    setNotice(message);
    refreshCounts();
  };

  return (
    <div className="mx-auto max-w-[760px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Preferences
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Settings
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-fog">
        Simple controls, stored only in this browser. Nothing is sent to a server.
      </p>

      <div
        aria-live="polite"
        className="mt-4 min-h-5 text-[11px] font-bold tracking-[0.18em] text-acid uppercase"
      >
        {notice}
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel/50">
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Clapperboard size={16} className="text-acid" />
          <h2 className="text-[11px] font-bold tracking-[0.28em] text-bone uppercase">
            Playback
          </h2>
        </header>
        <Row title="Movies & series mirror" hint="Used the next time you press play.">
          <select
            aria-label="Movies and series mirror"
            value={settings.movieServerId}
            onChange={(e) =>
              update({ movieServerId: e.target.value, tvServerId: e.target.value })
            }
            className="h-11 min-w-[180px] cursor-pointer rounded-full border border-line bg-void px-4 text-sm text-bone outline-none focus-visible:ring-2 focus-visible:ring-acid"
          >
            {STREAM_SERVERS.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name}
              </option>
            ))}
          </select>
        </Row>
        <Row title="Anime mirror" hint="Default source for anime episodes.">
          <select
            aria-label="Anime mirror"
            value={settings.animeServerId}
            onChange={(e) => update({ animeServerId: e.target.value })}
            className="h-11 min-w-[180px] cursor-pointer rounded-full border border-line bg-void px-4 text-sm text-bone outline-none focus-visible:ring-2 focus-visible:ring-acid"
          >
            {ANIME_SERVERS.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name}
              </option>
            ))}
          </select>
        </Row>
        <Row title="Anime language" hint="Start new anime in sub or dub when available.">
          <div className="flex rounded-full border border-line bg-void p-1">
            {(["sub", "dub"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => update({ animeLang: option })}
                className={cn(
                  "h-9 min-w-16 cursor-pointer rounded-full px-4 text-[11px] font-bold tracking-[0.16em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
                  settings.animeLang === option
                    ? "bg-acid text-void"
                    : "text-fog hover:text-bone",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Row>
        <Row title="Autoplay" hint="Ask players to start as soon as the page opens.">
          <Toggle
            label="Autoplay"
            checked={settings.autoplay}
            onChange={(autoplay) => update({ autoplay })}
          />
        </Row>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-panel/50">
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Monitor size={16} className="text-acid" />
          <h2 className="text-[11px] font-bold tracking-[0.28em] text-bone uppercase">
            Display
          </h2>
        </header>
        <Row title="Reduce motion" hint="Cut animations and sliding effects.">
          <Toggle
            label="Reduce motion"
            checked={settings.reducedMotion}
            onChange={(reducedMotion) => update({ reducedMotion })}
          />
        </Row>
        <Row title="Compact layout" hint="Tighter spacing and more titles on screen.">
          <Toggle
            label="Compact layout"
            checked={settings.compactUi}
            onChange={(compactUi) => update({ compactUi })}
          />
        </Row>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-panel/50">
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Database size={16} className="text-acid" />
          <h2 className="text-[11px] font-bold tracking-[0.28em] text-bone uppercase">
            Data
          </h2>
        </header>
        <Row
          title="Watch history"
          hint={`${historyCount} title${historyCount === 1 ? "" : "s"} saved on this device.`}
        >
          <button
            type="button"
            disabled={historyCount === 0}
            onClick={() => {
              if (!window.confirm("Clear watch history on this device?")) return;
              clearHistory();
              flash("History cleared");
            }}
            className="h-11 cursor-pointer rounded-full border border-line px-4 text-[11px] font-bold tracking-[0.16em] text-fog uppercase transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear history
          </button>
        </Row>
        <Row
          title="Watchlist"
          hint={`${listCount} saved title${listCount === 1 ? "" : "s"}.`}
        >
          <button
            type="button"
            disabled={listCount === 0}
            onClick={() => {
              if (!window.confirm("Clear your watchlist on this device?")) return;
              clearList();
              flash("Watchlist cleared");
            }}
            className="h-11 cursor-pointer rounded-full border border-line px-4 text-[11px] font-bold tracking-[0.16em] text-fog uppercase transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear watchlist
          </button>
        </Row>
        <Row title="Reset settings" hint="Restore playback and display defaults.">
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("Reset all settings to defaults?")) return;
              setSettingsState(resetSettings());
              flash("Settings reset");
            }}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-[11px] font-bold tracking-[0.16em] text-fog uppercase transition-colors hover:border-acid hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </Row>
      </section>

      <p className="mt-8 flex items-center gap-2 text-xs leading-relaxed text-fog/70">
        <Settings2 size={14} className="shrink-0 text-acid/80" />
        Clearing data only affects this browser. Mirrors stay gated — names only, never domains.
      </p>
    </div>
  );
}
