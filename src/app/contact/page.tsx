"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Users,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type BranchKey = "mumbai" | "bengaluru" | "delhi";

interface BranchDetails {
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBranch, setActiveBranch] = useState<BranchKey>("mumbai");

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

    // Stagger reveal of panels
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

  const branches: Record<BranchKey, BranchDetails> = {
    mumbai: {
      city: "Mumbai Headquarters",
      address: "E Tech Corporate Tower, Bandra Kurla Complex (BKC), Mumbai, MH - 400051",
      phone: "+91 22 6600 9900",
      email: "mumbai.office@etechelevators.com",
      hours: "9:00 AM - 6:00 PM (Mon - Sat)"
    },
    bengaluru: {
      city: "Bengaluru Tech Hub",
      address: "Prestige Trade Tower, Palace Rd, Sampangi Rama Nagar, Bengaluru, KA - 560001",
      phone: "+91 80 4400 8800",
      email: "blr.office@etechelevators.com",
      hours: "9:00 AM - 6:00 PM (Mon - Sat)"
    },
    delhi: {
      city: "Delhi NCR Hub",
      address: "DLF Cyber City, Building 10, Tower B, Phase 2, Gurugram, HR - 122002",
      phone: "+91 124 5500 7700",
      email: "delhi.office@etechelevators.com",
      hours: "9:00 AM - 6:00 PM (Mon - Sat)"
    }
  };

  const departments = [
    {
      name: "Sales & New Installs",
      desc: "Architect specs, luxury bespoke cabin estimates, and initial hoistway design planning.",
      email: "projects@etechelevators.com",
      icon: Briefcase
    },
    {
      name: "Modernization Desk",
      desc: "Retrofitting old systems, PMSM motor replacements, and interior upgrades.",
      email: "mod@etechelevators.com",
      icon: Users
    },
    {
      name: "AMC & Service Desk",
      desc: "Active contract registrations, service telemetry setup, and routine schedule updates.",
      email: "support@etechelevators.com",
      icon: ShieldCheck
    }
  ];

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
        {/* Decorative Grid and Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">
            Bespoke Vertical Consultation
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            Connect <span className="font-light text-luxury-accent">With E Tech</span>
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            Reach our structural design engineers, request dynamic telemetry setup details, or log a technical specification brief through our CRM routing system.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Split CRM Form & Branch Details Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* Left Column: Branch Switcher & Quick Contacts */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32 self-start animate-panel">
            
            {/* Interactive Branch Switcher */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-accent font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Corporate Network
                </span>
                <h3 className="text-xl font-heading font-light tracking-wide text-luxury-text-primary">
                  Interactive Corporate Offices
                </h3>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-white/5">
                {(Object.keys(branches) as BranchKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveBranch(key)}
                    className={`flex-1 py-3 text-center text-xs uppercase tracking-widest transition-all duration-300 font-medium border-b-2 relative ${
                      activeBranch === key
                        ? "border-luxury-accent text-luxury-accent"
                        : "border-transparent text-luxury-text-secondary hover:text-luxury-text-primary"
                    }`}
                  >
                    {key === "delhi" ? "Delhi NCR" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="p-6 border border-white/5 bg-luxury-card rounded-sm space-y-4 transition-all duration-500">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-text-primary font-semibold">
                    {branches[activeBranch].city}
                  </h4>
                  <div className="flex gap-3 text-xs font-light text-luxury-text-secondary">
                    <MapPin className="w-4 h-4 text-luxury-accent shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{branches[activeBranch].address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-semibold block">Office Line</span>
                    <a href={`tel:${branches[activeBranch].phone}`} className="text-xs text-luxury-accent hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {branches[activeBranch].phone}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-text-secondary font-semibold block">Primary Email</span>
                    <a href={`mailto:${branches[activeBranch].email}`} className="text-xs text-luxury-accent hover:underline flex items-center gap-1 truncate block">
                      <Mail className="w-3 h-3 shrink-0" /> {branches[activeBranch].email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 items-center text-[10px] text-luxury-text-secondary pt-2">
                  <Clock className="w-3.5 h-3.5 text-luxury-accent" />
                  <span>Hours: {branches[activeBranch].hours}</span>
                </div>
              </div>
            </div>

            {/* Helpline Panel */}
            <div className="p-6 border border-red-500/10 bg-luxury-card/40 rounded-sm space-y-4 relative overflow-hidden group">
              {/* Red glow backdrop */}
              <div className="absolute -inset-12 bg-red-500/3 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <PhoneCall className="w-4 h-4 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-red-500 font-semibold">24/7 Breakdown Hotline</h4>
                  <p className="text-[10px] text-luxury-text-secondary font-light">Immediate safety dispatch</p>
                </div>
              </div>
              <p className="text-xl font-heading font-light text-luxury-text-primary tracking-wide relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                {siteContent.contact.info.emergencyPhone}
              </p>
              <p className="text-[10px] text-luxury-text-secondary leading-relaxed font-light relative z-10">
                *Response teams deploy in under 60 minutes for active AMC contracts. Direct tele-triage connection.
              </p>
            </div>

            {/* Brand Assurance Badge */}
            <div className="flex items-center gap-3 p-4 border border-white/5 bg-white/[0.01] rounded-sm">
              <Sparkles className="w-5 h-5 text-luxury-accent shrink-0" />
              <p className="text-[10px] uppercase tracking-wider text-luxury-text-secondary leading-relaxed font-light">
                Every inquiry initiates a structured assessment by our structural engineering and safety planning desk.
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

      {/* Department Contacts Row */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 bg-white/[0.01] relative overflow-hidden">
        {/* Section title */}
        <div className="text-center space-y-3 mb-16 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-accent font-semibold">
            Direct Channels
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-light tracking-tight text-luxury-text-primary">
            Departmental Communications
          </h2>
          <p className="text-xs text-luxury-text-secondary font-light">
            Skip the queue and email our specialty divisions directly for dedicated project tracking.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                className="p-6 border border-white/5 bg-luxury-card rounded-sm space-y-4 hover:border-luxury-accent/20 transition-all duration-500 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-sm bg-luxury-accent/5 border border-white/5 flex items-center justify-center text-luxury-accent group-hover:bg-luxury-accent/10 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm uppercase tracking-wider font-medium text-luxury-text-primary">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
                    {dept.desc}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-xs text-luxury-accent hover:underline font-light flex items-center gap-1.5"
                  >
                    {dept.email}
                  </a>
                  <ChevronRight className="w-4 h-4 text-luxury-text-secondary transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
