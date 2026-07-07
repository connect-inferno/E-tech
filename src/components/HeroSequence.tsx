"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Configurable crop values in pixels (relative to the raw source frame size)
const CROP_CONFIG = {
  top: 0,
  bottom: 60, // 60px crop at the bottom to hide the Gemini watermark
  left: 0,
  right: 0,
};

const TOTAL_FRAMES = 240;

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIndexRef = useRef<number>(1);

  // Helper function to format image filename path
  const getFrameUrl = (frameNumber: number) => {
    return `/images/elevator-sequence/${frameNumber}.jpg`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isComponentMounted = true;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // Phase 1: Preload the first 20 frames immediately to render the initial state rapidly
    const criticalFrameCount = 20;
    let criticalLoadedCount = 0;
    let totalLoadedCount = 0;

    const drawFrame = (index: number) => {
      const img = images[index - 1];
      if (!img || !img.complete) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Extract raw measurements
      const rawWidth = img.naturalWidth;
      const rawHeight = img.naturalHeight;

      // Apply crop margins to the source image dimensions
      const sx = CROP_CONFIG.left;
      const sy = CROP_CONFIG.top;
      const sw = rawWidth - CROP_CONFIG.left - CROP_CONFIG.right;
      const sh = rawHeight - CROP_CONFIG.top - CROP_CONFIG.bottom;

      // Perform a cover scale computation for the cropped source box relative to target canvas
      const croppedRatio = sw / sh;
      const canvasRatio = canvasWidth / canvasHeight;

      let dx = 0;
      let dy = 0;
      let dw = canvasWidth;
      let dh = canvasHeight;

      if (canvasRatio > croppedRatio) {
        // Canvas is wider than the cropped source image
        dh = canvasWidth / croppedRatio;
        dy = (canvasHeight - dh) / 2;
      } else {
        // Canvas is taller than the cropped source image
        dw = canvasHeight * croppedRatio;
        dx = (canvasWidth - dw) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      currentFrameIndexRef.current = index;
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale context back to normal coordinates but render with high density
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw last current frame to retain render state
      drawFrame(currentFrameIndexRef.current);
    };

    window.addEventListener("resize", handleResize);

    const onFrameLoaded = (index: number, isCritical: boolean) => {
      if (!isComponentMounted) return;

      totalLoadedCount++;

      if (isCritical) {
        criticalLoadedCount++;
        const progress = Math.round((criticalLoadedCount / criticalFrameCount) * 100);
        setLoadProgress(progress);
        
        if (criticalLoadedCount === criticalFrameCount) {
          // Trigger initial canvas resize and first frame draw immediately
          handleResize();
          drawFrame(1);
          
          setIsLoaded(true);
          // Setup GSAP animation early so user doesn't wait for 240 frames
          setupScrollAnimation();
          
          // Start loading the rest of the frames in chunks to prevent network throttling on mobile
          loadRemainingFramesInChunks(criticalFrameCount + 1);
        }
      }
    };

    const loadFrame = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const isCritical = i <= criticalFrameCount;
        
        img.onload = () => {
          onFrameLoaded(i, isCritical);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed loading frame: ${i}. Proceeding with fallback progress.`);
          onFrameLoaded(i, isCritical);
          resolve();
        };
        
        img.src = getFrameUrl(i);
        images[i - 1] = img;
      });
    };

    // Pre-allocate array
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      images.push(null as any);
    }

    // Start critical frames loading
    for (let i = 1; i <= criticalFrameCount; i++) {
      loadFrame(i);
    }

    const loadRemainingFramesInChunks = async (startIndex: number) => {
      const CHUNK_SIZE = 4; // Load 4 frames at a time to be safe on iOS
      for (let i = startIndex; i <= TOTAL_FRAMES; i += CHUNK_SIZE) {
        if (!isComponentMounted) break;
        const promises = [];
        for (let j = 0; j < CHUNK_SIZE && i + j <= TOTAL_FRAMES; j++) {
          promises.push(loadFrame(i + j));
        }
        await Promise.all(promises);
      }
    };

    function setupScrollAnimation() {
      if (!containerRef.current || !canvasRef.current) return;

      const frameObj = { index: 1 };

      // Create a master timeline that binds the sequence and overlay animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%", // Pin and scrub for 6 viewports of scroll distance
          pin: true,
          pinSpacing: true,
          scrub: 1.2, // Smooth interpolation easing
        },
      });

      // 1. Frame Index scrubbing (0% to 100% timeline progress)
      tl.to(frameObj, {
        index: TOTAL_FRAMES,
        ease: "none",
        duration: 100,
        onUpdate: () => {
          drawFrame(Math.round(frameObj.index));
        },
      }, 0);

      // 2. Phase 1 Text: Fades out (0 to 15)
      tl.to(".phase-1-text", {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        ease: "power1.in",
        duration: 15,
      }, 0);

      // 3. Phase 2 Text: Fades in (15 to 23) and out (32 to 40)
      tl.fromTo(".phase-2-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
        15
      );
      tl.to(".phase-2-text", {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        ease: "power2.in",
        duration: 8,
      }, 32);

      // 4. Phase 3 Text: Fades in (40 to 48) and out (57 to 65)
      tl.fromTo(".phase-3-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
        40
      );
      tl.to(".phase-3-text", {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        ease: "power2.in",
        duration: 8,
      }, 57);

      // 5. Phase 4 Text: Fades in (65 to 73) and out (80 to 88)
      tl.fromTo(".phase-4-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
        65
      );
      tl.fromTo(".phase-4-li",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 1.0, ease: "power1.out", duration: 8 },
        65
      );
      tl.to([".phase-4-text", ".phase-4-li"], {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        ease: "power2.in",
        duration: 8,
      }, 80);

      // 6. Phase 5 Text: Fades in (88 to 95)
      tl.fromTo(".phase-5-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 7 },
        88
      );
      tl.fromTo(".phase-5-cta",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 7 },
        90
      );

      // 7. Canvas container Fade Out (95 to 100)
      tl.to(".sequence-canvas-container", {
        opacity: 0,
        scale: 0.95,
        ease: "none",
        duration: 5,
      }, 95);

      // Refresh ScrollTrigger to ensure all layout offsets are registered correctly
      ScrollTrigger.refresh();
    }

    return () => {
      isComponentMounted = false;
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleCtaScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home" ref={containerRef} className="relative w-full h-screen bg-luxury-bg">
      {/* Loading overlay panel */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-bg">
          <div className="text-center space-y-6">
            <h2 className="text-sm font-heading tracking-[0.4em] uppercase text-luxury-accent">
              E TECH ELEVATORS
            </h2>
            <p className="text-xs text-luxury-text-secondary tracking-[0.15em] font-light">
              Initializing Cinematic Atmosphere
            </p>
            <div className="relative w-64 h-[1px] bg-white/10 mx-auto overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-luxury-accent transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-luxury-text-secondary tracking-widest">
              {loadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Sticky Canvas & Overlay Text Container */}
      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-screen overflow-hidden z-10">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

        {/* Phase 1: Architectural atmosphere & Intro */}
        <div className="phase-1-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <h1 className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-luxury-text-primary mb-6 animate-pulse duration-4000">
            {siteContent.hero.phase1.title}
          </h1>
          <p className="text-sm md:text-lg tracking-[0.4em] uppercase text-luxury-accent font-light max-w-xl">
            {siteContent.hero.phase1.subtitle}
          </p>
          <div className="absolute bottom-16 flex flex-col items-center gap-2 text-luxury-text-secondary animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.35em] font-light">Scroll to Begin Journey</span>
            <ArrowDown className="w-4 h-4 text-luxury-accent" />
          </div>
        </div>

        {/* Phase 2: Orbit - Luxury Vertical Mobility */}
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-luxury-text-primary mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {siteContent.hero.phase2.title}
          </h2>
          <p className="text-sm md:text-lg text-luxury-accent font-light max-w-xl leading-relaxed tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {siteContent.hero.phase2.description}
          </p>
        </div>

        {/* Phase 3: Designed Around Experience */}
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-luxury-text-primary mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {siteContent.hero.phase3.title}
          </h2>
          <p className="text-sm md:text-lg text-luxury-accent font-light max-w-xl leading-relaxed tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {siteContent.hero.phase3.description}
          </p>
        </div>

        {/* Phase 4: Precision Engineering Feature List */}
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-luxury-text-primary mb-8 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {siteContent.hero.phase4.title}
          </h2>
          <ul className="space-y-4 max-w-md text-left md:text-center md:inline-block">
            {siteContent.hero.phase4.features.map((feature, idx) => (
              <li
                key={idx}
                className="phase-4-li flex items-center md:justify-center gap-4 text-sm md:text-lg tracking-widest text-luxury-accent font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 5: Arrival & Call to Action */}
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none">
          <h1 className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-luxury-text-primary mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {siteContent.hero.phase5.title}
          </h1>
          <p className="text-sm md:text-lg tracking-[0.4em] uppercase text-luxury-accent font-light max-w-xl mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {siteContent.hero.phase5.subtitle}
          </p>
          <a
            href="#about"
            onClick={handleCtaScroll}
            className="phase-5-cta luxury-btn px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium"
          >
            {siteContent.hero.phase5.cta}
          </a>
        </div>

        {/* Subtle top/bottom luxury vignettes */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-luxury-bg to-transparent pointer-events-none z-15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-luxury-bg to-transparent pointer-events-none z-15" />
      </div>
    </div>
  );
}
