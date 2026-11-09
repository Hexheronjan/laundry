"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, m } from "motion/react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Plus, Trash2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { orderBaseSchema, type OrderInput } from "@/lib/validations/order";
import { submitOnlineOrder } from "@/lib/actions/public";
import { Button, buttonClass } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { formatDuration, rupiah } from "@/lib/utils/format";
import { waLink } from "@/lib/utils/phone";

type Svc = { id: string; name: string; price: number; unit: string; estimatedHours: number };
type FormIn = z.input<typeof orderBaseSchema>;

const steps = ["Data Pelanggan", "Pilihan Layanan", "Konfirmasi Pesanan"];

export function BookingForm({
  services,
  enableDelivery,
  enablePickup,
  whatsapp,
  businessName,
}: {
  services: Svc[];
  enableDelivery: boolean;
  enablePickup: boolean;
  whatsapp: string;
  businessName: string;
}) {
  const preset = useSearchParams().get("layanan");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ invoiceNo: string; total: number } | null>(null);

  const form = useForm<FormIn, unknown, OrderInput>({
    resolver: zodResolver(orderBaseSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      notes: "",
      fulfillment: "SELF_PICKUP",
      items: [{ serviceId: services.find((s) => s.id === preset)?.id ?? services[0]?.id ?? "", quantity: 1 }],
    },
    mode: "onTouched",
  });

  const { register, control, trigger, setError, getValues, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  
  const watchedItems = useWatch({ control, name: "items" }) || [];
  const watchedFulfillment = useWatch({ control, name: "fulfillment" }) || "SELF_PICKUP";

  const lines = watchedItems.map((it) => {
    const s = services.find((x) => x.id === it?.serviceId);
    const q = Number(it?.quantity) || 0;
    return { s, q, subtotal: s ? Math.round(s.price * q) : 0 };
  });
  const total = lines.reduce((a, l) => a + l.subtotal, 0);
  const maxHours = Math.max(0, ...lines.map((l) => l.s?.estimatedHours ?? 0));

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  async function next() {
    if (step === 0) {
      const ok = await trigger(["customerName", "phone", "address"]);
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await trigger(["items", "fulfillment"]);
      if (!ok) return;
      if (getValues("fulfillment") !== "SELF_PICKUP" && !getValues("address")?.trim()) {
        setError("address", { message: "Alamat wajib diisi jika memilih layanan antar/jemput" });
        go(0);
        return;
      }
    }
    go(step + 1);
  }

  async function submit(data: OrderInput) {
    setLoading(true);
    const r = await submitOnlineOrder(data);
    setLoading(false);
    if (!r.ok) {
      toast.error(r.error);
      if (r.fieldErrors) {
        for (const [k, v] of Object.entries(r.fieldErrors)) {
          setError(k as keyof FormIn, { message: v[0] });
        }
      }
      return;
    }
    setDone({ invoiceNo: r.invoiceNo, total: r.total });
  }

  if (done) {
    const text = `Halo ${businessName}, saya sudah membuat pesanan online dengan nomor nota ${done.invoiceNo} (total perkiraan ${rupiah(done.total)}).`;
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-lift">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-pop">
          <Check className="size-10" strokeWidth={3} />
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          <Sparkles className="size-3.5" /> Pesanan Berhasil Dibuat
        </span>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Terima Kasih, Pesanan Anda Kami Terima!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Simpan nomor nota Anda di bawah untuk memantau progres pengerjaan cucian.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-100/80 border border-slate-200/80 p-5">
          <p className="text-xs text-muted uppercase font-bold tracking-wider">Nomor Nota Pesanan</p>
          <p className="font-mono text-2xl font-extrabold text-primary tracking-wide mt-1">
            {done.invoiceNo}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Estimasi Tagihan: <b className="text-slate-900">{rupiah(done.total)}</b>
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          {whatsapp && (
            <a
              href={waLink(whatsapp, text)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("primary", "lg", "shadow-glow")}
            >
              <MessageCircle className="size-5" />
              Kirim Notifikasi ke WhatsApp
            </a>
          )}
          <Link href="/cek-status" className={buttonClass("outline", "lg")}>
            Cek Status Cucian Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const opts = [
    { v: "SELF_PICKUP", l: "Antar sendiri ke outlet Prajalinks", on: true },
    { v: "PICKUP_BY_STORE", l: "Dijemput kurir Prajalinks", on: enablePickup },
    { v: "DELIVERY", l: "Diantar kurir setelah selesai", on: enableDelivery },
  ].filter((o) => o.on);

  return (
    <form onSubmit={form.handleSubmit(submit)} className="mx-auto max-w-2xl" noValidate>
      {/* Stepper Progress Bar */}
      <ol className="mb-3 flex justify-between text-xs sm:text-sm font-bold" aria-label="Langkah Pemesanan">
        {steps.map((t, i) => (
          <li
            key={t}
            aria-current={i === step ? "step" : undefined}
            className={i <= step ? "text-primary" : "text-muted"}
          >
            {i + 1}. {t}
          </li>
        ))}
      </ol>

      <div
        className="mb-8 h-2.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={step + 1}
      >
        <div
          className="h-full origin-left rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${(step + 1) / 3})` }}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <m.div
            key={step}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 30 * d }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -30 * d }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* LANGKAH 1 */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Informasi Pelanggan</h2>
                  <p className="text-xs text-muted mt-1">Masukkan data Anda untuk kemudahan verifikasi dan koordinasi.</p>
                </div>

                <Field label="Nama Lengkap" error={errors.customerName?.message}>
                  {(p) => <Input {...p} autoComplete="name" placeholder="Misal: Budi Santoso" {...register("customerName")} />}
                </Field>

                <Field
                  label="Nomor WhatsApp"
                  error={errors.phone?.message}
                  hint="Nomor ini akan dipakai untuk verifikasi saat Anda cek status pesanan."
                >
                  {(p) => <Input {...p} type="tel" inputMode="tel" autoComplete="tel" placeholder="0812xxxxxxxx" {...register("phone")} />}
                </Field>

                <Field
                  label="Alamat Lengkap (Wajib untuk antar/jemput)"
                  error={errors.address?.message}
                  hint="Sertakan patokan atau nomor rumah untuk memudahkan kurir."
                >
                  {(p) => <Textarea {...p} autoComplete="street-address" placeholder="Jl. Mawar No. 12, RT 01/RW 02..." {...register("address")} />}
                </Field>
              </div>
            )}

            {/* LANGKAH 2 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Pilih Layanan & Pengiriman</h2>
                  <p className="text-xs text-muted mt-1">Tentukan layanan yang Anda inginkan dan perkiraan jumlahnya.</p>
                </div>

                <div className="space-y-3">
                  {fields.map((f, i) => (
                    <div key={f.id} className="grid grid-cols-[1fr_6.5rem_auto] items-start gap-2 rounded-2xl bg-slate-50 p-3 border border-line">
                      <Field label={i === 0 ? "Layanan" : `Layanan ${i + 1}`} error={errors.items?.[i]?.serviceId?.message}>
                        {(p) => (
                          <Select {...p} {...register(`items.${i}.serviceId`)}>
                            {services.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} — {rupiah(s.price)}/{s.unit}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>

                      <Field
                        label={`Qty (${services.find((s) => s.id === watchedItems[i]?.serviceId)?.unit ?? ""})`}
                        error={errors.items?.[i]?.quantity?.message}
                      >
                        {(p) => (
                          <Input
                            {...p}
                            type="number"
                            step="0.5"
                            min="0.5"
                            inputMode="decimal"
                            {...register(`items.${i}.quantity`, { valueAsNumber: true })}
                          />
                        )}
                      </Field>

                      <button
                        type="button"
                        onClick={() => remove(i)}
                        disabled={fields.length === 1}
                        aria-label="Hapus layanan"
                        className="mt-[1.85rem] grid size-11 place-items-center rounded-xl text-red-600 hover:bg-red-50 disabled:opacity-30"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}

                  {errors.items?.message && <p role="alert" className="text-xs text-red-600">{errors.items.message}</p>}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ serviceId: services[0]?.id ?? "", quantity: 1 })}
                    className="w-full text-xs"
                  >
                    <Plus className="size-4" /> Tambah Layanan Lain
                  </Button>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-bold text-slate-900">Metode Pengiriman</legend>
                  <div className="grid gap-2">
                    {opts.map((o) => (
                      <label
                        key={o.v}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition ${
                          watchedFulfillment === o.v
                            ? "border-primary bg-primary-soft text-primary font-bold shadow-soft"
                            : "border-line bg-surface hover:bg-slate-50 text-slate-700 font-medium"
                        }`}
                      >
                        <input
                          type="radio"
                          value={o.v}
                          className="size-4 accent-[var(--primary)]"
                          {...register("fulfillment")}
                        />
                        {o.l}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field label="Catatan Tambahan (Opsional)" error={errors.notes?.message}>
                  {(p) => <Textarea {...p} placeholder="Misal: Pisahkan baju putih, atau jangan disemprot parfum melati" {...register("notes")} />}
                </Field>
              </div>
            )}

            {/* LANGKAH 3 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Konfirmasi Pemesanan</h2>
                  <p className="text-xs text-muted mt-1">Pastikan data dan layanan yang Anda pilih sudah sesuai.</p>
                </div>

                <div className="rounded-2xl border border-line bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Nama Pelanggan:</span>
                    <span className="font-bold text-slate-900">{getValues("customerName")}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">No. WhatsApp:</span>
                    <span className="font-bold text-slate-900">{getValues("phone")}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Metode Pengiriman:</span>
                    <span className="font-bold text-slate-900">{opts.find((o) => o.v === watchedFulfillment)?.l}</span>
                  </div>
                  {getValues("address") && (
                    <div className="flex justify-between gap-4 pt-1 border-t border-line">
                      <span className="text-muted">Alamat:</span>
                      <span className="text-right text-xs max-w-xs">{getValues("address")}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-line overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted">
                    Rincian Layanan Terpilih
                  </div>
                  <ul className="divide-y divide-line">
                    {lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <span>
                          <b className="text-slate-900">{l.s?.name}</b> × {l.q} {l.s?.unit}
                        </span>
                        <span className="font-bold text-slate-900">{rupiah(l.subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>

        {/* Ringkasan Estimasi Total */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-300">Estimasi Total Tagihan</span>
            <p className="text-2xl font-black text-cyan-300 mt-0.5">{rupiah(total)}</p>
            {maxHours > 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Estimasi selesai ± {formatDuration(maxHours)}. Timbangan akurat ditimbang di outlet.
              </p>
            )}
          </div>
          <ShieldCheck className="size-8 text-teal-400 opacity-60 shrink-0" />
        </div>

        {/* Tombol Aksi Navigasi */}
        <div className="mt-8 flex justify-between gap-3 border-t border-line pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => go(step - 1)}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="size-4" /> Kembali
          </Button>

          {step < 2 ? (
            <Button type="button" onClick={next} className="shadow-soft">
              Lanjut ke Langkah {step + 2} <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" loading={loading} className="shadow-glow px-7">
              Kirim Pesanan Sekarang
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
