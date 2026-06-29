"use client";
import React from "react";
import { siteContent } from "@/data/siteContent";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's an anchor link and we are on the homepage, prevent reload and smooth scroll
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-luxury-bg border-t border-white/5 py-20 px-6 md:px-12 overflow-hidden select-none">
      {/* Decorative linear grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Footer Top: Main Logo & Nav Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Logo & Tagline column */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-extralight tracking-[0.3em] text-luxury-text-primary">
              {siteContent.company.name}
            </h3>
            <p className="text-xs text-luxury-text-secondary leading-relaxed font-light max-w-xs">
              {siteContent.footer.tagline}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-light text-luxury-text-secondary">
              {siteContent.navigation.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-luxury-text-primary transition-colors duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social connections */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-6 text-xs font-light text-luxury-text-secondary">
              {siteContent.footer.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-luxury-text-primary transition-colors duration-300 border-b border-transparent hover:border-luxury-accent pb-0.5"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Huge aesthetic logo typography layer */}
        <div className="py-8 select-none pointer-events-none text-center">
          <span className="text-[7vw] md:text-[8vw] font-heading font-extralight uppercase tracking-[0.4em] text-white/[0.02] block leading-none">
            E TECH
          </span>
        </div>

        {/* Footer Bottom copyright details */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-luxury-text-secondary font-light">
          <p>{siteContent.footer.disclaimer}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-luxury-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxury-text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
