"use client";

import { useEffect, useRef } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Map siteContent icon strings to Lucide components dynamically
const getIconComponent = (iconName: string) => {
  const LucideIcon = (Icons as any)[iconName];
  if (!LucideIcon) return Icons.Settings;
  return LucideIcon;
};

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

    // Services cards staggered fade-in
    const cards = section.querySelectorAll(".service-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === gridRef.current) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
              {siteContent.services.subtitle}
            </span>
            <h2 className="animate-header text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary">
              {siteContent.services.title}
            </h2>
            <div className="animate-header w-20 h-[1px] bg-luxury-accent/30 mx-auto md:mx-0 mt-6" />
          </div>
          <div className="animate-header flex justify-center shrink-0">
            <Link
              href="/services"
              className="luxury-btn px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium"
            >
              View Lifecycle
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {siteContent.services.items.map((service, idx) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div
                key={service.id}
                className="service-card group relative bg-luxury-card border border-white/5 p-8 rounded-sm hover:border-luxury-accent/30 hover:bg-luxury-card-hover transition-all duration-500 flex flex-col justify-between min-h-[260px] select-none"
              >
                {/* Micro-interaction highlight corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-accent/3 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6">
                  {/* Glowing Icon Wrapper */}
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-sm bg-white/3 border border-white/5 text-luxury-accent group-hover:text-luxury-text-primary group-hover:bg-luxury-accent group-hover:border-luxury-accent transition-all duration-500">
                    <IconComponent className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    
                    {/* Ring glow */}
                    <div className="absolute inset-0 rounded-sm border border-luxury-accent/30 scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  <h3 className="text-lg md:text-xl font-heading font-light text-luxury-text-primary tracking-wide">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-luxury-text-secondary leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-6 border-t border-white/5 mt-6 text-[10px] uppercase tracking-widest text-luxury-text-secondary group-hover:text-luxury-accent transition-colors duration-300">
                  <span>Learn more</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
