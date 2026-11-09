"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { phoneSchema } from "@/lib/validations/order";
import { normalizePhone } from "@/lib/utils/phone";

const schema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  phone: phoneSchema,
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateCustomer(id: string, raw: z.input<typeof schema>) {
  await requireAdmin();
  const p = schema.safeParse(raw);
  if (!p.success) return { ok: false as const, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  const phone = normalizePhone(p.data.phone);
  const clash = await db.customer.findFirst({ where: { phone, NOT: { id } } });
  if (clash) return { ok: false as const, error: "Nomor WhatsApp sudah dipakai pelanggan lain.", fieldErrors: { phone: ["Nomor sudah terdaftar"] } };
  await db.customer.update({ where: { id }, data: { name: p.data.name, phone, address: p.data.address || null } });
  revalidatePath("/admin/pelanggan");
  return { ok: true as const, message: "Pelanggan diperbarui" };
}
