"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { rupiah } from "@/lib/utils/format";

export type ChartPoint = { name: string; pendapatan: number; pesanan: number };

export default function RevenueChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Grafik pendapatan dan jumlah pesanan">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
            <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis yAxisId="rev" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => (v >= 1_000_000 ? `${v / 1_000_000}jt` : v >= 1000 ? `${v / 1000}rb` : String(v))} />
          <YAxis yAxisId="ord" orientation="right" hide allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgb(15 23 42 / 0.1)" }} formatter={(v, n) => (n === "Pendapatan" ? rupiah(Number(v)) : v)} />
          <Area yAxisId="rev" type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gRev)" />
          <Area yAxisId="ord" type="monotone" dataKey="pesanan" name="Pesanan" stroke="var(--accent)" strokeWidth={2.5} fill="url(#gOrd)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
