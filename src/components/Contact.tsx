"use client";

import React, { useEffect, useRef } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Clock, PhoneCall } from "lucide-react";
import CrmForm from "./CrmForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header reveal
    const headerElements = section.querySelectorAll(".animate-header");
    gsap.fromTo(
      headerElements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      }
    );

    // Form and Info blocks slide-in stagger
    const panels = section.querySelectorAll(".animate-panel");
    gsap.fromTo(
      panels,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg border-t border-white/5 overflow-hidden"
    >
      {/* Large abstract architectural background image with low opacity */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-10">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
          alt="Architectural Backdrop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-transparent to-luxury-bg" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
            {siteContent.contact.subtitle}
          </span>
          <h2 className="animate-header text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary">
            {siteContent.contact.title}
          </h2>
          <div className="animate-header w-20 h-[1px] bg-luxury-accent/30 mx-auto md:mx-0 mt-6" />
        </div>

        {/* Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 space-y-12 animate-panel">
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-luxury-text-secondary leading-relaxed font-light">
                {siteContent.contact.description}
              </p>
            </div>

            {/* Business info checklist */}
            <div className="space-y-6 text-sm font-light text-luxury-text-secondary">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-luxury-text-primary font-normal">Headquarters</p>
                  <p className="leading-relaxed">{siteContent.contact.info.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-luxury-text-primary font-normal">Business Queries</p>
                  <p>{siteContent.contact.info.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-luxury-text-primary font-normal">Technical Department</p>
                  <p>{siteContent.contact.info.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-luxury-text-primary font-normal">Office Hours</p>
                  <p>{siteContent.contact.info.hours}</p>
                </div>
              </div>

              {/* Critical Helpline */}
              <div className="flex items-start gap-4 p-4 rounded-sm bg-luxury-accent/5 border border-luxury-accent/15 max-w-md">
                <PhoneCall className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-luxury-accent font-semibold tracking-wider uppercase text-xs">24/7 Breakdown Helpline</p>
                  <p className="text-luxury-text-primary font-medium">{siteContent.contact.info.emergencyPhone}</p>
                </div>
              </div>
            </div>

            {/* Compact Map Pane */}
            <div className="border border-white/5 p-2 rounded-sm bg-luxury-card/30">
              <iframe
                src={siteContent.contact.googleMapIframe}
                className="w-full h-[250px] border-0 rounded-sm grayscale invert opacity-75 hover:opacity-90 transition-opacity duration-500"
                allowFullScreen={false}
                loading="lazy"
                title="Office Location Map"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: CRM Form */}
          <div className="lg:col-span-7 animate-panel">
            <div id="crm-form-container" className="p-1 border border-white/5 bg-luxury-card/30 rounded-sm">
              <CrmForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
