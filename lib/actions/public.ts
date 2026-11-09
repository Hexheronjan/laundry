"use server";

import { db } from "@/lib/db";
import { orderBaseSchema, trackSchema, type OrderInput } from "@/lib/validations/order";
import { createOrder, OrderError } from "@/lib/orders";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";
import { normalizePhone } from "@/lib/utils/phone";

type Fail = { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitOnlineOrder(raw: OrderInput): Promise<{ ok: true; invoiceNo: string; total: number } | Fail> {
  const parsed = orderBaseSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Periksa kembali data pesanan Anda.", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }
  const ip = await getClientIp();
  if (!(await rateLimit(`order:${ip}`, 5, 600))) return { ok: false, error: "Terlalu banyak pesanan. Coba lagi beberapa menit lagi." };
  try {
    const r = await createOrder(parsed.data, { source: "ONLINE" });
    return { ok: true, invoiceNo: r.invoiceNo, total: r.total };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Terjadi kesalahan di server. Silakan coba lagi." };
  }
}

export type TrackResult = {
  invoiceNo: string;
  status: string;
  customerName: string;
  total: number;
  receivedAt: string;
  estimatedDoneAt: string;
  fulfillment: string;
  items: { name: string; unit: string; quantity: string; subtotal: number }[];
  history: { status: string; at: string }[];
  payment: { status: string; rejectReason: string | null } | null;
};

export async function trackOrder(raw: { invoiceNo: string; phone: string }): Promise<{ ok: true; data: TrackResult } | Fail> {
  const parsed = trackSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Data tidak valid.", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }
  const ip = await getClientIp();
  if (!(await rateLimit(`track:${ip}`, 10, 300))) return { ok: false, error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." };

  const order = await db.order.findFirst({
    where: {
      invoiceNo: parsed.data.invoiceNo.toUpperCase(),
      deletedAt: null,
      customer: { phone: normalizePhone(parsed.data.phone) },
    },
    include: { customer: true, items: true, history: { orderBy: { createdAt: "asc" } }, payment: true },
  });
  // Pesan sama untuk nota/nomor salah agar tidak bisa dipakai menebak data.
  if (!order) return { ok: false, error: "Pesanan tidak ditemukan. Periksa nomor nota dan nomor WhatsApp Anda." };

  return {
    ok: true,
    data: {
      invoiceNo: order.invoiceNo,
      status: order.status,
      customerName: order.customer.name,
      total: order.total,
      receivedAt: order.receivedAt.toISOString(),
      estimatedDoneAt: order.estimatedDoneAt.toISOString(),
      fulfillment: order.fulfillment,
      items: order.items.map((i) => ({ name: i.serviceName, unit: i.unit, quantity: i.quantity.toString(), subtotal: i.subtotal })),
      history: order.history.map((h) => ({ status: h.status, at: h.createdAt.toISOString() })),
      payment: order.payment ? { status: order.payment.status, rejectReason: order.payment.rejectReason } : null,
    },
  };
}
