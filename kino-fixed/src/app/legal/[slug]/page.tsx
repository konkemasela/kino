import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalDocument from "@/features/legal/components/legal-document";
import { LEGAL_DOCS, getLegalDoc } from "@/features/legal/docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLegalDoc(slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.summary };
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLegalDoc(slug);
  if (!entry) notFound();
  return <LegalDocument entry={entry} />;
}
