"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent, ProjectItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Map project IDs to luxury architectural Unsplash images
const PROJECT_IMAGES: Record<string, string> = {
  p1: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600",
  p2: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600",
  p3: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
  p4: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600",
  p5: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
  p6: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
};

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Header reveal
    const headerElements = container.querySelectorAll(".animate-header");
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
          trigger: container,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) {
          t.kill();
        }
      });
    };
  }, []);

  const filteredProjects = siteContent.projects.items.filter((project: ProjectItem) => {
    if (activeFilter === "All") return true;
    return project.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
              {siteContent.projects.subtitle}
            </span>
            <h2 className="animate-header text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary">
              {siteContent.projects.title}
            </h2>
            <div className="flex items-center gap-6 mt-6">
              <div className="animate-header w-20 h-[1px] bg-luxury-accent/30" />
              <Link
                href="/projects"
                className="luxury-btn px-6 py-2 text-[10px] uppercase tracking-[0.25em] font-medium"
              >
                View All Journeys
              </Link>
            </div>
          </div>

          {/* Filter Categories Menu */}
          <div className="animate-header flex flex-wrap gap-2 md:gap-4 border-b border-white/5 pb-2 md:pb-0">
            {siteContent.projects.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 relative focus:outline-none ${
                  activeFilter === category ? "text-luxury-accent" : "text-luxury-text-secondary hover:text-luxury-text-primary"
                }`}
              >
                {category}
                {activeFilter === category && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-like Framer Motion Grid */}
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
                  className={`group relative ${heightClass} bg-luxury-card border border-white/5 overflow-hidden rounded-sm cursor-pointer select-none`}
                >
                  {/* Subtle corner light reflection */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500 z-10" />

                  {/* Text Details Overlay (Bottom aligned) */}
                  <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {project.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-heading font-light tracking-wide text-luxury-text-primary leading-tight">
                      {project.title}
                    </h3>
                    
                    {/* Location detail */}
                    <div className="flex items-center gap-2 text-luxury-text-secondary text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      <MapPin className="w-3.5 h-3.5 text-luxury-accent" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
