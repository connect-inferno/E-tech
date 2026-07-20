"use client";

import React, { useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const getIcon = (name: string) => {
  const I = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return I ?? Icons.Circle;
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
        scrollTrigger: { trigger: ".values-grid", start: "top 80%" },
      }
    );

    const milestones = container.querySelectorAll(".milestone-item");
    gsap.fromTo(
      milestones,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".milestones-container", start: "top 80%" },
      }
    );

    const perfBlocks = container.querySelectorAll(".perf-block");
    gsap.fromTo(
      perfBlocks,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".perf-grid", start: "top 85%" },
      }
    );

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
          scrollTrigger: { trigger: block, start: "top 85%", toggleActions: "play none none none" },
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

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">
            About Us
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            The Standard of <span className="font-light text-luxury-accent">Reliable</span> Elevation
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            ISO-certified elevator installation, AMC, modernization and 24/7 breakdown support — trusted by 120+ AMC clients and 500+ lifts across Maharashtra since 2019.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              Meet the Founder
            </h2>
            <div className="w-16 h-[1px] bg-luxury-accent/30 mx-auto mt-4" />
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Founder & CEO */}
            <div className="group border border-white/5 bg-luxury-card rounded-sm transition-all duration-500 hover:border-luxury-accent/30 hover:bg-luxury-card-hover overflow-hidden flex flex-col md:flex-row items-stretch">
              <div className="w-full md:w-[45%] aspect-[4/5] relative overflow-hidden shrink-0">
                <img
                  src="/images/vivek.png"
                  alt="Vivek Borkar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="w-full md:w-[55%] flex flex-col justify-center p-6 md:p-8 space-y-3 text-center md:text-left">
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-light text-luxury-text-primary tracking-wide mb-1">
                    Vivek Borkar
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-luxury-accent font-semibold">
                    Founder &amp; CEO
                  </p>
                </div>
                <p className="text-[10px] text-luxury-text-secondary uppercase tracking-widest leading-relaxed font-medium">
                  E-Tech Elevator, Pune, Maharashtra.
                </p>
                <div className="w-12 h-[1px] bg-luxury-accent/20 mx-auto md:mx-0 pt-1" />
                <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                  Driving operational excellence, engineering standards, digital service reporting and premium AMC service delivery.
                </p>
              </div>
            </div>
          </div>
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
              <p className="whitespace-pre-line">{siteContent.about.storyParagraph1}</p>
              <p className="whitespace-pre-line">{siteContent.about.storyParagraph2}</p>
              <p>
                Our engineers work directly alongside architects, developers and facility teams — from hoistway survey through commissioning and on into the AMC lifecycle. Whether it&apos;s a single home lift retrofit or a fleet modernization across a commercial tower, the goal is the same: safe, silent, reliable transit for the life of the building.
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
                alt="Elevator engineering craft"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-luxury-card border border-white/5 rounded-sm space-y-2">
                <h4 className="text-sm font-heading font-normal text-luxury-text-primary">100% Genuine OEM Parts</h4>
                <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
                  Every replacement part is genuine OEM. No third-party substitutes, no warranty risk.
                </p>
              </div>
              <div className="p-6 bg-luxury-card border border-white/5 rounded-sm space-y-2">
                <h4 className="text-sm font-heading font-normal text-luxury-text-primary">15-Minute Emergency Response</h4>
                <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
                  Dedicated 24/7 dispatch line with on-call engineers across the Maharashtra service region.
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

      {/* Company Journey Timeline */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/20 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Company Journey</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              From Pune to Pan-Maharashtra
            </h2>
            <div className="w-16 h-[1px] bg-luxury-accent/30 mx-auto mt-4" />
          </div>

          <div className="milestones-container relative pl-8 md:pl-0">
            {/* Vertical line */}
            <div className="absolute left-3 md:left-1/2 top-2 bottom-2 w-[1px] bg-white/10 md:-translate-x-1/2" />

            <div className="space-y-10">
              {siteContent.about.milestones.map((m, idx) => {
                const leftSide = idx % 2 === 0;
                return (
                  <div key={m.year} className="milestone-item relative md:grid md:grid-cols-2 md:gap-12 items-center">
                    {/* Dot */}
                    <div className="absolute left-3 md:left-1/2 top-2 w-2 h-2 rounded-full bg-luxury-accent -translate-x-1/2 shadow-[0_0_0_4px_rgba(212,175,55,0.15)]" />
                    <div className={`${leftSide ? "md:text-right md:pr-8" : "md:col-start-2 md:pl-8"}`}>
                      <div className="text-2xl font-heading font-light text-luxury-accent tracking-widest">
                        {m.year}
                      </div>
                      <p className="text-sm text-luxury-text-primary font-light mt-1 leading-relaxed">
                        {m.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Core Values</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              What We Stand For
            </h2>
            <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
              Five principles that guide every service call, every install and every AMC we sign.
            </p>
          </div>

          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {siteContent.about.coreValues.map((val, idx) => {
              const Icon = getIcon(val.iconName);
              return (
                <div
                  key={idx}
                  className="value-card group p-6 bg-luxury-card border border-white/5 rounded-sm hover:border-luxury-accent/30 hover:bg-luxury-card-hover transition-all duration-500 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-sm bg-white/3 border border-white/5 text-luxury-accent group-hover:bg-luxury-accent group-hover:text-luxury-text-primary transition-all duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-heading font-light tracking-wide text-luxury-text-primary">
                      {val.title}
                    </h3>
                    <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
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

      {/* Performance Highlights */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Performance Highlights</span>
          <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
            The Numbers We Measure Ourselves By
          </h2>
        </div>
        <div className="perf-grid grid grid-cols-2 md:grid-cols-3 gap-6">
          {siteContent.about.performance.map((p, idx) => (
            <div
              key={idx}
              className="perf-block p-8 border border-white/5 bg-luxury-card/40 rounded-sm text-center space-y-2 hover:border-luxury-accent/30 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-heading font-light text-luxury-accent tracking-wider">
                {p.value}
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-luxury-text-secondary font-light">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance / Safety Standards */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/20 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">Safety & Compliance</span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              Standards We Work To
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteContent.about.compliance.map((line, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-5 border border-white/5 bg-luxury-card rounded-sm"
              >
                <ShieldCheck className="w-5 h-5 text-luxury-accent shrink-0 mt-0.5" />
                <span className="text-sm text-luxury-text-secondary font-light leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
