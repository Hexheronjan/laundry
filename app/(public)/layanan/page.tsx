import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, Sparkles, ArrowRight, Check } from "lucide-react";
import { getActiveServices, getSettings } from "@/lib/settings";
import { SlideIn, FadeUp } from "@/components/motion/SlideIn";
import { buttonClass } from "@/components/ui/Button";
import { formatDuration, rupiah } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Layanan Laundry & Wet Cleaning",
  description: "Daftar layanan lengkap Prajalinks Laundry: kiloan, satuan, bed cover, sepatu, dan express 6 jam.",
};

export default async function ServicesPage() {
  const [s, services] = await Promise.all([getSettings(), getActiveServices()]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      {/* Header */}
      <FadeUp className="max-w-2xl mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" /> Pilihan Layanan
        </span>
        <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl leading-tight">
          Layanan Perawatan Pakaian Terbaik Untuk Anda
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Dari pakaian harian kiloan, kemeja formal, bed cover tebal, hingga sepatu kesayangan, {s.businessName} siap merawatnya dengan standar kualitas tertinggi.
        </p>
      </FadeUp>

      {services.length === 0 ? (
        <p className="text-muted">Belum ada layanan yang tersedia saat ini.</p>
      ) : (
        <div className="space-y-16 md:space-y-24">
          {services.map((sv, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={sv.id}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-14 rounded-3xl border border-line/70 bg-white p-6 sm:p-10 shadow-soft"
              >
                {/* Gambar Layanan */}
                <SlideIn direction={reverse ? "right" : "left"} className={cn(reverse && "md:order-2")}>
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    {sv.imageUrl ? (
                      <Image
                        src={sv.imageUrl}
                        alt={sv.name}
                        fill
                        sizes="(min-width: 768px) 500px, 100vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-teal-800 text-white font-bold">
                        {sv.name}
                      </div>
                    )}
                    <span className="absolute top-4 left-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-soft">
                      {sv.unit === "kg" ? "Layanan Kiloan" : "Layanan Satuan"}
                    </span>
                  </div>
                </SlideIn>

                {/* Info Layanan */}
                <SlideIn direction={reverse ? "left" : "right"} className={cn(reverse && "md:order-1")}>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <span>Prajalinks Care</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl leading-snug">
                    {sv.name}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {sv.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-baseline gap-4 border-y border-line py-4">
                    <div>
                      <span className="text-xs text-muted">Tarif Layanan</span>
                      <p className="text-2xl font-black text-primary">
                        {rupiah(sv.price)}{" "}
                        <span className="text-sm font-semibold text-muted">/ {sv.unit}</span>
                      </p>
                    </div>

                    <div className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-primary">
                      <Clock className="size-3.5" />
                      Estimasi: {formatDuration(sv.estimatedHours)}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/pesan?layanan=${sv.id}`}
                      className={buttonClass("primary", "md", "shadow-soft")}
                    >
                      Pesan Layanan Ini <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/harga"
                      className={buttonClass("outline", "md")}
                    >
                      Lihat Rincian Harga
                    </Link>
                  </div>
                </SlideIn>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
