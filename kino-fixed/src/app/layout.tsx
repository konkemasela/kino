import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Instrument_Serif, Manrope } from "next/font/google";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import LegalNotice from "@/components/layout/legal-notice";
import SettingsApplier from "@/features/settings/components/settings-applier";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: { default: "KINO — Watch Movies & TV Shows", template: "%s — KINO" },
  description: "KINO is a cinematic streaming discovery platform. Browse trending movies and TV shows, pick a VidSrc server, and start watching in seconds.",
  applicationName: "KINO",
  generator: "KINO",
  icons: { icon: "/kino-logo.png", shortcut: "/kino-logo.png", apple: "/kino-logo.png" },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#050805",
    "msapplication-config": "none",
    "theme-color": "#050805",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "KINO",
  },
};

export const viewport: Viewport = { themeColor: "#080808", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebas.variable} ${manrope.variable} ${instrument.variable}`}>
      <body className="bg-void font-sans text-bone antialiased">
        <script dangerouslySetInnerHTML={{ __html: 'try{var s=JSON.parse(localStorage.getItem("kino:settings")||"{}");if(s.reducedMotion)document.documentElement.classList.add("reduce-motion");if(s.compactUi)document.documentElement.classList.add("compact");if(s.theme==="light")document.documentElement.classList.add("light")}catch{}' }} />
        <SettingsApplier />
        <Navigation />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <ScrollToTopButton />
        <LegalNotice />
      </body>
    </html>
  );
}
