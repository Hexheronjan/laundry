import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { TrackForm } from "@/components/public/TrackForm";
import { FadeUp } from "@/components/motion/SlideIn";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Cek Status Pesanan",
  description: "Pantau progres cucian Anda secara real-time dengan nomor nota dan nomor WhatsApp.",
};

export default async function TrackPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-16">
      <FadeUp className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/20 bg-teal-50 px-3.5 py-1.5 text-xs font-extrabold text-teal-800">
          <Sparkles className="size-3.5 text-teal-600" /> Live Laundry Tracker
        </span>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl leading-tight">
          Cek Status Pesanan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Pantau tahap pengerjaan cucian Anda secara real-time mulai dari diterima, dicuci,
          disetrika uap, hingga siap diambil.
        </p>
      </FadeUp>
      <TrackForm
        bankInfo={{
          bankName: s.bankName,
          bankAccountName: s.bankAccountName,
          bankAccountNumber: s.bankAccountNumber,
          enableProofUpload: s.enableProofUpload,
        }}
      />
    </div>
  );
}
