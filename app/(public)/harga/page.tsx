import type { Metadata } from "next";
import { getActiveServices, getSettings } from "@/lib/settings";
import { PriceList } from "@/components/public/PriceList";
import { FadeUp, SlideIn } from "@/components/motion/SlideIn";
import { Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Daftar Harga Lengkap",
  description: "Daftar harga laundry kiloan, satuan, bed cover, dan sepatu Prajalinks Laundry.",
};

export default async function PricePage() {
  const [s, services] = await Promise.all([getSettings(), getActiveServices()]);

  const faqs = [
    {
      q: "Berapa minimal berat untuk layanan kiloan?",
      a: "Minimal pemesanan kiloan adalah 3 kg. Jika pakaian Anda kurang dari 3 kg, akan tetap dihitung tarif minimal 3 kg.",
    },
    {
      q: "Apakah pakaian warna putih akan dipisah?",
      a: "Ya, tentu saja. Kami memilah pakaian berdasarkan warna dan jenis serat kain untuk mencegah risiko luntur dan menjaga kecerahan warna.",
    },
    {
      q: "Apakah biaya sudah termasuk detergen dan pelembut?",
      a: "Seluruh tarif yang tertera sudah termasuk detergen ramah lingkungan, pelembut anti-bakteri, setrika uap, dan kemasan higienis kedap udara.",
    },
    {
      q: "Bagaimana cara penimbangan pakaian?",
      a: "Pakaian ditimbang menggunakan timbangan digital presisi di outlet kami saat proses penerimaan dan difoto jika diperlukan.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <FadeUp className="max-w-2xl mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" /> Tarif & Biaya
        </span>
        <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl leading-tight">
          Daftar Harga Transparan {s.businessName}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Harga jujur tanpa biaya tersembunyi. Dapatkan hasil cuci bersih berstandar tinggi dengan tarif terjangkau.
        </p>
      </FadeUp>

      {/* Daftar Harga */}
      <div className="mt-8">
        {services.length === 0 ? (
          <p className="text-muted">Belum ada layanan yang tersedia saat ini.</p>
        ) : (
          <PriceList
            rows={services.map(({ id, name, description, price, unit, estimatedHours }) => ({
              id,
              name,
              description,
              price,
              unit,
              estimatedHours,
            }))}
          />
        )}
      </div>

      {/* FAQ Harga */}
      <section className="mt-20 border-t border-line pt-16">
        <SlideIn>
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Informasi Tambahan
            </span>
            <h2 className="text-2xl font-bold sm:text-3xl text-slate-950 mt-1">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h3 className="font-bold text-base text-slate-900 flex items-start gap-2">
                  <HelpCircle className="size-5 text-teal-600 shrink-0 mt-0.5" />
                  {f.q}
                </h3>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-7">{f.a}</p>
              </div>
            ))}
          </div>
        </SlideIn>
      </section>
    </div>
  );
}
