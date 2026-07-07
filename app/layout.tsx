import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://isoml.com"),
  title: {
    default: "ISOML — In Search of Modern Law",
    template: "%s | ISOML",
  },
  description:
    "AI-powered legal intelligence that organizes discovery, maps evidence to statutory elements, compares precedent, and reveals the data that can make or break a case.",
  keywords: [
    "legal technology",
    "AI legal research",
    "discovery organization",
    "sentencing analytics",
    "justice data engine",
    "legal intelligence",
    "ISOML",
  ],
  authors: [{ name: "Oh Ya Inc." }],
  creator: "Oh Ya Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://isoml.com",
    siteName: "ISOML",
    title: "ISOML — In Search of Modern Law",
    description:
      "AI-powered legal intelligence for discovery, precedent, sentencing transparency, and fairness analysis.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ISOML — In Search of Modern Law",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISOML — In Search of Modern Law",
    description:
      "AI-powered legal intelligence for discovery, precedent, sentencing transparency, and fairness analysis.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
