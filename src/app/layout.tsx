import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import GsapProvider from "@/components/ui/gsap-provider";

export const metadata: Metadata = {
  metadataBase: new URL('https://al-daani.xyz'),
  title: "عبدالمجيد الضاعني | مصمم جرافيك ومسوّق رقمي",
  description:
    "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي. أقدم حلولاً إبداعية تمزج بين الفن والتقنية لتحقيق رؤية عملائك.",
  keywords: [
    "تصميم جرافيك",
    "تسويق رقمي",
    "عبدالمجيد الضاعني",
    "Graphic Design",
    "Digital Marketing",
    "Branding",
    "هوية بصرية",
    "تصميم شعارات",
  ],
  authors: [{ name: "عبدالمجيد الضاعني" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    title: "عبدالمجيد الضاعني | مصمم جرافيك ومسوّق رقمي",
    description:
      "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي. أقدم حلولاً إبداعية تمزج بين الفن والتقنية لتحقيق رؤية عملائك.",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "عبدالمجيد الضاعني | مصمم جرافيك ومسوّق رقمي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عبدالمجيد الضاعني | مصمم جرافيك ومسوّق رقمي",
    description:
      "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي.",
    images: ['/og-image.png'],
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
    alternateName: "Abdulmajid Al-Daani",
    jobTitle: "مصمم جرافيك ومسوّق رقمي",
    description:
      "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي.",
    knowsAbout: [
      "Graphic Design",
      "Digital Marketing",
      "Branding",
      "Social Media Marketing",
      "UI/UX Design",
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
        {/* Animate.css */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
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
        <Toaster />
      </body>
    </html>
  );
}
