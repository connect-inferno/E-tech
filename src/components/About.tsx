"use client";

import { useEffect, useRef } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;
    const image = imageRef.current;
    const stats = statsRef.current;
    if (!section) return;

    // Fade-in stagger for editorial text
    const textElements = section.querySelectorAll(".animate-text");
    gsap.fromTo(
      textElements,
      { opacity: 0, y: 30, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Image Parallax scroll effect
    if (imageContainer && image) {
      gsap.fromTo(
        image,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: imageContainer,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    // Numbers count-up scroll trigger
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
              // Handle decimal and integers uniquely
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
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === imageContainer || (stats && stats.contains(t.trigger as Node))) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Left Column: Editorial Text */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <span className="animate-text block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
              {siteContent.about.subtitle}
            </span>
            <h2 className="animate-text text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary max-w-lg leading-tight">
              {siteContent.about.title}
            </h2>
          </div>

          <div className="w-20 h-[1px] bg-luxury-accent/30 animate-text" />

          <div className="space-y-6 text-luxury-text-secondary font-light text-sm md:text-base leading-relaxed max-w-xl">
            <p className="animate-text text-luxury-text-primary font-medium tracking-wide">
              {siteContent.about.storyTitle}
            </p>
            <p className="animate-text whitespace-pre-line">
              {siteContent.about.storyParagraph1}
            </p>
            <p className="animate-text whitespace-pre-line">
              {siteContent.about.storyParagraph2}
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 animate-text">
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium">
                {siteContent.about.missionTitle}
              </h4>
              <p className="text-xs leading-relaxed text-luxury-text-secondary font-light">
                {siteContent.about.missionText}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-accent font-medium">
                {siteContent.about.visionTitle}
              </h4>
              <p className="text-xs leading-relaxed text-luxury-text-secondary font-light">
                {siteContent.about.visionText}
              </p>
            </div>
          </div>

          {/* Read Our Full Story CTA */}
          <div className="pt-4 animate-text">
            <Link
              href="/about"
              className="luxury-btn inline-block px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium"
            >
              Read Our Full Story
            </Link>
          </div>
        </div>

        {/* Right Column: Architectural Visualizer */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div
            ref={imageContainerRef}
            className="parallax-container relative w-full aspect-[4/5] max-w-md md:max-w-lg overflow-hidden border border-white/10 rounded-sm shadow-2xl bg-luxury-card"
          >
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-transparent opacity-80 z-10" />
            <div className="absolute inset-0 bg-black/10 z-10" />
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
              alt="Luxury Architecture"
              className="gpu-img absolute top-0 left-0 w-full h-[130%] object-cover select-none pointer-events-none scale-105"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div
        ref={statsRef}
        className="max-w-7xl mx-auto mt-24 md:mt-32 pt-16 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left"
      >
        {siteContent.about.stats.map((stat, idx) => (
          <div key={idx} className="stat-block space-y-3">
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
  );
}
