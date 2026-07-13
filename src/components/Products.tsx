"use client";

import React, { useEffect, useRef } from "react";
import { siteContent, ProductItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Map key to curated Unsplash images
const PRODUCT_IMAGES: Record<string, string> = {
  passenger: "/images/passenger_elavtor__1.jpg",
  capsule: "/images/capsule_elevator__2.jpg",
  glass: "/images/glass_elevators_2.jpg",
  home: "/images/home_elevators_2.jpg",
  hospital: "/images/hospitle_elevator__2.jpg",
  hydraulic: "/images/hydraulic_elevator_in_building_1.jpg",
  mrl: "/images/MRL_elevator_in_building__2.jpg",
  escalators: "/images/escalator.jpg",
};

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header reveal
    const titleElements = section.querySelectorAll(".animate-header");
    gsap.fromTo(
      titleElements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      }
    );

    // Cards staggered entry
    const cards = section.querySelectorAll(".product-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === gridRef.current) {
          t.kill();
        }
      });
    };
  }, []);

  // Apple card 3D tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Tilt angle limited to max 5 degrees for premium restraint
    const tiltX = (yc - y) / 18;
    const tiltY = (x - xc) / 18;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;

    // Interactive radial glow positioning
    const glow = card.querySelector(".card-glow") as HTMLDivElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(212, 175, 55, 0.1), transparent 80%)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    const glow = card.querySelector(".card-glow") as HTMLDivElement;
    if (glow) {
      glow.style.background = `transparent`;
    }
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 px-6 md:px-12 bg-luxury-bg border-t border-white/5"
    >
      {/* Decorative accent background light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-medium">
              {siteContent.products.subtitle}
            </span>
            <h2 className="animate-header text-3xl md:text-5xl font-heading font-light tracking-tight text-luxury-text-primary">
              {siteContent.products.title}
            </h2>
            <div className="animate-header w-20 h-[1px] bg-luxury-accent/30 mx-auto md:mx-0 mt-6" />
          </div>
          <div className="animate-header flex justify-center shrink-0">
            <Link
              href="/products"
              className="luxury-btn px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium"
            >
              Explore Full Catalog
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {siteContent.products.categories.map((product: ProductItem, idx) => (
            <div
              key={product.id}
              className="product-card group relative bg-luxury-card border border-white/5 rounded-sm p-6 overflow-hidden flex flex-col justify-between aspect-[4/5] transition-all duration-500 ease-out select-none cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Radial glow layer */}
              <div className="card-glow absolute inset-0 pointer-events-none transition-opacity duration-300 z-10" />

              {/* Upper Section */}
              <div className="space-y-4 z-20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-widest text-luxury-accent uppercase font-medium">
                    0{idx + 1} / {siteContent.products.categories.length}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-luxury-text-secondary group-hover:text-luxury-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-light text-luxury-text-primary tracking-wide">
                  {product.title}
                </h3>
                <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Central stylized image backdrop */}
              <div className="relative w-full h-1/2 my-6 overflow-hidden rounded-sm border border-white/5 bg-black/40 z-20">
                <img
                  src={PRODUCT_IMAGES[product.image] || PRODUCT_IMAGES.passenger}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark overlay inside image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </div>

              {/* Features Footer inside card */}
              <div className="space-y-3 pt-4 border-t border-white/5 z-20">
                <p className="text-[10px] uppercase tracking-widest text-luxury-text-secondary">
                  Key Specifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[9px] tracking-wider px-2 py-1 rounded-full bg-white/5 border border-white/5 text-luxury-text-primary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
