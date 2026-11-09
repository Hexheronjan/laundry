import "server-only";
import { db } from "@/lib/db";
import { type OrderStatusKey } from "@/lib/utils/format";

export type ReportPreset = "today" | "week" | "month" | "custom";

export function parseDateRange(preset?: string, fromStr?: string, toStr?: string) {
  const now = new Date();
  // WIB offset = UTC + 7 jam
  const wibTime = new Date(now.getTime() + 7 * 3600_000);
  const YYYY = wibTime.getUTCFullYear();
  const MM = wibTime.getUTCMonth();
  const DD = wibTime.getUTCDate();

  let start: Date;
  let end: Date;

  if (preset === "today") {
    start = new Date(Date.UTC(YYYY, MM, DD, 0, 0, 0, 0) - 7 * 3600_000);
    end = new Date(Date.UTC(YYYY, MM, DD, 23, 59, 59, 999) - 7 * 3600_000);
  } else if (preset === "week") {
    // Senin minggu ini
    const dayOfWeek = (wibTime.getUTCDay() + 6) % 7; // 0 = Senin, 6 = Minggu
    const mondayDD = DD - dayOfWeek;
    start = new Date(Date.UTC(YYYY, MM, mondayDD, 0, 0, 0, 0) - 7 * 3600_000);
    end = new Date(Date.UTC(YYYY, MM, mondayDD + 6, 23, 59, 59, 999) - 7 * 3600_000);
  } else if (preset === "month") {
    start = new Date(Date.UTC(YYYY, MM, 1, 0, 0, 0, 0) - 7 * 3600_000);
    end = new Date(Date.UTC(YYYY, MM + 1, 0, 23, 59, 59, 999) - 7 * 3600_000);
  } else if (fromStr && toStr) {
    const fParts = fromStr.split("-").map(Number);
    const tParts = toStr.split("-").map(Number);
    start = new Date(Date.UTC(fParts[0], fParts[1] - 1, fParts[2], 0, 0, 0, 0) - 7 * 3600_000);
    end = new Date(Date.UTC(tParts[0], tParts[1] - 1, tParts[2], 23, 59, 59, 999) - 7 * 3600_000);
  } else {
    // Default: bulan ini
    start = new Date(Date.UTC(YYYY, MM, 1, 0, 0, 0, 0) - 7 * 3600_000);
    end = new Date(Date.UTC(YYYY, MM + 1, 0, 23, 59, 59, 999) - 7 * 3600_000);
  }

  return { start, end };
}

export async function getReportData(start: Date, end: Date) {
  let orders: Awaited<ReturnType<typeof db.order.findMany<{ include: { customer: true; items: true; payment: true } }>>> = [];
  try {
    orders = await db.order.findMany({
      where: {
        deletedAt: null,
        receivedAt: { gte: start, lte: end },
      },
      orderBy: { receivedAt: "desc" },
      include: {
        customer: true,
        items: true,
        payment: true,
      },
    });
  } catch {
    // Database offline
  }

  // 1. Ringkasan Pendapatan (Hanya dari pembayaran PAID)
  const paidRevenue = orders.reduce((sum, o) => {
    return o.payment?.status === "PAID" ? sum + o.payment.amount : sum;
  }, 0);

  const totalBilled = orders.reduce((sum, o) => sum + o.total, 0);

  // 2. Rekap per status
  const statusCounts: Record<OrderStatusKey, number> = {
    RECEIVED: 0,
    WASHING: 0,
    IRONING: 0,
    PACKING: 0,
    READY: 0,
    DONE: 0,
  };
  for (const o of orders) {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status]++;
    }
  }

  // 3. Rekap per layanan
  const serviceMap = new Map<string, { name: string; unit: string; totalQty: number; subtotal: number }>();
  for (const o of orders) {
    for (const it of o.items) {
      const cur = serviceMap.get(it.serviceName) ?? {
        name: it.serviceName,
        unit: it.unit,
        totalQty: 0,
        subtotal: 0,
      };
      cur.totalQty += Number(it.quantity);
      cur.subtotal += it.subtotal;
      serviceMap.set(it.serviceName, cur);
    }
  }
  const serviceSummary = [...serviceMap.values()].sort((a, b) => b.subtotal - a.subtotal);

  return {
    orders,
    totalOrders: orders.length,
    paidRevenue,
    totalBilled,
    statusCounts,
    serviceSummary,
  };
}
