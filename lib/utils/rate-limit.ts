import { db } from "@/lib/db";
import { headers } from "next/headers";

/** Ambil IP klien (di belakang reverse proxy gunakan X-Forwarded-For). */
export async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Rate limit fixed-window berbasis database.
 * @returns true jika masih diizinkan.
 */
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const now = new Date();
  const row = await db.rateLimit.findUnique({ where: { key } });
  if (!row || now.getTime() - row.windowStart.getTime() > windowSec * 1000) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return true;
  }
  if (row.count >= limit) return false;
  await db.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}
