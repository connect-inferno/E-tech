"use client";

import React, { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Shield, Cpu, Zap, Gem, CheckCircle, Clock, Heart } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const container = containerRef.current;
    if (!container) return;

    // Header reveal
    const headerItems = container.querySelectorAll(".animate-header");
    gsap.fromTo(
      headerItems,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power3.out" }
    );

    // Stagger values grid reveal
    const cards = container.querySelectorAll(".value-card");
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
          trigger: ".values-grid",
          start: "top 80%",
        },
      }
    );

    // Stats counter count-up scroll trigger
    const stats = statsRef.current;
    if (stats) {
      const statBlocks = stats.querySelectorAll(".stat-block");
      statBlocks.forEach((block) => {
        const numberEl = block.querySelector(".stat-number");
        if (!numberEl) return;

        const target = parseFloat(numberEl.getAttribute("data-target") || "0");
        const suffix = numberEl.getAttribute("data-suffix") || "";
        const countObj = { value: 0 };

        gsap.to(countObj, {
          value: target,
          duration: 2.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (numberEl) {
              if (target % 1 === 0) {
                numberEl.textContent = Math.floor(countObj.value).toString() + suffix;
              } else {
                numberEl.textContent = countObj.value.toFixed(1) + suffix;
              }
            }
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const coreValues = [
    {
      icon: Shield,
      title: "Zero-Incident Safety",
      description: "Implementing triple redundancy in brakes, governors, and automated rescue devices for absolute peace of mind."
    },
    {
      icon: Cpu,
      title: "German Technology Integration",
      description: "Employing Gearless PMSM machines and predictive telemetry sensors engineered in Germany."
    },
    {
      icon: Gem,
      title: "Architectural Customization",
      description: "Designing bespoke spaces with leather trims, textured bronze, and curved crystal structures."
    },
    {
      icon: Award,
      title: "Absolute Uptime",
      description: "Active IoT-enabled remote monitoring that identifies and resolves system fatigue before outages can occur."
    }
  ];

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
        {/* Aesthetic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">
            About Us
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            The Standard of <span className="font-light text-luxury-accent">Architectural</span> Elevation
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            E Tech Elevators designs and engineers high-end vertical mobility systems for signature buildings, residential penthouses, and clinical spaces worldwide.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Editorial Narrative & Stats */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-heading font-light tracking-wide text-luxury-text-primary">
              {siteContent.about.storyTitle}
            </h2>
            <div className="space-y-6 text-sm md:text-base font-light text-luxury-text-secondary leading-relaxed">
              <p>{siteContent.about.storyParagraph1}</p>
              <p>{siteContent.about.storyParagraph2}</p>
              <p>
                Our structural layouts are coordinated directly with architects and interior design houses. From invisible home elevator hoistways to towering commercial capsules, we match our structural steel builds with tailored luxury design components.
              </p>
            </div>

            {/* Mission & Vision Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-luxury-accent" />
                  <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium">
                    {siteContent.about.missionTitle}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-luxury-text-secondary font-light">
                  {siteContent.about.missionText}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-luxury-accent" />
                  <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium">
                    {siteContent.about.visionTitle}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-luxury-text-secondary font-light">
                  {siteContent.about.visionText}
                </p>
              </div>
            </div>
          </div>

          {/* Large Image Frame & Highlights Grid */}
          <div className="space-y-12">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 rounded-sm bg-luxury-card shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
                alt="Bespoke Metal Finish Craftsman"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>

            {/* Grid of Key Distinctions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-luxury-card border border-white/5 rounded-sm space-y-2">
                <h4 className="text-sm font-heading font-normal text-luxury-text-primary">PMSM Gearless Motors</h4>
                <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
                  Reduces power consumption by up to 40% while assuring quiet traction transit.
                </p>
              </div>
              <div className="p-6 bg-luxury-card border border-white/5 rounded-sm space-y-2">
                <h4 className="text-sm font-heading font-normal text-luxury-text-primary">Micro-Leveling accuracy</h4>
                <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
                  Active deck leveling coordinates alignment with sub-millimeter precision.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Section */}
        <div
          ref={statsRef}
          className="mt-20 md:mt-28 pt-16 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center"
        >
          {siteContent.about.stats.map((stat, idx) => (
            <div key={idx} className="stat-block space-y-2 bg-luxury-card border border-white/5 p-8 rounded-sm hover:border-luxury-accent/25 transition-all">
              <h3
                className="stat-number text-4xl md:text-5xl font-heading font-light tracking-wider text-luxury-accent"
                data-target={stat.number}
                data-suffix={stat.suffix}
              >
                0
              </h3>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-text-secondary font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Grid - Aesthetic Grid layout */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Corporate Ethos</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              Our Core Principles
            </h2>
            <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
              Every system we engineer and commission reflects E Tech's absolute parameters of engineering perfection.
            </p>
          </div>

          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="value-card group p-8 bg-luxury-card border border-white/5 rounded-sm hover:border-luxury-accent/30 hover:bg-luxury-card-hover transition-all duration-500 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-white/3 border border-white/5 text-luxury-accent group-hover:bg-luxury-accent group-hover:text-luxury-text-primary transition-all duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-heading font-light tracking-wide text-luxury-text-primary">
                      {val.title}
                    </h3>
                    <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-white/10 uppercase tracking-widest block text-right">
                    0{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid Showcase of Manufacturing Standards */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 border border-white/5 bg-luxury-card/50 rounded-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-luxury-accent uppercase tracking-widest font-semibold">Standard 01</span>
              <h3 className="text-xl font-heading font-light text-luxury-text-primary">European Certification</h3>
              <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                All electrical panels, safety blocks, and brake configurations are built to satisfy strict European EN-81 lift safety guidelines.
              </p>
            </div>
            <div className="w-8 h-[1px] bg-luxury-accent/40" />
          </div>

          <div className="p-8 border border-white/5 bg-luxury-card/50 rounded-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-luxury-accent uppercase tracking-widest font-semibold">Standard 02</span>
              <h3 className="text-xl font-heading font-light text-luxury-text-primary">Galvanized Construction</h3>
              <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                Our guide rails, cabin frames, and structural channels are finished with protective zinc coatings to guarantee rust-free operations.
              </p>
            </div>
            <div className="w-8 h-[1px] bg-luxury-accent/40" />
          </div>

          <div className="p-8 border border-white/5 bg-luxury-card/50 rounded-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-luxury-accent uppercase tracking-widest font-semibold">Standard 03</span>
              <h3 className="text-xl font-heading font-light text-luxury-text-primary">Laser Hoistway Surveying</h3>
              <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                Before installation, every hoistway is mapped in three dimensions with laser scanners to guarantee guide rails align to the millimeter.
              </p>
            </div>
            <div className="w-8 h-[1px] bg-luxury-accent/40" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
