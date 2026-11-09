"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/** Angka count-up sekali saat terlihat. */
export function CountUp({ value, currency, className }: { value: number; currency?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(reduce ? value : 0, value, {
      duration: reduce ? 0 : 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {currency ? `Rp ${display.toLocaleString("id-ID")}` : display.toLocaleString("id-ID")}
    </span>
  );
}
