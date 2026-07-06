import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { siteContent } from "@/data/siteContent";
import UnderConstructionModal from "@/components/UnderConstructionModal";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.e-techelevators.com'),
  title: {
    default: siteContent.metadata.title,
    template: `%s | ${siteContent.company.name}`,
  },
  description: siteContent.metadata.description,
  keywords: [
    "Luxury Elevators",
    "Passenger Elevators",
    "Capsule Elevators",
    "Glass Elevators",
    "Home Elevators",
    "Hospital Elevators",
    "Elevator Engineering",
    "Premium Vertical Mobility",
    "Elevators India"
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
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Level 14, MG Road",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:30"
    }
  };

  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-luxury-bg text-luxury-text-primary overflow-x-hidden antialiased" suppressHydrationWarning>
        <UnderConstructionModal />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
