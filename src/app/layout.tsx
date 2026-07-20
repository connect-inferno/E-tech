import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.e-techelevators.com'),
  title: {
    default: siteContent.metadata.title,
    template: `%s | ${siteContent.company.name}`,
  },
  description: siteContent.metadata.description,
  keywords: [
    "Elevator company Pune",
    "Elevator installation Maharashtra",
    "Elevator AMC Pune",
    "Lift maintenance Pimpri Chinchwad",
    "Lift modernization Nashik",
    "Passenger elevators",
    "Home elevators",
    "Hospital elevators",
    "MRL elevators",
    "Capsule elevators",
    "Hydraulic lifts",
    "24/7 breakdown service Maharashtra",
    "ISO certified elevator company",
    "E Tech Elevators",
  ],
  authors: [{ name: siteContent.company.name }],
  creator: siteContent.company.name,
  publisher: siteContent.company.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    url: '/',
    siteName: siteContent.company.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteContent.company.name,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    creator: '@etechelevators',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteContent.company.name,
    "image": "https://www.e-techelevators.com/og-image.jpg",
    "@id": "https://www.e-techelevators.com",
    "url": "https://www.e-techelevators.com",
    "telephone": siteContent.contact.info.phone,
    "email": siteContent.contact.info.email,
    "priceRange": "$$",
    "foundingDate": "2019",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "410505",
      "addressCountry": "IN",
    },
    "areaServed": siteContent.contact.serviceAreas.map((city) => ({
      "@type": "City",
      "name": city,
    })),
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:30",
    },
    "sameAs": siteContent.footer.socials.map((s) => s.href),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-luxury-bg text-luxury-text-primary overflow-x-hidden antialiased" suppressHydrationWarning>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
