import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
  block?: boolean;
}

export const ComicButton = React.forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ className, variant = "primary", size = "md", block, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-white border-pink-700 hover:bg-primary/90",
      secondary: "bg-secondary text-white border-cyan-700 hover:bg-secondary/90",
      accent: "bg-accent text-yellow-900 border-yellow-600 hover:bg-accent/90",
      success: "bg-green-500 text-white border-green-700 hover:bg-green-600",
      danger: "bg-red-500 text-white border-red-700 hover:bg-red-600",
      neutral: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl border-b-2",
      md: "px-6 py-3 text-base rounded-2xl border-b-4",
      lg: "px-8 py-4 text-xl rounded-2xl border-b-[6px]",
      xl: "px-10 py-6 text-2xl rounded-3xl border-b-[8px]",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.95, y: 2 }}
        className={cn(
          "btn-comic font-display font-bold shadow-sm flex items-center justify-center gap-2",
          variants[variant],
          sizes[size],
          block ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
ComicButton.displayName = "ComicButton";
