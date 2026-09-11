"use client";

import React from "react";
import { LucideIcon, FolderX } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface EmptyStateProps {
  /** Lucide React icon to display in the empty state. Defaults to FolderX */
  icon?: LucideIcon;
  /** Primary title text. Defaults to 'هذا المجلد فارغ' */
  title?: string;
  /** Optional secondary description text */
  description?: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Callback function triggered when action button is clicked */
  onAction?: () => void;
  /** Additional container classes */
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderX,
  title = "هذا المجلد فارغ",
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -6 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-24 sm:py-36 px-4 my-8 max-w-sm mx-auto select-none relative",
        className
      )}
      dir="rtl"
    >
      {/* Soft, delicate ambient gold glow in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

      {/* Daintily scaled-down gold-outlined Folder Icon */}
      <div className="relative inline-flex items-center justify-center mb-2.5 text-primary">
        <Icon
          className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.2] text-primary/90 drop-shadow-[0_0_12px_rgba(197,160,89,0.3)] transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Proportionate, elegant Arabic typography */}
      <div className="space-y-1 relative z-10">
        <h4 className="text-xs sm:text-sm font-light tracking-wide text-foreground/75 leading-relaxed">
          {title}
        </h4>
        {description && (
          <p className="text-[10px] sm:text-xs text-foreground/40 leading-relaxed max-w-xs mx-auto font-light">
            {description}
          </p>
        )}
      </div>

      {/* Optional action button (if provided) */}
      {actionLabel && onAction && (
        <div className="pt-4 relative z-10">
          <button
            onClick={onAction}
            className="relative group overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary text-[11px] font-medium backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10">{actionLabel}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}


