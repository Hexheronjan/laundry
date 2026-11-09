import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles, ShieldCheck, Truck, Clock } from "lucide-react";
import { getActiveServices, getSettings } from "@/lib/settings";
import { BookingForm } from "@/components/public/BookingForm";
import { FadeUp } from "@/components/motion/SlideIn";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Pesan Online Antar-Jemput",
  description: "Pesan layanan laundry Prajalinks secara online dalam tiga langkah mudah.",
};

export default async function BookingPage() {
  const [s, services] = await Promise.all([getSettings(), getActiveServices()]);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-16">
      <FadeUp className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/20 bg-teal-50 px-3.5 py-1.5 text-xs font-extrabold text-teal-800">
          <Sparkles className="size-3.5 text-teal-600" /> Formulir Pemesanan Instan
        </span>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl leading-tight">
          Pesan Laundry Online
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Isi data singkat, pilih paket layanan, dan konfirmasi. Tanpa perlu registrasi akun,
          langsung dapat nomor nota digital.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-3 py-1 shadow-2xs">
            <Truck className="size-3.5 text-teal-600" /> Bisa Jemput &amp; Antar
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-3 py-1 shadow-2xs">
            <ShieldCheck className="size-3.5 text-teal-600" /> 1 Mesin 1 Pelanggan
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-3 py-1 shadow-2xs">
            <Clock className="size-3.5 text-teal-600" /> Selesai Tepat Waktu
          </span>
        </div>
      </FadeUp>

      <Suspense fallback={<div className="mx-auto max-w-2xl h-96 skeleton rounded-3xl" />}>
        <BookingForm
          services={services.map(({ id, name, price, unit, estimatedHours }) => ({
            id,
            name,
            price,
            unit,
            estimatedHours,
          }))}
          enableDelivery={s.enableDelivery}
          enablePickup={s.enablePickup}
          whatsapp={s.whatsapp}
          businessName={s.businessName}
        />
      </Suspense>
    </div>
  );
}
