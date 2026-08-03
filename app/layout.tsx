import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "SHD Quartermaster — Division 2 Expertise Calculator",
      template: "%s · SHD Quartermaster",
    },
    description:
      "A fast, interactive Division 2 Expertise resource planner with current level 0–30 upgrade costs.",
    applicationName: "SHD Quartermaster",
    keywords: ["The Division 2", "Expertise", "calculator", "upgrade costs", "SHD"],
    authors: [{ name: "skuldgerry" }],
    creator: "skuldgerry",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      title: "SHD Quartermaster",
      description: "Plan every Expertise upgrade from 0 to 30 before spending a single component.",
      siteName: "SHD Quartermaster",
      images: [{ url: socialImage, width: 1734, height: 907, alt: "SHD Quartermaster — Division 2 Expertise Calculator" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "SHD Quartermaster",
      description: "Division 2 Expertise calculation, rebuilt for level 30.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#090d10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
