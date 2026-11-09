export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(d));

export const formatDateTime = (d: Date | string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(d));

export function formatDuration(hours: number) {
  if (hours < 24) return `${hours} jam`;
  const days = Math.round(hours / 24);
  return `${days} hari`;
}

export const ORDER_STATUSES = ["RECEIVED", "WASHING", "IRONING", "PACKING", "READY", "DONE"] as const;
export type OrderStatusKey = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatusKey, string> = {
  RECEIVED: "Pesanan diterima",
  WASHING: "Sedang dicuci",
  IRONING: "Sedang disetrika",
  PACKING: "Sedang dikemas",
  READY: "Siap diambil",
  DONE: "Selesai",
};

export const PAYMENT_STATUS_LABEL = {
  UNPAID: "Menunggu pembayaran",
  PENDING_VERIFICATION: "Menunggu verifikasi",
  PAID: "Lunas",
  REJECTED: "Ditolak",
} as const;

export const FULFILLMENT_LABEL = {
  SELF_PICKUP: "Antar sendiri ke outlet",
  PICKUP_BY_STORE: "Dijemput kurir",
  DELIVERY: "Diantar ke alamat",
} as const;

export const DAYS = [
  { key: "mon", label: "Senin" },
  { key: "tue", label: "Selasa" },
  { key: "wed", label: "Rabu" },
  { key: "thu", label: "Kamis" },
  { key: "fri", label: "Jumat" },
  { key: "sat", label: "Sabtu" },
  { key: "sun", label: "Minggu" },
] as const;

export type OpeningHours = Record<string, { open: string; close: string; closed: boolean }>;

/** Status buka/tutup saat ini (zona waktu Asia/Jakarta). */
export function getOpenStatus(hours: OpeningHours, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta",
  }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")!.value.toLowerCase().slice(0, 3);
  const hh = parts.find((p) => p.type === "hour")!.value.replace("24", "00");
  const mm = parts.find((p) => p.type === "minute")!.value;
  const cur = `${hh}:${mm}`;
  const today = hours[wd];
  const isOpen = !!today && !today.closed && cur >= today.open && cur < today.close;
  return { isOpen, today };
}
