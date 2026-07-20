"use client";

import React, { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrmForm from "@/components/CrmForm";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  PhoneCall,
  Building2,
  MessageCircle,
  MapPinned,
  Sparkles,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const container = containerRef.current;
    if (!container) return;

    const headerItems = container.querySelectorAll(".animate-header");
    gsap.fromTo(
      headerItems,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power3.out" }
    );

    const panels = container.querySelectorAll(".animate-panel");
    gsap.fromTo(
      panels,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1.0, ease: "power2.out" }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const info = siteContent.contact.info;
  const serviceAreas = siteContent.contact.serviceAreas;
  const whatsappDigits = info.whatsapp.replace(/[^\d]/g, "");

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">
            {siteContent.contact.subtitle}
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            Connect <span className="font-light text-luxury-accent">With E Tech</span>
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            {siteContent.contact.description}
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Split CRM Form & HQ / Service Areas */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

          {/* Left Column: Pune HQ + Service Areas + 24/7 Line */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32 self-start animate-panel">

            {/* Pune Headquarters */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Headquarters
                </span>
                <h3 className="text-xl font-heading font-light tracking-wide text-luxury-text-primary">
                  Pune, Maharashtra
                </h3>
              </div>

              <div className="p-6 border border-white/5 bg-luxury-card rounded-sm space-y-5">
                <div className="flex gap-3 text-xs font-light text-luxury-text-secondary">
                  <MapPin className="w-4 h-4 text-luxury-accent shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{info.address}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-semibold block">Phone</span>
                    <a href={`tel:${info.phone.replace(/\s/g, "")}`} className="text-xs text-luxury-accent hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {info.phone}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-semibold block">WhatsApp</span>
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-luxury-accent hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> {info.whatsapp}
                    </a>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-semibold block">Email</span>
                    <a href={`mailto:${info.email}`} className="text-xs text-luxury-accent hover:underline flex items-center gap-1 truncate block">
                      <Mail className="w-3 h-3 shrink-0" /> {info.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 items-center text-[10px] text-luxury-text-secondary pt-2">
                  <Clock className="w-3.5 h-3.5 text-luxury-accent" />
                  <span>{info.hours}</span>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold flex items-center gap-1.5">
                  <MapPinned className="w-3.5 h-3.5" /> Service Areas
                </span>
                <h3 className="text-sm font-heading font-light tracking-wide text-luxury-text-primary">
                  Across Maharashtra
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 border border-white/10 rounded-sm text-[11px] tracking-wide text-luxury-text-secondary bg-white/[0.02]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Hotline */}
            <div className="p-6 border border-red-500/10 bg-luxury-card/40 rounded-sm space-y-4 relative overflow-hidden group">
              <div className="absolute -inset-12 bg-red-500/3 blur-3xl pointer-events-none rounded-full" />

              <div className="flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <PhoneCall className="w-4 h-4 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-red-500 font-semibold">24/7 Breakdown Hotline</h4>
                  <p className="text-[10px] text-luxury-text-secondary font-light">15-minute emergency response</p>
                </div>
              </div>
              <a
                href={`tel:${info.phone.replace(/\s/g, "")}`}
                className="block text-xl font-heading font-light text-luxury-text-primary tracking-wide relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              >
                {info.phone}
              </a>
              <p className="text-[10px] text-luxury-text-secondary leading-relaxed font-light relative z-10">
                Active AMC contracts receive priority dispatch. Call or WhatsApp — a real engineer answers.
              </p>
            </div>

            {/* Brand Assurance */}
            <div className="flex items-center gap-3 p-4 border border-white/5 bg-white/[0.01] rounded-sm">
              <Sparkles className="w-5 h-5 text-luxury-accent shrink-0" />
              <p className="text-[10px] uppercase tracking-wider text-luxury-text-secondary leading-relaxed font-light">
                ISO Certified · Serving Maharashtra since 2019 · 500+ lifts under maintenance
              </p>
            </div>

          </div>

          {/* Right Column: CRM Form */}
          <div className="lg:col-span-7 animate-panel">
            <div id="crm-form-container" className="p-1 border border-white/5 bg-luxury-card/30 rounded-sm">
              <CrmForm />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
