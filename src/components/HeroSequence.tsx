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

  // Helper to wrap "Safety" and "Trust" in accent-colored spans
  const highlightAccents = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(Safety|Trust)/g);
    return parts.map((part, i) =>
      part === "Safety" || part === "Trust" ? (
        <span key={i} className="text-[#C9A44B] font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isComponentMounted = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    // ── Mobile detection ─────────────────────────────────────────────────────
    // On mobile we apply two strategies:
    //   1. Load every 2nd frame only (120 frames instead of 240) — halves memory
    //   2. Cap canvas DPR at 1.25× instead of 2× — 2.56× fewer pixels per draw
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const FRAME_STEP = isMobile ? 2 : 1;  // skip odd frames on mobile
    const DPR_CAP = isMobile ? 1.25 : 2;  // lower resolution on mobile

    // Phase 1: Preload first N frames for fast initial render
    const criticalFrameCount = isMobile ? 10 : 20;
    let criticalLoadedCount = 0;

    // ── Cached layout values ──────────────────────────────────────────────────
    // Recomputed only on resize (not on every drawFrame call), so onUpdate is
    // as cheap as possible — just an array lookup + one drawImage call.
    let cachedSx = 0, cachedSy = 0, cachedSw = 0, cachedSh = 0;
    let cachedDx = 0, cachedDy = 0, cachedDw = 0, cachedDh = 0;
    let layoutReady = false;

    const computeLayout = (img: HTMLImageElement) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const rawWidth = img.naturalWidth;
      const rawHeight = img.naturalHeight;
      if (!rawWidth || !rawHeight) return;

      cachedSx = CROP_CONFIG.left;
      cachedSy = CROP_CONFIG.top;
      cachedSw = rawWidth - CROP_CONFIG.left - CROP_CONFIG.right;
      cachedSh = rawHeight - CROP_CONFIG.top - CROP_CONFIG.bottom;

      const croppedRatio = cachedSw / cachedSh;
      const canvasRatio = canvasWidth / canvasHeight;

      cachedDx = 0; cachedDy = 0; cachedDw = canvasWidth; cachedDh = canvasHeight;

      if (canvasRatio > croppedRatio) {
        cachedDh = canvasWidth / croppedRatio;
        cachedDy = (canvasHeight - cachedDh) / 2;
      } else {
        cachedDw = canvasHeight * croppedRatio;
        cachedDx = (canvasWidth - cachedDw) / 2;
      }
      layoutReady = true;
    };

    // ── rAF-throttled draw ────────────────────────────────────────────────────
    // GSAP onUpdate can fire multiple times between browser paint frames.
    // We schedule a single draw per visual frame using requestAnimationFrame,
    // which is the key fix for canvas stutter during scroll.
    let pendingFrame: number | null = null;
    let pendingIndex = 1;

    const drawFrame = (index: number) => {
      pendingIndex = index;
      if (pendingFrame !== null) return; // already scheduled for this visual frame
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null;
        const img = images[pendingIndex - 1];
        if (!img || !img.complete || !layoutReady) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, cachedSx, cachedSy, cachedSw, cachedSh, cachedDx, cachedDy, cachedDw, cachedDh);
        currentFrameIndexRef.current = pendingIndex;
      });
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium"; // 'high' is imperceptible during animation

      // Recompute cached layout for new canvas size
      const refImg = images[currentFrameIndexRef.current - 1] || images[0];
      if (refImg && refImg.complete) computeLayout(refImg);

      // Draw current frame with updated dimensions
      drawFrame(currentFrameIndexRef.current);
    };

    window.addEventListener("resize", handleResize);

    const onFrameLoaded = (index: number, isCritical: boolean) => {
      if (!isComponentMounted) return;

      if (isCritical) {
        criticalLoadedCount++;
        const progress = Math.round((criticalLoadedCount / criticalFrameCount) * 100);
        setLoadProgress(progress);

        if (criticalLoadedCount === criticalFrameCount) {
          // Compute layout from first loaded frame, then resize canvas + draw
          const firstImg = images[0];
          if (firstImg && firstImg.complete) computeLayout(firstImg);
          handleResize();
          drawFrame(1);

          setIsLoaded(true);
          setupScrollAnimation();

          // Load remaining frames after critical ones are shown
          loadRemainingFramesInChunks((criticalFrameCount * FRAME_STEP) + 1);
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

    // Start critical frames loading — on mobile load every 2nd frame only
    for (let i = 1; i <= criticalFrameCount * FRAME_STEP; i += FRAME_STEP) {
      loadFrame(i);
    }

    const loadRemainingFramesInChunks = async (startIndex: number) => {
      // On mobile: smaller chunks + skip odd frames to stay within memory limits
      const CHUNK_SIZE = isMobile ? 4 : 8;
      for (let i = startIndex; i <= TOTAL_FRAMES; i += CHUNK_SIZE * FRAME_STEP) {
        if (!isComponentMounted) break;
        const promises: Promise<void>[] = [];
        for (let j = 0; j < CHUNK_SIZE && i + j * FRAME_STEP <= TOTAL_FRAMES; j++) {
          promises.push(loadFrame(i + j * FRAME_STEP));
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
          scrub: 0.5, // Reduced from 1.2 — tighter tracking eliminates the "sticky lag" feel
        },
      });

      // 1. Frame Index scrubbing (0% to 100% timeline progress)
      // On mobile we only have every 2nd frame loaded — snap to nearest loaded frame
      tl.to(frameObj, {
        index: TOTAL_FRAMES,
        ease: "none",
        duration: 100,
        onUpdate: () => {
          const raw = Math.round(frameObj.index);
          // Snap to nearest loaded frame index based on FRAME_STEP
          const snapped = Math.max(1, Math.round(raw / FRAME_STEP) * FRAME_STEP);
          drawFrame(Math.min(snapped, TOTAL_FRAMES));
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
      if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
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
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        />

        {/* Soft Golden Backlight Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_450px_at_50%_50%,rgba(201,164,75,0.08),transparent_80%)] pointer-events-none z-15" />

        {/* Phase 1: Architectural atmosphere & Intro */}
        <div className="phase-1-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <h1 
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6 animate-pulse duration-4000"
            style={{ textShadow: "0 0 30px rgba(201, 164, 75, 0.35), 0 0 60px rgba(201, 164, 75, 0.15)" }}
          >
            {siteContent.hero.phase1.title}
          </h1>
          <p className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl text-[rgba(250,250,250,0.65)]">
            {highlightAccents(siteContent.hero.phase1.subtitle)}
          </p>
          <div className="absolute bottom-16 flex flex-col items-center gap-2 text-[rgba(250,250,250,0.65)] animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.35em] font-light">Scroll to Begin Journey</span>
            <ArrowDown className="w-4 h-4 text-[#C9A44B]" />
          </div>
        </div>

        {/* Phase 2: Orbit - Luxury Vertical Mobility */}
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)" }}
          >
            {siteContent.hero.phase2.title}
          </h2>
          <p 
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)" }}
          >
            {highlightAccents(siteContent.hero.phase2.description)}
          </p>
        </div>

        {/* Phase 3: Designed Around Experience */}
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)" }}
          >
            {siteContent.hero.phase3.title}
          </h2>
          <p 
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)" }}
          >
            {highlightAccents(siteContent.hero.phase3.description)}
          </p>
        </div>

        {/* Phase 4: Precision Engineering Feature List */}
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
          <h2 
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-8"
            style={{ textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)" }}
          >
            {siteContent.hero.phase4.title}
          </h2>
          <ul className="space-y-4 max-w-md text-left md:text-center md:inline-block">
            {siteContent.hero.phase4.features.map((feature, idx) => (
              <li
                key={idx}
                className="phase-4-li flex items-center md:justify-center gap-4 text-sm md:text-lg tracking-widest font-light text-[rgba(250,250,250,0.65)]"
                style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44B] shrink-0" />
                <span>{highlightAccents(feature)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 5: Arrival & Call to Action */}
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none">
          <h2 
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)" }}
          >
            {siteContent.hero.phase5.title}
          </h2>
          <p 
            className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl mb-12 text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)" }}
          >
            {highlightAccents(siteContent.hero.phase5.subtitle)}
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
