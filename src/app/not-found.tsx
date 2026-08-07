import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, Home, Phone, Wrench, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-luxury-bg text-luxury-text-primary overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 md:px-12 flex-1 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-luxury-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-luxury-accent/30 bg-luxury-accent/10 rounded-sm text-xs font-mono uppercase tracking-widest text-luxury-accent">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Error 404 • Page Not Found</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-heading font-light tracking-tighter text-white">
              4<span className="text-luxury-accent font-normal">0</span>4
            </h1>

            <h2 className="text-xl md:text-3xl font-heading font-light text-white">
              The Requested Floor or Page Does Not Exist
            </h2>

            <p className="text-xs md:text-sm text-luxury-text-secondary font-light max-w-md mx-auto leading-relaxed">
              The link you followed may be expired, moved, or misspelled. Use the options below to navigate back to E-Tech Elevators portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="luxury-btn inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-medium border border-white/15 hover:border-luxury-accent/50 text-luxury-text-primary hover:text-luxury-accent transition-colors rounded-sm"
            >
              <Wrench className="w-4 h-4 text-luxury-accent" />
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
