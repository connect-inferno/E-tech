"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { siteContent, ProjectItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLenisInstance } from "@/components/SmoothScrollProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Local project images
const PROJECT_IMAGES: Record<string, string> = {
  p1: "/images/projects/p1.png",
  p2: "/images/projects/p2.png",
  p3: "/images/projects/p3.jpg",
  p4: "/images/projects/dwarka.webp",
  p5: "/images/projects/p5.png",
  p6: "/images/projects/p6.png",
  p7: "/images/projects/p7.png",
  p8: "/images/projects/gds.jpg",
  p9: "/images/projects/p9.jpg",
  p10: "/images/projects/sanklecha.jpg",
  p11: "/images/projects/spine.jpg",
  p12: "/images/projects/redeccan.jpeg",
  p13: "/images/projects/vasant.webp",
  p14: "/images/projects/swaraj.webp",
};

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const lenis = useLenisInstance();

  // Freeze background page scroll completely when modal is open
  useEffect(() => {
    if (selectedProject) {
      lenis?.stop();
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const handleTouch = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchmove", handleTouch, { passive: false });

      return () => {
        lenis?.start();
        document.body.style.overflow = originalBodyOverflow || "unset";
        document.documentElement.style.overflow = originalHtmlOverflow || "unset";
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchmove", handleTouch);
      };
    } else {
      lenis?.start();
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  }, [selectedProject, lenis]);

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
            {filteredProjects.map((project: ProjectItem) => {
              const heightClass = "aspect-[4/5]";

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
                  <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {project.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-heading font-light tracking-wide text-luxury-text-primary leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Project Details Modal (Static, Non-scrollable) */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none overflow-hidden overscroll-none"
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className="relative bg-luxury-card border border-white/10 rounded-sm w-full max-w-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-luxury-text-secondary hover:text-luxury-accent transition-colors text-2xl font-light focus:outline-none z-10 cursor-pointer"
            >
              ✕
            </button>

            {/* Static Content (No Scrolling) */}
            <div className="p-6 md:p-7 space-y-4">
              {/* Header / Title */}
              <div className="space-y-1.5 pr-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">
                  {selectedProject.category}
                </span>
                <h2 className="text-xl md:text-2xl font-heading font-light tracking-tight text-luxury-text-primary">
                  {selectedProject.title}
                </h2>
                <div className="w-12 h-[1px] bg-luxury-accent/30 mt-2" />
              </div>

              {/* Image below Title */}
              <div className="relative aspect-[16/10] max-h-[300px] w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={PROJECT_IMAGES[selectedProject.id] || PROJECT_IMAGES.p1}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 md:px-7 md:py-5 border-t border-white/10 bg-luxury-card shrink-0 rounded-b-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/contact";
                    }
                  }}
                  className="luxury-btn flex-1 text-center py-3 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  Inquire for Similar Setup <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="border border-white/10 hover:bg-white/5 transition-all rounded-sm flex-1 text-center py-3 text-xs text-luxury-text-primary uppercase tracking-[0.2em] font-medium cursor-pointer"
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
