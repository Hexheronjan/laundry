"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/SlideIn";
import { formatDuration, rupiah } from "@/lib/utils/format";
import { buttonClass } from "@/components/ui/Button";

export type PriceRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  estimatedHours: number;
};

export function PriceList({ rows }: { rows: PriceRow[] }) {
  const units = [...new Set(rows.map((r) => r.unit))];
  const tabs = ["Semua", ...units.map((u) => (u === "kg" ? "Per kg (Kiloan)" : u === "pcs" ? "Per pcs (Satuan)" : `Per ${u}`))];
  const values = ["", ...units];
  const [idx, setIdx] = useState(0);
  const shown = idx === 0 ? rows : rows.filter((r) => r.unit === values[idx]);

  return (
    <div>
      {/* Tab Filter */}
      <div
        role="tablist"
        aria-label="Filter satuan"
        className="relative mb-8 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 max-w-xl"
      >
        {tabs.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
              i === idx
                ? "bg-white text-primary shadow-soft"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tabel Desktop */}
      <Stagger key={idx} className="hidden overflow-hidden rounded-3xl border border-line bg-white shadow-soft md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-muted border-b border-line">
            <tr>
              <th className="px-6 py-4">Nama Layanan</th>
              <th className="px-6 py-4">Estimasi Pengerjaan</th>
              <th className="px-6 py-4 text-right">Tarif</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                <td className="px-6 py-5">
                  <StaggerItem>
                    <p className="font-bold text-slate-900 text-base">{r.name}</p>
                    {r.description && (
                      <p className="text-xs text-muted mt-1 max-w-md">{r.description}</p>
                    )}
                  </StaggerItem>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Clock className="size-3 text-teal-600" />
                    {formatDuration(r.estimatedHours)}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-lg font-black text-primary">{rupiah(r.price)}</span>
                  <span className="text-xs font-semibold text-muted"> / {r.unit}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link
                    href={`/pesan?layanan=${r.id}`}
                    className={buttonClass("primary", "sm", "rounded-xl text-xs")}
                  >
                    Pesan <ArrowRight className="size-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Stagger>

      {/* Tampilan Kartu Mobile */}
      <Stagger key={`m${idx}`} className="space-y-3.5 md:hidden">
        {shown.map((r) => (
          <StaggerItem key={r.id}>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 text-base">{r.name}</p>
                  {r.description && (
                    <p className="mt-1 text-xs text-muted leading-relaxed">{r.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted">Harga</span>
                  <p className="text-lg font-black text-primary">
                    {rupiah(r.price)}{" "}
                    <span className="text-xs font-semibold text-muted">/ {r.unit}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    <Clock className="size-3 text-teal-600" />
                    {formatDuration(r.estimatedHours)}
                  </span>
                  <Link
                    href={`/pesan?layanan=${r.id}`}
                    className={buttonClass("primary", "sm", "rounded-xl text-xs")}
                  >
                    Pesan
                  </Link>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
