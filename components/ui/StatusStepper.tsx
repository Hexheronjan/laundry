"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatusKey } from "@/lib/utils/format";

/**
 * Stepper status: horizontal di md ke atas, vertikal di mobile. Garis progres terisi dengan animasi (transform).
 * Jika `onSelect` diberikan, setiap langkah dapat diklik (dipakai admin).
 */
export function StatusStepper({ current, onSelect, disabled }: { current: OrderStatusKey; onSelect?: (s: OrderStatusKey) => void; disabled?: boolean }) {
  const idx = ORDER_STATUSES.indexOf(current);
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setFilled(idx / (ORDER_STATUSES.length - 1)));
    return () => cancelAnimationFrame(t);
  }, [idx]);

  const dot = (i: number, s: OrderStatusKey) => {
    const state = i < idx ? "done" : i === idx ? "current" : "todo";
    const inner = (
      <span className={cn("grid size-9 place-items-center rounded-full border-2 text-sm font-bold transition-colors duration-500", state === "done" && "border-primary bg-primary text-primary-foreground", state === "current" && "border-primary bg-white text-primary ring-4 ring-primary/15", state === "todo" && "border-slate-300 bg-white text-slate-400")}>
        {state === "done" ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
      </span>
    );
    return onSelect ? (
      <button type="button" disabled={disabled} onClick={() => onSelect(s)} aria-current={state === "current" ? "step" : undefined} className="group flex min-h-11 flex-col items-center gap-2 rounded-xl px-1 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60 md:w-24 md:flex-col md:justify-start" aria-label={`Ubah status ke ${ORDER_STATUS_LABEL[s]}`}>
        {inner}
        <span className={cn("text-center text-xs font-medium leading-tight", state === "todo" ? "text-muted group-hover:text-ink" : "text-ink")}>{ORDER_STATUS_LABEL[s]}</span>
      </button>
    ) : (
      <div aria-current={state === "current" ? "step" : undefined} className="flex flex-col items-center gap-2 md:w-24">
        {inner}
        <span className={cn("text-center text-xs font-medium leading-tight", state === "todo" ? "text-muted" : "text-ink")}>{ORDER_STATUS_LABEL[s]}</span>
      </div>
    );
  };

  return (
    <>
      {/* Horizontal */}
      <div className="relative hidden md:block">
        <div className="absolute left-12 right-12 top-[18px] h-0.5 bg-slate-200">
          <div className="h-full origin-left bg-primary transition-transform duration-1000 ease-out" style={{ transform: `scaleX(${filled})` }} />
        </div>
        <ol className="relative flex justify-between">
          {ORDER_STATUSES.map((s, i) => <li key={s}>{dot(i, s)}</li>)}
        </ol>
      </div>

      {/* Vertikal */}
      <div className="relative md:hidden">
        <div className="absolute bottom-[18px] left-[18px] top-[18px] w-0.5 bg-slate-200">
          <div className="h-full origin-top bg-primary transition-transform duration-1000 ease-out" style={{ transform: `scaleY(${filled})` }} />
        </div>
        <ol className="relative space-y-4">
          {ORDER_STATUSES.map((s, i) => (
            <li key={s} className="[&>*]:flex-row [&>*]:items-center [&>*]:gap-3 [&>*]:w-full [&>*]:justify-start [&_span:last-child]:text-left [&_span:last-child]:text-sm">{dot(i, s)}</li>
          ))}
        </ol>
      </div>
    </>
  );
}
