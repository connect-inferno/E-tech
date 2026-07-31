"use client";
import React, { useState } from "react";
import { siteContent } from "@/data/siteContent";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Mail, Clock, ArrowUpRight, ShieldCheck, Award, MapPinned, X, Lock, FileText } from "lucide-react";

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.708 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "is14665" | null>(null);
  const info = siteContent.contact.info;
  const whatsappDigits = info.whatsapp.replace(/[^\d]/g, "");
  const phoneDigits = info.phone.replace(/\s/g, "");

  // A short curated slice of services for the footer column
  const topServices = siteContent.services.items.slice(0, 5);
  const serviceAreas = siteContent.contact.serviceAreas;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-luxury-bg border-t border-white/5 pt-20 pb-8 px-6 md:px-12 overflow-hidden select-none">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-luxury-accent/[0.025] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top CTA strip */}
        <div className="mb-14 pb-14 border-b border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">Ready to talk?</span>
            <h3 className="text-2xl md:text-3xl font-heading font-light tracking-tight text-luxury-text-primary leading-tight">
              Get a quote, an AMC review, or emergency service — <span className="text-luxury-accent">reach us directly.</span>
            </h3>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={`tel:${phoneDigits}`}
              className="luxury-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Call {info.phone}</span>
            </a>
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.15em] font-medium border border-luxury-accent/40 text-luxury-accent hover:bg-luxury-accent/10 transition-colors rounded-sm whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 rounded-sm px-3 py-2 inline-block shadow-sm">
              <Image
                src="/images/etech-logo.png"
                alt={siteContent.company.name}
                width={140}
                height={90}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-luxury-text-secondary leading-relaxed font-light max-w-xs">
              {siteContent.footer.tagline}
            </p>

            {/* Certification badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-luxury-accent/25 bg-luxury-accent/5 rounded-sm text-[10px] tracking-wider text-luxury-accent">
                <Award className="w-3 h-3" /> ISO Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-white/10 bg-white/[0.02] rounded-sm text-[10px] tracking-wider text-luxury-text-secondary">
                <ShieldCheck className="w-3 h-3" /> Since 2019
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-white/10 bg-white/[0.02] rounded-sm text-[10px] tracking-wider text-luxury-text-secondary">
                <MapPinned className="w-3 h-3" /> Maharashtra
              </span>
            </div>
          </div>

          {/* Explore column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-luxury-text-secondary">
              {siteContent.navigation.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="inline-flex items-center gap-1 hover:text-luxury-accent transition-colors duration-300 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-luxury-accent transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-luxury-text-secondary">
              {topServices.map((svc) => (
                <li key={svc.id}>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 hover:text-luxury-accent transition-colors duration-300 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-luxury-accent transition-all duration-300" />
                    {svc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-luxury-accent hover:underline text-[11px] pt-1"
                >
                  View all services <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs font-light text-luxury-text-secondary">
              <li className="flex gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-luxury-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{info.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="w-3.5 h-3.5 text-luxury-accent shrink-0 mt-0.5" />
                <a href={`tel:${phoneDigits}`} className="hover:text-luxury-accent transition-colors">
                  {info.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MessageCircle className="w-3.5 h-3.5 text-luxury-accent shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-luxury-accent transition-colors"
                >
                  {info.whatsapp}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="w-3.5 h-3.5 text-luxury-accent shrink-0 mt-0.5" />
                <a href={`mailto:${info.email}`} className="hover:text-luxury-accent transition-colors break-all">
                  {info.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="w-3.5 h-3.5 text-luxury-accent shrink-0 mt-0.5" />
                <span>{info.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Service Areas row */}
        <div className="mt-14 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-4 md:gap-8 md:items-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-accent font-semibold shrink-0">
            Service Areas
          </span>
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1 border border-white/10 rounded-sm text-[10px] tracking-wide text-luxury-text-secondary bg-white/[0.02]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-luxury-text-secondary font-light">
          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
            <p>{siteContent.footer.disclaimer}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-luxury-text-secondary pt-1 md:pt-0">
              <button
                type="button"
                onClick={() => setActiveModal("privacy")}
                className="hover:text-luxury-accent transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Privacy Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={() => setActiveModal("terms")}
                className="hover:text-luxury-accent transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Terms &amp; Conditions
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={() => setActiveModal("is14665")}
                className="hover:text-luxury-accent transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                IS 14665 Safety Code
              </button>
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            {siteContent.footer.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-luxury-accent transition-colors"
              >
                {social.name} <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Legal & Policy Glassmorphic Modal Window */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className="bg-[#0e0e12] border border-white/10 rounded-sm max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-10">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                {activeModal === "privacy" && <Lock className="w-4 h-4 text-luxury-accent" />}
                {activeModal === "terms" && <FileText className="w-4 h-4 text-luxury-accent" />}
                {activeModal === "is14665" && <ShieldCheck className="w-4 h-4 text-luxury-accent" />}
                <h3 className="text-sm font-heading font-semibold uppercase tracking-widest text-luxury-text-primary">
                  {activeModal === "privacy" && "Privacy Policy"}
                  {activeModal === "terms" && "Terms & Conditions / Disclaimer"}
                  {activeModal === "is14665" && "IS 14665 Elevator Safety Code Compliance"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-luxury-text-secondary hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-luxury-text-secondary font-light leading-relaxed">
              {activeModal === "privacy" && (
                <>
                  <p className="text-luxury-text-primary font-medium">
                    E-Tech Elevators &amp; Escalators ("E-Tech") is committed to protecting the privacy and security of your personal data.
                  </p>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">1. Information We Collect</h4>
                    <p>When you submit an enquiry through our CRM form or WhatsApp, we collect basic details including your name, contact phone number, email address, site location, and elevator specifications.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">2. Use of Information</h4>
                    <p>Your details are used exclusively by E-Tech's engineering desk to evaluate site requirements, generate accurate technical estimates, and dispatch emergency breakdown technicians.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">3. Data Security &amp; Non-Disclosure</h4>
                    <p>We strictly enforce zero third-party data sharing. Your personal and project information is never sold, rented, or distributed to outside marketing vendors.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">4. Contact Privacy Desk</h4>
                    <p>For any privacy queries or data removal requests, contact our desk at e.tech5534@gmail.com or +91 95884 09957.</p>
                  </div>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <p className="text-luxury-text-primary font-medium">
                    Terms &amp; Conditions for E-Tech Elevators &amp; Escalators Services &amp; Web Portal.
                  </p>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">1. Quotations &amp; Technical Estimates</h4>
                    <p>All pricing estimates, equipment specifications, and timeline projections generated via our online portal or preliminary brochures are subject to physical site inspection, hoistway plumb line audits, and structural verification by E-Tech engineers.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">2. Maintenance &amp; Emergency Response SLAs</h4>
                    <p>24/7 emergency breakdown dispatch priority is provided for active AMC clients. Dispatch response times depend on traffic conditions, site access, and severe weather emergencies.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">3. Site Preparedness</h4>
                    <p>For new installations and modernization projects, the customer / building committee is responsible for providing a plumb concrete shaft, required pit depth, overhead clearance, and 3-phase power supply as specified in E-Tech engineering layouts.</p>
                  </div>
                </>
              )}

              {activeModal === "is14665" && (
                <>
                  <p className="text-luxury-text-primary font-medium">
                    Compliance with Bureau of Indian Standards (BIS) IS 14665 Guidelines for Electric Traction &amp; Hydraulic Elevators.
                  </p>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">1. Safety Standards Adherence</h4>
                    <p>Every E-Tech elevator installation, AMC maintenance regimen, and modernization upgrade is executed in full compliance with IS 14665 (Parts 1–5) and Maharashtra Lift Rules.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">2. Essential Safety Devices</h4>
                    <p>Our elevator systems incorporate mandatory safety features including Overspeed Governor drop safety gears, Automatic Rescue Devices (ARD), Phase reversal protection, Infra-red full-height door curtain sensors, and Emergency Stop alarms.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-luxury-accent font-semibold uppercase tracking-wider text-[10px]">3. Periodical Audits</h4>
                    <p>AMC contracts include periodic hoistway rope tension audits, brake lining wear checks, and battery backup telemetry to maintain 100% safety certification.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="luxury-btn px-6 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
