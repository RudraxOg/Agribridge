"use client";
import { motion, useReducedMotion } from "motion/react";

export function PageMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .28, ease: [.2, 0, 0, 1] }}>{children}</motion.div>;
}
