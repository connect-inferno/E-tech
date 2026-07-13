"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteContent, ProductItem } from "@/data/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles, Box, ListChecks, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Unsplash images
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

// Customizer options
const PANEL_FINISHES = [
  { id: "gold", name: "Brushed Gold", value: "linear-gradient(135deg, #dfba4d, #9a7b1c)", colorHex: "#dfba4d" },
  { id: "titanium", name: "Polished Titanium", value: "linear-gradient(135deg, #7a7a7d, #3c3c3e)", colorHex: "#7a7a7d" },
  { id: "obsidian", name: "Obsidian Glass", value: "linear-gradient(135deg, #18181b, #09090b)", colorHex: "#18181b" },
  { id: "walnut", name: "Walnut Burl Wood", value: "linear-gradient(135deg, #5c4033, #2b1d0c)", colorHex: "#5c4033" },
];

const FLOOR_MATERIALS = [
  { id: "marble-black", name: "Nero Marquina Marble", value: "radial-gradient(circle, rgba(20,20,20,1) 30%, rgba(5,5,5,1) 90%)", colorHex: "#141414" },
  { id: "marble-white", name: "Statuario White Marble", value: "radial-gradient(circle, rgba(240,240,242,1) 30%, rgba(200,200,205,1) 90%)", colorHex: "#f0f0f2" },
  { id: "wood-oak", name: "Solid Oak Parquet", value: "linear-gradient(90deg, #b58a57 25%, #8f6534 25%, #8f6534 50%, #b58a57 50%, #b58a57 75%, #8f6534 75%)", colorHex: "#b58a57" },
];

const CEILING_LIGHTS = [
  { id: "starry", name: "Starry Sky LED", glow: "rgba(212,175,55,0.45)", effectClass: "bg-[radial-gradient(circle,rgba(255,255,255,0.95)_1px,transparent_2px)] bg-[size:10px_10px]" },
  { id: "halo", name: "Ambient Soft Halo", glow: "rgba(255,255,255,0.4)", effectClass: "shadow-[inset_0_0_40px_rgba(255,255,255,0.85)] bg-white/10" },
  { id: "neon", name: "Linear Neon Grids", glow: "rgba(212,175,55,0.6)", effectClass: "border-b border-luxury-accent/50 bg-[linear-gradient(90deg,transparent_45%,#d4af37_50%,transparent_55%)] bg-[size:30px_100%] opacity-85" },
];

export default function ProductsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Customizer state
  const [panelFinish, setPanelFinish] = useState(PANEL_FINISHES[0]);
  const [floorMat, setFloorMat] = useState(FLOOR_MATERIALS[0]);
  const [ceilingLight, setCeilingLight] = useState(CEILING_LIGHTS[0]);

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

    // Cards staggered entry
    const cards = container.querySelectorAll(".product-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 1.0,
        ease: "power3.out",
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

  // Card 3D tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = (yc - y) / 16;
    const tiltY = (x - xc) / 16;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

    const glow = card.querySelector(".card-glow") as HTMLDivElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(212, 175, 55, 0.12), transparent 80%)`;
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
    <main ref={containerRef} className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-6 md:px-12 border-b border-white/5 overflow-hidden flex flex-col items-center text-center">
        {/* Aesthetic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <span className="animate-header block text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold">
            Bespoke Vertical Systems
          </span>
          <h1 className="animate-header text-4xl md:text-6xl font-heading font-extralight tracking-tight leading-none text-luxury-text-primary">
            Elevator Systems <span className="font-light text-luxury-accent">Portfolio</span>
          </h1>
          <p className="animate-header text-sm md:text-base font-light text-luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            Browse our wide catalog of premium mobility options, engineered with gearless traction technology, safety controls, and sophisticated visual configurations.
          </p>
          <div className="animate-header w-24 h-[1px] bg-luxury-accent/30 mx-auto mt-8" />
        </div>
      </section>

      {/* Products Grid Showcase */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {siteContent.products.categories.map((product: ProductItem, idx) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="product-card group relative bg-luxury-card border border-white/5 rounded-sm p-6 overflow-hidden flex flex-col justify-between aspect-[4/5] transition-all duration-500 ease-out select-none cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Radial glow layer */}
              <div className="card-glow absolute inset-0 pointer-events-none transition-opacity duration-300 z-10" />

              <div className="space-y-4 z-20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-widest text-luxury-accent uppercase font-medium">
                    System 0{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-luxury-text-secondary group-hover:text-luxury-accent transition-colors duration-300">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-light text-luxury-text-primary tracking-wide">
                  {product.title}
                </h3>
                <p className="text-xs text-luxury-text-secondary leading-relaxed font-light line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Central image backdrop */}
              <div className="relative w-full h-1/2 my-4 overflow-hidden rounded-sm border border-white/5 bg-black/40 z-20">
                <img
                  src={PRODUCT_IMAGES[product.image] || PRODUCT_IMAGES.passenger}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-85" />
              </div>

              {/* Specifications snippet footer */}
              <div className="space-y-3 pt-4 border-t border-white/5 z-20">
                <p className="text-[9px] uppercase tracking-widest text-luxury-text-secondary font-medium">
                  Key Technical Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[8px] tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-luxury-text-primary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="relative bg-luxury-card border border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-luxury-text-secondary hover:text-luxury-accent transition-colors text-2xl font-light"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Product Visual */}
              <div className="space-y-6">
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-white/10">
                  <img
                    src={PRODUCT_IMAGES[selectedProduct.image] || PRODUCT_IMAGES.passenger}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-4 bg-white/3 rounded-sm border border-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">
                    Engineered to Standards
                  </p>
                  <p className="text-[10px] text-luxury-text-secondary font-light mt-1">
                    CE, EN-81-20/50, and national lift regulations fully certified.
                  </p>
                </div>
              </div>

              {/* Product Specifications details */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent font-semibold">
                    Vertical Mobility Series
                  </span>
                  <h2 className="text-3xl font-heading font-light tracking-tight text-luxury-text-primary">
                    {selectedProduct.title}
                  </h2>
                </div>

                <div className="w-16 h-[1px] bg-luxury-accent/30" />

                <div className="space-y-4">
                  <p className="text-sm text-luxury-text-primary leading-relaxed font-normal">
                    {selectedProduct.longDescription}
                  </p>
                  <p className="text-xs text-luxury-text-secondary leading-relaxed font-light">
                    Every installation in this series is meticulously customized. Options range from specific speed profiles (up to 4.0 m/s) to direct digital integration with home automation networks or corporate security desks.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold flex items-center gap-2">
                    <ListChecks className="w-4 h-4" /> Included Specifications
                  </h4>
                  <ul className="space-y-3">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs font-light text-luxury-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-xs font-light text-luxury-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent" />
                      <span>Automatic Rescue Device (ARD) included</span>
                    </li>
                    <li className="flex items-center gap-3 text-xs font-light text-luxury-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent" />
                      <span>Seismic Sensor & Safety trigger mechanisms</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = "/#contact";
                      }
                    }}
                    className="luxury-btn flex-1 text-center py-3 text-xs uppercase tracking-[0.2em] font-medium"
                  >
                    Request Technical Specs
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="border border-white/10 hover:bg-white/5 transition-all rounded-sm flex-1 text-center py-3 text-xs text-luxury-text-primary uppercase tracking-[0.2em] font-medium"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cabin Visual Customizer Widget Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-luxury-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-luxury-accent font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> E Tech Configurator
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight text-luxury-text-primary">
              Design Your Cabin Interior
            </h2>
            <p className="text-xs md:text-sm text-luxury-text-secondary font-light leading-relaxed">
              Interact with panel finishes, marble floors, and ceiling options to visualize your custom luxury elevator cabin below.
            </p>
          </div>

          {/* Configurator Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Selection Panel Inputs (left 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8 p-8 border border-white/5 bg-luxury-card rounded-sm shadow-xl">
              <div className="space-y-8">
                {/* 1. Panel Finish */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
                    1. Wall Panel Finish
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {PANEL_FINISHES.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPanelFinish(opt)}
                        className={`flex items-center gap-3 p-3 text-left border rounded-sm transition-all focus:outline-none ${panelFinish.id === opt.id
                          ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                          : "border-white/5 hover:border-white/20 text-luxury-text-secondary"
                          }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                          style={{ background: opt.value }}
                        />
                        <span className="text-[11px] tracking-wide font-light">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Flooring Material */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
                    2. Cabin Floor Material
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                    {FLOOR_MATERIALS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFloorMat(opt)}
                        className={`flex items-center gap-3 p-3 text-left border rounded-sm transition-all focus:outline-none ${floorMat.id === opt.id
                          ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                          : "border-white/5 hover:border-white/20 text-luxury-text-secondary"
                          }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                          style={{ background: opt.value }}
                        />
                        <span className="text-[11px] tracking-wide font-light">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Ceiling Lighting Options */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
                    3. Ceiling Light Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                    {CEILING_LIGHTS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCeilingLight(opt)}
                        className={`flex items-center gap-3 p-3 text-left border rounded-sm transition-all focus:outline-none ${ceilingLight.id === opt.id
                          ? "border-luxury-accent bg-luxury-accent/5 text-luxury-text-primary"
                          : "border-white/5 hover:border-white/20 text-luxury-text-secondary"
                          }`}
                      >
                        <span
                          className="w-4 h-4 rounded-sm border border-white/10 shrink-0 flex items-center justify-center bg-zinc-800"
                          style={{ boxShadow: `0 0 6px ${opt.glow}` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </span>
                        <span className="text-[11px] tracking-wide font-light">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#contact";
                  }
                }}
                className="luxury-btn w-full text-center py-4 text-xs uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-2 mt-6"
              >
                Request Custom Spec Quote <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Styling Mock Cabin Visual representation (right 7 cols) */}
            <div className="lg:col-span-7 flex items-center justify-center p-8 border border-white/5 bg-black/40 rounded-sm relative overflow-hidden min-h-[400px] lg:min-h-[500px]">
              {/* Radial gradient background light matching selected ceiling glow */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle 280px at 50% 10%, ${ceilingLight.glow}, transparent 80%)`,
                }}
              />

              {/* 3D Wireframe Perspective Elevator Cabin CSS Box */}
              <div className="w-[280px] h-[360px] md:w-[320px] md:h-[420px] relative border border-white/15 overflow-hidden flex flex-col justify-between transition-all duration-500 rounded-sm bg-[#030303]">
                {/* Ceiling Layer */}
                <div
                  className={`h-12 w-full border-b border-white/10 relative transition-all duration-500 flex items-center justify-center ${ceilingLight.effectClass}`}
                  style={{
                    backgroundColor: "#0d0d0f",
                    boxShadow: `0 4px 15px -2px ${ceilingLight.glow}`,
                  }}
                >
                  <span className="text-[8px] uppercase tracking-[0.25em] text-luxury-text-secondary select-none">
                    E TECH LUMINA
                  </span>
                </div>

                {/* Main Walls Layer */}
                <div
                  className="flex-1 w-full flex relative transition-all duration-700"
                  style={{ background: panelFinish.value }}
                >
                  {/* Left Corner Reflection Line */}
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-white/15" />
                  {/* Right Corner Reflection Line */}
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-white/15" />
                  {/* Center Shadow overlay to give depth */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]" />

                  {/* Aesthetic Center Mirror/Accent Line */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-4/5 border border-white/10 bg-black/40 rounded-sm flex flex-col items-center justify-center p-3">
                    <span className="text-[7px] uppercase tracking-widest text-luxury-accent text-center">
                      Tailored Finish
                    </span>
                    <span className="text-[6px] tracking-wider text-luxury-text-secondary text-center mt-1 uppercase">
                      {panelFinish.name}
                    </span>
                  </div>
                </div>

                {/* Floor Layer */}
                <div
                  className="h-14 w-full border-t border-white/10 relative transition-all duration-700 overflow-hidden"
                  style={{ background: floorMat.value }}
                >
                  {/* Perspective perspective overlays */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.2),rgba(0,0,0,0.65))]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-[8px] uppercase tracking-widest ${floorMat.id === "marble-white" ? "text-neutral-600" : "text-luxury-text-secondary"
                        } font-medium`}
                    >
                      FL: {floorMat.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
