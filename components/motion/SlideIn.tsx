"use client";

import { useSyncExternalStore } from "react";
import { m } from "motion/react";
import { cn } from "@/lib/utils/cn";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** true di layar md ke atas. */
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
  if (!desktop) return { x: 0, y: 14 };
  if (direction === "left") return { x: -distance, y: 0 };
  if (direction === "right") return { x: distance, y: 0 };
  return { x: 0, y: 20 };
}

export function SlideIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 32,
  once = true,
  as = "div",
}: Props) {
  const desktop = useIsDesktop();
  const o = offsets(direction, desktop, distance);
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, ...o }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.05, margin: "0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </Comp>
  );
}

/** Elemen yang animasinya langsung jalan saat mount (untuk hero, di atas lipatan layar). */
export function EnterIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 32,
}: Omit<Props, "once" | "as">) {
  const desktop = useIsDesktop();
  const o = offsets(direction, desktop, distance);
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, ...o }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

export const FadeIn = (p: Omit<Props, "direction">) => <SlideIn {...p} direction="none" />;
export const FadeUp = (p: Omit<Props, "direction">) => <SlideIn {...p} direction="up" />;

/** Kontainer daftar kartu — aman di mobile maupun saat resize layar. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
