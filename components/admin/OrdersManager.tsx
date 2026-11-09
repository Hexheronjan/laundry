"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOrder, updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";
import { StatusBadge, orderTone, paymentTone } from "@/components/ui/StatusBadge";
import { StatusStepper } from "@/components/ui/StatusStepper";
import { ConfirmDialog, Modal, SidePanel } from "./Overlays";
import { EmptyState } from "./ui";
import { OrderForm } from "./OrderForm";
import { FULFILLMENT_LABEL, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDateTime, rupiah, type OrderStatusKey } from "@/lib/utils/format";

export type SvcOption = { id: string; name: string; price: number; unit: string; isActive: boolean };
export type OrderRow = {
  id: string; invoiceNo: string; status: string; fulfillment: string; address: string | null; notes: string | null; total: number;
  receivedAt: string; estimatedDoneAt: string; source: string;
  customerName: string; phone: string;
  paymentStatus: string | null;
  items: { serviceId: string; name: string; unit: string; quantity: string; unitPrice: number; subtotal: number }[];
  history: { status: string; at: string; by: string | null }[];
};

export function OrdersManager({ rows, services }: { rows: OrderRow[]; services: SvcOption[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<OrderRow | null | "new">(null);
  const [del, setDel] = useState<OrderRow | null>(null);
  const [pending, start] = useTransition();
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const changeStatus = (o: OrderRow, s: OrderStatusKey) => start(async () => {
    const r = await updateOrderStatus(o.id, s);
    if (r.ok) {
      toast.success(r.message);
    } else {
      toast.error(r.error);
    }
    router.refresh();
  });
  const remove = (o: OrderRow) => start(async () => {
    const r = await deleteOrder(o.id);
    if (r.ok) { toast.success(r.message); setDel(null); setSelectedId(null); router.refresh(); } else toast.error(r.error);
  });

  const actions = (o: OrderRow) => (
    <div className="flex">
      <Link href={`/admin/pesanan/${o.id}/nota`} title="Cetak Nota" aria-label={`Cetak nota ${o.invoiceNo}`} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100 text-slate-700">
        <Printer className="size-5" strokeWidth={2} />
      </Link>
      <button type="button" title="Detail" aria-label={`Detail ${o.invoiceNo}`} onClick={() => setSelectedId(o.id)} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><Eye className="size-5" strokeWidth={2} /></button>
      <button type="button" title="Edit" aria-label={`Edit ${o.invoiceNo}`} onClick={() => setForm(o)} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><Pencil className="size-5" strokeWidth={2} /></button>
      <button type="button" title="Hapus" aria-label={`Hapus ${o.invoiceNo}`} onClick={() => setDel(o)} className="grid size-11 place-items-center rounded-xl text-red-600 hover:bg-red-50"><Trash2 className="size-5" strokeWidth={2} /></button>
    </div>
  );

  return (
    <>
      <div className="mb-4 flex justify-end"><Button onClick={() => setForm("new")}><Plus className="size-4" strokeWidth={2} />Pesanan baru</Button></div>

      {rows.length === 0 ? <EmptyState title="Tidak ada pesanan" text="Coba ubah pencarian/filter, atau buat pesanan baru." action={<Button onClick={() => setForm("new")}>Pesanan baru</Button>} /> : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-muted"><tr>{["Nota", "Pelanggan", "Masuk", "Total", "Status", "Bayar", ""].map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono font-semibold">{o.invoiceNo}</td>
                    <td className="px-4 py-2"><p className="font-medium">{o.customerName}</p><p className="text-xs text-muted">{o.phone}</p></td>
                    <td className="px-4 py-2 text-muted">{formatDateTime(o.receivedAt)}</td>
                    <td className="px-4 py-2 font-semibold">{rupiah(o.total)}</td>
                    <td className="px-4 py-2"><StatusBadge tone={orderTone(o.status)}>{ORDER_STATUS_LABEL[o.status as OrderStatusKey]}</StatusBadge></td>
                    <td className="px-4 py-2">{o.paymentStatus && <StatusBadge tone={paymentTone(o.paymentStatus)}>{PAYMENT_STATUS_LABEL[o.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL]}</StatusBadge>}</td>
                    <td className="px-2 py-1">{actions(o)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 md:hidden">
            {rows.map((o) => (
              <li key={o.id} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2"><p className="font-mono font-bold">{o.invoiceNo}</p><StatusBadge tone={orderTone(o.status)}>{ORDER_STATUS_LABEL[o.status as OrderStatusKey]}</StatusBadge></div>
                <p className="mt-1 font-medium">{o.customerName}</p>
                <p className="text-sm text-muted">{formatDateTime(o.receivedAt)}</p>
                <div className="mt-2 flex items-center justify-between"><span className="font-bold text-primary">{rupiah(o.total)}</span>{actions(o)}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      <SidePanel open={!!selected} onClose={() => setSelectedId(null)} title={selected?.invoiceNo ?? "Detail"}>
        {selected && (
          <div className="space-y-6">
            <section aria-label="Status laundry">
              <h3 className="mb-3 text-sm font-semibold text-muted">Status laundry (klik untuk mengubah)</h3>
              <StatusStepper current={selected.status as OrderStatusKey} disabled={pending} onSelect={(s) => changeStatus(selected, s)} />
            </section>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted">Pelanggan</dt><dd className="font-medium">{selected.customerName}</dd></div>
              <div><dt className="text-muted">WhatsApp</dt><dd className="font-medium">{selected.phone}</dd></div>
              <div><dt className="text-muted">Masuk</dt><dd className="font-medium">{formatDateTime(selected.receivedAt)}</dd></div>
              <div><dt className="text-muted">Estimasi selesai</dt><dd className="font-medium">{formatDateTime(selected.estimatedDoneAt)}</dd></div>
              <div><dt className="text-muted">Pengiriman</dt><dd className="font-medium">{FULFILLMENT_LABEL[selected.fulfillment as keyof typeof FULFILLMENT_LABEL]}</dd></div>
              <div><dt className="text-muted">Sumber</dt><dd className="font-medium">{selected.source === "ONLINE" ? "Online" : "Admin"}</dd></div>
              {selected.address && <div className="col-span-2"><dt className="text-muted">Alamat</dt><dd className="font-medium">{selected.address}</dd></div>}
              {selected.notes && <div className="col-span-2"><dt className="text-muted">Catatan</dt><dd className="font-medium">{selected.notes}</dd></div>}
            </dl>
            <ul className="divide-y divide-line rounded-xl border border-line text-sm">
              {selected.items.map((i, k) => <li key={k} className="flex justify-between gap-3 px-4 py-3"><span>{i.name} × {i.quantity} {i.unit}<span className="block text-xs text-muted">@ {rupiah(i.unitPrice)}</span></span><span className="font-semibold">{rupiah(i.subtotal)}</span></li>)}
              <li className="flex justify-between bg-slate-50 px-4 py-3 font-bold"><span>Total</span><span>{rupiah(selected.total)}</span></li>
            </ul>
            <section>
              <h3 className="mb-2 text-sm font-semibold text-muted">Riwayat status</h3>
              <ol className="space-y-2 text-sm">
                {[...selected.history].reverse().map((h, i) => <li key={i} className="flex justify-between gap-3"><span><b>{ORDER_STATUS_LABEL[h.status as OrderStatusKey]}</b>{h.by ? ` · ${h.by}` : ""}</span><span className="text-muted">{formatDateTime(h.at)}</span></li>)}
              </ol>
            </section>
            <div className="flex flex-wrap gap-3">
              <Link href={`/admin/pesanan/${selected.id}/nota`} className="group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 min-h-11 px-5 text-sm border border-line bg-white text-ink hover:bg-slate-50">
                <Printer className="size-4" strokeWidth={2} /> Cetak Nota
              </Link>
              <Button variant="outline" onClick={() => setForm(selected)}><Pencil className="size-4" strokeWidth={2} />Edit</Button>
              <Button variant="danger" onClick={() => setDel(selected)}><Trash2 className="size-4" strokeWidth={2} />Hapus</Button>
            </div>
          </div>
        )}
      </SidePanel>

      <Modal open={form !== null} onClose={() => setForm(null)} title={form === "new" ? "Pesanan baru" : "Edit pesanan"}>
        {form !== null && <OrderForm key={form === "new" ? "new" : form.id} order={form === "new" ? null : form} services={services} onDone={() => setForm(null)} />}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} loading={pending} title="Hapus pesanan?" message={`Pesanan ${del?.invoiceNo} akan dihapus dari daftar (soft delete — data tetap tercatat di database).`} onConfirm={() => del && remove(del)} />
    </>
  );
}
