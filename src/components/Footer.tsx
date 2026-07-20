"use client";
import React from "react";
import { siteContent } from "@/data/siteContent";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Mail, Clock, ArrowUpRight, ShieldCheck, Award, MapPinned } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
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
        <div className="mb-14 pb-14 border-b border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">Ready to talk?</span>
            <h3 className="text-2xl md:text-3xl font-heading font-light tracking-tight text-luxury-text-primary leading-tight">
              Get a quote, an AMC review, or emergency service — <span className="text-luxury-accent">reach us directly.</span>
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
            <a
              href={`tel:${phoneDigits}`}
              className="luxury-btn inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium"
            >
              <Phone className="w-3.5 h-3.5" /> Call {info.phone}
            </a>
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium border border-luxury-accent/40 text-luxury-accent hover:bg-luxury-accent/10 transition-colors rounded-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
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
          <p className="text-center md:text-left">{siteContent.footer.disclaimer}</p>
          <div className="flex items-center gap-5">
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
    </footer>
  );
}
