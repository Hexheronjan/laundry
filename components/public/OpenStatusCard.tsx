"use client";

import { useSyncExternalStore } from "react";
import { Clock, Sparkles } from "lucide-react";
import { getOpenStatus, type OpeningHours } from "@/lib/utils/format";

const emptySubscribe = () => () => {};

/** Status buka/tutup dihitung di browser agar tidak basi pada halaman ISR. */
export function OpenStatusCard({ hours }: { hours: OpeningHours }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const st = isClient ? getOpenStatus(hours) : null;

  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-lift backdrop-blur-md ring-1 ring-slate-900/5 transition hover:scale-[1.02] duration-300"
      aria-live="polite"
    >
      <div className="relative">
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-soft">
          <Clock className="size-5" strokeWidth={2.2} aria-hidden />
        </span>
        {st && (
          <span
            className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white ${
              st.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
        )}
      </div>

      <div className="min-w-40 text-sm leading-snug">
        {st ? (
          <>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
              <span>{st.isOpen ? "Outlet Buka Sekarang" : "Outlet Sedang Tutup"}</span>
              {st.isOpen && <Sparkles className="size-3.5 text-amber-500" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {!st.today || st.today.closed
                ? "Libur Hari Ini"
                : `Hari ini: ${st.today.open} – ${st.today.close} WIB`}
            </p>
          </>
        ) : (
          <div className="space-y-1">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-24" />
          </div>
        )}
      </div>
    </div>
  );
}
