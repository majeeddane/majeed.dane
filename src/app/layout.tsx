import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import GsapProvider from "@/components/ui/gsap-provider";
import CustomCursor from "@/components/ui/custom-cursor";

export const metadata: Metadata = {
  metadataBase: new URL('https://al-daani.xyz'),
  title: "عبدالمجيد الضاعني | مصمم جرافيك",
  description:
    "مصمم جرافيك متخصص في الهوية البصرية والتصميم التجاري والمحتوى الإبداعي، مع خبرة في تصميم المعارض والبروفايلات التجارية والمشاريع الرقمية. الرياض، السعودية.",
  keywords: [
    "مصمم جرافيك",
    "هوية بصرية",
    "تصميم معارض",
    "بروفايلات شركات",
    "عبدالمجيد الضاعني",
    "Graphic Designer",
    "Brand Identity",
    "Exhibition Design",
    "Corporate Profiles",
    "Riyadh",
    "Saudi Arabia",
    "تصميم الرياض",
  ],
  authors: [{ name: "عبدالمجيد الضاعني", url: "https://al-daani.xyz" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "عبدالمجيد الضاعني | مصمم جرافيك",
    description:
      "مصمم جرافيك متخصص في الهوية البصرية والتصميم التجاري والمحتوى الإبداعي، مع خبرة في تصميم المعارض والبروفايلات التجارية والمشاريع الرقمية.",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: "https://al-daani.xyz",
    siteName: "Abdulmajeed Aldhanei — Graphic Designer",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "عبدالمجيد الضاعني | مصمم جرافيك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عبدالمجيد الضاعني | مصمم جرافيك",
    description:
      "مصمم جرافيك متخصص في الهوية البصرية والتصميم التجاري والمحتوى الإبداعي.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://al-daani.xyz",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrgData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "عبدالمجيد الضاعني",
    alternateName: "Abdulmajeed Aldhanei",
    jobTitle: "Graphic Designer",
    description:
      "Graphic designer specializing in visual identity, brand design, exhibition design, and corporate profiles. Based in Riyadh, Saudi Arabia.",
    url: "https://al-daani.xyz",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    knowsAbout: [
      "Graphic Design",
      "Brand Identity",
      "Visual Communication",
      "Exhibition Design",
      "Corporate Profiles",
      "Digital Design",
      "Web Design",
    ],
    sameAs: [],
  };

  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
        {/* Resource hints for faster CDN loading */}
        <link rel="preconnect" href="https://cdn-uicons.flaticon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn-uicons.flaticon.com" />

        {/* Flaticon UI Icons — Bold Rounded */}
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />

        {/* Flaticon UI Icons — Brands */}
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-brands/css/uicons-brands.css"
        />
      </head>
      <body
        className={`antialiased bg-background text-foreground`}
      >
        <GsapProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </GsapProvider>
        <CustomCursor />
        <Toaster />
      </body>
    </html>
  );
}
