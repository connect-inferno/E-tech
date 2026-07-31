"use client";
import React, { useEffect, useState } from "react";
import { siteContent } from "@/data/siteContent";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLenisInstance } from "@/components/SmoothScrollProvider";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenisInstance();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);

    // Anchor link handling
    if (href.startsWith("/#")) {
      const targetId = href.substring(2);
      if (pathname === "/") {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          if (lenis) {
            lenis.scrollTo(targetElement, { duration: 0.6 });
          } else {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else {
        e.preventDefault();
        router.push("/contact");
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.4 });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as any });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 ${isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            prefetch={true}
            onClick={(e) => handleLinkClick(e, "/")}
            className="group select-none bg-white/95 rounded-sm px-2 py-1 shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
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
            <span className="text-[8px] font-mono text-gray-400 leading-none">v37</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {siteContent.navigation.links.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`luxury-link text-xs uppercase tracking-[0.2em] font-light transition-all ${isActive
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
              href="/contact"
              prefetch={true}
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
        className={`fixed inset-0 z-35 bg-luxury-bg/97 flex flex-col justify-center px-8 transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-8 text-left max-w-sm">
          {siteContent.navigation.links.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                prefetch={true}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-2xl font-heading font-light tracking-widest transition-colors ${isActive ? "!text-luxury-accent" : "text-luxury-text-secondary hover:text-luxury-accent"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/contact"
            prefetch={true}
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
