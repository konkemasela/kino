import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ListTree, Mail } from "lucide-react";
import { EMAIL_CONFIGURED, SITE } from "@/lib/site-config";
import { LEGAL_DOCS, type LegalEntry } from "../docs";

function Toc({ entry }: { entry: LegalEntry }) {
  return <ol className="space-y-1 text-sm">{entry.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="block rounded-md px-2 py-1.5 text-fog transition-colors hover:bg-panel2 hover:text-bone">{section.title}</a></li>)}</ol>;
}

export default function LegalDocument({ entry }: { entry: LegalEntry }) {
  const index = LEGAL_DOCS.findIndex((document) => document.slug === entry.slug);
  const previous = index > 0 ? LEGAL_DOCS[index - 1] : null;
  const next = index < LEGAL_DOCS.length - 1 ? LEGAL_DOCS[index + 1] : null;
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <Link href="/legal" className="inline-flex min-h-9 items-center gap-2 text-sm text-fog hover:text-bone"><ArrowLeft size={16} />All legal documents</Link>
      <header className="mt-5 max-w-3xl"><p className="text-sm font-medium text-fog">{entry.kicker}</p><h1 className="mt-2 text-3xl font-semibold text-bone sm:text-4xl">{entry.title}</h1><p className="mt-3 text-sm leading-6 text-fog">{entry.summary}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-fog"><span className="inline-flex items-center gap-2"><CalendarDays size={14} />Effective {SITE.effectiveDate} · v{SITE.version}</span><span className="inline-flex items-center gap-2"><Clock size={14} />{entry.minutes} min read</span></div></header>
      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside><details className="rounded-lg border border-line bg-panel p-4 lg:hidden"><summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-bone"><ListTree size={16} className="text-acid" />Contents</summary><div className="mt-3"><Toc entry={entry} /></div></details><nav aria-label="On this page" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block"><p className="mb-2 flex items-center gap-2 text-sm font-medium text-bone"><ListTree size={16} className="text-acid" />Contents</p><Toc entry={entry} /></nav></aside>
        <div className="min-w-0 space-y-3">{entry.sections.map((section) => <article key={section.id} id={section.id} className="scroll-mt-24 rounded-lg border border-line bg-panel p-4 sm:p-5"><h2 className="text-lg font-semibold text-bone">{section.title}</h2><div className="mt-3 space-y-3 text-sm leading-6 text-fog">{section.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}{section.list && <ul className="list-disc space-y-1 pl-5 marker:text-acid">{section.list.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>}{section.after?.map((paragraph, paragraphIndex) => <p key={`after-${paragraphIndex}`}>{paragraph}</p>)}{section.note && <p className="rounded-md border border-line bg-panel2 p-3 text-bone/85">{section.note}</p>}</div></article>)}
          <section className="rounded-lg border border-line bg-panel p-4 sm:p-5"><h2 className="text-lg font-semibold text-bone">Questions?</h2><p className="mt-2 text-sm leading-6 text-fog">{EMAIL_CONFIGURED ? "Email us and we will do our best to help." : "Contact details are available on the contact page."}</p><div className="mt-4 flex flex-wrap gap-2">{EMAIL_CONFIGURED && <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`[General] ${entry.title}`)}`} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-acid px-4 text-sm font-medium text-void"><Mail size={15} />Email us</a>}<Link href="/legal/contact" className="inline-flex min-h-10 items-center rounded-md border border-line px-4 text-sm text-bone">Contact</Link></div></section>
          <nav aria-label="Previous and next document" className="grid gap-2 pt-2 sm:grid-cols-2">{previous ? <Link href={`/legal/${previous.slug}`} className="flex min-h-16 items-center gap-3 rounded-lg border border-line bg-panel p-4 hover:border-acid/50"><ArrowLeft size={16} className="text-fog" /><span><span className="block text-xs text-fog">Previous</span><span className="text-sm font-medium text-bone">{previous.title}</span></span></Link> : <span />}{next && <Link href={`/legal/${next.slug}`} className="flex min-h-16 items-center justify-end gap-3 rounded-lg border border-line bg-panel p-4 text-right hover:border-acid/50"><span><span className="block text-xs text-fog">Next</span><span className="text-sm font-medium text-bone">{next.title}</span></span><ArrowRight size={16} className="text-fog" /></Link>}</nav>
        </div>
      </div>
    </div>
  );
}
