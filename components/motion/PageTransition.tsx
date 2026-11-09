"use client";

import { m } from "motion/react";

/** Transisi halaman: fade + slide tipis. Dipakai oleh app/template.tsx. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
      {children}
    </m.div>
  );
}
