import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GameCard({ children, className, animate = true }: GameCardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className={cn("card-comic p-6 md:p-8 relative overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}
