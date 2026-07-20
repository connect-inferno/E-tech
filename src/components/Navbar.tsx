"use client";
import React, { useEffect, useState } from "react";
import { siteContent } from "@/data/siteContent";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    
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
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-45 transition-all duration-500 ${
          isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="group select-none bg-white/95 rounded-sm px-2 py-1 shadow-sm hover:shadow-md transition-shadow"
            aria-label={siteContent.company.name}
          >
            <Image
              src="/images/etech-logo.png"
              alt={siteContent.company.name}
              width={90}
              height={58}
              priority
              className="h-9 md:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {siteContent.navigation.links.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`luxury-link text-xs uppercase tracking-[0.2em] font-light transition-all ${
                    isActive
                      ? "!text-luxury-accent font-normal"
                      : "text-luxury-text-secondary hover:text-luxury-text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/#contact"
              onClick={(e) => handleLinkClick(e, "/#contact")}
              className="luxury-btn px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-medium"
            >
              {siteContent.company.ctaText}
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="block md:hidden text-luxury-text-primary hover:text-luxury-accent transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-35 bg-luxury-bg/97 flex flex-col justify-center px-8 transition-all duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8 text-left max-w-sm">
          {siteContent.navigation.links.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-2xl font-heading font-light tracking-widest transition-colors ${
                  isActive ? "!text-luxury-accent" : "text-luxury-text-secondary hover:text-luxury-accent"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            onClick={(e) => handleLinkClick(e, "/#contact")}
            className="luxury-btn inline-block text-center mt-6 px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium"
          >
            {siteContent.company.ctaText}
          </Link>
        </div>
      </div>
    </>
  );
}
