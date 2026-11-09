"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m } from "motion/react";
import { Search, UploadCloud, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { trackSchema } from "@/lib/validations/order";
import { trackOrder, type TrackResult } from "@/lib/actions/public";
import { uploadPaymentProof } from "@/lib/actions/payments";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { StatusStepper } from "@/components/ui/StatusStepper";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FULFILLMENT_LABEL, ORDER_STATUS_LABEL, formatDateTime, rupiah, type OrderStatusKey } from "@/lib/utils/format";
import type { z } from "zod";

type In = z.input<typeof trackSchema>;

interface BankInfo {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  enableProofUpload: boolean;
}

export function TrackForm({ bankInfo }: { bankInfo: BankInfo }) {
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<In>({
    resolver: zodResolver(trackSchema),
    mode: "onTouched",
  });

  async function onSubmit(v: In) {
    setLoading(true);
    setError(null);
    const r = await trackOrder(v);
    setLoading(false);
    if (r.ok) {
      setResult(r.data);
    } else {
      setResult(null);
      setError(r.error);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!result || !selectedFile) {
      toast.error("Pilih file bukti transfer terlebih dahulu.");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("invoiceNo", result.invoiceNo);
    fd.append("phone", getValues("phone"));
    fd.append("file", selectedFile);

    const r = await uploadPaymentProof(fd);
    setUploading(false);
    if (r.ok) {
      toast.success(r.message);
      setSelectedFile(null);
      // Refresh status data
      const refresh = await trackOrder({ invoiceNo: result.invoiceNo, phone: getValues("phone") });
      if (refresh.ok) setResult(refresh.data);
    } else {
      toast.error(r.error);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 rounded-3xl border border-line bg-white p-5 shadow-soft sm:grid-cols-2 sm:p-8">
        <Field label="Nomor nota" error={errors.invoiceNo?.message}>
          {(p) => <Input {...p} placeholder="LDR-20261109-0001" autoCapitalize="characters" {...register("invoiceNo")} />}
        </Field>
        <Field label="Nomor WhatsApp terdaftar" error={errors.phone?.message}>
          {(p) => <Input {...p} type="tel" inputMode="tel" placeholder="0812xxxxxxxx" {...register("phone")} />}
        </Field>
        <Button type="submit" loading={loading} className="sm:col-span-2">
          <Search className="size-4" strokeWidth={2} /> Cek Status
        </Button>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{error}</p>}
      </form>

      {result && (
        <m.section
          key={result.invoiceNo}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-8 space-y-6"
          aria-live="polite"
        >
          {/* Stepper Progres */}
          <div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Nomor nota</p>
                <p className="font-mono text-xl font-bold">{result.invoiceNo}</p>
              </div>
              <StatusBadge tone={result.status === "DONE" ? "green" : "blue"}>
                {ORDER_STATUS_LABEL[result.status as OrderStatusKey]}
              </StatusBadge>
            </div>
            <div className="mt-8">
              <StatusStepper current={result.status as OrderStatusKey} />
            </div>
          </div>

          {/* Rincian Pesanan */}
          <div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-8">
            <h3 className="mb-4 text-base font-bold">Rincian Pesanan</h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">Pelanggan</dt><dd className="font-medium">{result.customerName}</dd></div>
              <div><dt className="text-muted">Pengiriman</dt><dd className="font-medium">{FULFILLMENT_LABEL[result.fulfillment as keyof typeof FULFILLMENT_LABEL]}</dd></div>
              <div><dt className="text-muted">Tanggal masuk</dt><dd className="font-medium">{formatDateTime(result.receivedAt)}</dd></div>
              <div><dt className="text-muted">Estimasi selesai</dt><dd className="font-medium">{formatDateTime(result.estimatedDoneAt)}</dd></div>
            </dl>
            <ul className="mt-5 divide-y divide-line rounded-xl border border-line text-sm">
              {result.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-4 px-4 py-3">
                  <span>{it.name} × {it.quantity} {it.unit}</span>
                  <span className="font-semibold">{rupiah(it.subtotal)}</span>
                </li>
              ))}
              <li className="flex justify-between gap-4 bg-slate-50 px-4 py-3 font-bold">
                <span>Total Tagihan</span>
                <span className="text-primary">{rupiah(result.total)}</span>
              </li>
            </ul>

            {/* Status Pembayaran */}
            <div className="mt-6 border-t border-line pt-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Status Pembayaran</span>
                <StatusBadge tone={{ UNPAID: "yellow", PENDING_VERIFICATION: "yellow", PAID: "green", REJECTED: "red" }[result.payment?.status ?? "UNPAID"] as "yellow" | "green" | "red"}>
                  {{ UNPAID: "Menunggu pembayaran", PENDING_VERIFICATION: "Menunggu verifikasi admin", PAID: "Lunas", REJECTED: "Ditolak" }[result.payment?.status ?? "UNPAID"]}
                </StatusBadge>
              </div>

              {result.payment?.status === "REJECTED" && result.payment.rejectReason && (
                <div className="mt-4 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
                  <AlertCircle className="size-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-bold">Pembayaran Ditolak</p>
                    <p className="mt-1">Alasan: {result.payment.rejectReason}</p>
                    <p className="mt-1 text-xs">Silakan periksa kembali transfer Anda dan unggah ulang bukti yang benar di bawah.</p>
                  </div>
                </div>
              )}

              {result.payment?.status === "PENDING_VERIFICATION" && (
                <div className="mt-4 flex gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">
                  <Clock className="size-5 shrink-0 text-sky-600" />
                  <div>
                    <p className="font-bold">Menunggu Verifikasi</p>
                    <p className="mt-1">Bukti transfer Anda sudah kami terima dan sedang diverifikasi oleh admin kami.</p>
                  </div>
                </div>
              )}

              {result.payment?.status === "PAID" && (
                <div className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  <CheckCircle className="size-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold">Pembayaran Lunas</p>
                    <p className="mt-1">Terima kasih, pembayaran Anda telah diverifikasi dan lunas.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Pembayaran & Unggah Bukti Transfer jika belum lunas */}
          {result.payment?.status !== "PAID" && bankInfo.enableProofUpload && (
            <div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-8">
              <h3 className="text-base font-bold">Instruksi Pembayaran Transfer Bank</h3>
              <p className="mt-1 text-sm text-muted">Silakan transfer sesuai total tagihan ke rekening resmi kami berikut:</p>

              {bankInfo.bankAccountNumber ? (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary-soft p-5 text-sm">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted">Nama Bank</p>
                      <p className="font-bold text-ink">{bankInfo.bankName || "Transfer Bank"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Nomor Rekening</p>
                      <p className="font-mono text-lg font-extrabold text-primary">{bankInfo.bankAccountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Atas Nama</p>
                      <p className="font-semibold text-ink">{bankInfo.bankAccountName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500 italic">Informasi rekening dapat dikonfirmasi via WhatsApp.</p>
              )}

              <form onSubmit={handleUpload} className="mt-6 border-t border-line pt-6">
                <label className="mb-2 block text-sm font-semibold">
                  {result.payment?.status === "REJECTED" ? "Unggah Ulang Bukti Transfer" : "Unggah Bukti Transfer"}
                </label>
                <p className="mb-3 text-xs text-muted">Format: JPG, PNG, atau WEBP. Maksimal ukuran file 5 MB.</p>
                
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-primary-soft file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                  />
                  <Button type="submit" loading={uploading} disabled={!selectedFile} className="shrink-0">
                    <UploadCloud className="size-4" strokeWidth={2} />
                    Kirim Bukti
                  </Button>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium">
                    File terpilih: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </form>
            </div>
          )}
        </m.section>
      )}
    </div>
  );
}
