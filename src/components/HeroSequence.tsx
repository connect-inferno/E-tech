"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire a resize every time the URL bar hides or shows.
  // Without this, each one refreshes the pin mid-scroll and yanks the user's
  // scroll position around.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// ── Pre-decoded frame sequence ──────────────────────────────────────────────
// Scroll paints frames with drawImage() — a GPU blit with no video decoder on
// the scroll path at all. Scrubbing a compressed video instead means asking the
// decoder to seek up to 60×/s, which is its worst-case workload: desktops cope
// unevenly and phones do not cope at all (iOS Safari drops to single-digit fps
// and can kill the tab). Frames are the only approach that scrubs smoothly on
// every device.
const FRAME_COUNT = 240;

// Same 240 frames, same 1-based numbering, two resolutions. Phones paint the
// canvas at ~780 CSS px wide, so the 1280px set is wasted bytes there; the
// 720px set is visually identical on device at roughly a third of the decoded
// cost.
const DESKTOP_FRAME_DIR = "/images/elevator-sequence-webp";
const MOBILE_FRAME_DIR = "/images/elevator-sequence-webp-mobile";

// How much of the sequence stays decoded at once. Asymmetric because scrolling
// continues in the direction you're already going far more often than it
// reverses, so we buy more runway ahead than behind.
//
// Holding all 240 decoded at once would cost ~844 MB, which blows past the
// per-tab ceiling on iOS Safari (~200-400 MB). The window keeps peak memory
// flat at roughly 70 MB instead.
const WINDOW_AHEAD_DESKTOP = 40;
const WINDOW_BEHIND_DESKTOP = 20;
const WINDOW_AHEAD_MOBILE = 28;
const WINDOW_BEHIND_MOBILE = 12;

// Every Nth frame stays decoded permanently. A flick-scroll can outrun the
// decoder, and without these the fallback could be dozens of frames stale —
// visibly frozen. With them the worst case is half a step off, which reads as
// a slightly coarse scrub rather than a stuck image.
const KEYFRAME_STEP = 12;
const MAX_CONCURRENT_DECODES = 6;

// Numeric scrub (seconds of catch-up) rather than `true`. With `true` the frame
// index is pinned 1:1 to the scrollbar, so every decode hiccup and every jitter
// in a fling shows up directly on screen. A catch-up window makes GSAP
// interpolate toward the target instead, smoothing motion and hiding brief
// stalls — the single biggest perceived-smoothness win.
//
// The two values differ because the platforms have different amounts of
// smoothing underneath them. Desktop runs Lenis, which already interpolates
// the scroll position, so a long catch-up here would stack on top of that and
// feel floaty/detached. Mobile deliberately skips Lenis (native momentum
// scrolling is better) which means raw, jittery scroll deltas — so scrub is
// doing all the smoothing work there and needs a wider window.
const SCRUB_DESKTOP = 0.15;
const SCRUB_MOBILE = 0.35;

// Phones need far less thumb-travel to feel like a full journey, and a shorter
// pin means fewer distinct positions to render for the same gesture.
const PIN_DISTANCE_DESKTOP = "+=600%";
const PIN_DISTANCE_MOBILE = "+=400%";

type DeviceTier = "" | "desktop" | "mobile";

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tier, setTier] = useState<DeviceTier>("");
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Decide on the client only — the server has no way to know the device, and
  // guessing would mean downloading the wrong resolution set.
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory <= 4;
    setTier(coarsePointer || lowMemory ? "mobile" : "desktop");
  }, []);

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
    if (!tier) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let readyFired = false;

    // Shared reveal: park on the opening frame, let the loader finish its rise,
    // then hand over to the scroll animation.
    const reveal = (paintFirstFrame: () => void) => {
      if (readyFired || cancelled) return;
      readyFired = true;
      setLoadProgress(100);
      paintFirstFrame();
      setTimeout(() => {
        if (cancelled) return;
        setIsReady(true);
        setupScrollAnimation();
      }, 600);
    };

    // Set by the renderer below; called by ScrollTrigger on every update.
    let applyProgress: (p: number) => void = () => {};

    const teardown = setupFrameRenderer();

    function setupFrameRenderer(): () => void {
      const canvas = canvasRef.current;
      if (!canvas || !container) return () => {};
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return () => {};

      const isMobile = tier === "mobile";
      const frameDir = isMobile ? MOBILE_FRAME_DIR : DESKTOP_FRAME_DIR;
      const windowAhead = isMobile ? WINDOW_AHEAD_MOBILE : WINDOW_AHEAD_DESKTOP;
      const windowBehind = isMobile ? WINDOW_BEHIND_MOBILE : WINDOW_BEHIND_DESKTOP;
      const frameUrl = (i: number) => `${frameDir}/${i}.webp`;

      // Compressed source bytes for every frame — ~5 MB (mobile) / ~13 MB
      // (desktop) total, cheap to hold for the lifetime of the hero.
      const blobs: (Blob | undefined)[] = new Array(FRAME_COUNT);
      // Decoded pixels, only for frames in the window or on a keyframe.
      // ImageBitmap over HTMLImageElement specifically because .close() frees
      // the backing memory deterministically instead of waiting on GC.
      const bitmaps: (ImageBitmap | undefined)[] = new Array(FRAME_COUNT);
      const decoding = new Set<number>();

      let loadedCount = 0;
      let currentFrameIdx = -1;
      let rafId = 0;
      let pendingFrame = -1;
      let scrollDir = 1;

      const isKeyframe = (i: number) => i % KEYFRAME_STEP === 0;

      const resize = () => {
        if (currentFrameIdx >= 0 && bitmaps[currentFrameIdx]) draw(currentFrameIdx);
      };

      // Nearest decoded frame to a target. When the user out-scrolls the
      // decoder we show the closest available frame instead of a black gap.
      const nearestLoaded = (target: number): number => {
        if (bitmaps[target]) return target;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (target - d >= 0 && bitmaps[target - d]) return target - d;
          if (target + d < FRAME_COUNT && bitmaps[target + d]) return target + d;
        }
        return -1;
      };

      // Cover-fit canvas via hardware 1:1 pixel blit + CSS object-cover scaling.
      // Crops source watermark (~60px) off the bottom during context paint.
      const draw = (idx: number) => {
        const useIdx = nearestLoaded(idx);
        if (useIdx < 0) return;
        const img = bitmaps[useIdx];
        if (!img || !img.width) return;
        currentFrameIdx = useIdx;

        const cropBottom = 60;
        const srcW = img.width;
        const srcH = Math.max(1, img.height - cropBottom);

        if (canvas.width !== srcW || canvas.height !== srcH) {
          canvas.width = srcW;
          canvas.height = srcH;
        }

        ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, srcW, srcH);
      };

      // Background idle pre-decoder queue: pre-decodes keyframes & remaining frames
      // during CPU idle time after blobs load, ensuring instant 0ms frame lookups.
      let idlePredecodeScheduled = false;
      const startIdlePredecoding = () => {
        if (idlePredecodeScheduled || cancelled) return;
        idlePredecodeScheduled = true;

        const indicesToPredecode: number[] = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (isKeyframe(i)) indicesToPredecode.push(i);
        }
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (!isKeyframe(i)) indicesToPredecode.push(i);
        }

        let idxPointer = 0;
        const decodeNext = () => {
          if (cancelled || idxPointer >= indicesToPredecode.length) return;
          const i = indicesToPredecode[idxPointer++];
          if (bitmaps[i] || !blobs[i]) {
            decodeNext();
            return;
          }
          createImageBitmap(blobs[i]!)
            .then((bmp) => {
              if (cancelled) {
                bmp.close();
                return;
              }
              bitmaps[i] = bmp;
              if (typeof requestIdleCallback !== "undefined") {
                requestIdleCallback(decodeNext, { timeout: 100 });
              } else {
                setTimeout(decodeNext, 10);
              }
            })
            .catch(() => {
              if (typeof requestIdleCallback !== "undefined") {
                requestIdleCallback(decodeNext, { timeout: 100 });
              } else {
                setTimeout(decodeNext, 10);
              }
            });
        };

        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(decodeNext, { timeout: 200 });
        } else {
          setTimeout(decodeNext, 50);
        }
      };

      // Keeps [center-behind, center+ahead] decoded plus keyframes
      const updateWindow = (center: number) => {
        if (cancelled || center < 0) return;
        const lo = Math.max(0, center - (scrollDir >= 0 ? windowBehind : windowAhead));
        const hi = Math.min(
          FRAME_COUNT - 1,
          center + (scrollDir >= 0 ? windowAhead : windowBehind)
        );

        for (let i = 0; i < FRAME_COUNT; i++) {
          if (i >= lo && i <= hi) continue;
          if (isKeyframe(i)) continue;
          const bmp = bitmaps[i];
          if (bmp) {
            bmp.close();
            bitmaps[i] = undefined;
          }
        }

        for (let d = 0; d <= hi - lo; d++) {
          for (const i of d === 0 ? [center] : [center + d, center - d]) {
            if (i < lo || i > hi) continue;
            if (decoding.size >= MAX_CONCURRENT_DECODES) return;
            decodeFrame(i);
          }
        }
      };

      const decodeFrame = (i: number) => {
        if (bitmaps[i] || decoding.has(i) || !blobs[i] || cancelled) return;
        decoding.add(i);
        createImageBitmap(blobs[i]!)
          .then((bmp) => {
            decoding.delete(i);
            if (cancelled) {
              bmp.close();
              return;
            }
            bitmaps[i] = bmp;
            if (i === pendingFrame && i !== currentFrameIdx) draw(i);
          })
          .catch(() => {
            decoding.delete(i);
          });
      };

      applyProgress = (p: number) => {
        const idx = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(p * (FRAME_COUNT - 1)))
        );
        if (idx !== pendingFrame) scrollDir = idx >= pendingFrame ? 1 : -1;
        pendingFrame = idx;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          if (pendingFrame !== currentFrameIdx) draw(pendingFrame);
          // Schedule window maintenance asynchronously so paint tick is instant
          setTimeout(() => updateWindow(pendingFrame), 0);
        });
      };

      const CONCURRENCY = 8;
      const queue = Array.from({ length: FRAME_COUNT }, (_, i) => i);
      let inFlight = 0;

      const pumpQueue = () => {
        while (inFlight < CONCURRENCY && queue.length && !cancelled) {
          const i = queue.shift()!;
          inFlight++;
          fetch(frameUrl(i + 1), {
            priority: i < 15 ? "high" : "auto",
          } as RequestInit)
            .then((res) => (res.ok ? res.blob() : null))
            .then((blob) => {
              if (cancelled) return;
              if (blob) blobs[i] = blob;
            })
            .catch(() => {})
            .finally(() => {
              if (cancelled) return;
              inFlight--;
              loadedCount++;
              setLoadProgress(Math.min(99, Math.round((loadedCount / FRAME_COUNT) * 100)));
              if (!readyFired && loadedCount === FRAME_COUNT) {
                updateWindow(0);
                if (blobs[0]) {
                  createImageBitmap(blobs[0])
                    .then((bmp) => {
                      if (cancelled) {
                        bmp.close();
                        return;
                      }
                      bitmaps[0] = bmp;
                      reveal(() => {
                        resize();
                        draw(0);
                        startIdlePredecoding();
                      });
                    })
                    .catch(() => {
                      reveal(() => {});
                      startIdlePredecoding();
                    });
                } else {
                  reveal(() => {});
                  startIdlePredecoding();
                }
              }
              pumpQueue();
            });
        }
      };

      resize();
      window.addEventListener("resize", resize);
      pumpQueue();

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        // .close() releases decoded pixels immediately rather than leaving it
        // to GC; then drop the compressed sources.
        for (let i = 0; i < FRAME_COUNT; i++) {
          bitmaps[i]?.close();
          bitmaps[i] = undefined;
          blobs[i] = undefined;
        }
      };
    }

    function setupScrollAnimation() {
      if (!container) return;
      const isMobile = tier === "mobile";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: isMobile ? PIN_DISTANCE_MOBILE : PIN_DISTANCE_DESKTOP,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: isMobile ? SCRUB_MOBILE : SCRUB_DESKTOP,
          onUpdate: (self) => applyProgress(self.progress),
          // Hide the browser scrollbar while the hero is pinned; show it again
          // as soon as the user exits the pinned range (in either direction).
          onToggle: (self) => {
            document.documentElement.classList.toggle("hide-scrollbar", self.isActive);
          },
        },
      });

      // Blur filters were deliberately removed — animating `filter: blur()` on
      // scroll is one of the most expensive compositor operations
      // (re-rasterizes every frame per layer). Opacity + translate give a
      // similar feel at roughly 10× the performance.

      // 2. Phase 1 Text: Fades out (0 to 15)
      tl.to(".phase-1-text", { opacity: 0, y: -50, ease: "power1.in", duration: 15 }, 0);

      // 3. Phase 2 Text: Fades in (15 to 23) and out (32 to 40)
      tl.fromTo(
        ".phase-2-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 8 },
        15
      );
      tl.to(".phase-2-text", { opacity: 0, y: -50, ease: "power2.in", duration: 8 }, 32);

      // 4. Phase 3 Text: Fades in (40 to 48) and out (57 to 65)
      tl.fromTo(
        ".phase-3-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 8 },
        40
      );
      tl.to(".phase-3-text", { opacity: 0, y: -50, ease: "power2.in", duration: 8 }, 57);

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

      // 7. Media container fades out (95 to 100)
      tl.to(
        ".sequence-canvas-container",
        { opacity: 0, scale: 0.95, ease: "none", duration: 5 },
        95
      );

      ScrollTrigger.refresh();
    }

    return () => {
      cancelled = true;
      teardown();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      // Restore the scrollbar in case the component unmounts mid-pin.
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, [tier]);

  const handleCtaScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // 100svh, not 100vh: on mobile 100vh is the *expanded* viewport, so the
    // hero is taller than the visible area until the URL bar hides, which makes
    // the pin start at a shifting offset.
    <div id="home" ref={containerRef} className="relative w-full h-[100svh] bg-luxury-bg">
      {/* Minimal elevator-shaft loader — a single vertical line with a gold
          marker that rises from bottom to top as the media loads. Fades out
          once everything is buffered and safe to scrub. */}
      {!isReady && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-bg transition-opacity duration-700 ${
            loadProgress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-16">
            {/* Wordmark */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xs font-heading tracking-[0.5em] uppercase text-luxury-text-primary/90">
                E TECH ELEVATORS
              </h2>
              <div className="w-6 h-[1px] bg-luxury-accent/40" />
            </div>

            {/* Vertical shaft with rising marker */}
            <div className="relative h-[220px] w-4 flex items-center justify-center">
              {/* Shaft line */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10" />
              {/* Filled portion (from bottom up) */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-luxury-accent/60 transition-all duration-300 ease-out"
                style={{ height: `${loadProgress}%` }}
              />
              {/* Elevator car — a small gold bar with a soft glow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-[6px] bg-luxury-accent rounded-[1px] transition-all duration-300 ease-out"
                style={{
                  bottom: `calc(${loadProgress}% - 3px)`,
                  boxShadow: "0 0 12px rgba(212,175,55,0.7), 0 0 24px rgba(212,175,55,0.35)",
                }}
              />
            </div>

            {/* Percentage */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-heading font-extralight text-luxury-text-primary tabular-nums tracking-wider">
                {String(loadProgress).padStart(2, "0")}
                <span className="text-luxury-accent/60 text-base ml-0.5">%</span>
              </span>
              <p className="text-[9px] text-luxury-text-secondary tracking-[0.35em] uppercase font-light">
                Preparing your journey
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Frame canvas + overlay text container. The canvas paints pre-decoded
          frames, cover-fit with ~60px overshoot at the bottom to crop the
          source watermark. */}
      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-[100svh] overflow-hidden z-10">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
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
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)",
            }}
          >
            {siteContent.hero.phase2.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)",
            }}
          >
            {highlightAccents(siteContent.hero.phase2.description)}
          </p>
        </div>

        {/* Phase 3: Designed Around Experience */}
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)",
            }}
          >
            {siteContent.hero.phase3.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)",
            }}
          >
            {highlightAccents(siteContent.hero.phase3.description)}
          </p>
        </div>

        {/* Phase 4: Precision Engineering Feature List */}
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-8"
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)",
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
                    "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44B] shrink-0" />
                <span>{highlightAccents(feature)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 5: Arrival & Call to Action */}
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6"
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)",
            }}
          >
            {siteContent.hero.phase5.title}
          </h2>
          <p
            className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl mb-12 text-[rgba(250,250,250,0.65)]"
            style={{
              textShadow:
                "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)",
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
