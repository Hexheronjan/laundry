import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Inbox, Loader, ShoppingBag, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { getChartData, getSummary, type Range } from "@/lib/dashboard";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/SlideIn";
import { ChartLoader } from "@/components/admin/ChartLoader";
import { Card, PageHeader } from "@/components/admin/ui";
import { StatusBadge, orderTone, paymentTone } from "@/components/ui/StatusBadge";
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  formatDateTime,
  rupiah,
  type OrderStatusKey,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Dashboard" };

const ranges: { v: Range; l: string }[] = [
  { v: "day", l: "Harian" },
  { v: "week", l: "Mingguan" },
  { v: "month", l: "Bulanan" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const range: Range = ranges.some((r) => r.v === sp.range) ? (sp.range as Range) : "day";
  const [sum, chart] = await Promise.all([getSummary(), getChartData(range)]);

  let recent: {
    id: string;
    invoiceNo: string;
    receivedAt: Date;
    total: number;
    status: OrderStatusKey;
    customer: { name: string };
    payment: { status: "UNPAID" | "PENDING_VERIFICATION" | "PAID" | "REJECTED" } | null;
  }[] = [];

  try {
    const dbRecent = await db.order.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, payment: true },
    });
    if (dbRecent.length > 0) {
      recent = dbRecent;
    } else {
      recent = DEMO_ORDERS;
    }
  } catch {
    recent = DEMO_ORDERS;
  }

  const cards = [
    { label: "Total pesanan (30 hari)", icon: ShoppingBag, ...sum.total },
    { label: "Pesanan masuk", icon: Inbox, ...sum.incoming },
    { label: "Sedang diproses", icon: Loader, ...sum.processing },
    { label: "Selesai (30 hari)", icon: CheckCircle2, ...sum.done },
    { label: "Total pendapatan", icon: Wallet, currency: true, ...sum.revenue },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasional. Pendapatan hanya dihitung dari pembayaran berstatus Lunas."
      />
      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <StaggerItem key={c.label}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <c.icon className="size-5" strokeWidth={2} aria-hidden />
                </span>
                {c.change !== null && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-semibold",
                      c.change >= 0 ? "text-emerald-600" : "text-red-600"
                    )}
                    title="Dibanding 30 hari sebelumnya"
                  >
                    {c.change >= 0 ? (
                      <TrendingUp className="size-3.5" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="size-3.5" strokeWidth={2} />
                    )}
                    {c.change > 0 ? "+" : ""}
                    {c.change}%
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-tight">
                <CountUp value={c.value} currency={"currency" in c} />
              </p>
              <p className="text-sm text-muted">{c.label}</p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <Card className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">Pendapatan &amp; pesanan</h2>
          <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Rentang grafik">
            {ranges.map((r) => (
              <Link
                key={r.v}
                href={`?range=${r.v}`}
                scroll={false}
                aria-current={r.v === range}
                className={cn(
                  "flex min-h-9 items-center rounded-lg px-3 text-sm font-semibold transition-colors",
                  r.v === range ? "bg-white text-primary shadow-soft" : "text-slate-600 hover:text-ink"
                )}
              >
                {r.l}
              </Link>
            ))}
          </div>
        </div>
        <ChartLoader data={chart} />
      </Card>

      <h2 className="mb-3 mt-8 font-bold">Transaksi terbaru</h2>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-muted">
              <tr>
                {["Nota", "Pelanggan", "Tanggal", "Total", "Status", "Pembayaran"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold">
                    <Link href={`/admin/pesanan?q=${o.invoiceNo}`} className="hover:text-primary">
                      {o.invoiceNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{o.customer.name}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(o.receivedAt)}</td>
                  <td className="px-4 py-3 font-semibold">{rupiah(o.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={orderTone(o.status)}>
                      {ORDER_STATUS_LABEL[o.status as OrderStatusKey]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    {o.payment && (
                      <StatusBadge tone={paymentTone(o.payment.status)}>
                        {PAYMENT_STATUS_LABEL[o.payment.status]}
                      </StatusBadge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
