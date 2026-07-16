"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useLenisInstance = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Force scroll to top before Lenis takes over to prevent jumping to cached scroll positions
    window.scrollTo(0, 0);

    // ── Mobile guard ──────────────────────────────────────────────────────────
    // On touch devices, the OS already provides native momentum scrolling that
    // is GPU-accelerated at the OS compositor level. Running Lenis on top adds
    // a redundant JS scroll layer causing jitter + fighting with GSAP canvas draws.
    // We skip Lenis entirely on mobile and rely on native scroll + ScrollTrigger.
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      // Still connect ScrollTrigger to native scroll events
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    // Instantiate Lenis smooth scroll
    // `autoRaf: false` is CRITICAL — prevents Lenis from running its own internal
    // requestAnimationFrame loop. Without this, Lenis is ticked twice per frame
    // (once internally, once via gsap.ticker), causing scroll jitter and image lag.
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoRaf: false,
    });

    setLenis(lenisInstance);

    // Connect Lenis to ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // Disable lag smoothing to prevent frame synchronization issues during rendering
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(updateTicker);
      setLenis(null);
    };
  }, []);


  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
