"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception telemetry internally (never output raw stack traces to visitor screen)
    console.error("Application Runtime Error Captured:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-text-primary flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-luxury-card border border-white/10 p-8 rounded-sm text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-semibold">
            System Guard Protection
          </span>
          <h1 className="text-xl md:text-2xl font-heading font-light text-white">
            Unexpected Exception Intercepted
          </h1>
          <p className="text-xs text-luxury-text-secondary font-light leading-relaxed">
            Our application guard caught a temporary client error. No sensitive system data or internal logs were exposed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="luxury-btn flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-medium border border-white/15 hover:border-luxury-accent/50 text-luxury-text-primary hover:text-luxury-accent transition-colors rounded-sm"
          >
            <Home className="w-3.5 h-3.5 text-luxury-accent" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
