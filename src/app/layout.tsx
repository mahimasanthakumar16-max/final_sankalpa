import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";
import { safeFetch } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await safeFetch(siteSettingsQuery);

    return {
      title: settings?.seo?.metaTitle || settings?.title || "Sankalpa Counseling | Premium Psychotherapy & Counseling in Tamil Nadu",
      description: settings?.seo?.metaDescription || settings?.description || "A premium modern therapy private practice providing emotionally safe, calming, and professional psychotherapy and counseling.",
      keywords: settings?.seo?.keywords?.join(", ") || "therapy, counseling, psychotherapy, mental health, Tamil Nadu, emotional wellness, Sankalpa Counseling",
      icons: {
        icon: "/images/LOTO.png",
        shortcut: "/images/LOTO.png",
        apple: "/images/LOTO.png"
      },
      openGraph: {
        images: settings?.seo?.ogImage ? [settings.seo.ogImage] : [],
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Sankalpa Counseling | Premium Psychotherapy & Counseling in Tamil Nadu",
      description: "A premium modern therapy private practice providing emotionally safe, calming, and professional psychotherapy and counseling.",
      icons: {
        icon: "/images/LOTO.png",
        shortcut: "/images/LOTO.png",
        apple: "/images/LOTO.png"
      },
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await safeFetch(siteSettingsQuery);
  } catch (error) {
    console.error("RootLayout settings fetch failed:", error);
  }

  return (
    <html lang="en">
      <head>
        {/* Temporarily commented out GA to troubleshoot hangs */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}
      </head>
      <body>
        <Navigation settings={settings || undefined} />
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
        <Footer settings={settings || undefined} />
      </body>
    </html>
  );
}


