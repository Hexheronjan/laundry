import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Droplets,
  ExternalLink,
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
import { LazyMap } from "@/components/public/LazyMap";
import { buttonClass } from "@/components/ui/Button";
import { formatDuration, rupiah } from "@/lib/utils/format";
import { formatPhoneDisplay, waLink } from "@/lib/utils/phone";

export const revalidate = 60;

const FALLBACK_SERVICES = [
  {
    id: "fallback-1",
    name: "Cuci Kering Lipat",
    description:
      "Pakaian dicuci bersih higienis satu mesin per pelanggan, dikeringkan optimal, dan dilipat rapi dengan pewangi premium.",
    price: 8000,
    unit: "kg",
    estimatedHours: 24,
    imageUrl: "/images/kiloan.jpg",
  },
  {
    id: "fallback-2",
    name: "Cuci Setrika Uap (Reguler)",
    description:
      "Perawatan komplit pencucian anti-bakteri disusul setrika uap boiler presisi tanpa risiko gosong, dikemas plastik kedap udara.",
    price: 10000,
    unit: "kg",
    estimatedHours: 48,
    imageUrl: "/images/setrika.jpg",
  },
  {
    id: "fallback-3",
    name: "Express Kilat (6 Jam)",
    description:
      "Layanan prioritas untuk kebutuhan mendesak. Selesai bersih, harum, dan licin dalam waktu 6 jam siap pakai.",
    price: 18000,
    unit: "kg",
    estimatedHours: 6,
    imageUrl: "/images/express.jpg",
  },
  {
    id: "fallback-4",
    name: "Bed Cover & Quilt",
    description:
      "Pencucian deep-clean untuk serat tebal bed cover, menghilangkan tungau dan debu serat hingga lembut mengembang kembali.",
    price: 35000,
    unit: "pcs",
    estimatedHours: 48,
    imageUrl: "/images/bedcover.jpg",
  },
  {
    id: "fallback-5",
    name: "Setrika Uap Halus Satuan",
    description:
      "Khusus kemeja, celana formal, dress, batik, dan jas dengan pelicin uap khusus dan hanger gratis.",
    price: 12000,
    unit: "pcs",
    estimatedHours: 24,
    imageUrl: "/images/setrika.jpg",
  },
  {
    id: "fallback-6",
    name: "Sneakers & Bag Treatment",
    description:
      "Cuci basah manual khusus sepatu dan tas dengan pembersih pH seimbang yang aman untuk kanvas, kulit, dan suede.",
    price: 30000,
    unit: "pcs",
    estimatedHours: 72,
    imageUrl: "/images/sepatu.jpg",
  },
];

export default async function HomePage() {
  const [s, dbServices] = await Promise.all([getSettings(), getActiveServices()]);
  const services = dbServices.length > 0 ? dbServices : FALLBACK_SERVICES;

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

  const years = s.foundedYear ? Math.max(1, new Date().getFullYear() - s.foundedYear) : 5;

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
      title: "Detergen Eco & Parfum Mewah",
      text: "Formula pembersih ramah lingkungan berbahan aktif biodegradable dengan keharuman lembut tahan hingga 14 hari.",
    },
    {
      no: "04",
      icon: Zap,
      title: "Live Status Tracking Online",
      text: "Pantau setiap tahap cucian Anda secara transparan dari penerimaan, pencucian, setrika hingga siap antar langsung via HP.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Pesan Online / WA",
      desc: "Pilih jenis layanan dan tentukan jadwal penjemputan kurir atau antar mandiri ke outlet.",
      icon: Sparkles,
    },
    {
      step: "02",
      title: "Jemput Tepat Waktu",
      desc: "Kurir resmi Prajalinks menjemput cucian kotor dan menimbang dengan timbangan digital.",
      icon: Truck,
    },
    {
      step: "03",
      title: "Proses Higienis",
      desc: "Diproses 1 mesin 1 pelanggan dengan air terfiltrasi, detergen eco, dan setrika uap boiler.",
      icon: RefreshCw,
    },
    {
      step: "04",
      title: "Diantar Bersih & Rapi",
      desc: "Pakaian dikemas kedap udara, wangi mewah tahan lama, dan diantar kembali tepat waktu.",
      icon: CheckCircle2,
    },
  ];

  const testimonials = [
    {
      name: "Sabrina Anggraini",
      role: "Pelanggan Setia Kiloan",
      rating: 5,
      comment:
        "Prajalinks benar-benar game changer! Pakaian kerja saya disetrika uap rapi banget, wanginya mewah dan tahan lama di lemari. Kurirnya juga ramah dan tepat waktu.",
    },
    {
      name: "Rian Hidayat",
      role: "Layanan Bed Cover & Jas",
      rating: 5,
      comment:
        "Bed cover king size saya kembali mengembang lembut dan bebas dari tungau. Paling suka karena ada fitur tracking status pesanan di website, jadi tahu kapan siap diambil.",
    },
    {
      name: "Dr. Amanda P.",
      role: "Pelanggan Express Kilat",
      rating: 5,
      comment:
        "Layanan express 6 jam Prajalinks penyelamat saat ada tugas mendadak. Baju dinas putih bersih sempurna tanpa noda. Sangat saya rekomendasikan untuk yang sibuk!",
    },
  ];

  const mapUrl =
    s.mapsEmbedUrl && s.mapsEmbedUrl.trim().length > 0
      ? s.mapsEmbedUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(s.address || "Jakarta")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-surface pt-6 pb-16 md:pt-12 md:pb-24">
        {/* Glow backdrop circles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/4 size-[420px] rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute top-32 right-1/4 size-[380px] rounded-full bg-cyan-400/15 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <EnterIn direction="left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-white/90 px-4 py-1.5 text-xs font-extrabold text-teal-800 shadow-soft">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-teal-600" />
                </span>
                <span>{s.tagline || "Laundry Kiloan & Satuan Premium"}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-[54px] leading-[1.12]">
                Cucian Lebih Bersih,{" "}
                <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Wangi Mewah
                </span>
                , Selesai Tepat Waktu.
              </h1>

              {/* Description */}
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {s.description}
              </p>

              {/* Feature Chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "✓ 1 Mesin 1 Pelanggan",
                  "✓ Setrika Uap Boiler",
                  "✓ Detergen Eco-Friendly",
                  "✓ Antar-Jemput Kurir",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-lg border border-teal-200/80 bg-teal-50/70 px-3 py-1 text-xs font-bold text-teal-900"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </EnterIn>

            {/* CTA Buttons */}
            <EnterIn direction="up" delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/pesan"
                  className={buttonClass(
                    "primary",
                    "lg",
                    "shadow-glow text-sm sm:text-base px-6 sm:px-8 py-3.5"
                  )}
                >
                  <Sparkles className="size-5 text-cyan-200 animate-pulse" />
                  Pesan Antar-Jemput
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/cek-status"
                  className={buttonClass(
                    "outline",
                    "lg",
                    "text-sm sm:text-base bg-white shadow-soft hover:bg-slate-50"
                  )}
                >
                  <Search className="size-4 text-teal-600" />
                  Cek Status Pesanan
                </Link>

                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-teal-600/30 bg-teal-50/80 px-4 text-xs sm:text-sm font-extrabold text-teal-900 hover:bg-teal-100 transition"
                >
                  <ShieldCheck className="size-4 text-teal-600" />
                  Demo Login Staf →
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
                  <span className="font-extrabold text-slate-900">4.9/5</span>
                  <span className="text-slate-500">(1.200+ Pelanggan Puas)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <BadgeCheck className="size-4 text-teal-600" />
                  <span className="font-bold">Garansi Cuci Ulang 100%</span>
                </div>
              </div>
            </EnterIn>
          </div>

          {/* Hero Image with Floating Cards */}
          <EnterIn direction="right" delay={0.1}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/4.3] overflow-hidden rounded-[32px] border-4 border-white bg-slate-100 shadow-2xl ring-1 ring-slate-900/10">
                <Image
                  src={s.heroImageUrl || "/images/hero.jpg"}
                  alt={`Tempat usaha ${s.businessName}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating Badge Top-Right */}
              <div className="absolute -top-3 right-2 sm:-top-4 sm:-right-4 rounded-2xl border border-white bg-white/95 px-4 py-2.5 shadow-lift backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-700 font-black text-sm">
                    ⚡️
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Express 6 Jam</p>
                    <p className="text-[10px] font-medium text-slate-500">Siap Pakai Hari Ini</p>
                  </div>
                </div>
              </div>

              {/* Floating Real-time Status Card Bottom-Left */}
              <div className="absolute -bottom-5 left-2 sm:-left-5">
                <OpenStatusCard hours={s.openingHours} />
              </div>
            </div>
          </EnterIn>
        </div>
      </section>

      {/* 2. STATISTIK SINGKAT (COUNT UP) */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-10 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center divide-x-0 md:divide-x divide-white/10">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400">
                <CountUp value={years} />+ Thn
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-300">
                Pengalaman Operasional
              </p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400">
                <CountUp value={doneCount} />+
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-300">
                Pesanan Selesai Tepat Waktu
              </p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400">
                <CountUp value={customerCount} />+
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-300">
                Pelanggan Setia Terdaftar
              </p>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">100%</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-300">
                1 Mesin 1 Pelanggan (Higienis)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATALOG LAYANAN UNGGULAN (Tampil jelas di Mobile & Desktop) */}
      <section id="layanan" className="py-16 md:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-teal-800">
                <Sparkles className="size-3.5 text-teal-600" /> Katalog Layanan Kami
              </span>
              <h2 className="mt-2.5 text-2xl font-black sm:text-4xl text-slate-950">
                Pilihan Layanan Laundry &amp; Wet Cleaning
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                Pilih layanan sesuai kebutuhan pakaian Anda. Semua paket sudah termasuk detergen
                ramah lingkungan, parfum premium, dan kemasan bersih.
              </p>
            </div>
            <Link
              href="/layanan"
              className={buttonClass("outline", "md", "bg-white")}
            >
              Lihat Detail Semua Layanan <ArrowRight className="size-4" />
            </Link>
          </div>

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((sv) => (
              <StaggerItem key={sv.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-teal-500/40">
                  {/* Foto Layanan */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {sv.imageUrl ? (
                      <Image
                        src={sv.imageUrl}
                        alt={sv.name}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-teal-800 text-white">
                        <Droplets className="size-12 opacity-50" />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                      {sv.unit === "kg" ? "Kiloan" : "Satuan"}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-slate-900 shadow-soft">
                      <Clock className="size-3.5 inline mr-1 text-teal-600 -mt-0.5" />
                      {formatDuration(sv.estimatedHours)}
                    </span>
                  </div>

                  {/* Deskripsi & Harga */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-extrabold text-slate-950 group-hover:text-primary transition-colors">
                      {sv.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
                      {sv.description || "Layanan laundry profesional dengan standar higienis tinggi."}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Tarif Layanan
                        </span>
                        <p className="text-xl font-black text-primary">
                          {rupiah(sv.price)}{" "}
                          <span className="text-xs font-semibold text-slate-500">/ {sv.unit}</span>
                        </p>
                      </div>
                      <Link
                        href={`/pesan?layanan=${sv.id}`}
                        className={buttonClass("primary", "sm", "rounded-xl px-4 py-2.5")}
                      >
                        Pesan <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 4. KEUNGGULAN UTAMA PRAJALINKS */}
      <section className="bg-white border-y border-line py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <SlideIn direction="left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">
                Standar Hotel Bintang 5
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl leading-tight">
                Mengapa Pelanggan Memilih {s.businessName}?
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Kami memahami pakaian Anda adalah investasi dan representasi diri. Karena itu, kami
                menerapkan protokol pencucian higienis terpisah dengan teknologi uap modern yang
                menjaga serat kain tetap awet seperti baru.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/tentang" className={buttonClass("primary", "md")}>
                  Profil &amp; Galeri Outlet <ArrowRight className="size-4" />
                </Link>
                <Link href="/harga" className={buttonClass("outline", "md")}>
                  Tabel Harga Lengkap
                </Link>
              </div>
            </SlideIn>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <SlideIn key={b.title} delay={i * 0.06}>
                  <div className="h-full rounded-3xl border border-slate-200/90 bg-surface p-6 shadow-soft transition-all duration-300 hover:bg-white hover:shadow-lift hover:border-teal-500/30">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-600/20">
                        <b.icon className="size-6" strokeWidth={2} />
                      </span>
                      <span className="font-mono text-2xl font-black text-slate-200">{b.no}</span>
                    </div>
                    <h3 className="mt-5 text-base font-extrabold text-slate-950">{b.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {b.text}
                    </p>
                  </div>
                </SlideIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-STEP PROCESS (CARA KERJA) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Alur Layanan Praktis
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl text-slate-950">
              Cucian Beres Dalam 4 Langkah Mudah
            </h2>
            <p className="mt-3 text-slate-600">
              Tanpa perlu antre dan keluar rumah, serahkan cucian Anda kepada tim profesional{" "}
              {s.businessName}.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <SlideIn key={st.step} delay={i * 0.08}>
                <div className="relative h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-700">
                      <st.icon className="size-6" strokeWidth={2} />
                    </div>
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                      Langkah {st.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-extrabold text-slate-950">{st.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. KALKULATOR ESTIMASI BIAYA */}
      <section className="border-y border-line bg-teal-950/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SlideIn direction="left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Simulasi Tarif
              </span>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                Hitung Perkiraan Biaya Cucian Anda
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Kami mengutamakan transparansi harga tanpa biaya tersembunyi. Gunakan kalkulator
                interaktif ini untuk mengestimasi tagihan sebelum memesan.
              </p>

              <div className="mt-7 space-y-3.5">
                {[
                  "Timbangan digital akurat dan transparan",
                  "Gratis plastik kemasan anti-debu & hanger satuan",
                  "Notifikasi WhatsApp & cek status real-time",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-slate-800"
                  >
                    <CheckCircle2 className="size-5 text-teal-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/harga" className={buttonClass("outline", "md", "bg-white")}>
                  Lihat Tabel Daftar Harga Lengkap <ArrowRight className="size-4" />
                </Link>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <PriceEstimator
                services={services.map((sv) => ({
                  id: sv.id,
                  name: sv.name,
                  price: sv.price,
                  unit: sv.unit,
                  estimatedHours: sv.estimatedHours,
                }))}
              />
            </SlideIn>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONI PELANGGAN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Ulasan Pelanggan
          </span>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl text-slate-950">
            Dipercaya Oleh Keluarga &amp; Profesional
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <SlideIn key={t.name} delay={i * 0.08}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-soft hover:shadow-lift transition duration-300">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-line flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-extrabold grid place-items-center text-sm shadow-soft">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* 8. LOKASI OUTLET & GOOGLE MAPS PREVIEW */}
      <section className="border-t border-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Lokasi &amp; Kontak
              </span>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Kunjungi Outlet {s.businessName}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Datang langsung ke outlet kami atau hubungi kurir antar-jemput kami melalui
                WhatsApp.
              </p>

              <div className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="font-extrabold text-slate-900">Alamat Outlet</p>
                    <p className="text-slate-600">{s.address}</p>
                  </div>
                </div>
                {s.whatsapp && (
                  <div className="flex items-start gap-3 border-t border-line pt-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-teal-600" />
                    <div>
                      <p className="font-extrabold text-slate-900">WhatsApp Layanan Pelanggan</p>
                      <p className="font-mono font-bold text-teal-700">
                        {formatPhoneDisplay(s.whatsapp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/kontak" className={buttonClass("primary", "md")}>
                  Detail Kontak &amp; Jam Buka <ArrowRight className="size-4" />
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${s.businessName} ${s.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("outline", "md")}
                >
                  Buka di Google Maps <ExternalLink className="size-4" />
                </a>
              </div>
            </div>

            <div className="h-80 sm:h-96 rounded-3xl overflow-hidden border border-line bg-slate-100 p-2 shadow-soft">
              <LazyMap src={mapUrl} title={`Peta lokasi ${s.businessName}`} />
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER MEWAH */}
      <section className="px-4 sm:px-6 py-16">
        <SlideIn>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-teal-900 to-slate-950 p-8 sm:p-14 text-center text-white shadow-2xl">
            {/* Background glow circle */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-teal-500/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold text-cyan-300 backdrop-blur-md mb-6">
                <Sparkles className="size-3.5" /> Siap Menikmati Pakaian Segar &amp; Wangi?
              </span>
              <h2 className="text-3xl font-black sm:text-5xl tracking-tight leading-tight text-white">
                Pesan Laundry Tanpa Ribet Bersama {s.businessName}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                Jadwalkan penjemputan cucian Anda hari ini. Kami jemput, kami rawat dengan standar
                terbaik, dan kami antar kembali rapi ke depan pintu Anda.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/pesan"
                  className={buttonClass(
                    "light",
                    "lg",
                    "font-extrabold text-teal-950 shadow-lift px-8 py-4"
                  )}
                >
                  Pesan Antar-Jemput Sekarang
                </Link>
                {s.whatsapp && (
                  <a
                    href={waLink(
                      s.whatsapp,
                      `Halo ${s.businessName}, saya ingin pesan layanan laundry.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
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
