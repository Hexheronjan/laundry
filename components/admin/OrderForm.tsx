"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { orderBaseSchema, type OrderInput } from "@/lib/validations/order";
import { createAdminOrder, updateAdminOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FULFILLMENT_LABEL, rupiah } from "@/lib/utils/format";
import type { OrderRow, SvcOption } from "./OrdersManager";

type FormIn = z.input<typeof orderBaseSchema>;

export function OrderForm({ order, services, onDone }: { order: OrderRow | null; services: SvcOption[]; onDone: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, control, watch, handleSubmit, setError, formState: { errors } } = useForm<FormIn, unknown, OrderInput>({
    resolver: zodResolver(orderBaseSchema),
    defaultValues: order
      ? { customerName: order.customerName, phone: order.phone, address: order.address ?? "", notes: order.notes ?? "", fulfillment: order.fulfillment as OrderInput["fulfillment"], items: order.items.map((i) => ({ serviceId: i.serviceId, quantity: Number(i.quantity) })) }
      : { customerName: "", phone: "", address: "", notes: "", fulfillment: "SELF_PICKUP", items: [{ serviceId: services[0]?.id ?? "", quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const total = items.reduce((a, it) => {
    const s = services.find((x) => x.id === it.serviceId);
    const old = order?.items.find((i) => i.serviceId === it.serviceId);
    return a + Math.round((old?.unitPrice ?? s?.price ?? 0) * (Number(it.quantity) || 0));
  }, 0);

  async function onSubmit(v: OrderInput) {
    setLoading(true);
    const r = order ? await updateAdminOrder(order.id, v) : await createAdminOrder(v);
    setLoading(false);
    if (!r.ok) { toast.error(r.error); Object.entries(r.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof FormIn, { message: m[0] })); return; }
    toast.success(r.message); router.refresh(); onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Nama pelanggan" error={errors.customerName?.message}>{(p) => <Input {...p} {...register("customerName")} />}</Field>
      <Field label="Nomor WhatsApp" error={errors.phone?.message} hint="08xx dan 628xx dianggap sama.">{(p) => <Input {...p} type="tel" inputMode="tel" {...register("phone")} />}</Field>
      <Field label="Alamat" error={errors.address?.message}>{(p) => <Textarea {...p} {...register("address")} />}</Field>
      {fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-[1fr_6rem_auto] items-start gap-2">
          <Field label={`Layanan ${i + 1}`} error={errors.items?.[i]?.serviceId?.message}>{(p) => <Select {...p} {...register(`items.${i}.serviceId`)}>{services.map((s) => <option key={s.id} value={s.id}>{s.name} — {rupiah(s.price)}/{s.unit}{s.isActive ? "" : " (nonaktif)"}</option>)}</Select>}</Field>
          <Field label="Jumlah" error={errors.items?.[i]?.quantity?.message}>{(p) => <Input {...p} type="number" step="0.1" min="0" inputMode="decimal" {...register(`items.${i}.quantity`, { valueAsNumber: true })} />}</Field>
          <button type="button" aria-label="Hapus layanan" disabled={fields.length === 1} onClick={() => remove(i)} className="mt-[1.85rem] grid size-11 place-items-center rounded-xl text-red-600 hover:bg-red-50 disabled:opacity-30"><Trash2 className="size-5" strokeWidth={2} /></button>
        </div>
      ))}
      {errors.items?.message && <p role="alert" className="text-sm text-red-600">{errors.items.message}</p>}
      <Button type="button" variant="outline" onClick={() => append({ serviceId: services[0]?.id ?? "", quantity: 1 })}><Plus className="size-4" strokeWidth={2} />Tambah layanan</Button>
      <Field label="Pengantaran / pengambilan" error={errors.fulfillment?.message}>{(p) => <Select {...p} {...register("fulfillment")}>{Object.entries(FULFILLMENT_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select>}</Field>
      <Field label="Catatan" error={errors.notes?.message}>{(p) => <Textarea {...p} {...register("notes")} />}</Field>
      <div className="flex items-baseline justify-between rounded-xl bg-slate-50 p-4"><span className="text-sm text-muted">Total (dihitung ulang server)</span><span className="text-xl font-extrabold text-primary">{rupiah(total)}</span></div>
      <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={onDone}>Batal</Button><Button type="submit" loading={loading}>Simpan</Button></div>
    </form>
  );
}
