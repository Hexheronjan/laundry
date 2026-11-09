import type { Metadata } from "next";
import { Suspense } from "react";
import { getActiveServices, getSettings } from "@/lib/settings";
import { BookingForm } from "@/components/public/BookingForm";
import { FadeUp } from "@/components/motion/SlideIn";

export const revalidate = 300;
export const metadata: Metadata = { title: "Pesan Online", description: "Pesan layanan laundry secara online dalam tiga langkah mudah." };

export default async function BookingPage() {
  const [s, services] = await Promise.all([getSettings(), getActiveServices()]);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <FadeUp className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Pesan online</h1>
        <p className="mt-3 text-slate-600">Isi data, pilih layanan, lalu konfirmasi. Tanpa perlu membuat akun.</p>
      </FadeUp>
      {services.length === 0 ? (
        <p className="text-center text-muted">Belum ada layanan yang tersedia untuk dipesan.</p>
      ) : (
        <Suspense>
          <BookingForm
            services={services.map(({ id, name, price, unit, estimatedHours }) => ({ id, name, price, unit, estimatedHours }))}
            enableDelivery={s.enableDelivery}
            enablePickup={s.enablePickup}
            whatsapp={s.whatsapp}
            businessName={s.businessName}
          />
        </Suspense>
      )}
    </div>
  );
}
