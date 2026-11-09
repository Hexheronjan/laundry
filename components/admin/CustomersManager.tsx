"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { History, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { phoneSchema } from "@/lib/validations/order";
import { updateCustomer } from "@/lib/actions/customers";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { StatusBadge, orderTone } from "@/components/ui/StatusBadge";
import { Modal, SidePanel } from "./Overlays";
import { EmptyState } from "./ui";
import { ORDER_STATUS_LABEL, formatDate, rupiah, type OrderStatusKey } from "@/lib/utils/format";

const schema = z.object({ name: z.string().trim().min(2, "Nama minimal 2 karakter"), phone: phoneSchema, address: z.string().optional() });
export type CustomerRow = { id: string; name: string; phone: string; address: string | null; orderCount: number; orders: { invoiceNo: string; status: string; total: number; at: string }[] };

function EditForm({ c, onDone }: { c: CustomerRow; onDone: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: c.name, phone: c.phone, address: c.address ?? "" } });
  async function onSubmit(v: z.infer<typeof schema>) {
    setLoading(true);
    const r = await updateCustomer(c.id, v);
    setLoading(false);
    if (!r.ok) { toast.error(r.error); Object.entries(r.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof z.infer<typeof schema>, { message: m[0] })); return; }
    toast.success(r.message); router.refresh(); onDone();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Nama" error={errors.name?.message}>{(p) => <Input {...p} {...register("name")} />}</Field>
      <Field label="Nomor WhatsApp" error={errors.phone?.message}>{(p) => <Input {...p} type="tel" {...register("phone")} />}</Field>
      <Field label="Alamat" error={errors.address?.message}>{(p) => <Textarea {...p} {...register("address")} />}</Field>
      <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={onDone}>Batal</Button><Button type="submit" loading={loading}>Simpan</Button></div>
    </form>
  );
}

export function CustomersManager({ rows }: { rows: CustomerRow[] }) {
  const [edit, setEdit] = useState<CustomerRow | null>(null);
  const [hist, setHist] = useState<CustomerRow | null>(null);
  if (rows.length === 0) return <EmptyState title="Belum ada pelanggan" text="Pelanggan tercatat otomatis saat ada pesanan masuk." />;
  const actions = (c: CustomerRow) => (
    <div className="flex">
      <button type="button" title="Riwayat pesanan" aria-label={`Riwayat pesanan ${c.name}`} onClick={() => setHist(c)} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><History className="size-5" strokeWidth={2} /></button>
      <button type="button" title="Edit" aria-label={`Edit ${c.name}`} onClick={() => setEdit(c)} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><Pencil className="size-5" strokeWidth={2} /></button>
    </div>
  );
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-muted"><tr>{["Nama", "WhatsApp", "Alamat", "Pesanan", ""].map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => <tr key={c.id} className="hover:bg-slate-50"><td className="px-4 py-2 font-medium">{c.name}</td><td className="px-4 py-2">{c.phone}</td><td className="max-w-xs truncate px-4 py-2 text-muted">{c.address ?? "—"}</td><td className="px-4 py-2">{c.orderCount}</td><td className="px-2">{actions(c)}</td></tr>)}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {rows.map((c) => <li key={c.id} className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-white p-4 shadow-soft"><div className="min-w-0"><p className="font-bold">{c.name}</p><p className="text-sm text-muted">{c.phone} · {c.orderCount} pesanan</p></div>{actions(c)}</li>)}
      </ul>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit pelanggan">{edit && <EditForm key={edit.id} c={edit} onDone={() => setEdit(null)} />}</Modal>
      <SidePanel open={!!hist} onClose={() => setHist(null)} title={hist ? `Riwayat ${hist.name}` : ""}>
        {hist && (hist.orders.length === 0 ? <p className="text-muted">Belum ada pesanan.</p> : (
          <ul className="divide-y divide-line">
            {hist.orders.map((o) => <li key={o.invoiceNo} className="flex items-center justify-between gap-3 py-3 text-sm"><div><p className="font-mono font-semibold">{o.invoiceNo}</p><p className="text-muted">{formatDate(o.at)}</p></div><div className="text-right"><p className="font-semibold">{rupiah(o.total)}</p><StatusBadge tone={orderTone(o.status)}>{ORDER_STATUS_LABEL[o.status as OrderStatusKey]}</StatusBadge></div></li>)}
          </ul>
        ))}
      </SidePanel>
    </>
  );
}
