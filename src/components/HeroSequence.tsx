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

// 240 WebP frames — scroll = drawImage (a GPU blit), no video decoder on the
// scroll path, so scrubbing stays smooth on any device.
//
// Frames are downloaded as compressed Blobs and only *decoded* in a sliding
// window around the current scroll position (see the window logic below).
// Holding all 240 decoded at once costs 1280*720*4*240 ≈ 844 MB, which blows
// past the per-tab memory ceiling on iOS Safari (~200-400 MB) — the tab gets
// killed the moment scrolling forces every frame to decode, which is exactly
// what "the site freezes after the hero" was.
const FRAME_COUNT = 240;
// Phones paint the canvas at ~780 CSS px wide, so the 1280px set is wasted
// bytes there; the 720px set is visually identical on device at 1/3 the
// decoded cost. Same 240 frames, same 1-based numbering, in both sets.
const DESKTOP_FRAME_DIR = "/images/elevator-sequence-webp";
const MOBILE_FRAME_DIR = "/images/elevator-sequence-webp-mobile";

// How much of the sequence stays decoded at once. Asymmetric because scrolling
// continues in the direction you're already going far more often than it
// reverses, so we buy more runway ahead than behind.
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

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const frameDir = isCoarsePointer ? MOBILE_FRAME_DIR : DESKTOP_FRAME_DIR;
    const frameUrl = (i: number) => `${frameDir}/${i}.webp`;
    const windowAhead = isCoarsePointer ? WINDOW_AHEAD_MOBILE : WINDOW_AHEAD_DESKTOP;
    const windowBehind = isCoarsePointer ? WINDOW_BEHIND_MOBILE : WINDOW_BEHIND_DESKTOP;

    // Compressed source bytes for every frame — ~4.6 MB (mobile) / ~11.6 MB
    // (desktop) total, cheap to hold for the lifetime of the hero.
    const blobs: (Blob | undefined)[] = new Array(FRAME_COUNT);
    // Decoded pixels, only for frames currently in the window or on a keyframe.
    // ImageBitmap is used over HTMLImageElement specifically because .close()
    // frees the backing memory deterministically instead of waiting on GC.
    const bitmaps: (ImageBitmap | undefined)[] = new Array(FRAME_COUNT);
    const decoding = new Set<number>();

    let loadedCount = 0;
    let cancelled = false;
    let currentFrameIdx = -1;
    let rafId = 0;
    let pendingFrame = -1;
    let scrollDir = 1;

    const isKeyframe = (i: number) => i % KEYFRAME_STEP === 0;

    // Canvas sizing — cover-fit the container, respecting DPR (but capped at 2
    // to avoid burning fill-rate on retina phones for negligible visual gain).
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = container.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      if (currentFrameIdx >= 0 && bitmaps[currentFrameIdx]) draw(currentFrameIdx);
    };

    // Find the nearest decoded frame to a target index. Used when the user
    // scrolls faster than we can decode — instead of a black gap, we show the
    // closest available frame. Returns -1 if nothing has decoded yet.
    const nearestLoaded = (target: number): number => {
      if (bitmaps[target]) return target;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (target - d >= 0 && bitmaps[target - d]) return target - d;
        if (target + d < FRAME_COUNT && bitmaps[target + d]) return target + d;
      }
      return -1;
    };

    // Cover-fit an image inside the canvas (like CSS background-size: cover).
    // Falls back to the nearest loaded frame if the requested one isn't ready.
    const draw = (idx: number) => {
      const useIdx = nearestLoaded(idx);
      if (useIdx < 0) return;
      const img = bitmaps[useIdx];
      if (!img || !img.width) return;
      currentFrameIdx = useIdx;
      const cw = canvas.width;
      const ch = canvas.height;
      // Overshoot height by ~60px worth to hide the watermark strip, matching
      // the old `bottom: -60px` crop on the video element.
      const cropPx = 60 * dpr;
      const targetH = ch + cropPx;
      const targetW = cw;
      const scale = Math.max(targetW / img.width, targetH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = (targetW - drawW) / 2;
      const dy = 0; // anchor top; crop overshoots at the bottom
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    // rAF-batched scroll → frame. GSAP scrub calls onUpdate up to 60×/s;
    // we coalesce to one draw per frame and paint the nearest available frame.
    const setTargetFrame = (idx: number) => {
      if (idx !== pendingFrame) scrollDir = idx >= pendingFrame ? 1 : -1;
      pendingFrame = idx;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (pendingFrame !== currentFrameIdx) draw(pendingFrame);
        // Reshape the decoded window *after* painting, so decode work never
        // delays the frame the user is waiting on.
        updateWindow(pendingFrame);
      });
    };

    // ── Sliding decode window ────────────────────────────────────────────────
    // Keeps [center-behind, center+ahead] decoded (biased in the scroll
    // direction), plus every KEYFRAME_STEP-th frame, and closes everything
    // else. This is what keeps peak memory flat at ~70 MB instead of growing
    // to 844 MB as the user scrubs through the sequence.
    const updateWindow = (center: number) => {
      if (cancelled || center < 0) return;
      const lo = Math.max(0, center - (scrollDir >= 0 ? windowBehind : windowAhead));
      const hi = Math.min(
        FRAME_COUNT - 1,
        center + (scrollDir >= 0 ? windowAhead : windowBehind)
      );

      // Release anything that fell outside the window.
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (i >= lo && i <= hi) continue;
        if (isKeyframe(i)) continue;
        const bmp = bitmaps[i];
        if (bmp) {
          bmp.close();
          bitmaps[i] = undefined;
        }
      }

      // Fill the window, nearest-to-center first so the frames most likely to
      // be needed next are decoded first.
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
          // If we were showing a stale fallback and the real frame just landed,
          // repaint immediately.
          if (i === pendingFrame && i !== currentFrameIdx) draw(i);
        })
        .catch(() => {
          decoding.delete(i);
        });
    };

    // ── Preload all 240 frames before revealing the hero ─────────────────────
    // Progress drives the elevator-door loader animation. Small concurrency
    // cap keeps HTTP/2 from being greedy and lets the browser prioritize the
    // first frames.
    const CONCURRENCY = 8;
    const queue = Array.from({ length: FRAME_COUNT }, (_, i) => i);
    let inFlight = 0;
    let readyFired = false;

    const pumpQueue = () => {
      while (inFlight < CONCURRENCY && queue.length && !cancelled) {
        const i = queue.shift()!;
        inFlight++;
        fetch(frameUrl(i + 1), {
          // Prioritize the first batch so the opening frames are ready early.
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
            setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            if (!readyFired && loadedCount === FRAME_COUNT) {
              readyFired = true;
              // Decode the opening window before revealing anything, so the
              // first paint is the real frame 0 rather than a fallback.
              updateWindow(0);
              createImageBitmap(blobs[0]!)
                .then((bmp) => {
                  if (cancelled) {
                    bmp.close();
                    return;
                  }
                  bitmaps[0] = bmp;
                  resize();
                  draw(0);
                })
                .catch(() => {})
                .finally(() => {
                  if (cancelled) return;
                  // Small delay so the doors visibly finish opening before
                  // the hero shows.
                  setTimeout(() => {
                    if (cancelled) return;
                    setIsReady(true);
                    setupScrollAnimation();
                  }, 600);
                });
            }
            pumpQueue();
          });
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
          // Hide the browser scrollbar while the hero is pinned; show it again
          // as soon as the user exits the pinned range (in either direction).
          onToggle: (self) => {
            document.documentElement.classList.toggle("hide-scrollbar", self.isActive);
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
      // Restore the scrollbar in case the component unmounts mid-pin.
      document.documentElement.classList.remove("hide-scrollbar");
      // Explicitly free decoded pixels — .close() releases immediately rather
      // than leaving it to GC — then drop the compressed source blobs.
      for (let i = 0; i < FRAME_COUNT; i++) {
        bitmaps[i]?.close();
        bitmaps[i] = undefined;
        blobs[i] = undefined;
      }
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
    // 100svh, not 100vh: on mobile 100vh is the *expanded* viewport, so the
    // hero is taller than the visible area until the URL bar hides, which makes
    // the pin start at a shifting offset.
    <div id="home" ref={containerRef} className="relative w-full h-[100svh] bg-luxury-bg">
      {/* Minimal elevator-shaft loader — a single vertical line with a gold
          marker that rises from bottom to top as frames download. Fades out
          once all 240 frames have loaded. */}
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

      {/* Frame canvas + overlay text container. Canvas paints pre-decoded
          image frames — the scroll path never touches a video decoder, so
          scrubbing is buttery-smooth on any device. */}
      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-[100svh] overflow-hidden z-10">
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
