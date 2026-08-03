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

const themeScript = `(function(){try{var t=localStorage.getItem('expertise-calculator-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})();`;

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
  const socialImage = `${origin}/og-v2.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Expertise Calculator — The Division 2",
      template: "%s · Expertise Calculator",
    },
    description:
      "A fast, interactive Division 2 Expertise resource planner with current level 0–30 upgrade costs.",
    applicationName: "Expertise Calculator",
    keywords: ["The Division 2", "Expertise", "calculator", "upgrade costs", "SHD"],
    authors: [{ name: "skuldgerry" }],
    creator: "skuldgerry",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      title: "Expertise Calculator",
      description: "Plan every Expertise upgrade from 0 to 30 before spending a single component.",
      siteName: "Expertise Calculator",
      images: [{ url: socialImage, width: 1734, height: 907, alt: "Expertise Calculator for The Division 2" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Expertise Calculator",
      description: "Division 2 Expertise calculation, rebuilt for level 30.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080d10" },
    { media: "(prefers-color-scheme: light)", color: "#eef1f2" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
