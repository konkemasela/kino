import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Instrument_Serif, Manrope } from "next/font/google";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "KINO — Watch Movies & TV Shows",
    template: "%s — KINO",
  },
  description:
    "KINO is a cinematic streaming discovery platform. Browse trending movies and TV shows, pick a VidSrc server, and start watching in seconds.",
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.035]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${manrope.variable} ${instrument.variable}`}
    >
      <body className="bg-void font-sans text-bone antialiased">
        <Grain />
        <Navigation />
        <div className="md:pl-20">
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
