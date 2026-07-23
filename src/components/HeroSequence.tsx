"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// ── Asset paths ──────────────────────────────────────────────────────────────
const MOBILE_VIDEO_SRC = "/images/elevator-allkeyframe-mobile.mp4";
const DESKTOP_VIDEO_SRC = "/images/elevator-allkeyframe-desktop.mp4";

type DeviceTier = "" | "mobile" | "desktop";

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tier, setTier] = useState<DeviceTier>("");
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── Tier detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (coarse || window.innerWidth < 768) {
      setTier("mobile");
    } else {
      setTier("desktop");
    }
  }, []);

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
    const video = videoRef.current;
    if (!container || !video) return;

    let isCancelled = false;
    let duration = 10; // Default 10s duration

    // Set src based on device tier
    video.src = tier === "mobile" ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;
    video.load();

    // ── Preloading engine ────────────────────────────────────────────────────
    const handleProgress = () => {
      if (isCancelled) return;
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
        setLoadProgress(pct);
        if (pct >= 95) {
          onReady();
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration) {
        duration = video.duration;
      }
      setLoadProgress(30);
    };

    const handleCanPlayThrough = () => {
      setLoadProgress(100);
      onReady();
    };

    let readyFired = false;
    const onReady = () => {
      if (readyFired || isCancelled) return;
      readyFired = true;
      setLoadProgress(100);

      // Force video to seek to 0 initially
      video.currentTime = 0;

      setTimeout(() => {
        if (isCancelled) return;
        setIsReady(true);
        startScrubLoop();
        setupAnimation();
      }, 300);
    };

    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    // Safety fallback (maximum 3.5s wait)
    const safetyTimer = setTimeout(() => {
      if (!readyFired && !isCancelled) {
        onReady();
      }
    }, 3500);

    // ── Smooth Seek RAF Loop ──────────────────────────────────────────────────
    let targetTime = 0;
    let currentTime = 0;
    let rafId = 0;
    let isSeeking = false;

    const startScrubLoop = () => {
      const lerpFactor = tier === "mobile" ? 0.15 : 0.2;

      const loop = () => {
        if (isCancelled) return;

        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.001) {
          currentTime += diff * lerpFactor;
        } else {
          currentTime = targetTime;
        }

        // Fast zero-delay seek because video is encoded All-Intra (every frame is a keyframe!)
        if (!isSeeking && Math.abs(video.currentTime - currentTime) > 0.01) {
          isSeeking = true;
          video.currentTime = Math.min(duration - 0.01, Math.max(0, currentTime));
        }

        rafId = requestAnimationFrame(loop);
      };

      video.addEventListener("seeked", () => {
        isSeeking = false;
      });

      rafId = requestAnimationFrame(loop);
    };

    // ── Scroll Animation Setup ───────────────────────────────────────────────
    let animationTimeline: gsap.core.Timeline | null = null;

    function setupAnimation() {
      if (isCancelled || !container) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const pinDistance = tier === "mobile" ? "+=450%" : "+=600%";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: pinDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 0, // RAF loop handles butter-smooth lerp seeking
          onUpdate: (self) => {
            targetTime = self.progress * duration;
          },
          onToggle: (self) => {
            document.documentElement.classList.toggle("hide-scrollbar", self.isActive);
          },
        },
      });

      animationTimeline = tl;

      tl.to(".phase-1-text", { opacity: 0, y: -50, ease: "power1.in", duration: 15 }, 0);

      tl.fromTo(".phase-2-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out", duration: 8 }, 15);
      tl.to(".phase-2-text", { opacity: 0, y: -50, ease: "power2.in", duration: 8 }, 32);

      tl.fromTo(".phase-3-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out", duration: 8 }, 40);
      tl.to(".phase-3-text", { opacity: 0, y: -50, ease: "power2.in", duration: 8 }, 57);

      tl.fromTo(".phase-4-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out", duration: 8 }, 65);
      tl.fromTo(".phase-4-li", { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 1.0, ease: "power1.out", duration: 8 }, 65);
      tl.to([".phase-4-text", ".phase-4-li"], { opacity: 0, y: -50, ease: "power2.in", duration: 8 }, 80);

      tl.fromTo(".phase-5-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out", duration: 7 }, 88);
      tl.fromTo(".phase-5-cta", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 7 }, 90);

      tl.to(".sequence-canvas-container", { opacity: 0, scale: 0.95, ease: "none", duration: 5 }, 95);

      ScrollTrigger.refresh();
    }

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
      if (rafId) cancelAnimationFrame(rafId);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      if (animationTimeline) {
        animationTimeline.kill();
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, [tier]);

  const handleCtaScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="home" ref={containerRef} className="relative w-full h-[100svh] bg-luxury-bg">
      {!isReady && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-bg transition-opacity duration-700 ${
            loadProgress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xs font-heading tracking-[0.5em] uppercase text-luxury-text-primary/90">
                E TECH ELEVATORS
              </h2>
              <div className="w-6 h-[1px] bg-luxury-accent/40" />
            </div>

            <div className="relative h-[220px] w-4 flex items-center justify-center">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10" />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-luxury-accent/60 transition-all duration-300 ease-out"
                style={{ height: `${loadProgress}%` }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-[6px] bg-luxury-accent rounded-[1px] transition-all duration-300 ease-out"
                style={{
                  bottom: `calc(${loadProgress}% - 3px)`,
                  boxShadow: "0 0 12px rgba(212,175,55,0.7), 0 0 24px rgba(212,175,55,0.35)",
                }}
              />
            </div>

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

      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-[100svh] overflow-hidden z-10">
        {/* All-Intra Native Hardware Scrubber Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover [will-change:transform] [transform:translateZ(0)]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_450px_at_50%_50%,rgba(201,164,75,0.08),transparent_80%)] pointer-events-none z-[15]" />

        {/* Phase 1 */}
        <div className="phase-1-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 [will-change:transform,opacity] [transform:translateZ(0)]">
          <h1
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6"
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

        {/* Phase 2 */}
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)" }}
          >
            {siteContent.hero.phase2.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)" }}
          >
            {highlightAccents(siteContent.hero.phase2.description)}
          </p>
        </div>

        {/* Phase 3 */}
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)" }}
          >
            {siteContent.hero.phase3.title}
          </h2>
          <p
            className="text-sm md:text-lg font-light max-w-xl leading-relaxed tracking-wider text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)" }}
          >
            {highlightAccents(siteContent.hero.phase3.description)}
          </p>
        </div>

        {/* Phase 4 */}
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-4xl md:text-6xl font-heading font-light tracking-[0.2em] uppercase text-[#FAFAFA] mb-8"
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)" }}
          >
            {siteContent.hero.phase4.title}
          </h2>
          <ul className="space-y-4 max-w-md text-left md:text-center md:inline-block">
            {siteContent.hero.phase4.features.map((feature, idx) => (
              <li
                key={idx}
                className="phase-4-li flex items-center md:justify-center gap-4 text-sm md:text-lg tracking-widest font-light text-[rgba(250,250,250,0.65)]"
                style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A44B] shrink-0" />
                <span>{highlightAccents(feature)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phase 5 */}
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none [will-change:transform,opacity] [transform:translateZ(0)] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_900px_450px_at_50%_50%,rgba(0,0,0,0.75),transparent_75%)] before:pointer-events-none before:-z-10">
          <h2
            className="text-5xl md:text-7xl font-heading font-extralight tracking-[0.3em] uppercase text-[#FAFAFA] mb-6"
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 0, 0, 0.8)" }}
          >
            {siteContent.hero.phase5.title}
          </h2>
          <p
            className="text-sm md:text-lg tracking-[0.4em] uppercase font-light max-w-xl mb-12 text-[rgba(250,250,250,0.65)]"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 1), 0 0 24px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.7)" }}
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

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-luxury-bg to-transparent pointer-events-none z-[15]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-luxury-bg to-transparent pointer-events-none z-[15]" />
      </div>
    </div>
  );
}