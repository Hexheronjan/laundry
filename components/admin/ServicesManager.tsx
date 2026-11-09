"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { serviceSchema, type ServiceInput } from "@/lib/validations/admin";
import { deleteService, saveService, toggleService } from "@/lib/actions/services";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { ConfirmDialog, Modal } from "./Overlays";
import { EmptyState } from "./ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDuration, rupiah } from "@/lib/utils/format";
import type { z } from "zod";

export type ServiceRow = { id: string; name: string; description: string | null; price: number; unit: string; estimatedHours: number; isActive: boolean; used: number };

function ServiceForm({ row, onDone }: { row: ServiceRow | null; onDone: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<ServiceInput, unknown, z.output<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: row ? { name: row.name, description: row.description ?? "", price: row.price, unit: row.unit, estimatedHours: row.estimatedHours, isActive: row.isActive } : { name: "", description: "", price: 0, unit: "kg", estimatedHours: 48, isActive: true },
  });
  async function onSubmit(v: z.output<typeof serviceSchema>) {
    setLoading(true);
    const r = await saveService(row?.id ?? null, v);
    setLoading(false);
    if (!r.ok) { toast.error(r.error); Object.entries(r.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof ServiceInput, { message: m[0] })); return; }
    toast.success(r.message); router.refresh(); onDone();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Nama layanan" error={errors.name?.message}>{(p) => <Input {...p} {...register("name")} />}</Field>
      <Field label="Deskripsi" error={errors.description?.message}>{(p) => <Textarea {...p} {...register("description")} />}</Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Harga (Rp)" error={errors.price?.message}>{(p) => <Input {...p} type="number" min={0} inputMode="numeric" {...register("price")} />}</Field>
        <Field label="Satuan" error={errors.unit?.message} hint="kg, pcs, m2, dll.">{(p) => <Input {...p} {...register("unit")} />}</Field>
      </div>
      <Field label="Estimasi pengerjaan (jam)" error={errors.estimatedHours?.message} hint="48 jam = 2 hari">{(p) => <Input {...p} type="number" min={1} inputMode="numeric" {...register("estimatedHours")} />}</Field>
      <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="size-5 accent-[var(--primary)]" {...register("isActive")} />Aktif (tampil di website & bisa dipesan)</label>
      <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="outline" onClick={onDone}>Batal</Button><Button type="submit" loading={loading}>Simpan</Button></div>
    </form>
  );
}

export function ServicesManager({ rows }: { rows: ServiceRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ServiceRow | null | "new">(null);
  const [del, setDel] = useState<ServiceRow | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>, after?: () => void) =>
    start(async () => { const r = await fn(); if (r.ok) { toast.success(r.message); router.refresh(); after?.(); } else toast.error(r.error); });

  return (
    <>
      <div className="mb-4 flex justify-end"><Button onClick={() => setEditing("new")}><Plus className="size-4" strokeWidth={2} />Tambah layanan</Button></div>
      {rows.length === 0 ? <EmptyState title="Belum ada layanan" text="Tambahkan layanan pertama agar pelanggan bisa memesan." action={<Button onClick={() => setEditing("new")}>Tambah layanan</Button>} /> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:shadow-lift">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><p className="font-bold">{r.name}</p><StatusBadge tone={r.isActive ? "green" : "gray"}>{r.isActive ? "Aktif" : "Nonaktif"}</StatusBadge></div>
                <p className="mt-1 text-sm text-muted">{rupiah(r.price)} / {r.unit} · {formatDuration(r.estimatedHours)}{r.used > 0 && ` · dipakai ${r.used}×`}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" title="Edit" aria-label={`Edit ${r.name}`} onClick={() => setEditing(r)} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100"><Pencil className="size-5" strokeWidth={2} /></button>
                <button type="button" title={r.isActive ? "Nonaktifkan" : "Aktifkan"} aria-label={r.isActive ? `Nonaktifkan ${r.name}` : `Aktifkan ${r.name}`} disabled={pending} onClick={() => run(() => toggleService(r.id, !r.isActive))} className="grid size-11 place-items-center rounded-xl hover:bg-slate-100 disabled:opacity-50"><Power className="size-5" strokeWidth={2} /></button>
                <button type="button" title="Hapus" aria-label={`Hapus ${r.name}`} onClick={() => setDel(r)} className="grid size-11 place-items-center rounded-xl text-red-600 hover:bg-red-50"><Trash2 className="size-5" strokeWidth={2} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Tambah layanan" : "Edit layanan"}>
        {editing !== null && <ServiceForm key={editing === "new" ? "new" : editing.id} row={editing === "new" ? null : editing} onDone={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} loading={pending} title="Hapus layanan?" confirmLabel="Hapus"
        message={del && del.used > 0 ? `"${del.name}" sudah pernah dipakai di pesanan, jadi hanya akan dinonaktifkan agar riwayat tetap utuh.` : `"${del?.name}" akan dihapus permanen.`}
        onConfirm={() => del && run(() => deleteService(del.id), () => setDel(null))} />
    </>
  );
}
