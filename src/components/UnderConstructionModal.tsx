"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HardHat, X } from "lucide-react";

export default function UnderConstructionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has already dismissed it this session
    const hasSeen = sessionStorage.getItem("hasSeenUnderConstruction");
    if (!hasSeen) {
      // Small delay for cinematic effect
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenUnderConstruction", "true");
  };

  // Prevent hydration errors by not rendering until mounted
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative w-full max-w-lg p-8 md:p-12 text-center rounded-2xl flex flex-col items-center shadow-2xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--color-luxury-text-secondary)] hover:text-[var(--color-luxury-accent)] transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 mb-6 rounded-full border border-[var(--color-luxury-border)] flex items-center justify-center bg-[var(--color-luxury-card)]">
              <HardHat className="w-8 h-8 text-[var(--color-luxury-accent)]" />
            </div>
            
            <h2 className="text-3xl mb-4 text-[var(--color-luxury-text-primary)] font-medium font-heading">Under Construction</h2>
            
            <p className="text-[var(--color-luxury-text-secondary)] mb-8 leading-relaxed">
              We are currently engineering the digital experience for E Tech Elevators. Some architectural elements and transitions are still being crafted. Thank you for your patience.
            </p>
            
            <button 
              onClick={handleClose}
              className="luxury-btn px-8 py-3 rounded-none uppercase tracking-widest text-sm font-medium w-full md:w-auto"
            >
              Enter Site
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
