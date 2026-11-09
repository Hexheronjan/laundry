import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/utils/phone";
import { generateInvoiceNo } from "@/lib/utils/invoice";
import type { OrderInput } from "@/lib/validations/order";

export class OrderError extends Error {}

/**
 * Membuat pesanan lengkap (customer, item, riwayat status, pembayaran) dalam satu transaction.
 * Harga SELALU dihitung ulang dari database — harga dari client diabaikan.
 */
export async function createOrder(input: OrderInput, opts: { source: "ONLINE" | "ADMIN"; userId?: string }) {
  const settings = await db.setting.findUniqueOrThrow({ where: { id: 1 } });

  if (opts.source === "ONLINE") {
    if (input.fulfillment === "DELIVERY" && !settings.enableDelivery) throw new OrderError("Layanan pengantaran tidak tersedia.");
    if (input.fulfillment === "PICKUP_BY_STORE" && !settings.enablePickup) throw new OrderError("Layanan penjemputan tidak tersedia.");
  }
  if (input.fulfillment !== "SELF_PICKUP" && !input.address?.trim()) throw new OrderError("Alamat wajib diisi untuk antar/jemput.");

  // Gabungkan item dengan layanan yang sama
  const merged = new Map<string, number>();
  for (const it of input.items) merged.set(it.serviceId, (merged.get(it.serviceId) ?? 0) + it.quantity);

  const services = await db.service.findMany({
    where: { id: { in: [...merged.keys()] }, isActive: true, deletedAt: null },
  });
  if (services.length !== merged.size) throw new OrderError("Salah satu layanan tidak tersedia lagi. Muat ulang halaman.");

  const lines = services.map((s) => {
    const qty = merged.get(s.id)!;
    return { s, qty, subtotal: Math.round(s.price * qty) };
  });
  const total = lines.reduce((a, l) => a + l.subtotal, 0);
  const maxHours = Math.max(...lines.map((l) => l.s.estimatedHours));
  const now = new Date();
  const estimatedDoneAt = new Date(now.getTime() + maxHours * 3600_000);
  const phone = normalizePhone(input.phone);

  return db.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone },
      create: { name: input.customerName, phone, address: input.address || null },
      update: { ...(input.address ? { address: input.address } : {}) },
    });
    const invoiceNo = await generateInvoiceNo(tx, settings.invoiceFormat, now);
    const order = await tx.order.create({
      data: {
        invoiceNo,
        customerId: customer.id,
        fulfillment: input.fulfillment,
        address: input.address || null,
        notes: input.notes || null,
        total,
        receivedAt: now,
        estimatedDoneAt,
        source: opts.source,
        items: {
          create: lines.map((l) => ({
            serviceId: l.s.id,
            serviceName: l.s.name,
            unit: l.s.unit,
            unitPrice: l.s.price,
            quantity: new Prisma.Decimal(l.qty),
            subtotal: l.subtotal,
          })),
        },
        history: { create: { status: "RECEIVED", userId: opts.userId ?? null, note: opts.source === "ONLINE" ? "Pesanan online" : "Dibuat admin" } },
        payment: {
          create: { amount: total, status: "UNPAID", history: { create: { status: "UNPAID", note: "Tagihan dibuat" } } },
        },
      },
    });
    return { id: order.id, invoiceNo, total };
  });
}
