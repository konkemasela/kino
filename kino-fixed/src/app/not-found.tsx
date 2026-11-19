import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Film size={28} className="text-fog" aria-hidden="true" />
      <h1 className="text-5xl font-semibold text-bone sm:text-6xl">Page not found</h1>
      <p className="max-w-md text-sm leading-6 text-fog">This page may have moved, or the address may be incorrect.</p>
      <Link href="/" className="mt-2 inline-flex min-h-11 items-center rounded-md bg-acid px-5 text-sm font-semibold text-void">Go to KINO home</Link>
    </main>
  );
}
