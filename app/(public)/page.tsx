import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Droplets,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wind,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db";
import { getActiveServices, getSettings } from "@/lib/settings";
import { EnterIn, SlideIn, Stagger, StaggerItem } from "@/components/motion/SlideIn";
import { CountUp } from "@/components/motion/CountUp";
import { OpenStatusCard } from "@/components/public/OpenStatusCard";
import { PriceEstimator } from "@/components/public/PriceEstimator";
import { buttonClass } from "@/components/ui/Button";
import { formatDuration, rupiah } from "@/lib/utils/format";

export const revalidate = 300;

export default async function HomePage() {
  const [s, services] = await Promise.all([
    getSettings(),
    getActiveServices(),
  ]);

  let doneCount = 1240;
  let customerCount = 890;
  try {
    const [d, c] = await Promise.all([
      db.order.count({ where: { status: "DONE", deletedAt: null } }),
      db.customer.count(),
    ]);
    if (d > 0) doneCount = d;
    if (c > 0) customerCount = c;
  } catch {
    // Database offline
  }

  const years = s.foundedYear ? Math.max(1, new Date().getFullYear() - s.foundedYear) : 4;

  const benefits = [
    {
      no: "01",
      icon: ShieldCheck,
      title: "1 Mesin 1 Pelanggan (Anti-Campur)",
      text: "Cucian Anda tidak pernah dicampur dengan pakaian orang lain. Higienitas terjamin 100% dan bebas risiko tertukar.",
    },
    {
      no: "02",
      icon: Wind,
      title: "Setrika Uap Boiler Presisi",
      text: "Uap panas merata menembus serat kain terdalam, menghasilkan pakaian licin sempurna tanpa meninggalkan kilap atau risiko gosong.",
    },
    {
      no: "03",
      icon: Droplets,
      title: "Detergen Eco & Parfum Premium",
      text: "Formula pembersih ramah lingkungan berbahan aktif biodegradable dengan keharuman mewah tahan hingga 14 hari.",
    },
    {
      no: "04",
      icon: Zap,
      title: "Live Status Tracking",
      text: "Pantau setiap tahap cucian Anda secara transparan dari penerimaan, pencucian, setrika hingga siap antar langsung via HP.",
    },
  ];

  const steps = [
    {
      step: "Langkah 1",
      title: "Pesan Online",
      desc: "Pilih layanan dan tentukan pengantaran mandiri atau penjemputan oleh kurir kami.",
      icon: Sparkles,
    },
    {
      step: "Langkah 2",
      title: "Penjemputan Tepat Waktu",
      desc: "Kurir Prajalinks menjemput pakaian kotor di depan pintu rumah atau kantor Anda.",
      icon: Truck,
    },
    {
      step: "Langkah 3",
      title: "Perawatan Higienis",
      desc: "Diproses teliti satu mesin satu pelanggan dengan air terfiltrasi dan setrika uap halus.",
      icon: RefreshCw,
    },
    {
      step: "Langkah 4",
      title: "Diantar Bersih & Rapi",
      desc: "Pakaian dikemas higienis kedap udara, wangi mewah tahan lama, siap langsung pakai.",
      icon: CheckCircle2,
    },
  ];

  const testimonials = [
    {
      name: "Sabrina Anggraini",
      role: "Pelanggan Setia Kiloan",
      rating: 5,
      comment: "Prajalinks benar-benar game changer! Pakaian kerja saya disetrika uap rapi banget, wanginya mewah dan tahan lama di lemari. Kurirnya juga ramah dan tepat waktu.",
    },
    {
      name: "Rian Hidayat",
      role: "Layanan Bed Cover & Jas",
      rating: 5,
      comment: "Bed cover king size saya kembali mengembang lembut dan bebas dari tungau. Paling suka karena ada fitur tracking status pesanan di website, jadi tahu kapan siap diambil.",
    },
    {
      name: "Dr. Amanda P.",
      role: "Pelanggan Express Kilat",
      rating: 5,
      comment: "Layanan express 6 jam Prajalinks penyelamat saat ada tugas mendadak. Baju dinas putih bersih sempurna tanpa noda. Sangat saya rekomendasikan untuk yang sibuk!",
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-16 md:pt-10 md:pb-24">
        {/* Glow backdrop circles */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden">
          <div className="absolute top-10 left-1/4 size-96 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute top-40 right-1/4 size-96 rounded-full bg-cyan-400/15 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 lg:gap-16">
          <div>
            <EnterIn direction="left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-50/80 px-4 py-1.5 text-xs font-bold text-teal-800 shadow-soft backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-teal-600" />
                </span>
                <span>{s.tagline}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1]">
                Cucian Lebih Bersih,{" "}
                <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent italic font-serif">
                  Wangi Mewah
                </span>
                , Tepat Waktu.
              </h1>

              {/* Description */}
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
                {s.description}
              </p>
            </EnterIn>

            {/* CTA Buttons */}
            <EnterIn direction="up" delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/pesan"
                  className={buttonClass("primary", "lg", "shadow-glow text-base px-8 py-3.5")}
                >
                  <Sparkles className="size-5 text-cyan-200 animate-pulse" />
                  Pesan Antar-Jemput
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/cek-status"
                  className={buttonClass("outline", "lg", "text-base bg-white/90 shadow-soft hover:bg-slate-50")}
                >
                  <Search className="size-4 text-slate-500" />
                  Cek Status Pesanan
                </Link>
              </div>

              {/* Social Proof Mini */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">4.9/5</span>
                  <span className="text-slate-500">(1.200+ Ulasan)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <BadgeCheck className="size-4 text-teal-600" />
                  <span>Garansi Cuci Ulang 100%</span>
                </div>
              </div>
            </EnterIn>
          </div>

          {/* Hero Image with Floating Cards */}
          <EnterIn direction="right" delay={0.15}>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/5] sm:aspect-[4/4.5] overflow-hidden rounded-[32px] border border-white/60 bg-slate-100 shadow-2xl ring-1 ring-slate-900/10">
                <Image
                  src={s.heroImageUrl || "/images/hero.jpg"}
                  alt={`Tempat usaha ${s.businessName}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating Badge Top-Right */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs">
                    ⚡️
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Selesai 6 Jam</p>
                    <p className="text-[10px] text-slate-500">Layanan Kilat Tersedia</p>
                  </div>
                </div>
              </div>

              {/* Floating Real-time Status Card Bottom-Left */}
              <div className="absolute -bottom-6 left-3 sm:-left-6">
                <OpenStatusCard hours={s.openingHours} />
              </div>
            </div>
          </EnterIn>
        </div>
      </section>

      {/* 4-STEP PROCESS (ALUR MENCUCI MUDAH) */}
      <section className="border-y border-line bg-white/70 backdrop-blur-sm py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Cara Kerja
            </span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-slate-950">
              Mencuci Jadi Mudah Dalam 4 Langkah
            </h2>
            <p className="mt-3 text-slate-600">
              Tanpa perlu antre dan repot, serahkan pakaian kotor Anda kepada tim profesional Prajalinks.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <SlideIn key={st.step} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary-soft px-2.5 py-1 rounded-md">
                    {st.step}
                  </span>
                  <div className="mt-4 mb-3 grid size-12 place-items-center rounded-2xl bg-white border border-line text-primary shadow-soft">
                    <st.icon className="size-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{st.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN UTAMA PRAJALINKS */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
          <div>
            <SlideIn direction="left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Kualitas Premium
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl leading-tight">
                Mengapa Memilih {s.businessName}?
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Kami memahami pakaian Anda adalah representasi diri. Oleh sebab itu, kami menerapkan protokol pencucian hotel bintang lima dengan teknologi modern yang menjaga serat kain tetap awet.
              </p>
              <div className="mt-8">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 font-bold text-primary hover:underline"
                >
                  Pelajari standar operasional kami <ArrowRight className="size-4" />
                </Link>
              </div>
            </SlideIn>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <SlideIn key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lift hover:border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-soft">
                      <b.icon className="size-6" strokeWidth={2} />
                    </span>
                    <span className="font-mono text-2xl font-black text-slate-200">
                      {b.no}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-950">{b.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{b.text}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* DAFTAR LAYANAN DENGAN FOTO ASLI */}
      {services.length > 0 && (
        <section className="bg-slate-100/60 py-16 md:py-24 border-y border-line">
          <div className="mx-auto max-w-6xl px-5">
            <SlideIn className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Katalog Layanan
                </span>
                <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl text-slate-950">
                  Solusi Perawatan Pakaian Lengkap
                </h2>
              </div>
              <Link
                href="/layanan"
                className="inline-flex min-h-11 items-center gap-1.5 font-bold text-primary hover:underline"
              >
                Lihat Semua Layanan <ArrowRight className="size-4" />
              </Link>
            </SlideIn>

            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((sv) => (
                <StaggerItem key={sv.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    {/* Foto Layanan */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      {sv.imageUrl ? (
                        <Image
                          src={sv.imageUrl}
                          alt={sv.name}
                          fill
                          sizes="(min-width: 1024px) 380px, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-teal-800 text-white">
                          <Droplets className="size-12 opacity-50" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 shadow-soft">
                        <Clock className="size-3 inline mr-1 text-teal-600" />
                        {formatDuration(sv.estimatedHours)}
                      </span>
                    </div>

                    {/* Deskripsi & Harga */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold text-slate-950 group-hover:text-primary transition-colors">
                        {sv.name}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed flex-1">
                        {sv.description || "Layanan laundry profesional dengan standar higienis tinggi."}
                      </p>

                      <div className="mt-6 pt-4 border-t border-line flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-muted">Mulai dari</span>
                          <p className="text-xl font-black text-primary">
                            {rupiah(sv.price)}{" "}
                            <span className="text-xs font-semibold text-muted">/ {sv.unit}</span>
                          </p>
                        </div>
                        <Link
                          href={`/pesan?layanan=${sv.id}`}
                          className={buttonClass("primary", "sm", "rounded-xl")}
                        >
                          Pesan
                        </Link>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* KALKULATOR ESTIMASI BIAYA & HARGA UTAMA */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SlideIn direction="left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Harga Transparan
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Tanpa Biaya Tersembunyi
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Kami mengutamakan kejujuran dan kepuasan Anda. Gunakan kalkulator instan kami untuk melihat simulasi biaya sebelum memesan.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
                  <span>Timbangan digital transparan di depan Anda</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
                  <span>Gratis hanger & packing anti-debu berkualitas</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
                  <span>Gratis ongkir antar-jemput untuk radius terdekat</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/harga" className={buttonClass("outline", "md")}>
                  Lihat Daftar Harga Lengkap
                </Link>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <PriceEstimator
                services={services.map((s) => ({
                  id: s.id,
                  name: s.name,
                  price: s.price,
                  unit: s.unit,
                  estimatedHours: s.estimatedHours,
                }))}
              />
            </SlideIn>
          </div>
        </section>
      )}

      {/* STATISTIK DENGAN COUNT UP */}
      <section className="border-y border-line bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <Stagger className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <StaggerItem>
              <p className="text-4xl sm:text-5xl font-black text-cyan-400">
                <CountUp value={years} />+
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-slate-300">
                Tahun Melayani
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-4xl sm:text-5xl font-black text-cyan-400">
                <CountUp value={doneCount} />+
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-slate-300">
                Pesanan Berhasil Diselesaikan
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-4xl sm:text-5xl font-black text-cyan-400">
                <CountUp value={customerCount} />+
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-slate-300">
                Pelanggan Terdaftar
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-4xl sm:text-5xl font-black text-cyan-400">100%</p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-slate-300">
                Jaminan Higienis & Wangi
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* TESTIMONI PELANGGAN */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Testimoni Nyata
          </span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-slate-950">
            Dipercaya Oleh Ribuan Keluarga & Profesional
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <SlideIn key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-soft hover:shadow-lift transition duration-300">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-line flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-bold grid place-items-center text-sm shadow-soft">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* CTA BANNER MEWAH */}
      <section className="px-5 pb-20">
        <SlideIn>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-8 sm:p-14 text-center text-white shadow-2xl">
            {/* Background glow circle */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-teal-500/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md mb-6">
                <Sparkles className="size-3.5" /> Siap Menikmati Pakaian Segar & Wangi?
              </span>
              <h2 className="text-3xl font-black sm:text-5xl tracking-tight leading-tight">
                Pesan Laundry Tanpa Ribet Bersama {s.businessName}
              </h2>
              <p className="mt-4 text-base text-slate-300">
                Jadwalkan penjemputan cucian Anda hari ini. Kami jemput, kami rawat dengan standar terbaik, dan kami antar kembali rapi ke depan pintu Anda.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/pesan"
                  className={buttonClass("light", "lg", "font-bold text-teal-900 shadow-lift px-8 py-4")}
                >
                  Pesan Antar-Jemput Sekarang
                </Link>
                {s.whatsapp && (
                  <a
                    href={`https://wa.me/${s.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
                  >
                    <Phone className="size-4" /> Chat WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </SlideIn>
      </section>
    </>
  );
}
