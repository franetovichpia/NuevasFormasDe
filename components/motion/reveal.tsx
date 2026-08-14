"use client";

import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={className}
      initial={false}
      transition={{
        delay:
          shouldReduceMotion
            ? 0
            : Math.min(delay, 0.2),
        duration:
          shouldReduceMotion
            ? 0
            : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}