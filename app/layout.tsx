import type { Metadata } from "next";
import { Figtree, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://isoml.com"),
  title: {
    default: "isoML — Reachy Mini × You",
    template: "%s · isoML",
  },
  description:
    "isoML — in search of Machine Learning. Collect stories, preferences, and writing into a digital twin, then bring it to life with Reachy Mini.",
  keywords: [
    "isoML",
    "digital twin",
    "Reachy Mini",
    "personal AI",
    "personality studio",
    "machine learning",
  ],
  authors: [{ name: "Oh Ya Inc." }],
  creator: "Oh Ya Inc.",
  alternates: {
    canonical: "https://isoml.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://isoml.com",
    siteName: "isoML",
    title: "isoML — An AI twin. A robot personality. Unmistakably you.",
    description:
      "Teach your digital twin how you think and communicate, then connect it to Reachy Mini.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "isoML — Reachy Mini × You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "isoML — Reachy Mini × You",
    description:
      "Collect, understand, configure, test, and connect a digital twin for Reachy Mini.",
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
    <html lang="en">
      <body className={`${space.variable} ${figtree.variable} site-shell antialiased`}>
        <GoogleAnalytics />
        <Navbar />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
