"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDateTime, rupiah } from "@/lib/utils/format";
import { formatPhoneDisplay } from "@/lib/utils/phone";

type PaperSize = "58mm" | "80mm" | "a4";

interface ReceiptProps {
  settings: {
    businessName: string;
    tagline: string;
    address: string;
    whatsapp: string;
  };
  order: {
    id: string;
    invoiceNo: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string | null;
    fulfillment: string;
    receivedAt: string;
    estimatedDoneAt: string;
    total: number;
    status: string;
    notes: string | null;
    paymentStatus: string;
    items: {
      serviceName: string;
      unit: string;
      unitPrice: number;
      quantity: string;
      subtotal: number;
    }[];
  };
}

export function PrintReceipt({ settings, order }: ReceiptProps) {
  const [size, setSize] = useState<PaperSize>("80mm");

  const widthCls =
    size === "58mm"
      ? "max-w-[58mm] text-xs p-2"
      : size === "80mm"
      ? "max-w-[80mm] text-xs p-4"
      : "max-w-xl text-sm p-8";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Kontrol cetak (disembunyikan saat cetak via CSS) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Kembali ke Pesanan
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted">Ukuran kertas:</span>
          {(["58mm", "80mm", "a4"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                size === s
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s === "58mm" ? "Thermal 58 mm" : s === "80mm" ? "Thermal 80 mm" : "A5 / A4"}
            </button>
          ))}
          <Button onClick={() => window.print()} className="ml-2">
            <Printer className="size-4" strokeWidth={2} /> Cetak Nota
          </Button>
        </div>
      </div>

      {/* Lembar Nota yang dicetak */}
      <div
        id="nota-print-area"
        className={`mx-auto bg-white font-mono text-ink shadow-soft border border-line print:border-none print:shadow-none print:m-0 print:p-0 ${widthCls}`}
      >
        {/* Header Usaha */}
        <div className="text-center pb-3 border-b border-dashed border-slate-300">
          <h1 className="text-base font-extrabold tracking-tight uppercase">
            {settings.businessName}
          </h1>
          <p className="text-[11px] text-slate-600">{settings.tagline}</p>
          <p className="text-[10px] text-slate-600 mt-1 leading-tight">{settings.address}</p>
          {settings.whatsapp && (
            <p className="text-[10px] text-slate-600">WhatsApp: {formatPhoneDisplay(settings.whatsapp)}</p>
          )}
        </div>

        {/* Informasi Nota & Pelanggan */}
        <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span>No. Nota:</span>
            <span className="font-bold">{order.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDateTime(order.receivedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-semibold">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>No. Telp:</span>
            <span>{order.customerPhone}</span>
          </div>
          {order.customerAddress && size === "a4" && (
            <div className="flex justify-between">
              <span>Alamat:</span>
              <span className="text-right max-w-xs">{order.customerAddress}</span>
            </div>
          )}
        </div>

        {/* Tabel Layanan & Item */}
        <div className="py-2.5 border-b border-dashed border-slate-300">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[10px] text-slate-500">
                <th className="pb-1">Layanan</th>
                <th className="pb-1 text-center">Qty</th>
                <th className="pb-1 text-right">Harga</th>
                <th className="pb-1 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it, i) => (
                <tr key={i} className="py-1">
                  <td className="py-1 font-medium">{it.serviceName}</td>
                  <td className="py-1 text-center whitespace-nowrap">
                    {it.quantity} {it.unit}
                  </td>
                  <td className="py-1 text-right whitespace-nowrap">
                    {rupiah(it.unitPrice)}
                  </td>
                  <td className="py-1 text-right font-semibold whitespace-nowrap">
                    {rupiah(it.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ringkasan Total & Pembayaran */}
        <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1.5">
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL:</span>
            <span>{rupiah(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Status Pembayaran:</span>
            <span className="font-bold uppercase">
              {order.paymentStatus === "PAID"
                ? "LUNAS"
                : order.paymentStatus === "PENDING_VERIFICATION"
                ? "VERIFIKASI"
                : "BELUM LUNAS"}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>Estimasi Selesai:</span>
            <span>{formatDateTime(order.estimatedDoneAt)}</span>
          </div>
          {order.notes && (
            <div className="text-[10px] text-slate-600 pt-1">
              <span>Catatan: </span>
              <i>{order.notes}</i>
            </div>
          )}
        </div>

        {/* Footer Nota & Syarat Ketentuan */}
        <div className="pt-3 text-center text-[9px] text-slate-500 space-y-1 leading-tight">
          <p className="font-semibold text-slate-700">
            Terima kasih telah mempercayakan cucian Anda!
          </p>
          <p>
            Cek progres cucian secara berkala di website kami dengan nomor nota di atas.
          </p>
          <p>
            Barang yang tidak diambil dalam tempo 30 hari di luar tanggung jawab pihak laundry.
          </p>
        </div>
      </div>
    </div>
  );
}
