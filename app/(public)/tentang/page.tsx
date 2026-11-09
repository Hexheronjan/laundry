import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { FadeUp, SlideIn } from "@/components/motion/SlideIn";
import { Gallery } from "@/components/public/Gallery";
import { CheckCircle2, HeartHandshake, Leaf, ShieldCheck, Sparkles, Award } from "lucide-react";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Profil usaha Prajalinks, standar higienis, dan filosofi perawatan pakaian modern.",
};

export default async function AboutPage() {
  const s = await getSettings();
  const paragraphs = (s.aboutText || s.description).split(/\n{2,}/);

  const values = [
    {
      icon: ShieldCheck,
      title: "1 Mesin 1 Pelanggan",
      desc: "Menjamin pakaian Anda tidak pernah dicampur dengan pakaian pelanggan lain. Kebersihan dan privasi Anda selalu nomor satu.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly & Lembut",
      desc: "Menggunakan detergen ramah lingkungan dan parfum bersertifikasi aman untuk kulit sensitif dan bayi.",
    },
    {
      icon: Award,
      title: "Setrika Uap Boiler",
      desc: "Merapikan pakaian dengan tekanan uap halus tanpa gesekan panas berlebih yang dapat merusak serat kain.",
    },
    {
      icon: HeartHandshake,
      title: "Garansi Cuci Ulang",
      desc: "Jika hasil cucian dirasa kurang bersih atau kurang harum, kami siap mencuci ulang tanpa biaya tambahan.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      {/* Header */}
      <FadeUp className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="size-3.5" /> Tentang {s.businessName}
        </span>
        <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl leading-tight">
          Menghadirkan Standar Baru Perawatan Pakaian Modern
        </h1>
      </FadeUp>

      {/* Story & Showcase 2-Kolom */}
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
        <SlideIn direction="left">
          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 space-y-3 border-t border-line pt-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
              <span>Teknologi filtrasi air multi-tahap bebas karat dan lumpur</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
              <span>Pemisahan teliti bahan putih, warna gelap, dan kain lembut</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
              <span>Kemasan higienis anti-debu dengan segel kualitas</span>
            </div>
          </div>
        </SlideIn>

        <SlideIn direction="right">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/60 shadow-2xl">
              <Image
                src="/images/about.jpg"
                alt="Perawatan pakaian Prajalinks"
                fill
                priority
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lift backdrop-blur-md max-w-xs">
              <p className="font-extrabold text-sm text-slate-900">Higienitas Terjamin 100%</p>
              <p className="text-xs text-slate-500 mt-1">
                Pencucian steril bebas bakteri dengan air higienis dan suhu optimal.
              </p>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Nilai Utama / Core Values */}
      <section className="mt-20 border-t border-line pt-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl text-slate-950">Komitmen Kami Kepada Anda</h2>
          <p className="mt-2 text-sm text-slate-600">
            Setiap detail operasional kami dirancang untuk memastikan pakaian kesayangan Anda terawat sempurna.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <SlideIn key={v.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-soft hover:shadow-lift transition duration-300">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <v.icon className="size-6" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* Galeri Tempat Usaha */}
      {s.galleryUrls.length > 0 && (
        <section className="mt-20 border-t border-line pt-16" aria-labelledby="galeri">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Fasilitas & Outlet
              </span>
              <h2 id="galeri" className="text-2xl font-bold sm:text-3xl text-slate-950 mt-1">
                Galeri Tempat Usaha Prajalinks
              </h2>
            </div>
            <p className="text-xs text-muted">Klik foto untuk memperbesar</p>
          </div>
          <Gallery urls={s.galleryUrls} />
        </section>
      )}
    </div>
  );
}
