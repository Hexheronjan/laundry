"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";

export default function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <m.div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Foto diperbesar">
          <m.div className="relative h-[80vh] w-full max-w-4xl" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <Image src={src} alt="Foto tempat laundry" fill sizes="100vw" className="rounded-2xl object-contain" />
          </m.div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/90 text-ink hover:bg-white">
            <X className="size-5" strokeWidth={2} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
