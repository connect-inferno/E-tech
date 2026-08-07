import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteContent } from "@/data/siteContent";
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  const info = siteContent.contact.info;

  return (
    <main className="min-h-screen bg-luxury-bg text-luxury-text-primary overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/5 bg-gradient-to-b from-luxury-card/60 via-luxury-bg to-luxury-bg">
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumbs />

          <div className="inline-flex items-center gap-2 px-3 py-1 border border-luxury-accent/30 bg-luxury-accent/10 rounded-sm text-xs font-mono uppercase tracking-widest text-luxury-accent mt-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-light tracking-tight text-white">
            Terms of Service &amp; <span className="text-luxury-accent">Commercial Terms</span>
          </h1>

          <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
            Last Updated: August 2026 | Governing Elevator Engineering &amp; Maintenance Services across Maharashtra
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-10 text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
          
          <div className="space-y-3 bg-luxury-card/40 p-6 border border-white/5 rounded-sm">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-luxury-accent" />
              1. Technical Estimates &amp; Quotation Scope
            </h2>
            <p>
              All pricing estimates, equipment specifications, and timeline projections generated via our online portal or preliminary estimates are subject to physical site inspection, hoistway plumb line audits, pit depth checks, and structural verification by E-Tech engineers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white">
              2. Site Preparedness &amp; Customer Obligations
            </h2>
            <p>For new installations and modernization projects, the customer or building committee is responsible for providing:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-luxury-text-secondary">
              <li>A plumb, waterproofed RCC concrete hoistway shaft.</li>
              <li>Required pit depth and overhead clearance dimensions as per E-Tech engineering drawings.</li>
              <li>Dedicated 3-phase 415V power supply line with proper earthing up to the machine room.</li>
              <li>Safe access and secure storage space for elevator materials during installation.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white">
              3. Maintenance SLAs &amp; Emergency Breakdown Response
            </h2>
            <p>
              24/7 emergency breakdown dispatch priority is guaranteed for active AMC clients. Dispatch response times depend on traffic conditions, site access permissions, and extreme weather events. Non-AMC clients receive service dispatch subject to technician availability.
            </p>
          </div>

          <div className="space-y-4 bg-luxury-card/60 p-6 border border-white/10 rounded-sm">
            <h2 className="text-base md:text-lg font-heading font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-luxury-accent" />
              4. IS 14665 Safety Code Compliance
            </h2>
            <p>
              Every E-Tech elevator installation, AMC maintenance regimen, and modernization upgrade is executed in strict compliance with Bureau of Indian Standards (BIS) IS 14665 guidelines and Maharashtra Lift Rules.
            </p>
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Mandatory Integrated Safety Features:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-luxury-text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-luxury-accent shrink-0" />
                  Overspeed Governor Safety Gear
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-luxury-accent shrink-0" />
                  Automatic Rescue Device (ARD)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-luxury-accent shrink-0" />
                  Full-Height Infrared Light Curtains
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-luxury-accent shrink-0" />
                  Phase Reversal &amp; Overload Protection
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
