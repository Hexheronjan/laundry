"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createOrder, OrderError } from "@/lib/orders";
import { orderBaseSchema, type OrderInput } from "@/lib/validations/order";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatusKey } from "@/lib/utils/format";
import { normalizePhone } from "@/lib/utils/phone";

type R = { ok: true; message?: string; invoiceNo?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const refresh = () => { revalidatePath("/admin", "layout"); };

export async function createAdminOrder(raw: OrderInput): Promise<R> {
  const user = await requireAdmin();
  const p = orderBaseSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  try {
    const r = await createOrder(p.data, { source: "ADMIN", userId: user.id });
    refresh();
    return { ok: true, message: `Pesanan ${r.invoiceNo} dibuat`, invoiceNo: r.invoiceNo };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Terjadi kesalahan di server." };
  }
}

/** Edit pesanan: harga lama dipertahankan untuk layanan yang tidak berganti; layanan baru memakai harga saat ini. */
export async function updateAdminOrder(id: string, raw: OrderInput): Promise<R> {
  await requireAdmin();
  const p = orderBaseSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  const d = p.data;
  if (d.fulfillment !== "SELF_PICKUP" && !d.address?.trim()) return { ok: false, error: "Alamat wajib diisi untuk antar/jemput." };

  const order = await db.order.findFirst({ where: { id, deletedAt: null }, include: { items: true, payment: true } });
  if (!order) return { ok: false, error: "Pesanan tidak ditemukan." };
  if (order.payment?.status === "PAID") return { ok: false, error: "Pesanan yang sudah lunas tidak dapat diubah itemnya." };

  const merged = new Map<string, number>();
  for (const it of d.items) merged.set(it.serviceId, (merged.get(it.serviceId) ?? 0) + it.quantity);
  const services = await db.service.findMany({ where: { id: { in: [...merged.keys()] } } });
  if (services.length !== merged.size) return { ok: false, error: "Layanan tidak ditemukan." };

  const lines = services.map((s) => {
    const old = order.items.find((i) => i.serviceId === s.id);
    const unitPrice = old?.unitPrice ?? s.price;
    const qty = merged.get(s.id)!;
    return { s, unitPrice, qty, subtotal: Math.round(unitPrice * qty) };
  });
  const total = lines.reduce((a, l) => a + l.subtotal, 0);
  const phone = normalizePhone(d.phone);

  try {
    await db.$transaction(async (tx) => {
      const clash = await tx.customer.findFirst({ where: { phone, NOT: { id: order.customerId } } });
      const customerId = clash ? clash.id : order.customerId;
      if (!clash) await tx.customer.update({ where: { id: customerId }, data: { name: d.customerName, phone, address: d.address || null } });
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.update({
        where: { id },
        data: {
          customerId, fulfillment: d.fulfillment, address: d.address || null, notes: d.notes || null, total,
          items: { create: lines.map((l) => ({ serviceId: l.s.id, serviceName: l.s.name, unit: l.s.unit, unitPrice: l.unitPrice, quantity: new Prisma.Decimal(l.qty), subtotal: l.subtotal })) },
        },
      });
      if (order.payment) await tx.payment.update({ where: { orderId: id }, data: { amount: total } });
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Gagal menyimpan perubahan." };
  }
  refresh();
  return { ok: true, message: "Pesanan diperbarui" };
}

export async function updateOrderStatus(id: string, status: OrderStatusKey): Promise<R> {
  const user = await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return { ok: false, error: "Status tidak valid." };
  const order = await db.order.findFirst({ where: { id, deletedAt: null } });
  if (!order) return { ok: false, error: "Pesanan tidak ditemukan." };
  if (order.status === status) return { ok: true, message: "Status tidak berubah" };
  await db.$transaction([
    db.order.update({ where: { id }, data: { status } }),
    db.orderStatusHistory.create({ data: { orderId: id, status, userId: user.id } }),
  ]);
  refresh();
  return { ok: true, message: `Status: ${ORDER_STATUS_LABEL[status]}` };
}

/** Soft delete — data tetap tercatat. */
export async function deleteOrder(id: string): Promise<R> {
  await requireAdmin();
  await db.order.update({ where: { id }, data: { deletedAt: new Date() } });
  refresh();
  return { ok: true, message: "Pesanan dihapus" };
}
