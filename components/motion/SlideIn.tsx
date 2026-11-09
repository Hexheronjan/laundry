"use client";

import { useSyncExternalStore } from "react";
import { m, type Variants } from "motion/react";
import { cn } from "@/lib/utils/cn";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
/** true di layar md ke atas. Animasi slide besar hanya aktif di sini; di HP cukup fade-up tipis. */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
}

type Dir = "left" | "right" | "up" | "none";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Dir;
  /** jarak geser (px) pada desktop */
  distance?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "article";
}

function offsets(direction: Dir, desktop: boolean, distance: number) {
  if (direction === "none") return { x: 0, y: 0 };
  if (!desktop) return { x: 0, y: direction === "up" ? 16 : 12 };
  if (direction === "left") return { x: -distance, y: 0 };
  if (direction === "right") return { x: distance, y: 0 };
  return { x: 0, y: 24 };
}

export function SlideIn({ children, className, delay = 0, direction = "up", distance = 48, once = true, as = "div" }: Props) {
  const desktop = useIsDesktop();
  const o = offsets(direction, desktop, distance);
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, ...o }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </Comp>
  );
}

/** Elemen yang animasinya langsung jalan saat mount (untuk hero, di atas lipatan layar). */
export function EnterIn({ children, className, delay = 0, direction = "up", distance = 48 }: Omit<Props, "once" | "as">) {
  const desktop = useIsDesktop();
  const o = offsets(direction, desktop, distance);
  return (
    <m.div className={className} initial={{ opacity: 0, ...o }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.7, delay, ease: "easeOut" }}>
      {children}
    </m.div>
  );
}

export const FadeIn = (p: Omit<Props, "direction">) => <SlideIn {...p} direction="none" />;
export const FadeUp = (p: Omit<Props, "direction">) => <SlideIn {...p} direction="up" />;

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

/** Daftar yang muncul berurutan dengan jeda 0,1 detik. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={cn(className)} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
      {children}
    </m.div>
  );
}
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <m.div className={className} variants={item}>{children}</m.div>;
}
