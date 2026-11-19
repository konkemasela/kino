import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ScrollToTopButton from "@/components/layout/scroll-to-top";
import LegalNotice from "@/components/layout/legal-notice";
import SettingsApplier from "@/features/settings/components/settings-applier";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: { default: "KINO — Movies and series", template: "%s — KINO" },
  description: "Browse movies, series and anime. Save titles and pick up where you left off.",
  applicationName: "KINO",
  generator: "KINO",
  icons: { icon: "/kino-logo.png", shortcut: "/kino-logo.png", apple: "/kino-logo.png" },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#080908",
    "msapplication-config": "none",
    "theme-color": "#080908",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "KINO",
  },
};

export const viewport: Viewport = { themeColor: "#080908", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="bg-void font-sans text-bone antialiased">
        <script dangerouslySetInnerHTML={{ __html: 'try{var s=JSON.parse(localStorage.getItem("kino:settings")||"{}");if(s.reducedMotion)document.documentElement.classList.add("reduce-motion");if(s.compactUi)document.documentElement.classList.add("compact");if(s.theme==="light")document.documentElement.classList.add("light")}catch{}' }} />
        <SettingsApplier />
        <Navigation />
        <main className="min-h-screen pt-[68px]">{children}</main>
        <Footer />
        <ScrollToTopButton />
        <LegalNotice />
      </body>
    </html>
  );
}
