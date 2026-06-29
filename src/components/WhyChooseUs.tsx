"use client";

import { useEffect, useRef } from "react";
import { siteContent } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const getIconComponent = (iconName: string) => {
  const LucideIcon = (Icons as any)[iconName];
  if (!LucideIcon) return Icons.Award;
  return LucideIcon;
};

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

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

    // Timeline line progress animation
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 60%",
          end: "bottom 70%",
          scrub: true,
        },
      }
    );

    // Staggered node activation on scroll
    const items = container.querySelectorAll(".timeline-item");
    items.forEach((item) => {
      const node = item.querySelector(".timeline-node");
      const content = item.querySelector(".timeline-content");
      const index = item.querySelector(".timeline-index");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(node, { scale: 1.3, backgroundColor: "var(--color-luxury-accent)", borderColor: "var(--color-luxury-accent)", duration: 0.4, ease: "back.out(1.7)" })
        .fromTo(content, { opacity: 0, x: (item.classList.contains("lg:flex-row-reverse") ? 30 : -30) }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .to(index, { color: "var(--color-luxury-text-primary)", duration: 0.3 }, "-=0.4");
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container || (line && line.contains(t.trigger as Node)) || Array.from(items).includes(t.trigger as Element)) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="why-choose-us"
      ref={containerRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg border-t border-white/5 overflow-hidden"
    >
      {/* Dynamic ambient highlight */}
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-luxury-accent/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
            {siteContent.whyChooseUs.subtitle}
          </span>
          <h2 className="animate-header text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary">
            {siteContent.whyChooseUs.title}
          </h2>
          <div className="animate-header w-20 h-[1px] bg-luxury-accent/30 mx-auto md:mx-0 mt-6" />
        </div>

        {/* Timeline Container */}
        <div className="timeline-container relative w-full max-w-4xl mx-auto pt-10 pb-20">
          {/* Central Vertical Line (Background) */}
          <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />

          {/* Active Vertical Line (GSAP Driven Progress) */}
          <div
            ref={lineRef}
            className="absolute left-4 lg:left-1/2 -translate-x-1/2 top-0 w-[1px] bg-luxury-accent origin-top scale-y-0 h-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          />

          {/* Timeline Items */}
          <div className="space-y-16 lg:space-y-24">
            {siteContent.whyChooseUs.items.map((item, idx) => {
              const IconComponent = getIconComponent(item.iconName);
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`timeline-item relative flex flex-col lg:flex-row items-start lg:items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  } w-full pl-10 lg:pl-0 select-none`}
                >
                  {/* Central Node Indicator */}
                  <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-white/20 bg-luxury-bg timeline-node z-20 transition-all duration-300 shadow-[0_0_6px_rgba(0,0,0,0.8)]" />

                  {/* Left/Right Content Block */}
                  <div className="w-full lg:w-1/2 lg:px-12 timeline-content opacity-0">
                    <div className="bg-luxury-card border border-white/5 p-6 md:p-8 rounded-sm space-y-4 hover:border-white/10 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/3 border border-white/5 text-luxury-accent">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="timeline-index text-sm font-heading font-light text-luxury-text-secondary transition-colors duration-300">
                          0{idx + 1}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-heading font-light tracking-wide text-luxury-text-primary">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-luxury-text-secondary leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for layout symmetry */}
                  <div className="hidden lg:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
