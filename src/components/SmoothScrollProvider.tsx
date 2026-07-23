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
    // Take scroll restoration away from the browser. Without this it re-applies
    // the previous scroll position on reload/back-nav *after* our effects run,
    // which lands the visitor mid-way through the pinned hero and reads as the
    // page scrolling on its own.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // ── Mobile guard ──────────────────────────────────────────────────────────
    // On touch devices, the OS provides native momentum scrolling at the GPU
    // compositor level. Running Lenis on top adds a JS scroll interpolation
    // loop that FIGHTS with the compositor, causing jank. Skip Lenis on mobile
    // and rely on native scroll + GSAP ScrollTrigger scrub smoothing.
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
