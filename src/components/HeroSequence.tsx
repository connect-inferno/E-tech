"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 240 pre-decoded frames — smooth on any device because scroll = drawImage
// (a GPU blit), no video decoder on the scroll path.
const FRAME_COUNT = 240;
const FRAME_URL = (i: number) => `/images/elevator-sequence/${i}.jpg`;

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Helper to wrap accent words in gold spans
  const highlightAccents = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(Safety|Trust)/g);
    return parts.map((part, i) =>
      part === "Safety" || part === "Trust" ? (
        <span key={i} className="text-[#C9A44B] font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let cancelled = false;
    let currentFrameIdx = -1;
    let rafId = 0;
    let pendingFrame = -1;

    // Canvas sizing — cover-fit the container, respecting DPR (but capped at 2
    // to avoid burning fill-rate on retina phones for negligible visual gain).
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = container.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      if (currentFrameIdx >= 0 && frames[currentFrameIdx]) draw(currentFrameIdx);
    };

    // Find the nearest loaded frame to a target index. Used when the user
    // scrolls faster than we've loaded — instead of a black gap, we show the
    // closest available frame. Returns -1 if no frame has loaded yet.
    const nearestLoaded = (target: number): number => {
      if (frames[target]) return target;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (target - d >= 0 && frames[target - d]) return target - d;
        if (target + d < FRAME_COUNT && frames[target + d]) return target + d;
      }
      return -1;
    };

    // Cover-fit an image inside the canvas (like CSS background-size: cover).
    // Falls back to the nearest loaded frame if the requested one isn't ready.
    const draw = (idx: number) => {
      const useIdx = nearestLoaded(idx);
      if (useIdx < 0) return;
      const img = frames[useIdx];
      if (!img || !img.complete || !img.naturalWidth) return;
      currentFrameIdx = useIdx;
      const cw = canvas.width;
      const ch = canvas.height;
      // Overshoot height by ~60px worth to hide the watermark strip, matching
      // the old `bottom: -60px` crop on the video element.
      const cropPx = 60 * dpr;
      const targetH = ch + cropPx;
      const targetW = cw;
      const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (targetW - drawW) / 2;
      const dy = 0; // anchor top; crop overshoots at the bottom
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    // rAF-batched scroll → frame. GSAP scrub calls onUpdate up to 60×/s;
    // we coalesce to one draw per frame and paint the nearest available frame.
    const setTargetFrame = (idx: number) => {
      pendingFrame = idx;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (pendingFrame !== currentFrameIdx) draw(pendingFrame);
      });
    };

    // ── Progressive preload ───────────────────────────────────────────────────
    // Load the first FIRST_BATCH frames sequentially so the intro is ready
    // fast (~1 MB), reveal the hero, then keep pumping the rest in the
    // background with a concurrency cap. If the user out-scrolls the loader,
    // `draw()` falls back to the nearest loaded frame — no black gaps.
    const FIRST_BATCH = 15;
    const CONCURRENCY = 8;
    const queue = Array.from({ length: FRAME_COUNT }, (_, i) => i);
    let inFlight = 0;
    let readyFired = false;

    const pumpQueue = () => {
      while (inFlight < CONCURRENCY && queue.length && !cancelled) {
        const i = queue.shift()!;
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        const finish = (ok: boolean) => {
          inFlight--;
          if (ok) frames[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
          // Reveal the hero as soon as the first batch is in — the rest keep
          // streaming in the background.
          if (!readyFired && loadedCount >= FIRST_BATCH) {
            readyFired = true;
            resize();
            draw(0);
            setIsReady(true);
            setupScrollAnimation();
          }
          if (!cancelled) pumpQueue();
        };
        img.onload = () => { if (!cancelled) finish(true); };
        img.onerror = () => { if (!cancelled) finish(false); };
        // Prioritize the first batch — browsers respect fetchpriority=high
        // for the initial images even before we've called setIsReady.
        if (i < FIRST_BATCH) img.fetchPriority = "high";
        img.src = FRAME_URL(i + 1);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    pumpQueue();

    function setupScrollAnimation() {
      if (!container) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=600%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: true,
          onUpdate: (self) => {
            const idx = Math.min(
              FRAME_COUNT - 1,
              Math.max(0, Math.round(self.progress * (FRAME_COUNT - 1)))
            );
            setTargetFrame(idx);
          },
        },
      });

      // Blur filters were removed — animating `filter: blur()` on scroll is
      // one of the most expensive compositor operations (re-rasterizes every
      // frame per layer). Opacity + translate give a similar feel at ~10× perf.

      // 2. Phase 1 Text: Fades out (0 to 15)
      tl.to(
        ".phase-1-text",
        { opacity: 0, y: -50, ease: "power1.in", duration: 15 },
        0
      );

      // 3. Phase 2 Text: Fades in (15 to 23) and out (32 to 40)
      tl.fromTo(
        ".phase-2-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 8 },
        15
      );
      tl.to(
        ".phase-2-text",
        { opacity: 0, y: -50, ease: "power2.in", duration: 8 },
        32
      );

      // 4. Phase 3 Text: Fades in (40 to 48) and out (57 to 65)
      tl.fromTo(
        ".phase-3-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 8 },
        40
      );
      tl.to(
        ".phase-3-text",
        { opacity: 0, y: -50, ease: "power2.in", duration: 8 },
        57
      );

      // 5. Phase 4 Text: Fades in (65 to 73) and out (80 to 88)
      tl.fromTo(
        ".phase-4-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 8 },
        65
      );
      tl.fromTo(
        ".phase-4-li",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 1.0, ease: "power1.out", duration: 8 },
        65
      );
      tl.to(
        [".phase-4-text", ".phase-4-li"],
        { opacity: 0, y: -50, ease: "power2.in", duration: 8 },
        80
      );

      // 6. Phase 5 Text: Fades in (88 to 95)
      tl.fromTo(
        ".phase-5-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 7 },
        88
      );
      tl.fromTo(
        ".phase-5-cta",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 7 },
        90
      );

      // 7. Video container Fade Out (95 to 100)
      tl.to(
        ".sequence-canvas-container",
        {
          opacity: 0,
          scale: 0.95,
          ease: "none",
          duration: 5,
        },
        95
      );

      ScrollTrigger.refresh();
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      // Drop references so the browser can GC ~92 MB of decoded frames
      frames.length = 0;
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
      {/* Loading overlay — disappears as soon as video has enough data to play */}
      {!isReady && (
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

      {/* Frame canvas + overlay text container. Canvas paints pre-decoded
          image frames — the scroll path never touches a video decoder, so
          scrubbing is buttery-smooth on any device. */}
      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-screen overflow-hidden z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Soft Golden Backlight Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_450px_at_50%_50%,rgba(201,164,75,0.08),transparent_80%)] pointer-events-none z-15" />

        {/* Phase 1: Architectural atmosphere & Intro */}
        <div className="phase-1-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 [will-change:transform,opacity] [transform:translateZ(0)]">
          <h1
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6 animate-pulse duration-4000"
            style={{
              textShadow:
                "0 0 30px rgba(201, 164, 75, 0.35), 0 0 60px rgba(201, 164, 75, 0.15)",
            }}
          >
            {siteContent.hero.phase1.title}
          </h1>
          <p className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl text-[rgba(250,250,250,0.65)]">
            {highlightAccents(siteContent.hero.phase1.subtitle)}
          </p>
          <div className="absolute bottom-16 flex flex-col items-center gap-2 text-[rgba(250,250,250,0.65)] animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.35em] font-light">
              Scroll to Begin Journey
            </span>
            <ArrowDown className="w-4 h-4 text-[#C9A44B]" />
          </div>
        </div>

        {/* Phase 2: Orbit - Luxury Vertical Mobility */}
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)]">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)",
            }}
          >
            {siteContent.hero.phase2.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)",
            }}
          >
            {highlightAccents(siteContent.hero.phase2.description)}
          </p>
        </div>

        {/* Phase 3: Designed Around Experience */}
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)]">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)",
            }}
          >
            {siteContent.hero.phase3.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)",
            }}
          >
            {highlightAccents(siteContent.hero.phase3.description)}
          </p>
        </div>

        {/* Phase 4: Precision Engineering Feature List */}
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)]">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-8"
            style={{
              textShadow:
                "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)",
            }}
          >
            {siteContent.hero.phase4.title}
          </h2>
          <ul className="space-y-4 max-w-md text-left md:text-center md:inline-block">
            {siteContent.hero.phase4.features.map((feature, idx) => (
              <li
                key={idx}
                className="phase-4-li flex items-center md:justify-center gap-4 text-sm md:text-lg tracking-widest font-light text-[rgba(250,250,250,0.65)]"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44B] shrink-0" />
                <span>{highlightAccents(feature)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 5: Arrival & Call to Action */}
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)]">
          <h2
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 16px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)",
            }}
          >
            {siteContent.hero.phase5.title}
          </h2>
          <p
            className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl mb-12 text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)",
            }}
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
