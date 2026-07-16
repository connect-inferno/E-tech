"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The source video — 1080p, all-keyframes, CRF 28 (quality/size balanced)
const VIDEO_SRC = "/images/elevator-hero-hq.mp4";

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let scrollTriggerSetup = false;

    // ── Loading progress via buffer ───────────────────────────────────────────
    const onProgress = () => {
      if (video.duration > 0 && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.round((bufferedEnd / video.duration) * 100);
        setLoadProgress(Math.min(pct, 99));
      }
    };

    // ── Ready: fire as soon as the browser has enough data to start playback ─
    // canplay fires after only a few seconds of buffering — no waiting for full
    // download like the old 240-frame approach needed.
    const onCanPlay = () => {
      if (scrollTriggerSetup) return;
      scrollTriggerSetup = true;
      setLoadProgress(100);
      setIsReady(true);
      setupScrollAnimation();
    };

    video.addEventListener("progress", onProgress);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlay);

    // Kick off buffering
    video.load();

    // ── Scroll-driven video scrub ─────────────────────────────────────────────
    function setupScrollAnimation() {
      if (!container || !video) return;

      // ── Smart seek throttle ─────────────────────────────────────────────────
      // The browser video decoder can't keep up if we seek 60× per second.
      // We throttle to only seek when time changes by ≥1 frame (at 30fps = 33ms).
      // fastSeek() jumps to the nearest keyframe — the decoder already has it
      // buffered, so no inter-frame decoding is needed. This is the key fix.
      let lastSeekTime = -1;
      const MIN_DELTA = 1 / 30; // 30fps minimum seek step

      const seekTo = (targetTime: number) => {
        if (!video.duration || video.readyState < 2) return;
        const t = Math.max(0, Math.min(targetTime, video.duration));
        if (Math.abs(t - lastSeekTime) < MIN_DELTA) return; // skip redundant seeks
        lastSeekTime = t;
        // fastSeek() is supported in Chrome/Firefox/Safari — jumps to nearest
        // keyframe which the decoder already has decoded. Falls back to currentTime.
        if (typeof (video as any).fastSeek === "function") {
          (video as any).fastSeek(t);
        } else {
          video.currentTime = t;
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=600%",
          pin: true,
          pinSpacing: true,
          // anticipatePin pre-calculates the pin position before it's needed,
          // preventing the layout jump/freeze that happens on pin activation
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: true, // 1:1 direct scroll mapping, no added smoothing lag
          onUpdate: (self) => {
            seekTo(self.progress * video.duration);
          },
          // Free up the video decoder when section is fully past
          onLeaveBack: () => { video.currentTime = 0; },
        },
      });

      // 2. Phase 1 Text: Fades out (0 to 15)
      tl.to(
        ".phase-1-text",
        {
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
          ease: "power1.in",
          duration: 15,
        },
        0
      );

      // 3. Phase 2 Text: Fades in (15 to 23) and out (32 to 40)
      tl.fromTo(
        ".phase-2-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
        15
      );
      tl.to(
        ".phase-2-text",
        {
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
          ease: "power2.in",
          duration: 8,
        },
        32
      );

      // 4. Phase 3 Text: Fades in (40 to 48) and out (57 to 65)
      tl.fromTo(
        ".phase-3-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
        40
      );
      tl.to(
        ".phase-3-text",
        {
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
          ease: "power2.in",
          duration: 8,
        },
        57
      );

      // 5. Phase 4 Text: Fades in (65 to 73) and out (80 to 88)
      tl.fromTo(
        ".phase-4-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 8 },
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
        {
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
          ease: "power2.in",
          duration: 8,
        },
        80
      );

      // 6. Phase 5 Text: Fades in (88 to 95)
      tl.fromTo(
        ".phase-5-text",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 7 },
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
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlay);
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

      {/* Video + Overlay Text Container */}
      <div className="sequence-canvas-container absolute top-0 left-0 w-full h-screen overflow-hidden z-10">
        {/* ── Video element replaces canvas entirely ──────────────────────────
            - muted: required for autoplay/preload on mobile
            - playsInline: prevents iOS fullscreen takeover
            - preload="auto": browser aggressively buffers from the start
            - The video is NOT playing — we manually set currentTime on scroll
            The wrapper crops the bottom ~60px to hide any watermark       */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ bottom: "-60px" }} // crop bottom watermark strip
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              // Extend height to account for bottom crop
              height: "calc(100% + 60px)",
              bottom: 0,
              top: "auto",
            }}
          />
        </div>

        {/* Soft Golden Backlight Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_450px_at_50%_50%,rgba(201,164,75,0.08),transparent_80%)] pointer-events-none z-15" />

        {/* Phase 1: Architectural atmosphere & Intro */}
        <div className="phase-1-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
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
        <div className="phase-2-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
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
        <div className="phase-3-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
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
        <div className="phase-4-text absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 opacity-0 pointer-events-none select-none">
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
        <div className="phase-5-text absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 opacity-0 pointer-events-none select-none">
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
