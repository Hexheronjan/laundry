import type { Metadata } from "next";
import { TrackForm } from "@/components/public/TrackForm";
import { FadeUp } from "@/components/motion/SlideIn";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Cek Status Pesanan",
  description: "Pantau progres cucian Anda dengan nomor nota dan nomor WhatsApp.",
};

export default async function TrackPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <FadeUp className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Cek status pesanan</h1>
        <p className="mt-3 text-slate-600">
          Masukkan nomor nota dan nomor WhatsApp yang terdaftar pada pesanan.
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
