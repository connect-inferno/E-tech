import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CrmForm from "@/components/CrmForm";
import { siteContent } from "@/data/siteContent";
import { MapPin, CheckCircle2, Phone, ArrowRight } from "lucide-react";

interface CityInfo {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  highlights: string[];
  serviceCount: string;
  popularTypes: string[];
}

const LOCATION_DATA: Record<string, CityInfo> = {
  pune: {
    slug: "pune",
    name: "Pune",
    region: "Pune Metropolitan Region",
    tagline: "Premier Elevator Installation & 24/7 Maintenance in Pune",
    description: "E-Tech Elevators provides ISO 9001:2015 certified elevator installation, preventative AMC, breakdown response, and high-speed passenger lift modernization across Pune.",
    highlights: [
      "15-Minute Rapid Emergency Breakdown Response in Pune Central",
      "Specialized High-Rise Passenger & Commercial MRL Elevators",
      "Comprehensive Annual Maintenance Contracts (AMC) with OEM Spares",
      "Compliance with IS 14665 & Maharashtra Lift Rules",
    ],
    serviceCount: "250+ Lifts Managed",
    popularTypes: ["Passenger Elevators", "Commercial MRL Lifts", "Home Elevators", "Hospital Lifts"],
  },
  "pimpri-chinchwad": {
    slug: "pimpri-chinchwad",
    name: "Pimpri Chinchwad",
    region: "PCMC Industrial & Residential Hub",
    tagline: "Industrial Goods Lifts & Residential Elevators in PCMC",
    description: "Serving Nigdi, Akurdi, Chinchwad, Bhosari, and Pimpri with heavy-duty goods elevators, hydraulic lifts, and residential apartment elevator AMC maintenance.",
    highlights: [
      "Heavy Industrial Freight & Goods Lifts Up to 5000 kg",
      "Dedicated PCMC Breakdown Response Team",
      "Energy Efficient Gearless MRL Installations",
      "100% Genuine Spare Parts & Battery Backup ARD Systems",
    ],
    serviceCount: "180+ Lifts Managed",
    popularTypes: ["Goods & Freight Lifts", "Stretcher Lifts", "Gearless Passenger Lifts", "Hydraulic Lifts"],
  },
  chakan: {
    slug: "chakan",
    name: "Chakan",
    region: "Chakan Industrial Zone & Auto Hub",
    tagline: "Heavy-Duty Industrial Freight & Warehouse Elevator Specialists",
    description: "Custom engineered heavy-capacity industrial elevators, goods hoists, and factory material lifts built for Chakan MIDC Phase 1, 2, 3, and 4 automotive plants.",
    highlights: [
      "Industrial Duty Elevators Engineered for 24/7 Factory Operations",
      "Flameproof & Weatherproof Mechanical Options Available",
      "Dedicated MIDC On-Call Mobile Engineers",
      "Safety Audits Compliant with Factory Inspector Standards",
    ],
    serviceCount: "110+ Industrial Lifts",
    popularTypes: ["Industrial Goods Elevators", "Hydraulic Material Hoists", "Heavy Duty Freight Lifts", "Automotive Vehicle Lifts"],
  },
  talegaon: {
    slug: "talegaon",
    name: "Talegaon",
    region: "Talegaon Dabhade & Floriculture Belt",
    tagline: "Residential Society & Commercial Lift Solutions in Talegaon",
    description: "Reliable, whisper-quiet elevator installation and cost-effective AMC services for housing societies, townships, and commercial spaces in Talegaon Dabhade.",
    highlights: [
      "Whisper-Quiet Smooth Ride Gearless Drives",
      "Automatic Rescue Device (ARD) Integrated as Standard",
      "Affordable Society AMC Packages with Zero Hidden Costs",
      "Fast 24-Hour Quotation Turnaround",
    ],
    serviceCount: "60+ Lifts Managed",
    popularTypes: ["Passenger Lifts", "Compact Home Elevators", "Capsule Elevators"],
  },
  bhosari: {
    slug: "bhosari",
    name: "Bhosari",
    region: "Bhosari MIDC & Manufacturing Hub",
    tagline: "MIDC Bhosari Industrial & Commercial Elevator Engineering",
    description: "Precision engineered material handling lifts, industrial goods elevators, and commercial office passenger lifts for Bhosari MIDC manufacturers and IT parks.",
    highlights: [
      "High Duty Cycle Freight Machines Built for Continuous Use",
      "Rapid Response Breakdown Desk in Bhosari",
      "Custom Car Dimensions & Heavy Diamond Plate Flooring",
      "Complete Modernization for Aging Industrial Lift Assets",
    ],
    serviceCount: "95+ Lifts Managed",
    popularTypes: ["Industrial Goods Lifts", "Commercial Passenger Lifts", "Hydraulic Scissor & Freight Lifts"],
  },
  ranjangaon: {
    slug: "ranjangaon",
    name: "Ranjangaon",
    region: "Ranjangaon MIDC Industrial Corridor",
    tagline: "Industrial Goods Elevators & Plant Passenger Lifts in Ranjangaon",
    description: "Turnkey vertical transportation for Ranjangaon MIDC industrial plants, food processing units, and manufacturing facilities.",
    highlights: [
      "Rugged Stainless Steel IP-Rated Industrial Cabins",
      "Heavy Payload Load Cells & Overload Safety Alarms",
      "Preventative Maintenance SLA Guarantees Maximum Uptime",
      "Certified Safety Engineers for Industrial Plants",
    ],
    serviceCount: "45+ Industrial Units",
    popularTypes: ["Goods & Freight Elevators", "Heavy Duty Cargo Lifts", "Commercial Staff Lifts"],
  },
  nashik: {
    slug: "nashik",
    name: "Nashik",
    region: "Nashik Municipal Region & Ambad MIDC",
    tagline: "Elevator Installation, Modernization & AMC Services in Nashik",
    description: "Complete elevator lifecycle services across Nashik, Ambad, Satpur, and Panchavati — from luxury home lifts to high-traffic commercial building elevators.",
    highlights: [
      "Architectural Glass Capsule & Luxury Villa Elevators",
      "Complete Lift Modernization & Controller Upgrades",
      "Preventative Maintenance Programs for Residential Towers",
      "ISO Certified Quality Management & Full Warranty Coverage",
    ],
    serviceCount: "70+ Lifts Managed",
    popularTypes: ["Luxury Home Lifts", "Capsule Elevators", "Commercial Passenger Lifts"],
  },
  mumbai: {
    slug: "mumbai",
    name: "Mumbai",
    region: "Mumbai Metropolitan Region",
    tagline: "High-Speed & Compact MRL Elevator Engineering for Mumbai",
    description: "Engineered vertical mobility solutions for high-density residential buildings, commercial towers, and retrofitted structures across the Mumbai region.",
    highlights: [
      "Machine-Room-Less (MRL) Technology Saving Premium Overhead Space",
      "High Speed Smooth Acceleration Variable Frequency Drives",
      "Retrofit Elevator Shaft Construction & Modernization",
      "24/7 Breakdown Dispatch and Emergency Helpline",
    ],
    serviceCount: "130+ Lifts Managed",
    popularTypes: ["High-Speed MRL Passenger Lifts", "Compact Shaft Home Lifts", "Hospital Stretcher Lifts"],
  },
};

export async function generateStaticParams() {
  return Object.keys(LOCATION_DATA).map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const cityInfo = LOCATION_DATA[resolvedParams.city];

  if (!cityInfo) {
    return {
      title: "Location Not Found | E TECH ELEVATORS",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.e-techelevators.com";
  const canonicalUrl = `${baseUrl}/locations/${cityInfo.slug}`;

  return {
    title: `${cityInfo.name} Elevator Installation, AMC & Maintenance | E TECH ELEVATORS`,
    description: cityInfo.description,
    keywords: [
      `Elevator company ${cityInfo.name}`,
      `Elevator installation ${cityInfo.name}`,
      `Lift AMC ${cityInfo.name}`,
      `Elevator repair ${cityInfo.name}`,
      `Industrial goods lift ${cityInfo.name}`,
      `Lift breakdown service ${cityInfo.name}`,
      `E Tech Elevators ${cityInfo.name}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cityInfo.name} Elevator Services | E TECH ELEVATORS`,
      description: cityInfo.description,
      url: canonicalUrl,
      siteName: siteContent.company.name,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `E-Tech Elevators ${cityInfo.name}`,
        },
      ],
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const cityInfo = LOCATION_DATA[resolvedParams.city];

  if (!cityInfo) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.e-techelevators.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${siteContent.company.name} - ${cityInfo.name}`,
    "image": `${baseUrl}/og-image.jpg`,
    "@id": `${baseUrl}/locations/${cityInfo.slug}`,
    "url": `${baseUrl}/locations/${cityInfo.slug}`,
    "telephone": siteContent.contact.info.phone,
    "email": siteContent.contact.info.email,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityInfo.name,
      "addressRegion": "Maharashtra",
      "addressCountry": "IN",
    },
    "areaServed": {
      "@type": "City",
      "name": cityInfo.name,
    },
    "description": cityInfo.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-luxury-bg text-luxury-text-primary overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-12 border-b border-white/5 bg-gradient-to-b from-luxury-card/60 via-luxury-bg to-luxury-bg">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />

            <div className="mt-8 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-luxury-accent/30 bg-luxury-accent/10 rounded-sm text-xs font-mono uppercase tracking-widest text-luxury-accent">
                <MapPin className="w-3.5 h-3.5" />
                <span>{cityInfo.region}</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-light tracking-tight leading-tight text-white">
                Elevator Installation, AMC &amp; Breakdown Service in{" "}
                <span className="text-luxury-accent font-normal">{cityInfo.name}</span>
              </h1>

              <p className="text-base md:text-lg text-luxury-text-secondary font-light leading-relaxed">
                {cityInfo.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#contact-section"
                  className="luxury-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
                >
                  Request Quote for {cityInfo.name}
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`tel:${siteContent.contact.info.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-medium border border-white/15 hover:border-luxury-accent/50 text-luxury-text-primary hover:text-luxury-accent transition-colors rounded-sm"
                >
                  <Phone className="w-4 h-4 text-luxury-accent" />
                  <span>Call Emergency Desk</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* City Highlights & Stats */}
        <section className="py-16 px-6 md:px-12 border-b border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-light tracking-tight text-white">
                Why Property Owners &amp; Factories in <span className="text-luxury-accent">{cityInfo.name}</span> Trust E-Tech
              </h2>
              <div className="space-y-4 pt-2">
                {cityInfo.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-luxury-card/40 p-4 border border-white/5 rounded-sm">
                    <CheckCircle2 className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-luxury-text-secondary leading-relaxed font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 bg-luxury-card/60 p-8 border border-white/10 rounded-sm">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-accent font-semibold">Local Fleet Presence</span>
                <div className="text-3xl font-heading font-light text-white">{cityInfo.serviceCount}</div>
                <p className="text-xs text-luxury-text-secondary font-light">
                  Active maintenance contracts, routine inspections, and new installation sites in {cityInfo.name}.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-white font-medium">Popular Elevator Configurations:</h3>
                <div className="flex flex-wrap gap-2">
                  {cityInfo.popularTypes.map((type, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-[11px] text-luxury-text-secondary rounded-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Location Contact Form Section */}
        <section id="contact-section" className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">Get Local Quotation</span>
              <h2 className="text-2xl md:text-4xl font-heading font-light text-white">
                Submit Enquiry for <span className="text-luxury-accent">{cityInfo.name}</span> Site
              </h2>
              <p className="text-xs md:text-sm text-luxury-text-secondary font-light">
                Our local engineering desk in {cityInfo.name} will prepare an exact technical specification and cost proposal.
              </p>
            </div>
            <CrmForm />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
