import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@laundry.local").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "GantiPassword123!";

  await db.user.upsert({
    where: { email },
    update: { name: "Prajalinks Admin" },
    create: {
      name: "Prajalinks Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
      mustChangePassword: true,
    },
  });

  const day = { open: "07:30", close: "21:00", closed: false };
  const gallery = [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
  ];

  await db.setting.upsert({
    where: { id: 1 },
    update: {
      businessName: "Prajalinks",
      tagline: "Premium Eco Laundry & Wet Cleaning",
      heroTitle: "Cucian Lebih Bersih, Wangi Mewah, Selesai Tepat Waktu",
      description: "Solusi laundry modern kiloan & satuan dengan formula detergen eco-friendly ramah serat kain, anti-bakteri, setrika uap presisi, serta pemantauan status pesanan real-time.",
      heroImageUrl: "/images/hero.jpg",
      aboutText: "Prajalinks hadir sebagai standar baru perawatan pakaian modern. Kami memadukan mesin cuci teknologi terkini, air filtrasi higienis, detergen ramah lingkungan, dan pewangi premium berkarakter lembut tahan lama.\n\nSetiap helai pakaian dipilah berdasarkan jenis bahan dan warna, dicuci higienis satu mesin untuk satu pelanggan (tanpa dicampur), disetrika uap dengan suhu presisi, serta dikemas higienis anti-debu.\n\nDengan sistem online terintegrasi, pelanggan Prajalinks dapat memesan layanan antar-jemput kapan saja dan memantau status pengerjaan cucian langsung dari ponsel.",
      galleryUrls: gallery,
      address: "Jl. Boulevard Praja No. 88, Kawasan Niaga Utama",
      whatsapp: "6285151951806",
      email: "prajalinks@gmail.com",
      bankName: "BCA",
      bankAccountName: "Prajalinks Indonesia",
      bankAccountNumber: "8820918231",
      primaryColor: "#0D9488",
      accentColor: "#06B6D4",
      foundedYear: 2021,
      openingHours: {
        mon: day,
        tue: day,
        wed: day,
        thu: day,
        fri: day,
        sat: day,
        sun: { open: "08:30", close: "19:00", closed: false },
      },
    },
    create: {
      id: 1,
      businessName: "Prajalinks",
      tagline: "Premium Eco Laundry & Wet Cleaning",
      heroTitle: "Cucian Lebih Bersih, Wangi Mewah, Selesai Tepat Waktu",
      description: "Solusi laundry modern kiloan & satuan dengan formula detergen eco-friendly ramah serat kain, anti-bakteri, setrika uap presisi, serta pemantauan status pesanan real-time.",
      heroImageUrl: "/images/hero.jpg",
      aboutText: "Prajalinks hadir sebagai standar baru perawatan pakaian modern. Kami memadukan mesin cuci teknologi terkini, air filtrasi higienis, detergen ramah lingkungan, dan pewangi premium berkarakter lembut tahan lama.\n\nSetiap helai pakaian dipilah berdasarkan jenis bahan dan warna, dicuci higienis satu mesin untuk satu pelanggan (tanpa dicampur), disetrika uap dengan suhu presisi, serta dikemas higienis anti-debu.\n\nDengan sistem online terintegrasi, pelanggan Prajalinks dapat memesan layanan antar-jemput kapan saja dan memantau status pengerjaan cucian langsung dari ponsel.",
      galleryUrls: gallery,
      address: "Jl. Boulevard Praja No. 88, Kawasan Niaga Utama",
      whatsapp: "6285151951806",
      email: "prajalinks@gmail.com",
      bankName: "BCA",
      bankAccountName: "Prajalinks Indonesia",
      bankAccountNumber: "8820918231",
      primaryColor: "#0D9488",
      accentColor: "#06B6D4",
      foundedYear: 2021,
      openingHours: {
        mon: day,
        tue: day,
        wed: day,
        thu: day,
        fri: day,
        sat: day,
        sun: { open: "08:30", close: "19:00", closed: false },
      },
    },
  });

  // Hapus layanan lama jika belum ada transaksi agar bisa ditimpa dengan foto bagus
  const countItems = await db.orderItem.count();
  if (countItems === 0) {
    await db.service.deleteMany({});
    await db.service.createMany({
      data: [
        {
          name: "Cuci Kering Lipat",
          description: "Pakaian dicuci bersih higienis satu mesin per pelanggan, dikeringkan optimal, dan dilipat rapi dengan pewangi premium.",
          price: 8000,
          unit: "kg",
          estimatedHours: 24,
          imageUrl: "/images/kiloan.jpg",
          sortOrder: 1,
        },
        {
          name: "Cuci Setrika Uap (Reguler)",
          description: "Perawatan komplit pencucian anti-bakteri disusul setrika uap boiler presisi tanpa risiko gosong, dikemas plastik kedap udara.",
          price: 10000,
          unit: "kg",
          estimatedHours: 48,
          imageUrl: "/images/setrika.jpg",
          sortOrder: 2,
        },
        {
          name: "Express Kilat (6 Jam)",
          description: "Layanan prioritas untuk kebutuhan mendesak. Selesai bersih, harum, dan licin dalam waktu 6 jam siap pakai.",
          price: 18000,
          unit: "kg",
          estimatedHours: 6,
          imageUrl: "/images/express.jpg",
          sortOrder: 3,
        },
        {
          name: "Bed Cover & Quilt",
          description: "Pencucian deep-clean untuk serat tebal bed cover, menghilangkan tungau dan debu serat hingga lembut mengembang kembali.",
          price: 35000,
          unit: "pcs",
          estimatedHours: 48,
          imageUrl: "/images/bedcover.jpg",
          sortOrder: 4,
        },
        {
          name: "Setrika Uap Halus Satuan",
          description: "Khusus kemeja, celana formal, dress, batik, dan jas dengan pelicin uap khusus dan hanger gratis.",
          price: 12000,
          unit: "pcs",
          estimatedHours: 24,
          imageUrl: "/images/setrika.jpg",
          sortOrder: 5,
        },
        {
          name: "Sneakers & Bag Treatment",
          description: "Cuci basah manual khusus sepatu dan tas dengan pembersih pH seimbang yang aman untuk kanvas, kulit, dan suede.",
          price: 30000,
          unit: "pcs",
          estimatedHours: 72,
          imageUrl: "/images/sepatu.jpg",
          sortOrder: 6,
        },
      ],
    });
  }

  console.log("Database Prajalinks berhasil diperbarui dengan data premium!");
}

main().finally(() => db.$disconnect());
