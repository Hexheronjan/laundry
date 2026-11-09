import { cache } from "react";
import { db } from "@/lib/db";
import type { OpeningHours } from "@/lib/utils/format";

const defaultDay = { open: "08:00", close: "20:00", closed: false };

export const DEFAULT_SETTINGS = {
  id: 1,
  businessName: "Prajalinks",
  tagline: "Premium Eco Laundry & Wet Cleaning",
  heroTitle: "Cucian Lebih Bersih, Wangi Mewah, Selesai Tepat Waktu",
  description: "Solusi laundry modern kiloan & satuan dengan formula detergen eco-friendly ramah serat kain, anti-bakteri, setrika uap presisi, serta pemantauan status pesanan real-time.",
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  heroImageUrl: "/images/hero.jpg",
  aboutText: "Prajalinks hadir sebagai standar baru perawatan pakaian modern. Kami memadukan mesin cuci teknologi terkini, air filtrasi higienis, detergen ramah lingkungan, dan pewangi premium berkarakter lembut tahan lama.",
  galleryUrls: [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
  ],
  address: "Jl. Boulevard Praja No. 88, Kawasan Niaga Utama",
  whatsapp: "6285151951806",
  email: "prajalinks@gmail.com",
  openingHours: {
    mon: defaultDay,
    tue: defaultDay,
    wed: defaultDay,
    thu: defaultDay,
    fri: defaultDay,
    sat: defaultDay,
    sun: { open: "08:30", close: "19:00", closed: false },
  } as OpeningHours,
  mapsEmbedUrl: null as string | null,
  bankName: "BCA",
  bankAccountName: "Prajalinks Indonesia",
  bankAccountNumber: "8820918231",
  primaryColor: "#0D9488",
  accentColor: "#06B6D4",
  invoiceFormat: "PRJ-{YYYY}{MM}{DD}-{SEQ:4}",
  seoTitle: "Prajalinks Laundry — Layanan Laundry Kiloan & Satuan Premium",
  seoDescription: "Prajalinks menyediakan laundry kiloan & satuan berkualitas tinggi, antar jemput, setrika uap, dan tracking status pesanan online.",
  foundedYear: 2021,
  enableDelivery: true,
  enablePickup: true,
  enableProofUpload: true,
};

/** Pengaturan usaha (1 baris). Fallback ke default jika database belum di-seed atau offline saat build. */
export const getSettings = cache(async () => {
  try {
    const s = await db.setting.findUnique({ where: { id: 1 } });
    if (!s) return DEFAULT_SETTINGS;
    return {
      ...s,
      heroTitle: (s as unknown as { heroTitle?: string }).heroTitle || DEFAULT_SETTINGS.heroTitle,
      openingHours: (s.openingHours as unknown as OpeningHours) || DEFAULT_SETTINGS.openingHours,
      galleryUrls: ((s.galleryUrls as string[] | null) ?? []),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export type AppSettings = Awaited<ReturnType<typeof getSettings>>;

export const getActiveServices = cache(async () => {
  try {
    return await db.service.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
});
