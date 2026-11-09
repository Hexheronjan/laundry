import type { Prisma } from "@prisma/client";

const pad = (n: number, w: number) => String(n).padStart(w, "0");

function jakartaDateParts(d: Date) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(d)
    .split("-");
  return { YYYY: f[0], MM: f[1], DD: f[2] };
}

/**
 * Membuat nomor nota unik & berurutan di dalam transaction.
 * Format token: {YYYY} {MM} {DD} {SEQ:n}. Counter di-reset per "periode" (hasil format tanpa SEQ).
 * Keunikan dijamin ganda: row lock pada InvoiceCounter + unique constraint Order.invoiceNo.
 */
export async function generateInvoiceNo(tx: Prisma.TransactionClient, format: string, now = new Date()) {
  const parts = jakartaDateParts(now);
  const base = format
    .replace("{YYYY}", parts.YYYY)
    .replace("{MM}", parts.MM)
    .replace("{DD}", parts.DD);
  const seqMatch = base.match(/\{SEQ(?::(\d+))?\}/);
  const width = seqMatch?.[1] ? Number(seqMatch[1]) : 4;
  const periodKey = base.replace(/\{SEQ(?::\d+)?\}/, "");

  const counter = await tx.invoiceCounter.upsert({
    where: { key: periodKey },
    create: { key: periodKey, last: 1 },
    update: { last: { increment: 1 } },
  });
  const seq = pad(counter.last, width);
  return seqMatch ? base.replace(seqMatch[0], seq) : `${base}-${seq}`;
}
