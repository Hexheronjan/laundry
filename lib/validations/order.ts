import { z } from "zod";
import { isValidPhone } from "@/lib/utils/phone";

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Nomor WhatsApp wajib diisi")
  .refine(isValidPhone, "Nomor WhatsApp tidak valid (contoh: 0812xxxxxxxx)");

export const orderItemSchema = z.object({
  serviceId: z.string().min(1, "Pilih layanan"),
  quantity: z.coerce
    .number({ error: "Jumlah harus berupa angka" })
    .positive("Jumlah harus lebih dari 0")
    .max(1000, "Jumlah terlalu besar"),
});

export const orderBaseSchema = z.object({
  customerName: z.string().trim().min(2, "Nama minimal 2 karakter").max(100, "Nama terlalu panjang"),
  phone: phoneSchema,
  address: z.string().trim().max(500, "Alamat terlalu panjang").optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1, "Pilih minimal satu layanan"),
  notes: z.string().trim().max(500, "Catatan terlalu panjang").optional().or(z.literal("")),
  fulfillment: z.enum(["SELF_PICKUP", "PICKUP_BY_STORE", "DELIVERY"]),
});

export type OrderInput = z.infer<typeof orderBaseSchema>;

export const trackSchema = z.object({
  invoiceNo: z.string().trim().min(3, "Nomor nota wajib diisi").max(60),
  phone: phoneSchema,
});
