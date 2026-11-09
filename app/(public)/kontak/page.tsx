import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { SlideIn, FadeUp } from "@/components/motion/SlideIn";
import { HoursList } from "@/components/public/HoursList";
import { LazyMap } from "@/components/public/LazyMap";
import { buttonClass } from "@/components/ui/Button";
import { waLink, formatPhoneDisplay } from "@/lib/utils/phone";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Kontak & Lokasi Outlet",
  description: "Hubungi Prajalinks Laundry via WhatsApp, kunjungi outlet kami, dan lihat jam operasional.",
};

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <FadeUp className="max-w-2xl mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" /> Bantuan & Informasi
        </span>
        <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl leading-tight">
          Hubungi Tim {s.businessName}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Punya pertanyaan seputar layanan, penjemputan cucian, atau kerja sama? Tim ramah kami siap melayani Anda.
        </p>
      </FadeUp>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Kolom Info Kontak */}
        <SlideIn direction="left" className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-7 shadow-soft space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Alamat Outlet
              </span>
              <p className="mt-2 flex items-start gap-3 text-sm text-slate-700 leading-relaxed font-medium">
                <MapPin className="mt-1 size-5 shrink-0 text-primary" strokeWidth={2} />
                <span>{s.address}</span>
              </p>
            </div>

            {s.email && (
              <div className="border-t border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Email Dukungan
                </span>
                <p className="mt-2 flex items-center gap-3 text-sm font-medium text-slate-800">
                  <Mail className="size-4 text-primary shrink-0" />
                  <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors">
                    {s.email}
                  </a>
                </p>
              </div>
            )}

            {s.whatsapp && (
              <div className="border-t border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Layanan Pelanggan WhatsApp
                </span>
                <div className="mt-3">
                  <a
                    href={waLink(s.whatsapp, `Halo ${s.businessName}, saya ingin bertanya tentang layanan laundry.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("primary", "md", "w-full shadow-glow")}
                  >
                    <MessageCircle className="size-5" />
                    Chat WhatsApp ({formatPhoneDisplay(s.whatsapp)})
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-line bg-white p-7 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
              <Clock className="size-5 text-primary" strokeWidth={2} />
              Jadwal Operasional Outlet
            </h2>
            <HoursList hours={s.openingHours} />
          </div>
        </SlideIn>

        {/* Kolom Peta */}
        <SlideIn direction="right">
          <div className="h-full min-h-[380px] rounded-3xl overflow-hidden border border-line shadow-soft bg-white p-2">
            {s.mapsEmbedUrl ? (
              <LazyMap src={s.mapsEmbedUrl} title={`Lokasi ${s.businessName}`} />
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-line bg-slate-50 p-8 text-center text-muted">
                <div>
                  <MapPin className="size-8 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-700">Peta Lokasi Outlet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">{s.address}</p>
                </div>
              </div>
            )}
          </div>
        </SlideIn>
      </div>
    </div>
  );
}
