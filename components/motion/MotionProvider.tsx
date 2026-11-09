"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/** LazyMotion + domAnimation (bundle kecil) dan hormati prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: "easeOut" }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
