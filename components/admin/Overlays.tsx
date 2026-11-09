"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIsDesktop } from "@/components/motion/SlideIn";

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
}

/** Modal di tengah layar dengan animasi zoom/scale. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEsc(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <m.div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lift" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Tutup" className="-m-2 grid size-11 place-items-center rounded-xl hover:bg-slate-100"><X className="size-5" strokeWidth={2} /></button>
            </div>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Hapus", loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

/** Panel dari kanan (desktop) atau sheet dari bawah (mobile). */
export function SidePanel({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEsc(open, onClose);
  const desktop = useIsDesktop();
  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div className="fixed inset-0 z-40 bg-slate-900/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} aria-hidden />
          <m.aside role="dialog" aria-modal="true" aria-label={title}
            className="fixed z-50 flex flex-col bg-white shadow-lift max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[88dvh] max-md:rounded-t-3xl md:inset-y-0 md:right-0 md:w-full md:max-w-xl"
            initial={desktop ? { x: "100%" } : { y: "100%" }} animate={{ x: 0, y: 0 }} exit={desktop ? { x: "100%" } : { y: "100%" }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 className="text-lg font-bold">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Tutup" className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><X className="size-5" strokeWidth={2} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
