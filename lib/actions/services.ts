"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema, type ServiceInput } from "@/lib/validations/admin";

type R = { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function refresh() {
  revalidatePath("/admin/layanan");
  // Halaman publik di-ISR: segarkan saat layanan/harga berubah
  revalidatePath("/", "layout");
}

export async function saveService(id: string | null, raw: ServiceInput): Promise<R> {
  await requireAdmin();
  const p = serviceSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  const data = { ...p.data, description: p.data.description || null };
  if (id) await db.service.update({ where: { id }, data });
  else {
    const last = await db.service.aggregate({ _max: { sortOrder: true } });
    await db.service.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
  }
  refresh();
  return { ok: true, message: "Layanan disimpan" };
}

export async function toggleService(id: string, isActive: boolean): Promise<R> {
  await requireAdmin();
  await db.service.update({ where: { id }, data: { isActive } });
  refresh();
  return { ok: true, message: isActive ? "Layanan diaktifkan" : "Layanan dinonaktifkan" };
}

/** Layanan yang pernah dipakai pesanan hanya dinonaktifkan; yang belum pernah dipakai dihapus. */
export async function deleteService(id: string): Promise<R> {
  await requireAdmin();
  const used = await db.orderItem.count({ where: { serviceId: id } });
  if (used > 0) {
    await db.service.update({ where: { id }, data: { isActive: false } });
    refresh();
    return { ok: true, message: "Layanan sudah pernah dipakai, sehingga dinonaktifkan (riwayat tetap utuh)" };
  }
  await db.service.delete({ where: { id } });
  refresh();
  return { ok: true, message: "Layanan dihapus" };
}
