"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Clapperboard, Database, Monitor, Moon, RotateCcw, Settings2, Sun } from "lucide-react";
import { ANIME_SERVERS, STREAM_SERVERS } from "@/features/watch/servers";
import { clearHistory, clearList, getHistory, getList } from "@/lib/library-store";
import { DEFAULT_SETTINGS, getSettings, onSettingsChange, patchSettings, resetSettings, type KinoSettings } from "@/lib/settings-store";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn("relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-acid", checked ? "border-acid bg-acid" : "border-line bg-void")}><span className={cn("size-5 rounded-full transition-transform", checked ? "translate-x-8 bg-void" : "translate-x-1.5 bg-fog")} /></button>;
}
function Row({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return <div className="flex flex-col gap-3 border-b border-line px-4 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"><div className="min-w-0"><p className="text-sm font-medium text-bone">{title}</p><p className="mt-1 text-sm leading-5 text-fog">{hint}</p></div><div className="w-full sm:w-auto">{children}</div></div>;
}

export default function SettingsView() {
  const [settings, setSettingsState] = useState<KinoSettings>(DEFAULT_SETTINGS);
  const [historyCount, setHistoryCount] = useState(0);
  const [listCount, setListCount] = useState(0);
  const [notice, setNotice] = useState("");
  const refreshCounts = useCallback(() => { setHistoryCount(getHistory().length); setListCount(getList().length); }, []);
  useEffect(() => {
    const sync = () => queueMicrotask(() => { setSettingsState(getSettings()); refreshCounts(); });
    sync();
    return onSettingsChange(sync);
  }, [refreshCounts]);
  const update = (partial: Partial<KinoSettings>) => { setSettingsState(patchSettings(partial)); setNotice("Saved on this device"); };
  const flash = (message: string) => { setNotice(message); refreshCounts(); };
  const selectClass = "min-h-10 w-full rounded-md border border-line bg-void px-3 text-sm text-bone outline-none focus-visible:ring-2 focus-visible:ring-acid sm:min-w-48";
  const actionClass = "min-h-10 w-full rounded-md border border-line px-3 text-sm text-fog transition-colors hover:border-fog hover:text-bone disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="mb-6"><p className="text-sm text-fog">Preferences are stored in this browser</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl">Settings</h1><p className="mt-2 text-sm leading-6 text-fog">Choose playback and display options, or clear locally stored data.</p></header>
      <p aria-live="polite" className="mb-4 min-h-5 text-sm text-acid">{notice}</p>
      <section className="overflow-hidden rounded-lg border border-line bg-panel"><header className="flex items-center gap-2 border-b border-line px-4 py-3"><Clapperboard size={17} className="text-acid" /><h2 className="text-sm font-semibold text-bone">Playback</h2></header>
        <Row title="Movies and series" hint="Default playback source"><select aria-label="Movies and series mirror" value={settings.movieServerId} onChange={(event) => update({ movieServerId: event.target.value, tvServerId: event.target.value })} className={selectClass}>{STREAM_SERVERS.map((server) => <option key={server.id} value={server.id}>{server.name}</option>)}</select></Row>
        <Row title="Anime source" hint="Default source for anime episodes"><select aria-label="Anime mirror" value={settings.animeServerId} onChange={(event) => update({ animeServerId: event.target.value })} className={selectClass}>{ANIME_SERVERS.map((server) => <option key={server.id} value={server.id}>{server.name}</option>)}</select></Row>
        <Row title="Anime language" hint="Preferred audio when available"><div className="flex gap-2">{(["sub", "dub"] as const).map((option) => <button key={option} type="button" onClick={() => update({ animeLang: option })} className={cn("min-h-10 rounded-md border px-4 text-sm", settings.animeLang === option ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone")}>{option === "sub" ? "Subtitles" : "Dub"}</button>)}</div></Row>
        <Row title="Autoplay" hint="Start playback automatically"><Toggle label="Autoplay" checked={settings.autoplay} onChange={(autoplay) => update({ autoplay })} /></Row>
        <Row title="Player sandbox" hint="Restrict pop-ups from embedded players"><Toggle label="Sandbox players" checked={settings.sandboxPlayer} onChange={(sandboxPlayer) => update({ sandboxPlayer })} /></Row>
      </section>
      <section className="mt-4 overflow-hidden rounded-lg border border-line bg-panel"><header className="flex items-center gap-2 border-b border-line px-4 py-3"><Monitor size={17} className="text-acid" /><h2 className="text-sm font-semibold text-bone">Appearance</h2></header>
        <Row title="Theme" hint="Choose a dark or light appearance"><div className="flex gap-2">{(["dark", "light"] as const).map((option) => <button key={option} type="button" onClick={() => update({ theme: option })} className={cn("inline-flex min-h-10 items-center gap-2 rounded-md border px-4 text-sm", settings.theme === option ? "border-acid bg-acid text-void" : "border-line text-fog hover:text-bone")}>{option === "dark" ? <Moon size={14} /> : <Sun size={14} />}{option === "dark" ? "Dark" : "Light"}</button>)}</div></Row>
        <Row title="Reduce motion" hint="Limit animation and scrolling effects"><Toggle label="Reduce motion" checked={settings.reducedMotion} onChange={(reducedMotion) => update({ reducedMotion })} /></Row>
        <Row title="Compact layout" hint="Reduce spacing between titles"><Toggle label="Compact layout" checked={settings.compactUi} onChange={(compactUi) => update({ compactUi })} /></Row>
      </section>
      <section className="mt-4 overflow-hidden rounded-lg border border-line bg-panel"><header className="flex items-center gap-2 border-b border-line px-4 py-3"><Database size={17} className="text-acid" /><h2 className="text-sm font-semibold text-bone">Local data</h2></header>
        <Row title="Watch history" hint={`${historyCount} ${historyCount === 1 ? "title" : "titles"} saved`}><button type="button" disabled={!historyCount} onClick={() => { if (!window.confirm("Clear watch history on this device?")) return; clearHistory(); flash("History cleared"); }} className={actionClass}>Clear history</button></Row>
        <Row title="Saved titles" hint={`${listCount} ${listCount === 1 ? "title" : "titles"} in your library`}><button type="button" disabled={!listCount} onClick={() => { if (!window.confirm("Clear saved titles on this device?")) return; clearList(); flash("Saved titles cleared"); }} className={actionClass}>Clear saved titles</button></Row>
        <Row title="Reset preferences" hint="Restore the default playback and display choices"><button type="button" onClick={() => { if (!window.confirm("Reset all settings to defaults?")) return; setSettingsState(resetSettings()); flash("Settings reset"); }} className={cn(actionClass, "inline-flex items-center justify-center gap-2")}><RotateCcw size={14} />Reset settings</button></Row>
      </section>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-fog"><Settings2 size={14} className="mt-0.5 shrink-0" />Clearing data only affects this browser.</p>
    </div>
  );
}
