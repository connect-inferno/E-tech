"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteContent, ProjectItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, ArrowUpRight, ShieldCheck, Ruler, Scale, Eye } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Unsplash images
const PROJECT_IMAGES: Record<string, string> = {
  p1: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600",
  p2: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600",
  p3: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
  p4: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600",
  p5: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
  p6: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
};

// Custom Case Specifications for each project
const PROJECT_DETAILS: Record<string, {
  height: string;
  speed: string;
  loadCapacity: string;
  finish: string;
  systemType: string;
  notes: string;
}> = {
  p1: {
    height: "75 Meters (24 Floors)",
    speed: "2.5 m/s",
    loadCapacity: "1000 kg (13 Passengers)",
    finish: "Obsidian Mirror Glass with Brushed Gold trims",
    systemType: "Gearless PMSM Passenger Lift",
    notes: "Coordinates directly with private biometric smart home panels on landing vestibules.",
  },
  p2: {
    height: "140 Meters (42 Floors)",
    speed: "4.0 m/s",
    loadCapacity: "1600 kg (21 Passengers)",
    finish: "Linen-Textured Steel & Gray Granite floor",
    systemType: "Destination Control Traffic Lift",
    notes: "Maintains optimal scheduling algorithms to manage high morning traffic rushes.",
  },
  p3: {
    height: "45 Meters (15 Floors)",
    speed: "1.75 m/s",
    loadCapacity: "800 kg (10 Passengers)",
    finish: "Panoramic Curved Laminated Safety Glass",
    systemType: "Capsule Hydraulic Lift",
    notes: "Features 180-degree exterior views with ambient bottom light projections.",
  },
  p4: {
    height: "60 Meters (18 Floors)",
    speed: "1.5 m/s",
    loadCapacity: "2000 kg (Bed & Stretchers)",
    finish: "Hygienic Anti-Microbial Stainless Steel",
    systemType: "Clinically Calibrated Bed Lift",
    notes: "Equipped with priority code overrides and smooth acceleration curves.",
  },
  p5: {
    height: "110 Meters (32 Floors)",
    speed: "3.0 m/s",
    loadCapacity: "1350 kg (18 Passengers)",
    finish: "Textured Bronze panels and Nero Marquina Floor",
    systemType: "Machine-Room-Less (MRL) Traction Lift",
    notes: "Saves structural space by locating the gearless traction motor in the shaft head.",
  },
  p6: {
    height: "15 Meters (4 Floors)",
    speed: "1.0 m/s",
    loadCapacity: "450 kg (6 Passengers)",
    finish: "Walnut Paneling and Tufted Leather trims",
    systemType: "Home Elevator (Single Phase)",
    notes: "Features whisper-quiet pneumatic operations with low-clearance hoistway requirements.",
  },
};

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

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

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const filteredProjects = siteContent.projects.items.filter((project: ProjectItem) => {
    if (activeFilter === "All") return true;
    return project.category.toLowerCase() === activeFilter.toLowerCase();
  });

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
            Case Studies
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            Architectural <span className="font-light text-luxury-accent">Journeys</span>
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            Discover E Tech installations across high-rise residential properties, luxury commercial hubs, and healthcare structures.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Filterable Projects Grid */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        {/* Filter Navigation */}
        <div className="flex justify-center border-b border-white/5 pb-2">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {siteContent.projects.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 relative focus:outline-none ${activeFilter === category
                  ? "text-luxury-accent"
                  : "text-luxury-text-secondary hover:text-luxury-text-primary"
                  }`}
              >
                {category}
                {activeFilter === category && (
                  <motion.div
                    layoutId="activeFilterUnderlineProjects"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Staggered Masonry Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: ProjectItem, idx) => {
              // Custom column heights to achieve a luxury masonry aesthetic
              const heightClass =
                idx === 1 || idx === 3
                  ? "aspect-[4/5] md:aspect-[3/4]"
                  : idx === 4
                    ? "aspect-square"
                    : "aspect-[4/5]";

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative ${heightClass} bg-luxury-card border border-white/5 overflow-hidden rounded-sm cursor-pointer select-none`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none z-10" />

                  {/* Parallax Image Backdrop */}
                  <div className="absolute inset-0 w-full h-full scale-105 overflow-hidden">
                    <img
                      src={PROJECT_IMAGES[project.id] || PROJECT_IMAGES.p1}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Dark shade layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500 z-10" />

                  {/* Text Details Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {project.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-heading font-light tracking-wide text-luxury-text-primary leading-tight">
                      {project.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-luxury-text-secondary text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        <MapPin className="w-3.5 h-3.5 text-luxury-accent" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-luxury-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        <span>Case Details</span>
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Case Study Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="relative bg-luxury-card border border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-luxury-text-secondary hover:text-luxury-accent transition-colors text-2xl font-light focus:outline-none"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Media frame */}
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={PROJECT_IMAGES[selectedProject.id] || PROJECT_IMAGES.p1}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex items-center gap-2 text-xs text-luxury-text-secondary font-light">
                  <MapPin className="w-4 h-4 text-luxury-accent" />
                  <span>Site location: {selectedProject.location}</span>
                </div>
              </div>

              {/* Specifications checklist */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">
                    Case Study Commission
                  </span>
                  <h2 className="text-3xl font-heading font-light tracking-tight text-luxury-text-primary">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="w-16 h-[1px] bg-luxury-accent/30" />

                {/* Specs parameters grid */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-luxury-accent" /> Project Integration Specifications
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-white/5 bg-white/2 p-4 rounded-sm">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                        System Configuration
                      </span>
                      <span className="text-xs font-light text-luxury-text-primary mt-1 block">
                        {PROJECT_DETAILS[selectedProject.id]?.systemType || "Custom PMSM Traction"}
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/2 p-4 rounded-sm">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                        Commissioned Speed
                      </span>
                      <span className="text-xs font-light text-luxury-text-primary mt-1 block">
                        {PROJECT_DETAILS[selectedProject.id]?.speed || "1.75 m/s"}
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/2 p-4 rounded-sm">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                        Travel Elevation Height
                      </span>
                      <span className="text-xs font-light text-luxury-text-primary mt-1 block">
                        {PROJECT_DETAILS[selectedProject.id]?.height || "45 Meters"}
                      </span>
                    </div>

                    <div className="border border-white/5 bg-white/2 p-4 rounded-sm">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                        Load Capacity Limit
                      </span>
                      <span className="text-xs font-light text-luxury-text-primary mt-1 block">
                        {PROJECT_DETAILS[selectedProject.id]?.loadCapacity || "800 kg"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel details */}
                <div className="space-y-2 border-t border-white/5 pt-6">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                    Cabin Materials & Trims
                  </span>
                  <p className="text-xs text-luxury-text-primary leading-relaxed font-light">
                    {PROJECT_DETAILS[selectedProject.id]?.finish || "Obsidian panels and stone flooring"}
                  </p>
                </div>

                {/* Engineering Remarks */}
                <div className="space-y-2 border-t border-white/5 pt-6">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-text-secondary block">
                    Engineering Remarks
                  </span>
                  <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                    {PROJECT_DETAILS[selectedProject.id]?.notes || "Triple redundancy brake configuration."}
                  </p>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = "/#contact";
                      }
                    }}
                    className="luxury-btn flex-1 text-center py-3.5 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                  >
                    Inquire for Similar Setup <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="border border-white/10 hover:bg-white/5 transition-all rounded-sm flex-1 text-center py-3.5 text-xs text-luxury-text-primary uppercase tracking-[0.2em] font-medium"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
