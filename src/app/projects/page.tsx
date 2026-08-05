"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteContent, ProjectItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, ArrowUpRight, ShieldCheck, Ruler, Scale, Eye } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Local project images
const PROJECT_IMAGES: Record<string, string> = {
  p1: "/images/projects/p1.png",
  p2: "/images/projects/p2.png",
  p3: "/images/projects/p3.jpg",
  p4: "/images/projects/p4.png",
  p5: "/images/projects/p5.png",
  p6: "/images/projects/p6.png",
  p7: "/images/projects/p7.png",
  p8: "/images/projects/p8.png",
  p9: "/images/projects/p9.jpg",
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
    speed: "2.0 m/s",
    loadCapacity: "1600 kg (21 Passengers / Stretcher)",
    finish: "Antimicrobial Stainless Steel with soft LED paneling",
    systemType: "Hospital Stretcher & Service Lift",
    notes: "Equipped with priority medical override triggers and smooth acceleration curves.",
  },
  p5: {
    height: "30 Meters (8 Floors)",
    speed: "1.0 m/s",
    loadCapacity: "400 kg (5 Passengers)",
    finish: "Teak Wood Veneer with Warm Gold LED downlights",
    systemType: "Custom Home Villa Elevator",
    notes: "Operates ultra-quietly under 42 dB with single-phase power integration.",
  },
  p6: {
    height: "90 Meters (30 Floors)",
    speed: "3.0 m/s",
    loadCapacity: "1250 kg (16 Passengers)",
    finish: "Custom Etched Stainless Steel & Marble Inlay",
    systemType: "Commercial High-Speed Passenger Lift",
    notes: "Includes regenerative energy braking systems that feed power back to the grid.",
  },
  p11: {
    height: "Residential Specification",
    speed: "1.0 - 1.5 m/s",
    loadCapacity: "400 - 800 kg",
    finish: "Premium Stainless Steel",
    systemType: "Residential Passenger Lift",
    notes: "Installed at Sanklecha Mango Woods.",
  },
  p12: {
    height: "Residential Specification",
    speed: "1.0 - 1.5 m/s",
    loadCapacity: "400 - 800 kg",
    finish: "Premium Stainless Steel",
    systemType: "Residential Passenger Lift",
    notes: "Installed at Kool Homes Signature.",
  },
  p13: {
    height: "Residential Specification",
    speed: "1.0 - 1.5 m/s",
    loadCapacity: "400 - 800 kg",
    finish: "Premium Stainless Steel",
    systemType: "Residential Passenger Lift",
    notes: "Installed at Mantra Residency.",
  },
  p14: {
    height: "Residential Specification",
    speed: "1.0 - 1.5 m/s",
    loadCapacity: "400 - 800 kg",
    finish: "Premium Stainless Steel",
    systemType: "Residential Passenger Lift",
    notes: "Installed at GDS Capital City.",
  },
};

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const headerItems = container.querySelectorAll(".animate-header");
      gsap.fromTo(
        headerItems,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredProjects = siteContent.projects.items.filter((project: ProjectItem) => {
    if (activeFilter === "All") return true;
    return project.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      <div className="pt-24 md:pt-28 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-20">
        <Breadcrumbs />
      </div>

      {/* Hero Header */}
      <section className="relative pt-6 pb-20 md:pt-10 md:pb-28 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
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
          <div className="relative bg-luxury-card border border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-luxury-text-secondary hover:text-luxury-accent transition-colors text-2xl font-light focus:outline-none z-10"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              </div>
            </div>
            </div>

            {/* Fixed Footer for Actions */}
            <div className="p-6 md:px-10 md:py-6 border-t border-white/10 bg-luxury-card shrink-0 rounded-b-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedProject.link ? (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-btn flex-1 text-center py-3.5 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                  >
                    View Project Online <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
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
                )}
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
      )}

      <Footer />
    </main>
  );
}
