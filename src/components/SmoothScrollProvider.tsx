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
    
    // Instantiate Lenis smooth scroll
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
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
