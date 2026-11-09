import type { Metadata } from "next";
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getSettings } from "@/lib/settings";
import { SlideIn, FadeUp } from "@/components/motion/SlideIn";
import { HoursList } from "@/components/public/HoursList";
import { LazyMap } from "@/components/public/LazyMap";
import { buttonClass } from "@/components/ui/Button";
import { waLink, formatPhoneDisplay } from "@/lib/utils/phone";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Kontak & Lokasi Outlet",
  description:
    "Hubungi Prajalinks Laundry via WhatsApp, kunjungi outlet kami, dan lihat jam operasional serta peta lokasi.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const mapUrl =
    s.mapsEmbedUrl && s.mapsEmbedUrl.trim().length > 0
      ? s.mapsEmbedUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(s.address || "Jakarta")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${s.businessName} ${s.address}`
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <FadeUp className="max-w-2xl mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/20 bg-teal-50 px-3.5 py-1.5 text-xs font-extrabold text-teal-800">
          <Sparkles className="size-3.5 text-teal-600" /> Bantuan & Lokasi Outlet
        </span>
        <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl leading-tight">
          Hubungi & Kunjungi <span className="text-primary">{s.businessName}</span>
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Punya pertanyaan seputar layanan, penjemputan cucian di rumah/kantor, atau kerja sama
          kemitraan? Tim ramah kami siap melayani Anda setiap hari.
        </p>
      </FadeUp>

      {/* 3 Kartu Kontak Cepat */}
      <div className="grid gap-5 sm:grid-cols-3 mb-10">
        <SlideIn delay={0}>
          <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-soft hover:shadow-lift transition">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <Phone className="size-6" />
            </span>
            <h2 className="mt-4 text-base font-extrabold text-slate-900">WhatsApp Cepat</h2>
            <p className="mt-1 text-xs text-slate-500">Respon cepat untuk penjemputan & tanya harga</p>
            <p className="mt-3 font-mono text-sm font-black text-teal-700">
              {formatPhoneDisplay(s.whatsapp)}
            </p>
            {s.whatsapp && (
              <a
                href={waLink(
                  s.whatsapp,
                  `Halo ${s.businessName}, saya ingin bertanya tentang layanan laundry.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:underline"
              >
                <MessageCircle className="size-4" /> Chat Sekarang →
              </a>
            )}
          </div>
        </SlideIn>

        <SlideIn delay={0.08}>
          <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-soft hover:shadow-lift transition">
            <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60">
              <MapPin className="size-6" />
            </span>
            <h2 className="mt-4 text-base font-extrabold text-slate-900">Alamat Outlet Utama</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{s.address}</p>
            <a
              href={googleMapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-700 hover:underline"
            >
              <Navigation className="size-3.5" /> Petunjuk Arah Google Maps →
            </a>
          </div>
        </SlideIn>

        <SlideIn delay={0.16}>
          <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-soft hover:shadow-lift transition">
            <span className="grid size-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200/60">
              <Mail className="size-6" />
            </span>
            <h2 className="mt-4 text-base font-extrabold text-slate-900">Email Resmi</h2>
            <p className="mt-1 text-xs text-slate-500">Untuk layanan korporat, hotel & kerja sama</p>
            <p className="mt-3 text-sm font-bold text-slate-800 break-all">
              {s.email || "prajalinks@gmail.com"}
            </p>
            <a
              href={`mailto:${s.email || "prajalinks@gmail.com"}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-700 hover:underline"
            >
              Kirim Email →
            </a>
          </div>
        </SlideIn>
      </div>

      {/* Grid Utama: Jam Operasional + Google Maps Interaktif */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-stretch">
        {/* Kolom Jam Operasional & CTA WhatsApp */}
        <SlideIn direction="left" className="flex flex-col justify-between gap-6">
          <div className="rounded-3xl border border-line bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <h2 className="flex items-center gap-2.5 text-lg font-extrabold text-slate-950">
                <Clock className="size-5 text-primary" strokeWidth={2.2} />
                Jadwal Operasional Outlet
              </h2>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-emerald-700">
                Buka Setiap Hari
              </span>
            </div>
            <HoursList hours={s.openingHours} />

            <div className="mt-6 rounded-2xl bg-teal-50/70 border border-teal-200/60 p-4 text-xs text-teal-900 flex items-start gap-2.5">
              <ShieldCheck className="size-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Layanan Kurir Antar-Jemput Aktif</p>
                <p className="mt-0.5 text-slate-600">
                  Penjemputan dan pengantaran cucian tersedia sesuai jam operasional outlet.
                </p>
              </div>
            </div>
          </div>

          {s.whatsapp && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-7 text-white shadow-lift">
              <h3 className="text-lg font-extrabold text-white">
                Butuh Penjemputan Cucian Hari Ini?
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Hubungi tim kurir {s.businessName} melalui WhatsApp untuk penjemputan instan ke
                rumah, apartemen, atau kantor Anda.
              </p>
              <a
                href={waLink(
                  s.whatsapp,
                  `Halo ${s.businessName}, saya ingin jadwalkan penjemputan laundry hari ini.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary", "md", "mt-5 w-full shadow-glow")}
              >
                <MessageCircle className="size-5" />
                Chat WhatsApp ({formatPhoneDisplay(s.whatsapp)})
              </a>
            </div>
          )}
        </SlideIn>

        {/* Kolom Peta Google Maps */}
        <SlideIn direction="right" className="h-full">
          <div className="flex h-full flex-col rounded-3xl overflow-hidden border border-line shadow-lift bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Peta Lokasi Outlet {s.businessName}
                  </h2>
                  <p className="text-[11px] text-slate-500">{s.address}</p>
                </div>
              </div>
              <a
                href={googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            <div className="flex-1 min-h-[360px]">
              <LazyMap src={mapUrl} title={`Lokasi ${s.businessName}`} />
            </div>
          </div>
        </SlideIn>
      </div>
    </div>
  );
}
