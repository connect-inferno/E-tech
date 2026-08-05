"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") return null;

  const pathSegments = pathname.split("/").filter(Boolean);

  const formatSegmentName = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-light text-luxury-text-secondary/80 py-3 select-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-luxury-accent transition-colors duration-200"
      >
        <Home className="w-3.5 h-3.5 text-luxury-accent/80" />
        <span>Home</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-luxury-accent/40 shrink-0" />
            {isLast ? (
              <span className="text-luxury-accent font-medium">{formatSegmentName(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-luxury-accent transition-colors duration-200">
                {formatSegmentName(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
