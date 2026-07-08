import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
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
      "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي.",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "عبدالمجيد الضاعني | مصمم جرافيك ومسوّق رقمي",
    description:
      "مصمم جرافيك ومسوّق رقمي محترف مع خبرة واسعة في التصميم الإبداعي والتسويق الرقمي.",
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>{children}</LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
