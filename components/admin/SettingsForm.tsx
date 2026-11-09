"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { changePasswordSchema, settingsSchema } from "@/lib/validations/admin";
import { changePassword, saveSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Card } from "./ui";
import { DAYS } from "@/lib/utils/format";

type In = z.input<typeof settingsSchema>;
export type SettingsFormValues = In & { logoUrl: string; faviconUrl: string; heroImageUrl: string; heroTitle: string; galleryText: string };

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="text-lg font-bold">{title}</h2>
      {hint && <p className="mb-4 text-sm text-muted">{hint}</p>}
      <div className={`grid gap-4 sm:grid-cols-2 ${hint ? "" : "mt-4"}`}>{children}</div>
    </Card>
  );
}

const Toggle = ({ label, reg }: { label: string; reg: ReturnType<ReturnType<typeof useForm<SettingsFormValues>>["register"]> }) => (
  <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="size-5 accent-[var(--primary)]" {...reg} />{label}</label>
);

export function SettingsForm({ defaults }: { defaults: SettingsFormValues }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema) as never, defaultValues: defaults });
  const e = (k: keyof SettingsFormValues) => (errors[k] as { message?: string } | undefined)?.message;

  async function onSubmit(v: SettingsFormValues) {
    setLoading(true);
    const { galleryText, ...rest } = v;
    const r = await saveSettings({ ...rest, galleryUrls: galleryText.split("\n") });
    setLoading(false);
    if (!r.ok) { toast.error(r.error); Object.entries(r.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof SettingsFormValues, { message: m[0] })); return; }
    toast.success(r.message); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Section title="Profil usaha">
        <Field label="Nama usaha" error={e("businessName")}>{(p) => <Input {...p} {...register("businessName")} />}</Field>
        <Field label="Tagline (badge hero)" error={e("tagline")}>{(p) => <Input {...p} {...register("tagline")} />}</Field>
        <Field label="Judul hero" error={e("heroTitle")} className="sm:col-span-2">{(p) => <Input {...p} {...register("heroTitle")} />}</Field>
        <Field label="Deskripsi singkat" error={e("description")} className="sm:col-span-2">{(p) => <Textarea {...p} {...register("description")} />}</Field>
        <Field label="Teks halaman Tentang Kami" error={e("aboutText")} hint="Pisahkan paragraf dengan baris kosong." className="sm:col-span-2">{(p) => <Textarea {...p} rows={5} {...register("aboutText")} />}</Field>
        <Field label="Tahun berdiri" error={e("foundedYear")} hint="Dipakai untuk statistik lama usaha.">{(p) => <Input {...p} inputMode="numeric" {...register("foundedYear")} />}</Field>
      </Section>
      <Section title="Kontak & lokasi">
        <Field label="Alamat" error={e("address")} className="sm:col-span-2">{(p) => <Textarea {...p} {...register("address")} />}</Field>
        <Field label="Nomor WhatsApp" error={e("whatsapp")}>{(p) => <Input {...p} type="tel" {...register("whatsapp")} />}</Field>
        <Field label="Email" error={e("email")}>{(p) => <Input {...p} type="email" {...register("email")} />}</Field>
        <Field label="URL embed Google Maps" error={e("mapsEmbedUrl")} hint="Google Maps → Bagikan → Sematkan peta → salin nilai src pada iframe." className="sm:col-span-2">{(p) => <Textarea {...p} {...register("mapsEmbedUrl")} />}</Field>
      </Section>
      <Section title="Jam operasional">
        {DAYS.map((d) => (
          <div key={d.key} className="flex flex-wrap items-center gap-2 sm:col-span-1">
            <span className="w-20 text-sm font-medium">{d.label}</span>
            <Input aria-label={`Buka ${d.label}`} type="time" className="w-auto" {...register(`openingHours.${d.key}.open`)} />
            <span>–</span>
            <Input aria-label={`Tutup ${d.label}`} type="time" className="w-auto" {...register(`openingHours.${d.key}.close`)} />
            <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-[var(--primary)]" {...register(`openingHours.${d.key}.closed`)} />Libur</label>
          </div>
        ))}
      </Section>
      <Section title="Tampilan & brand" hint="Letakkan file gambar di folder public/brand lalu isi path-nya (mis. /brand/logo.png), atau pakai URL https.">
        <Field label="Logo" error={e("logoUrl")}>{(p) => <Input {...p} placeholder="/brand/logo.png" {...register("logoUrl")} />}</Field>
        <Field label="Favicon" error={e("faviconUrl")}>{(p) => <Input {...p} placeholder="/brand/favicon.ico" {...register("faviconUrl")} />}</Field>
        <Field label="Foto hero (tempat laundry)" error={e("heroImageUrl")} className="sm:col-span-2">{(p) => <Input {...p} placeholder="/brand/hero.jpg" {...register("heroImageUrl")} />}</Field>
        <Field label="Galeri (satu URL per baris)" className="sm:col-span-2">{(p) => <Textarea {...p} rows={4} {...register("galleryText")} />}</Field>
        <Field label="Warna utama" error={e("primaryColor")}>{(p) => <div className="flex gap-2"><input type="color" aria-label="Pilih warna utama" className="size-11 shrink-0 cursor-pointer rounded-xl border border-line bg-white p-1" {...register("primaryColor")} /><Input {...p} {...register("primaryColor")} /></div>}</Field>
        <Field label="Warna aksen" error={e("accentColor")}>{(p) => <div className="flex gap-2"><input type="color" aria-label="Pilih warna aksen" className="size-11 shrink-0 cursor-pointer rounded-xl border border-line bg-white p-1" {...register("accentColor")} /><Input {...p} {...register("accentColor")} /></div>}</Field>
      </Section>
      <Section title="Rekening bank" hint="Ditampilkan untuk pembayaran transfer manual.">
        <Field label="Nama bank" error={e("bankName")}>{(p) => <Input {...p} {...register("bankName")} />}</Field>
        <Field label="Nama pemilik rekening" error={e("bankAccountName")}>{(p) => <Input {...p} {...register("bankAccountName")} />}</Field>
        <Field label="Nomor rekening" error={e("bankAccountNumber")}>{(p) => <Input {...p} inputMode="numeric" {...register("bankAccountNumber")} />}</Field>
      </Section>
      <Section title="Nota & SEO">
        <Field label="Format nomor nota" error={e("invoiceFormat")} hint="Token: {YYYY} {MM} {DD} {SEQ:4}. Contoh: LDR-{YYYY}{MM}{DD}-{SEQ:4}" className="sm:col-span-2">{(p) => <Input {...p} {...register("invoiceFormat")} />}</Field>
        <Field label="Meta title" error={e("seoTitle")}>{(p) => <Input {...p} {...register("seoTitle")} />}</Field>
        <Field label="Meta description" error={e("seoDescription")}>{(p) => <Textarea {...p} {...register("seoDescription")} />}</Field>
      </Section>
      <Section title="Fitur">
        <Toggle label="Pengiriman (diantar ke alamat)" reg={register("enableDelivery")} />
        <Toggle label="Pengambilan (dijemput kurir)" reg={register("enablePickup")} />
        <Toggle label="Upload bukti transfer" reg={register("enableProofUpload")} />
      </Section>
      <div className="sticky bottom-3 flex justify-end"><Button type="submit" size="lg" loading={loading} className="shadow-lift">Simpan pengaturan</Button></div>
    </form>
  );
}

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<z.infer<typeof changePasswordSchema>>({ resolver: zodResolver(changePasswordSchema) });
  const router = useRouter();
  async function onSubmit(v: z.infer<typeof changePasswordSchema>) {
    setLoading(true);
    const r = await changePassword(v);
    setLoading(false);
    if (!r.ok) { toast.error(r.error); Object.entries(r.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof typeof v, { message: m[0] })); return; }
    toast.success(r.message); reset(); router.refresh();
  }
  return (
    <form id="akun" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <h2 className="text-lg font-bold">Ganti password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Password lama" error={errors.current?.message}>{(p) => <Input {...p} type="password" autoComplete="current-password" {...register("current")} />}</Field>
          <Field label="Password baru" error={errors.next?.message}>{(p) => <Input {...p} type="password" autoComplete="new-password" {...register("next")} />}</Field>
          <Field label="Konfirmasi" error={errors.confirm?.message}>{(p) => <Input {...p} type="password" autoComplete="new-password" {...register("confirm")} />}</Field>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit" loading={loading}>Ganti password</Button></div>
      </Card>
    </form>
  );
}
