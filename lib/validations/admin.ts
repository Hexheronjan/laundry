import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Nama layanan minimal 2 karakter").max(100),
  description: z.string().trim().max(500, "Deskripsi terlalu panjang").optional().or(z.literal("")),
  price: z.coerce.number({ error: "Harga harus berupa angka" }).int("Harga harus bilangan bulat").min(0, "Harga tidak boleh negatif"),
  unit: z.string().trim().min(1, "Satuan wajib diisi").max(20),
  estimatedHours: z.coerce.number({ error: "Estimasi harus berupa angka" }).int().min(1, "Minimal 1 jam").max(720),
  isActive: z.boolean().default(true),
});
export type ServiceInput = z.input<typeof serviceSchema>;

const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Format jam HH:MM");

export const settingsSchema = z.object({
  businessName: z.string().trim().min(2, "Nama usaha wajib diisi").max(100),
  tagline: z.string().trim().max(100),
  description: z.string().trim().max(500),
  aboutText: z.string().trim().max(3000).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Alamat wajib diisi").max(500),
  whatsapp: z.string().trim().min(8, "Nomor WhatsApp wajib diisi"),
  email: z.string().trim().email("Email tidak valid").or(z.literal("")),
  mapsEmbedUrl: z.string().trim().max(1500).optional().or(z.literal("")),
  bankName: z.string().trim().max(60),
  bankAccountName: z.string().trim().max(100),
  bankAccountNumber: z.string().trim().max(40),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format #RRGGBB"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format #RRGGBB"),
  invoiceFormat: z.string().trim().min(3).max(60).refine((v) => /\{SEQ(:\d+)?\}/.test(v), "Format wajib memuat {SEQ:4}"),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(160),
  foundedYear: z.union([z.literal(""), z.coerce.number({ error: "Tahun harus angka" }).int().min(1950, "Tahun tidak valid").max(2100, "Tahun tidak valid")]).optional(),
  enableDelivery: z.boolean(),
  enablePickup: z.boolean(),
  enableProofUpload: z.boolean(),
  openingHours: z.record(
    z.string(),
    z.object({ open: hhmm, close: hhmm, closed: z.boolean() }),
  ),
});
export type SettingsInput = z.input<typeof settingsSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, "Password lama wajib diisi"),
    next: z.string().min(8, "Password baru minimal 8 karakter"),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Konfirmasi password tidak cocok" });
