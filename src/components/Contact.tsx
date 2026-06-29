"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Clock, PhoneCall, Check } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Details */}
          <div className="space-y-12 animate-panel">
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
          </div>

          {/* Right Column: Premium Glass Form */}
          <div className="animate-panel">
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 md:p-10 rounded-sm space-y-6 relative overflow-hidden"
            >
              {/* Form Success Panel */}
              {formSubmitted && (
                <div className="absolute inset-0 bg-luxury-card/95 z-30 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-luxury-accent/10 border border-luxury-accent flex items-center justify-center mb-4 text-luxury-accent">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-luxury-text-primary mb-2">
                    Design Brief Received
                  </h3>
                  <p className="text-xs text-luxury-text-secondary max-w-xs font-light leading-relaxed">
                    Our structural engineering team will review your project specs and contact you within 24 hours.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-heading font-light tracking-wide text-luxury-text-primary">
                  Request Consultation
                </h3>
                <p className="text-xs text-luxury-text-secondary font-light">
                  Submit your architectural specs for a customized elevator layout.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-luxury-text-secondary">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Richard Foster"
                      className="w-full bg-white/3 border border-white/5 rounded-sm px-4 py-3 text-xs text-luxury-text-primary placeholder-white/20 focus:outline-none focus:border-luxury-accent transition-colors duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-luxury-text-secondary">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. contact@foster.com"
                      className="w-full bg-white/3 border border-white/5 rounded-sm px-4 py-3 text-xs text-luxury-text-primary placeholder-white/20 focus:outline-none focus:border-luxury-accent transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-text-secondary">Project Category</label>
                  <select className="w-full bg-white/3 border border-white/5 rounded-sm px-4 py-3 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent transition-colors duration-300">
                    <option className="bg-luxury-bg" value="passenger">Passenger Elevator</option>
                    <option className="bg-luxury-bg" value="capsule">Capsule Elevator</option>
                    <option className="bg-luxury-bg" value="glass">Glass Elevator</option>
                    <option className="bg-luxury-bg" value="home">Home Elevator</option>
                    <option className="bg-luxury-bg" value="hospital">Hospital Elevator</option>
                    <option className="bg-luxury-bg" value="other">Specialized Mechanical Solutions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-text-secondary">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe building structural dimensions, floor counts, cabin stylistic preferences..."
                    className="w-full bg-white/3 border border-white/5 rounded-sm px-4 py-3 text-xs text-luxury-text-primary placeholder-white/20 focus:outline-none focus:border-luxury-accent transition-colors duration-300 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full luxury-btn py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium"
              >
                {siteContent.contact.ctaLabel}
              </button>
            </form>
          </div>
        </div>

        {/* Full-width Map pane */}
        <div className="animate-panel border border-white/5 p-2 rounded-sm bg-luxury-card/30">
          <iframe
            src={siteContent.contact.googleMapIframe}
            className="w-full h-80 md:h-[400px] border-0 rounded-sm grayscale invert opacity-75 hover:opacity-90 transition-opacity duration-500"
            allowFullScreen={false}
            loading="lazy"
            title="Office Location Map"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
