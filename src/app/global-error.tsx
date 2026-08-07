"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Layout Error Captured:", error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0c0c0e] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#141419] border border-white/10 p-8 rounded-sm text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-semibold">
              Root System Intercept
            </span>
            <h1 className="text-xl font-semibold text-white">
              Application Error Encountered
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              A critical layout exception occurred. The system safely intercepted the error without compromising security.
            </p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#e5c158] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
