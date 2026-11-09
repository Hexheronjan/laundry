"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye, History, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { approvePayment, rejectPayment } from "@/lib/actions/payments";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";
import { StatusBadge, paymentTone } from "@/components/ui/StatusBadge";
import { Modal, SidePanel } from "./Overlays";
import { EmptyState } from "./ui";
import { PAYMENT_STATUS_LABEL, formatDateTime, rupiah } from "@/lib/utils/format";

export type PaymentRow = {
  id: string;
  orderId: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: "UNPAID" | "PENDING_VERIFICATION" | "PAID" | "REJECTED";
  proofFile: string | null;
  rejectReason: string | null;
  paidAt: string | null;
  createdAt: string;
  verifications: {
    id: string;
    adminName: string;
    result: "APPROVED" | "REJECTED";
    note: string | null;
    createdAt: string;
  }[];
};

export function PaymentsManager({ rows }: { rows: PaymentRow[] }) {
  const router = useRouter();
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<PaymentRow | null>(null);
  const [approving, setApproving] = useState<PaymentRow | null>(null);
  const [historyOf, setHistoryOf] = useState<PaymentRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approveNote, setApproveNote] = useState("");
  const [pending, start] = useTransition();

  const handleApprove = () => {
    if (!approving) return;
    start(async () => {
      const r = await approvePayment(approving.id, approveNote);
      if (r.ok) {
        toast.success(r.message);
        setApproving(null);
        setApproveNote("");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  const handleReject = () => {
    if (!rejecting) return;
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi.");
      return;
    }
    start(async () => {
      const r = await rejectPayment(rejecting.id, rejectReason);
      if (r.ok) {
        toast.success(r.message);
        setRejecting(null);
        setRejectReason("");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <>
      {rows.length === 0 ? (
        <EmptyState
          title="Tidak ada data pembayaran"
          text="Semua pembayaran pesanan akan tercatat di sini."
        />
      ) : (
        <>
          {/* Tabel Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nota</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Tagihan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Bukti Transfer</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-primary">
                      {p.invoiceNo}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{p.customerName}</p>
                      <p className="text-xs text-muted">{p.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {rupiah(p.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={paymentTone(p.status)}>
                        {PAYMENT_STATUS_LABEL[p.status]}
                      </StatusBadge>
                      {p.paidAt && (
                        <p className="mt-0.5 text-xs text-muted">
                          Lunas: {formatDateTime(p.paidAt)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.proofFile ? (
                        <button
                          type="button"
                          onClick={() => setSelectedProof(p.proofFile)}
                          className="group relative inline-flex items-center gap-1.5 rounded-lg border border-line bg-slate-50 px-2.5 py-1 text-xs font-semibold text-ink hover:border-primary hover:bg-primary-soft hover:text-primary transition"
                        >
                          <Eye className="size-3.5" />
                          Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-xs text-muted">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {p.status === "PENDING_VERIFICATION" && (
                          <>
                            <button
                              type="button"
                              title="Setujui Pembayaran"
                              onClick={() => { setApproving(p); setApproveNote(""); }}
                              className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                              <CheckCircle className="size-4" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              title="Tolak Pembayaran"
                              onClick={() => { setRejecting(p); setRejectReason(""); }}
                              className="grid size-9 place-items-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <XCircle className="size-4" strokeWidth={2} />
                            </button>
                          </>
                        )}
                        {p.verifications.length > 0 && (
                          <button
                            type="button"
                            title="Riwayat Verifikasi"
                            onClick={() => setHistoryOf(p)}
                            className="grid size-9 place-items-center rounded-xl hover:bg-slate-100"
                          >
                            <History className="size-4" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu Mobile */}
          <ul className="space-y-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="rounded-2xl border border-line bg-white p-4 shadow-soft space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono font-bold text-primary">{p.invoiceNo}</p>
                    <p className="font-semibold text-ink">{p.customerName}</p>
                    <p className="text-xs text-muted">{p.customerPhone}</p>
                  </div>
                  <StatusBadge tone={paymentTone(p.status)}>
                    {PAYMENT_STATUS_LABEL[p.status]}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2 text-sm">
                  <div>
                    <span className="text-xs text-muted">Tagihan: </span>
                    <span className="font-bold">{rupiah(p.amount)}</span>
                  </div>
                  {p.proofFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedProof(p.proofFile)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-slate-50 px-2 py-1 text-xs font-semibold"
                    >
                      <Eye className="size-3" /> Bukti
                    </button>
                  )}
                </div>
                <div className="flex justify-end gap-2 border-t border-line pt-2">
                  {p.status === "PENDING_VERIFICATION" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setRejecting(p); setRejectReason(""); }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="size-4" /> Tolak
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => { setApproving(p); setApproveNote(""); }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle className="size-4" /> Setujui
                      </Button>
                    </>
                  )}
                  {p.verifications.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setHistoryOf(p)}
                    >
                      <History className="size-4" /> Log
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Modal Preview Bukti Transfer (bisa diperbesar) */}
      <Modal
        open={!!selectedProof}
        onClose={() => setSelectedProof(null)}
        title="Bukti Transfer Pembayaran"
      >
        {selectedProof && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full max-h-[65vh] overflow-hidden rounded-2xl bg-slate-100 border border-line">
              <Image
                src={`/api/uploads/payment-proof/${selectedProof}`}
                alt="Bukti Transfer"
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex justify-between items-center text-xs text-muted">
              <span>File: {selectedProof}</span>
              <a
                href={`/api/uploads/payment-proof/${selectedProof}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Buka tab baru
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Setujui Pembayaran */}
      <Modal
        open={!!approving}
        onClose={() => setApproving(null)}
        title="Setujui Pembayaran"
      >
        {approving && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Apakah Anda yakin ingin menyetujui pembayaran untuk nota{" "}
              <b className="font-mono">{approving.invoiceNo}</b> sebesar{" "}
              <b className="text-primary">{rupiah(approving.amount)}</b>?
            </p>
            <p className="text-xs text-muted">
              Status pembayaran akan menjadi <b>Lunas</b> dan verifikasi ini akan dicatat permanen dalam sistem.
            </p>
            <Field label="Catatan verifikasi (opsional)">
              {(props) => (
                <Textarea
                  {...props}
                  placeholder="Misal: Sudah masuk ke mutasi BCA"
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                />
              )}
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setApproving(null)} disabled={pending}>
                Batal
              </Button>
              <Button onClick={handleApprove} loading={pending} className="bg-emerald-600 hover:bg-emerald-700">
                Setujui (Lunas)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Tolak Pembayaran */}
      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Tolak Pembayaran"
      >
        {rejecting && (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
              <ShieldAlert className="size-5 shrink-0 text-red-600" />
              <div>
                <p className="font-bold">Penolakan Wajib Disertai Alasan</p>
                <p className="text-xs">
                  Alasan ini akan ditampilkan kepada pelanggan di halaman Cek Status agar mereka dapat memperbaiki transfer atau mengunggah ulang bukti.
                </p>
              </div>
            </div>
            <Field label="Alasan penolakan" hint="Wajib diisi">
              {(props) => (
                <Textarea
                  {...props}
                  required
                  placeholder="Misal: Bukti buram / nominal tidak sesuai / dana belum masuk mutasi bank"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              )}
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setRejecting(null)} disabled={pending}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleReject} loading={pending}>
                Tolak Pembayaran
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Panel Riwayat Verifikasi (Immutable) */}
      <SidePanel
        open={!!historyOf}
        onClose={() => setHistoryOf(null)}
        title={`Riwayat Verifikasi ${historyOf?.invoiceNo}`}
      >
        {historyOf && (
          <div className="space-y-4">
            <p className="text-xs text-muted">
              Log verifikasi bersifat permanen (append-only) dan dilindungi oleh database trigger.
            </p>
            <ol className="relative border-l border-line ml-3 space-y-5">
              {historyOf.verifications.map((v) => (
                <li key={v.id} className="ml-4">
                  <div className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-white bg-primary" />
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={v.result === "APPROVED" ? "green" : "red"}>
                      {v.result === "APPROVED" ? "Disetujui" : "Ditolak"}
                    </StatusBadge>
                    <span className="text-xs text-muted">{formatDateTime(v.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">Oleh: {v.adminName}</p>
                  {v.note && <p className="mt-0.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-line">Catatan: {v.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </SidePanel>
    </>
  );
}
