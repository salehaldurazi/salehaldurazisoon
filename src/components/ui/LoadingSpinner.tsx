"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  /** Size of the spinner in pixels (width & height). Defaults to 36. */
  size?: number;
  /** Additional Tailwind CSS classes for custom styling or color adjustments. */
  className?: string;
  /** SVG stroke width for the spinner circle. Defaults to 0.8 for an ultra-thin look. */
  strokeWidth?: number;
  /** Optional hint or label text below the spinner. */
  label?: string;
}

export function LoadingSpinner({
  size = 36,
  className,
  strokeWidth = 0.8,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 w-full text-center">
      <div className="relative flex items-center justify-center">
        {/* Ambient subtle glow matching the amber dark theme */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        
        {/* Ultra-thin minimalist SVG spinner */}
        <svg
          className={cn("animate-spin text-primary transition-colors duration-500", className)}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="status"
          aria-label={label || "جاري التحميل"}
        >
          {/* Background track circle */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="opacity-15"
          />
          {/* Spinning indicator arc */}
          <path
            d="M12 2A10 10 0 0 1 22 12"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>
      </div>

      {label && (
        <p className="mt-3.5 text-xs font-light tracking-widest text-foreground/40 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
