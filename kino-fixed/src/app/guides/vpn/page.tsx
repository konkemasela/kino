import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  Globe2,
  KeyRound,
  Magnet,
  Scale,
  ShieldCheck,
  TriangleAlert,
  Wifi,
} from "lucide-react";

export const metadata: Metadata = { title: "VPN for torrenting" };

const WHY = [
  {
    icon: Eye,
    title: "Torrents are public by design",
    body: "Every peer in a swarm can see your IP address — that's how BitTorrent connects people. Anyone monitoring a swarm records who joined it.",
  },
  {
    icon: Wifi,
    title: "Your ISP sees the traffic",
    body: "Without a VPN your provider can see you're using BitTorrent and, in many countries, will forward infringement notices or throttle the connection.",
  },
  {
    icon: KeyRound,
    title: "A VPN encrypts the tunnel",
    body: "Traffic leaves your device encrypted and exits from the VPN's server, so the swarm sees the VPN's address instead of your home connection.",
  },
];

const CHECKLIST = [
  {
    title: "A real no-logs policy",
    body: "Ideally independently audited. If the provider keeps connection logs, the protection is mostly cosmetic.",
  },
  {
    title: "A kill switch",
    body: "Cuts your internet instantly if the VPN drops, so your torrent client can never leak your real IP mid-download.",
  },
  {
    title: "P2P-friendly servers",
    body: "Many providers only allow torrent traffic on specific locations. Check which servers are marked for P2P.",
  },
  {
    title: "Port forwarding (nice to have)",
    body: "Improves connection speed and seeding ability. Only some providers offer it.",
  },
  {
    title: "Paid, not free",
    body: "Free VPNs are usually funded by selling your browsing data or injecting ads — the exact problem you're trying to avoid.",
  },
];

const SETUP = [
  {
    title: "Subscribe and install",
    body: "Install the provider's official app on the device that will run the torrent client — desktop is easiest to configure.",
  },
  {
    title: "Turn on the kill switch",
    body: "Find it in the app's settings (sometimes called 'Network Lock'). Enable it before you download anything.",
  },
  {
    title: "Connect to a P2P server",
    body: "Pick a location the provider marks as P2P-allowed. Nearby countries usually give the best speed.",
  },
  {
    title: "Verify your IP changed",
    body: "Search 'what is my IP' in your browser before and after connecting. The number must be different.",
  },
  {
    title: "Bind your client to the VPN",
    body: "In qBittorrent: Settings → Advanced → 'Network interface', choose the VPN adapter. The client then refuses to transfer unless the VPN is up.",
  },
  {
    title: "Run a leak test",
    body: "Search for a 'torrent IP leak test' — it adds a tracking magnet that reports the IP your client is announcing. Confirm it matches the VPN.",
  },
];

export default function VpnGuidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        Guide
      </p>
      <h1 className="mt-4 font-display text-6xl tracking-[0.03em] uppercase md:text-8xl">
        VPN for{" "}
        <span className="font-editorial text-5xl italic normal-case text-outline md:text-7xl">
          torrenting
        </span>
      </h1>
      <p className="mt-4 flex max-w-2xl items-start gap-3 text-sm leading-relaxed text-fog">
        <Magnet size={18} className="mt-0.5 shrink-0 text-acid" />
        Streaming through a mirror is a normal web request. Torrenting is
        different — you join a public swarm where your address is visible to
        everyone in it. If you use the torrent vault, read this first.
      </p>

      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-ember/40 bg-ember/10 p-5">
        <Scale size={18} className="mt-0.5 shrink-0 text-ember" />
        <p className="text-[13px] leading-relaxed text-bone/85">
          A VPN is a privacy tool, not a licence. Downloading copyrighted work
          you don&apos;t have rights to is illegal in most countries regardless of
          how it&apos;s routed. Use the vault for public-domain, freely licensed or
          self-owned content — see the{" "}
          <Link href="/legal" className="text-ember underline underline-offset-2">
            legal section
          </Link>
          .
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-3xl tracking-[0.08em] text-bone uppercase md:text-4xl">
          Why it matters
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-2xl border border-line bg-panel/40 p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-acid/10 text-acid">
                <w.icon size={19} />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold text-bone">{w.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-fog">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-3 font-display text-3xl tracking-[0.08em] text-bone uppercase md:text-4xl">
          <ShieldCheck size={24} className="text-acid" />
          What to look for
        </h2>
        <p className="mt-2 text-[13px] text-fog">
          We don&apos;t take affiliate money or recommend specific brands — judge
          any provider against this list.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {CHECKLIST.map((c, i) => (
            <div
              key={c.title}
              className="flex gap-4 rounded-2xl border border-line bg-panel/40 p-5"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-acid/40 font-display text-sm text-acid">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold text-bone/90">{c.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-3 font-display text-3xl tracking-[0.08em] text-bone uppercase md:text-4xl">
          <Globe2 size={24} className="text-acid" />
          Setting it up
        </h2>
        <ol className="mt-6 space-y-4">
          {SETUP.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-2xl border border-line bg-panel/40 p-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-acid font-display text-base text-void">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[13.5px] font-semibold text-bone/90">{s.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 flex flex-wrap items-start gap-3 rounded-2xl border border-line bg-panel/40 p-6">
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-acid" />
        <p className="flex-1 text-[13px] leading-relaxed text-bone/80">
          <span className="font-semibold text-acid">Streaming only?</span> You
          don&apos;t strictly need a VPN — no swarm is involved. An ad blocker
          matters far more for that.
        </p>
        <Link
          href="/guides/adblock"
          className="rounded-full bg-acid px-5 py-2.5 text-[11px] font-bold tracking-[0.18em] text-void uppercase transition-transform hover:scale-105"
        >
          Ad blocker guide
        </Link>
      </div>
    </div>
  );
}
