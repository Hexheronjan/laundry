"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { rupiah } from "@/lib/utils/format";
import { buttonClass } from "@/components/ui/Button";

type ServiceOption = {
  id: string;
  name: string;
  price: number;
  unit: string;
  estimatedHours: number;
};

export function PriceEstimator({ services }: { services: ServiceOption[] }) {
  const kiloServices = services.filter((s) => s.unit === "kg");
  const defaultService = kiloServices[0] || services[0];
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService?.id || "");
  const [qty, setQty] = useState(4); // Default 4 kg

  const currentService = services.find((s) => s.id === selectedServiceId) || defaultService;
  const total = currentService ? Math.round(currentService.price * qty) : 0;

  return (
    <div className="rounded-3xl border border-line bg-white/95 p-6 shadow-lift backdrop-blur-md md:p-8">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Calculator className="size-5" strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Kalkulator Estimasi Biaya</h3>
          <p className="text-xs text-muted">Hitung perkiraan biaya cucian Anda secara instan</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
            Pilih Jenis Layanan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {services.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedServiceId(s.id)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                  selectedServiceId === s.id
                    ? "border-primary bg-primary-soft text-primary font-bold shadow-soft"
                    : "border-line bg-surface hover:bg-slate-50 text-slate-700 font-medium"
                }`}
              >
                <span className="text-sm">{s.name}</span>
                <span className="text-xs text-muted">
                  {rupiah(s.price)}/{s.unit}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Perkiraan Berat / Jumlah:
            </label>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-extrabold text-primary">
              {qty} {currentService?.unit || "kg"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full accent-[var(--primary)] cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-muted mt-1 font-mono">
            <span>1 {currentService?.unit}</span>
            <span>10 {currentService?.unit}</span>
            <span>20 {currentService?.unit}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-300">Estimasi Total Biaya</p>
            <p className="text-3xl font-extrabold tracking-tight text-cyan-300 mt-0.5">
              {rupiah(total)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              *Timbangan final dan akurat akan ditimbang ulang di outlet.
            </p>
          </div>
          <Link
            href={`/pesan?layanan=${currentService?.id}`}
            className={buttonClass("primary", "md", "w-full sm:w-auto shadow-glow whitespace-nowrap")}
          >
            <Sparkles className="size-4" />
            Pesan Layanan Ini <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
