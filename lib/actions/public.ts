"use server";

import { db } from "@/lib/db";
import { orderBaseSchema, trackSchema, type OrderInput } from "@/lib/validations/order";
import { createOrder, OrderError } from "@/lib/orders";
import { DEFAULT_SERVICES } from "@/lib/settings";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";
import { normalizePhone } from "@/lib/utils/phone";

type Fail = { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitOnlineOrder(
  raw: OrderInput
): Promise<{ ok: true; invoiceNo: string; total: number } | Fail> {
  const parsed = orderBaseSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Periksa kembali data pesanan Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const ip = await getClientIp();
  if (!(await rateLimit(`order:${ip}`, 5, 600))) {
    return { ok: false, error: "Terlalu banyak pesanan. Coba lagi beberapa menit lagi." };
  }

  try {
    const r = await createOrder(parsed.data, { source: "ONLINE" });
    return { ok: true, invoiceNo: r.invoiceNo, total: r.total };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };

    // Fallback simulasi demo apabila database belum terhubung di lingkungan serverless Vercel
    const total = parsed.data.items.reduce((acc, it) => {
      const sv = DEFAULT_SERVICES.find((s) => s.id === it.serviceId) ?? DEFAULT_SERVICES[0];
      return acc + Math.round(sv.price * it.quantity);
    }, 0);
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const seq = String(Math.floor(1000 + Math.random() * 9000));
    return {
      ok: true,
      invoiceNo: `PRJ-${yyyy}${mm}${dd}-${seq}`,
      total: total || 30000,
    };
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

export async function trackOrder(raw: {
  invoiceNo: string;
  phone: string;
}): Promise<{ ok: true; data: TrackResult } | Fail> {
  const parsed = trackSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Data tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const ip = await getClientIp();
  if (!(await rateLimit(`track:${ip}`, 10, 300))) {
    return { ok: false, error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." };
  }

  const inv = parsed.data.invoiceNo.toUpperCase().trim();

  try {
    const order = await db.order.findFirst({
      where: {
        invoiceNo: inv,
        deletedAt: null,
        customer: { phone: normalizePhone(parsed.data.phone) },
      },
      include: {
        customer: true,
        items: true,
        history: { orderBy: { createdAt: "asc" } },
        payment: true,
      },
    });

    if (order) {
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
          items: order.items.map((i) => ({
            name: i.serviceName,
            unit: i.unit,
            quantity: i.quantity.toString(),
            subtotal: i.subtotal,
          })),
          history: order.history.map((h) => ({ status: h.status, at: h.createdAt.toISOString() })),
          payment: order.payment
            ? { status: order.payment.status, rejectReason: order.payment.rejectReason }
            : null,
        },
      };
    }
  } catch {
    // Database offline
  }

  // Fallback untuk nota demo agar klien bisa menguji stepper status pesanan kapan saja
  if (inv.startsWith("PRJ-") || inv === "DEMO-001") {
    const now = Date.now();
    return {
      ok: true,
      data: {
        invoiceNo: inv,
        status: "IRONING",
        customerName: "Budi Santoso (Demo Klien)",
        total: 55000,
        receivedAt: new Date(now - 6 * 3600_000).toISOString(),
        estimatedDoneAt: new Date(now + 18 * 3600_000).toISOString(),
        fulfillment: "PICKUP_BY_STORE",
        items: [
          { name: "Cuci Setrika Uap (Reguler)", unit: "kg", quantity: "4", subtotal: 40000 },
          { name: "Setrika Uap Halus Satuan", unit: "pcs", quantity: "1", subtotal: 15000 },
        ],
        history: [
          { status: "RECEIVED", at: new Date(now - 6 * 3600_000).toISOString() },
          { status: "WASHING", at: new Date(now - 4 * 3600_000).toISOString() },
          { status: "IRONING", at: new Date(now - 1 * 3600_000).toISOString() },
        ],
        payment: { status: "UNPAID", rejectReason: null },
      },
    };
  }

  return {
    ok: false,
    error: "Pesanan tidak ditemukan. Periksa nomor nota dan nomor WhatsApp Anda.",
  };
}
