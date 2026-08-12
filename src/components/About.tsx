"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useInView } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function AnimatedStat({ number, suffix, label }: { number: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    let animationFrameId: number;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * number);
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, number]);

  return (
    <div ref={ref} className="stat-block space-y-3">
      <h3 className="stat-number text-4xl md:text-5xl font-heading font-light tracking-wider text-luxury-accent tabular-nums">
        {count}{suffix}
      </h3>
      <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-text-secondary font-light">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) {
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

        {/* Right Column: Founder & Leadership Visualizer */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div
            className="relative w-full aspect-[4/5] max-w-md md:max-w-lg overflow-hidden border border-luxury-accent/30 rounded-sm shadow-2xl bg-luxury-card group"
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 z-10 pointer-events-none" />
            <img
              src="/images/vivek.png"
              alt="Vivek Borkar - Founder & CEO"
              className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
              decoding="async"
            />
            {/* Leadership Caption Badge */}
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1 bg-black/70 backdrop-blur-md p-4 border border-white/10 rounded-sm">
              <h3 className="text-lg font-heading font-light text-luxury-text-primary tracking-wide">
                Vivek Borkar
              </h3>
              <p className="text-xs uppercase tracking-wider text-luxury-accent font-semibold">
                Founder &amp; CEO
              </p>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-widest font-light">
                E-Tech Elevators • Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div
        className="max-w-7xl mx-auto mt-24 md:mt-32 pt-16 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left"
      >
        {siteContent.about.stats.map((stat, idx) => (
          <AnimatedStat
            key={idx}
            number={stat.number}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}
