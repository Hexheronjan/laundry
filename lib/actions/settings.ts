"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { changePasswordSchema, settingsSchema, type SettingsInput } from "@/lib/validations/admin";
import { isValidPhone, normalizePhone } from "@/lib/utils/phone";

type R = { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function saveSettings(raw: SettingsInput & { logoUrl?: string; faviconUrl?: string; heroImageUrl?: string; heroTitle?: string; galleryUrls?: string[] }): Promise<R> {
  await requireAdmin();
  const { logoUrl, faviconUrl, heroImageUrl, heroTitle, galleryUrls, ...rest } = raw;
  const p = settingsSchema.safeParse(rest);
  if (!p.success) return { ok: false, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  const d = p.data;
  const mapsEmbedUrl = d.mapsEmbedUrl?.trim() || null;
  if (mapsEmbedUrl && !/^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed|^https:\/\/maps\.google\.[a-z.]+\//.test(mapsEmbedUrl)) {
    return { ok: false, error: "Link peta harus berupa URL embed Google Maps (https://www.google.com/maps/embed?...)", fieldErrors: { mapsEmbedUrl: ["URL embed Google Maps tidak valid"] } };
  }
  const clean = (u?: string) => (u?.trim() ? u.trim() : null);
  const data = {
    ...d,
    whatsapp: isValidPhone(d.whatsapp) ? normalizePhone(d.whatsapp) : d.whatsapp,
    mapsEmbedUrl,
    aboutText: d.aboutText || null,
    foundedYear: typeof d.foundedYear === "number" ? d.foundedYear : null,
    logoUrl: clean(logoUrl), faviconUrl: clean(faviconUrl), heroImageUrl: clean(heroImageUrl),
    heroTitle: heroTitle?.trim() || "Cucian bersih, wangi, dan tepat waktu",
    galleryUrls: (galleryUrls ?? []).map((u) => u.trim()).filter(Boolean),
  };
  await db.setting.update({ where: { id: 1 }, data });
  revalidatePath("/", "layout");
  return { ok: true, message: "Pengaturan disimpan" };
}

export async function changePassword(raw: { current: string; next: string; confirm: string }): Promise<R> {
  const u = await requireAdmin();
  const p = changePasswordSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Periksa kembali isian Anda.", fieldErrors: p.error.flatten().fieldErrors as Record<string, string[]> };
  const user = await db.user.findUnique({ where: { id: u.id } });
  if (!user || !(await bcrypt.compare(p.data.current, user.passwordHash))) return { ok: false, error: "Password lama salah.", fieldErrors: { current: ["Password lama salah"] } };
  await db.user.update({ where: { id: u.id }, data: { passwordHash: await bcrypt.hash(p.data.next, 12), mustChangePassword: false } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Password berhasil diganti" };
}
