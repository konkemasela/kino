import type { Metadata } from "next";
import Link from "next/link";
import {
  Apple,
  Globe,
  Monitor,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
} from "lucide-react";

export const metadata: Metadata = { title: "Ad blocker setup" };

interface Step {
  title: string;
  body: string;
}

interface Guide {
  platform: string;
  icon: typeof Monitor;
  pick: string;
  why: string;
  steps: Step[];
}

const GUIDES: Guide[] = [
  {
    platform: "Windows / macOS / Linux",
    icon: Monitor,
    pick: "uBlock Origin (Firefox) or uBlock Origin Lite (Chrome/Edge)",
    why: "Free, open-source and the most effective blocker for pop-ups and redirect scripts used by embed players.",
    steps: [
      {
        title: "Pick your browser",
        body: "Firefox gives the strongest result because it still supports the full uBlock Origin. Chrome and Edge now require uBlock Origin Lite.",
      },
      {
        title: "Install from the official store",
        body: "Search the extension by name in the Firefox Add-ons site or the Chrome Web Store. Only install the listing by the author 'Raymond Hill' (gorhill) — clones exist.",
      },
      {
        title: "Pin the icon",
        body: "Pin the extension to your toolbar so you can see the block counter and confirm it's active on a page.",
      },
      {
        title: "Keep default filter lists",
        body: "The defaults already cover ads, trackers and most pop-ups. Optionally enable the extra 'Annoyances' lists in the dashboard.",
      },
      {
        title: "Reload KINO and press play",
        body: "New tabs that try to open themselves will be blocked automatically. If a mirror still misbehaves, switch to another mirror in the player.",
      },
    ],
  },
  {
    platform: "Android",
    icon: Smartphone,
    pick: "Firefox for Android + uBlock Origin",
    why: "Firefox is the only mainstream Android browser that supports full extensions, so blocking works exactly like on desktop.",
    steps: [
      {
        title: "Install Firefox for Android",
        body: "Grab it from the Play Store if you don't already have it.",
      },
      {
        title: "Open the add-ons menu",
        body: "Tap the ⋮ menu → Add-ons (or Settings → Add-ons), then find uBlock Origin in the recommended list.",
      },
      {
        title: "Tap the + to install",
        body: "Confirm the permission prompt. A shield icon appears once it's active.",
      },
      {
        title: "Optional: system-wide DNS blocking",
        body: "In Android Settings → Network → Private DNS, choose 'Private DNS provider hostname' and enter a filtering DNS host. This blocks ads in every app, not just the browser.",
      },
      {
        title: "Add KINO to your home screen",
        body: "Use the browser menu → 'Add to Home screen' so it opens like an app, still protected by the blocker.",
      },
    ],
  },
  {
    platform: "iPhone / iPad",
    icon: Apple,
    pick: "A Safari content blocker app, or Firefox Focus",
    why: "iOS doesn't allow full extensions, but Safari supports dedicated content-blocker apps that work very well.",
    steps: [
      {
        title: "Install a content blocker",
        body: "Search the App Store for 'Safari content blocker'. Well-reviewed free options include AdGuard and Firefox Focus (which doubles as a blocker for Safari).",
      },
      {
        title: "Enable it in Settings",
        body: "Go to Settings → Apps → Safari → Extensions (on older iOS: Settings → Safari → Content Blockers) and toggle the blocker on.",
      },
      {
        title: "Block pop-ups",
        body: "In the same Safari settings, make sure 'Block Pop-ups' is enabled.",
      },
      {
        title: "Optional: Private DNS profile",
        body: "AdGuard and similar apps can install a DNS profile that filters ads across every app on the device.",
      },
      {
        title: "Reload and play",
        body: "Return to KINO in Safari and start a title. Switch mirrors if one still opens tabs.",
      },
    ],
  },
];

export default function AdblockGuidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Guide
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        Block the{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          pop-ups
        </span>
      </h1>
      <p className="mt-4 flex max-w-2xl items-start gap-3 text-sm leading-relaxed text-fog">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-acid" />
        KINO itself serves zero ads. Everything annoying comes from the
        third-party mirrors that host the video. A blocker removes almost all of
        it and makes playback noticeably faster.
      </p>

      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-acid/30 bg-acid/5 p-5">
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-acid" />
        <p className="text-[13px] leading-relaxed text-bone/85">
          <span className="font-semibold text-acid">Golden rule:</span> a mirror
          will never ask you to install software, update a codec, allow
          notifications, or sign in to watch. Close anything that does and switch
          mirrors in the player.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {GUIDES.map((guide) => (
          <section
            key={guide.platform}
            className="rounded-2xl border border-line bg-panel/40 p-6 md:p-8"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <guide.icon size={22} />
              </span>
              <div>
                <h2 className="font-display text-2xl tracking-[0.06em] text-bone uppercase md:text-3xl">
                  {guide.platform}
                </h2>
                <p className="text-[12px] text-acid">{guide.pick}</p>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-fog">{guide.why}</p>

            <ol className="mt-6 space-y-4">
              {guide.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-acid/40 font-display text-sm text-acid">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-bone/90">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-fog">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-panel/40 p-6">
        <Globe size={18} className="text-acid" />
        <p className="flex-1 text-[13px] leading-relaxed text-bone/80">
          Downloading torrents? Pair your blocker with a VPN.
        </p>
        <Link
          href="/guides/vpn"
          className="rounded-full bg-acid px-5 py-2.5 text-[11px] font-bold tracking-[0.18em] text-void uppercase transition-transform hover:scale-105"
        >
          VPN guide
        </Link>
      </div>
    </div>
  );
}
