import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLink from "@/components/ui/SkipLink";
import ClientTelemetry from "@/components/observability/ClientTelemetry";
import { validateEnv } from "@/lib/env";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kevin Long Photography",
    template: "%s | Kevin Long Photography",
  },
  description:
    "Boutique photography gallery featuring street, travel, and moments prints available for purchase.",
  keywords: ["photography", "prints", "street photography", "travel", "gallery", "fine art"],
  authors: [{ name: "Kevin Long" }],
  creator: "Kevin Long",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kevin Long Photography",
    title: "Kevin Long Photography",
    description:
      "Boutique photography gallery featuring street, travel, and moments prints.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Long Photography",
    description:
      "Boutique photography gallery featuring street, travel, and moments prints.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

validateEnv();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrument.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-grow scroll-smooth">
          {children}
        </main>
        <ClientTelemetry />
        <Footer />
      </body>
    </html>
  );
}
