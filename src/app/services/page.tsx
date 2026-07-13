"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrmForm from "@/components/CrmForm";
import { siteContent, ServiceItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { PhoneCall, ShieldAlert, CheckCircle, Wrench, ShieldCheck, ClipboardCheck, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Map siteContent icon strings to Lucide components dynamically
const getIconComponent = (iconName: string) => {
  const LucideIcon = (Icons as any)[iconName];
  if (!LucideIcon) return Icons.Settings;
  return LucideIcon;
};

// Workflow Steps
const WORKFLOW_STEPS = [
  {
    phase: "Phase 01",
    title: "Site Consultation & Scope",
    description: "Our structural engineers audit the physical blueprints, shaft dimensions, and electrical load availability to determine the ideal structural framing.",
    parameters: ["Hoistway clearance inspection", "Power requirement specification", "Architectural finish alignment"],
    timeframe: "3 - 5 Days",
  },
  {
    phase: "Phase 02",
    title: "3D Laser Hoistway Mapping",
    description: "Using advanced coordinates, laser scanners map the entire hoistway verticality. This checks for offsets, helping us guarantee sub-millimeter rail alignments.",
    parameters: ["Shaft vertical deviation check", "Laser coordinate mapping", "Tolerances under 1mm"],
    timeframe: "1 - 2 Days",
  },
  {
    phase: "Phase 03",
    title: "Mechanical & Core Assembly",
    description: "The PMSM gearless traction machine, counterweight frames, and guide rails are installed on site, supported by vibration dampers.",
    parameters: ["Gearless traction alignment", "Vibration damper assembly", "Tension ropes configuration"],
    timeframe: "2 - 3 Weeks",
  },
  {
    phase: "Phase 04",
    title: "Safety Calibration & Testing",
    description: "The mechanical overspeed governor, safety block jaws, and emergency backup batteries are subjected to dynamic load tests.",
    parameters: ["Overspeed governor tests", "Battery rescue system audit", "125% overload testing"],
    timeframe: "3 - 4 Days",
  },
  {
    phase: "Phase 05",
    title: "Regulatory Handover & AMC Launch",
    description: "After checking leveling and ride parameters, E Tech hands over the certified elevator alongside active remote telemetry AMC setups.",
    parameters: ["Micro-leveling certification", "Government safety compliance", "AMC Telemetry registration"],
    timeframe: "1 Day",
  },
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

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

    // Services cards staggered fade-in
    const cards = container.querySelectorAll(".service-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

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
            Engineering Support Lifecycle
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            E Tech Services <span className="font-light text-luxury-accent">Lifecycle</span>
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            From precision laser surveying and core mechanics assembly to 24/7 proactive maintenance and emergency support.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {siteContent.services.items.map((service: ServiceItem, idx) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div
                key={service.id}
                className="service-card group relative bg-luxury-card border border-white/5 p-8 rounded-sm hover:border-luxury-accent/30 hover:bg-luxury-card-hover transition-all duration-500 flex flex-col justify-between min-h-[280px] select-none"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-accent/3 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6">
                  {/* Glowing Icon Wrapper */}
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-sm bg-white/3 border border-white/5 text-luxury-accent group-hover:text-luxury-text-primary group-hover:bg-luxury-accent group-hover:border-luxury-accent transition-all duration-500">
                    <IconComponent className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    <div className="absolute inset-0 rounded-sm border border-luxury-accent/30 scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  <h3 className="text-xl font-heading font-light text-luxury-text-primary tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-luxury-text-secondary leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-6 border-t border-white/5 mt-6 text-[10px] uppercase tracking-widest text-luxury-text-secondary group-hover:text-luxury-accent transition-colors duration-300">
                  <span>Certified Procedures Included</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Workflow Stepper Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold flex items-center justify-center gap-2">
              <ClipboardCheck className="w-3.5 h-3.5" /> Project Commissioning
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              Our Integration Workflow
            </h2>
            <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
              Discover how E Tech conducts its structural surveys and load safety testing phases from scratch.
            </p>
          </div>

          {/* Stepper controls */}
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Step triggers (left 5 cols on lg) */}
            <div className="lg:w-5/12 flex flex-col gap-3 justify-center">
              {WORKFLOW_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 text-left border rounded-sm transition-all duration-300 flex items-center justify-between focus:outline-none ${activeStep === idx
                    ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                    : "border-white/5 hover:border-white/10 text-luxury-text-secondary"
                    }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-accent block">
                      {step.phase}
                    </span>
                    <span className="text-sm font-heading font-light tracking-wide">
                      {step.title}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono ${activeStep === idx ? "text-luxury-accent" : "text-white/10"}`}>
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Step Detail Display (right 7 cols on lg) */}
            <div className="lg:w-7/12 p-8 md:p-12 border border-white/5 bg-luxury-card rounded-sm flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl">
              {/* Corner watermark */}
              <span className="absolute bottom-6 right-6 text-[8vw] font-heading font-extralight text-white/[0.01] pointer-events-none select-none">
                E-TECH
              </span>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
                    {WORKFLOW_STEPS[activeStep].phase}
                  </span>
                  <span className="text-xs text-luxury-text-secondary font-light">
                    Est: {WORKFLOW_STEPS[activeStep].timeframe}
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-light tracking-wide text-luxury-text-primary">
                  {WORKFLOW_STEPS[activeStep].title}
                </h3>

                <p className="text-sm text-luxury-text-secondary leading-relaxed font-light">
                  {WORKFLOW_STEPS[activeStep].description}
                </p>

                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Protocol Parameters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WORKFLOW_STEPS[activeStep].parameters.map((param, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs font-light text-luxury-text-secondary">
                        <span className="w-1 h-1 bg-luxury-accent rounded-full shrink-0" />
                        <span>{param}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-white/5 text-[10px] uppercase tracking-widest text-luxury-text-secondary">
                <ShieldCheck className="w-4 h-4 text-luxury-accent" />
                <span>Supervised by certified structural technicians</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency dispatch request widget */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Dispatch info text */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32 self-start">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-luxury-accent animate-pulse" /> 24/7 Dispatch Control
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
                Emergency Rapid Dispatch
              </h2>
              <p className="text-xs md:text-sm text-luxury-text-secondary leading-relaxed font-light">
                We operate an immediate service support cell in our corporate hubs. If your system requires urgent maintenance, spare parts, or certified troubleshooting, launch an alert ticket below.
              </p>
            </div>

            <div className="p-6 border border-white/5 bg-luxury-card rounded-sm space-y-3 relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute -inset-y-12 -inset-x-12 bg-luxury-accent/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

              <p className="text-xs text-luxury-text-primary uppercase tracking-widest font-medium relative z-10">
                Emergency support hotline
              </p>
              <p className="text-lg md:text-xl font-heading font-light text-luxury-accent flex items-center gap-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                <PhoneCall className="w-4 h-4" /> {siteContent.contact.info.emergencyPhone}
              </p>
              <p className="text-[10px] text-luxury-text-secondary font-light relative z-10">
                *Response teams deploy in under 60 minutes for active AMC contracts.
              </p>
            </div>

            {/* Rapid Response Timeline */}
            <div className="pt-4 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-text-primary font-medium">
                Dispatch Protocol
              </h3>
              <div className="space-y-5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {/* Step 1 */}
                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-semibold text-luxury-accent">1</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-luxury-text-primary">Instant Triage</h4>
                    <p className="text-[11px] text-luxury-text-secondary leading-relaxed font-light">
                      Your ticket instantly alerts our active telemetry center and duty engineer.
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-semibold text-luxury-accent">2</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-luxury-text-primary">Tech Allocation</h4>
                    <p className="text-[11px] text-luxury-text-secondary leading-relaxed font-light">
                      Nearest specialized field service unit is dispatched with parts pre-allocated.
                    </p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-semibold text-luxury-accent">3</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-luxury-text-primary">Resolution & Audit</h4>
                    <p className="text-[11px] text-luxury-text-secondary leading-relaxed font-light">
                      System recovery is executed, tested, and certified for active operation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
              <div className="text-center p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                <p className="text-lg md:text-xl font-heading font-light text-luxury-accent">60m</p>
                <p className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-light">Max Response</p>
              </div>
              <div className="text-center p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                <p className="text-lg md:text-xl font-heading font-light text-luxury-accent">24/7</p>
                <p className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-light">Monitoring</p>
              </div>
              <div className="text-center p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                <p className="text-lg md:text-xl font-heading font-light text-luxury-accent">100%</p>
                <p className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-light">Certified</p>
              </div>
            </div>
          </div>

          {/* Form Widget */}
          <div className="lg:col-span-7">
            <CrmForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
