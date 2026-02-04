import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLink from "@/components/ui/SkipLink";
import ClientTelemetry from "@/components/observability/ClientTelemetry";
import { validateEnv } from "@/lib/env";
import "./globals.css";

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
        className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen"
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
