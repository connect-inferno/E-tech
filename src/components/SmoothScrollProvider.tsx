"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    // Take scroll restoration away from the browser.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Reset window scroll immediately on route change
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, lenis]);

  useEffect(() => {
    // ── Mobile guard ──────────────────────────────────────────────────────────
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      autoRaf: true,
    });

    setLenis(lenisInstance);

    // Connect Lenis to ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    return () => {
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

