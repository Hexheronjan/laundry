import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileSpreadsheet, FileText, Filter, Calendar } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/ui";
import { CountUp } from "@/components/motion/CountUp";
import { StatusBadge, orderTone, paymentTone } from "@/components/ui/StatusBadge";
import { getReportData, parseDateRange } from "@/lib/reports";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDateTime, rupiah, type OrderStatusKey } from "@/lib/utils/format";
import { inputClass } from "@/components/ui/Field";

export const metadata: Metadata = { title: "Laporan & Rekapitulasi" };

export default async function ReportsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const preset = sp.preset ?? (!sp.from && !sp.to ? "month" : undefined);
  const from = sp.from;
  const to = sp.to;

  const { start, end } = parseDateRange(preset, from, to);
  const data = await getReportData(start, end);

  const queryParams = new URLSearchParams({
    ...(preset ? { preset } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }).toString();

  const presets = [
    { key: "today", label: "Hari Ini" },
    { key: "week", label: "Minggu Ini" },
    { key: "month", label: "Bulan Ini" },
  ];

  return (
    <>
      <PageHeader
        title="Laporan & Rekapitulasi"
        description={`Periode: ${formatDateTime(start)} – ${formatDateTime(end)}`}
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href={`/api/admin/reports/export-excel?${queryParams}`}
              download
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink shadow-soft hover:bg-slate-50 transition"
            >
              <FileSpreadsheet className="size-4 text-emerald-600" /> Export Excel (.xlsx)
            </a>
            <a
              href={`/api/admin/reports/export-pdf?${queryParams}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-soft hover:bg-primary-dark transition"
            >
              <FileText className="size-4" /> Export PDF
            </a>
          </div>
        }
      />

      {/* Filter Tanggal & Preset */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Preset Periode">
            {presets.map((p) => {
              const active = preset === p.key;
              return (
                <Link
                  key={p.key}
                  href={`?preset=${p.key}`}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-9 items-center rounded-lg px-3.5 text-xs font-bold transition ${
                    active ? "bg-white text-primary shadow-soft" : "text-slate-600 hover:text-ink"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>

          {/* Custom Date Form */}
          <form className="flex flex-wrap items-center gap-2" method="get">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="size-3.5" />
              <span>Rentang khusus:</span>
            </div>
            <input
              type="date"
              name="from"
              defaultValue={from ?? start.toISOString().slice(0, 10)}
              className={`${inputClass} !min-h-9 !py-1 text-xs w-auto`}
            />
            <span className="text-xs text-muted">s/d</span>
            <input
              type="date"
              name="to"
              defaultValue={to ?? end.toISOString().slice(0, 10)}
              className={`${inputClass} !min-h-9 !py-1 text-xs w-auto`}
            />
            <button
              type="submit"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <Filter className="size-3.5" /> Terapkan
            </button>
          </form>
        </div>
      </Card>

      {/* Ringkasan Angka Utama */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <p className="text-xs font-semibold text-muted uppercase">Total Pendapatan (Lunas)</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            <CountUp value={data.paidRevenue} currency />
          </p>
          <p className="mt-1 text-xs text-muted">Hanya dari pembayaran berstatus LUNAS</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-muted uppercase">Total Nilai Tagihan</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            <CountUp value={data.totalBilled} currency />
          </p>
          <p className="mt-1 text-xs text-muted">Termasuk tagihan belum lunas / pending</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-muted uppercase">Jumlah Pesanan</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            <CountUp value={data.totalOrders} /> Pesanan
          </p>
          <p className="mt-1 text-xs text-muted">Dibuat dalam periode terpilih</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Rekap Status Laundry */}
        <Card>
          <h2 className="font-bold text-base mb-4">Rekap Pesanan Berdasarkan Status</h2>
          <div className="space-y-2.5">
            {ORDER_STATUSES.map((st) => {
              const count = data.statusCounts[st] ?? 0;
              const pct = data.totalOrders > 0 ? Math.round((count / data.totalOrders) * 100) : 0;
              return (
                <div key={st} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={orderTone(st)}>{ORDER_STATUS_LABEL[st]}</StatusBadge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">({pct}%)</span>
                    <span className="font-bold w-10 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Rekap Layanan */}
        <Card>
          <h2 className="font-bold text-base mb-4">Rekap Berdasarkan Jenis Layanan</h2>
          {data.serviceSummary.length === 0 ? (
            <p className="text-sm text-muted">Belum ada layanan yang dipesan pada periode ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Layanan</th>
                    <th className="px-3 py-2 font-semibold text-center">Volume</th>
                    <th className="px-3 py-2 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.serviceSummary.map((sv) => (
                    <tr key={sv.name} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium">{sv.name}</td>
                      <td className="px-3 py-2 text-center text-muted">
                        {sv.totalQty} {sv.unit}
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-primary">
                        {rupiah(sv.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Rincian Transaksi */}
      <Card className="overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-line flex justify-between items-center">
          <h2 className="font-bold text-base">Daftar Transaksi Pesanan</h2>
          <span className="text-xs text-muted">{data.orders.length} transaksi</span>
        </div>
        {data.orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            Tidak ada transaksi pada periode ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nota</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Status Laundry</th>
                  <th className="px-4 py-3 font-semibold">Pembayaran</th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-primary">
                      <Link href={`/admin/pesanan?q=${o.invoiceNo}`} className="hover:underline">
                        {o.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDateTime(o.receivedAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{o.customer.name}</p>
                      <p className="text-xs text-muted">{o.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={orderTone(o.status)}>
                        {ORDER_STATUS_LABEL[o.status as OrderStatusKey]}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={paymentTone(o.payment?.status ?? "UNPAID")}>
                        {PAYMENT_STATUS_LABEL[o.payment?.status ?? "UNPAID"]}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-ink">
                      {rupiah(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
