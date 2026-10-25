import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  ListTree,
  Mail,
} from "lucide-react";
import { EMAIL_CONFIGURED, SITE } from "@/lib/site-config";
import { LEGAL_DOCS, type LegalEntry } from "../docs";

const pad = (n: number) => String(n + 1).padStart(2, "0");

function Toc({ entry }: { entry: LegalEntry }) {
  return (
    <ol className="space-y-1.5 text-[13px]">
      {entry.sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-2.5 rounded-lg px-2 py-1 text-fog transition-colors hover:bg-panel2 hover:text-acid"
          >
            <span className="font-editorial text-xs italic text-acid/60">
              {pad(i)}
            </span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalDocument({ entry }: { entry: LegalEntry }) {
  const index = LEGAL_DOCS.findIndex((d) => d.slug === entry.slug);
  const prev = index > 0 ? LEGAL_DOCS[index - 1] : null;
  const next = index < LEGAL_DOCS.length - 1 ? LEGAL_DOCS[index + 1] : null;
  const Icon = entry.icon;

  return (
    <div className="mx-auto max-w-[1300px] px-5 pb-28 pt-32 md:px-10 md:pb-16 md:pt-40">
      <Link
        href="/legal"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-fog uppercase transition-colors hover:text-acid"
      >
        <ArrowLeft size={14} />
        All legal documents
      </Link>

      <p className="mt-8 flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-acid uppercase">
        <span className="h-px w-10 bg-acid" />
        {entry.kicker}
      </p>
      <h1 className="mt-4 flex items-center gap-4 font-display text-5xl tracking-[0.03em] uppercase md:text-7xl">
        <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-acid/10 text-acid md:flex">
          <Icon size={26} />
        </span>
        {entry.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fog">
        {entry.summary}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-fog/80">
        <span className="flex items-center gap-2">
          <CalendarDays size={14} className="text-acid/80" />
          Effective {SITE.effectiveDate} · v{SITE.version}
        </span>
        <span className="flex items-center gap-2">
          <Clock size={14} className="text-acid/80" />
          {entry.minutes} min read
        </span>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside>
          <details className="rounded-2xl border border-line bg-panel/50 p-4 lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-bone uppercase">
              <ListTree size={14} className="text-acid" />
              On this page
            </summary>
            <div className="mt-3">
              <Toc entry={entry} />
            </div>
          </details>
          <nav
            aria-label="On this page"
            className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
          >
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-bone uppercase">
              <ListTree size={14} className="text-acid" />
              On this page
            </p>
            <Toc entry={entry} />
          </nav>
        </aside>

        <div className="space-y-4">
          {entry.sections.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="scroll-mt-28 rounded-2xl border border-line bg-panel/50 p-6 md:p-8"
            >
              <span className="font-editorial text-xs italic text-acid/70">
                §{pad(i)}
              </span>
              <h2 className="font-display text-2xl tracking-[0.06em] text-bone uppercase md:text-3xl">
                {s.title}
              </h2>
              <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-bone/75">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.list && (
                  <ul className="list-disc space-y-1.5 pl-5 marker:text-acid">
                    {s.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p, j) => <p key={`a${j}`}>{p}</p>)}
                {s.note && (
                  <p className="rounded-xl border border-acid/25 bg-acid/5 px-4 py-3 text-[13px] text-bone/90">
                    {s.note}
                  </p>
                )}
              </div>
            </article>
          ))}

          <div className="rounded-2xl border border-acid/25 bg-acid/5 p-6 md:p-8">
            <p className="font-display text-2xl tracking-[0.06em] uppercase">
              Questions about this document?
            </p>
            <p className="mt-2 text-sm text-fog">
              {EMAIL_CONFIGURED
                ? "Write to us and we will do our best to help."
                : "Contact details are published on the Contact & Reporting page."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {EMAIL_CONFIGURED && (
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`[General] ${entry.title}`)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-acid px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-void uppercase transition-transform hover:scale-105"
                >
                  <Mail size={14} />
                  Email us
                </a>
              )}
              <Link
                href="/legal/contact"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-bone uppercase transition-colors hover:border-acid hover:text-acid"
              >
                Contact & reporting
              </Link>
            </div>
          </div>

          <nav
            aria-label="Previous and next document"
            className="grid gap-3 pt-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/legal/${prev.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-panel/50 p-5 transition-colors hover:border-acid/40"
              >
                <ArrowLeft size={16} className="text-acid" />
                <span>
                  <span className="block text-[10px] tracking-[0.24em] text-fog uppercase">
                    Previous
                  </span>
                  <span className="font-display text-xl tracking-[0.06em] uppercase">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/legal/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-line bg-panel/50 p-5 text-right transition-colors hover:border-acid/40"
              >
                <span>
                  <span className="block text-[10px] tracking-[0.24em] text-fog uppercase">
                    Next
                  </span>
                  <span className="font-display text-xl tracking-[0.06em] uppercase">
                    {next.title}
                  </span>
                </span>
                <ArrowRight size={16} className="text-acid" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
