import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from 'next/font/google';
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sankalpacounseling.com';

  return {
    metadataBase: new URL(baseUrl),
    title: "Sankalpa Counseling | Premium Psychotherapy & Counseling in Tamil Nadu",
    description: "A premium modern therapy private practice providing emotionally safe, calming, and professional psychotherapy and counseling.",
    keywords: "therapy, counseling, psychotherapy, mental health, Tamil Nadu, emotional wellness, Sankalpa Counseling, counseling psychologist Tamil Nadu",
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: "/images/LOTO.png",
      shortcut: "/images/LOTO.png",
      apple: "/images/LOTO.png"
    },
    openGraph: {
      title: "Counseling Psychologist Tamil Nadu | Sankalpa Therapy",
      description: "Licensed psychotherapist in Tamil Nadu offering secure online therapy and relationship counseling. Book a free consultation.",
      url: baseUrl,
      siteName: "Sankalpa Counseling",
      images: [
        {
          url: '/images/LOTO.png',
          width: 512,
          height: 512,
          alt: "Sankalpa Counseling Logo",
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: "summary_large_image",
      title: "Counseling Psychologist Tamil Nadu | Sankalpa Therapy",
      description: "Licensed psychotherapist in Tamil Nadu offering secure online therapy and relationship counseling.",
      images: ['/images/LOTO.png']
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = null;

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
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
        <ToastProvider>
          <Navigation settings={settings || undefined} />
          <main style={{ paddingTop: '80px' }}>
            {children}
          </main>
          <Footer settings={settings || undefined} />
        </ToastProvider>
      </body>
    </html>
  );
}

