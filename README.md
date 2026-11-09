# Prajalinks Laundry — Sistem Website & Dashboard Usaha Laundry Modern

Website profesional kelas premium untuk usaha laundry **Prajalinks** (dan siap dijadikan produk multi-client untuk berbagai pengusaha laundry). Sistem mencakup website publik yang memukau untuk pelanggan dan dashboard admin lengkap untuk mengelola seluruh operasional laundry.

---

## ✨ Identitas Brand & Pembaruan Visual (Prajalinks)

- **Nama Usaha**: **Prajalinks** (Prajalinks Laundry & Care)
- **Tagline**: *Premium Eco Laundry & Wet Cleaning*
- **Judul Utama**: *Cucian Lebih Bersih, Wangi Mewah, Selesai Tepat Waktu*
- **Palet Warna**: Luminous Emerald/Teal (`#0D9488`), Aksen Cyan Bercahaya (`#06B6D4`), Slate Gelap Mewah (`#0F172A`), dan Permukaan Kaca Bersih (`#F8FAFC`).
- **Fotografi Asli**: Koleksi foto resolusi tinggi estetik untuk interior outlet, mesin cuci modern, pakaian terlipat rapi, setrika uap, bed cover, sepatu, dan galeri tempat usaha di `/public/images/`.
- **Kalkulator Estimasi Biaya Interaktif**: Pelanggan dapat menggeser perkiraan berat pakaian secara langsung di beranda untuk melihat simulasi biaya seketika.
- **Alur 4 Langkah Modern**: Edukasi pelanggan dari pemesanan, penjemputan, pencucian higienis 1 mesin 1 pelanggan, hingga pengantaran.

### 1. Website Publik (Customer-Facing)
- **Beranda Interaktif**:
  - Navbar sticky responsif (transparan saat di atas, solid saat di-scroll) dengan menu mobile drawer.
  - Hero section layout 2-kolom dengan teks beranimasi dari kiri, gambar dari kanan, dan CTA bertahap.
  - Kartu status buka/tutup dinamis yang menghitung jam operasional nyata secara real-time (zona waktu Asia/Jakarta).
  - Keunggulan layanan dengan ikon bergradien halus.
  - Ringkasan layanan & daftar harga utama.
  - Statistik usaha dengan angka animasi *Count-Up*.
  - Tombol floating WhatsApp tanpa menutupi konten di mobile.
  - Footer lengkap dengan tautan cepat, jam operasional, dan Google Maps lazy-loaded.
- **Tentang Kami**: Profil usaha dan galeri foto tempat laundry dengan modal *Lightbox* zoom-in.
- **Layanan**: Daftar layanan selang-seling (gambar kiri - teks kanan bergantian) dengan estimasi pengerjaan.
- **Daftar Harga**: Tab filter dengan indikator pill beranimasi halus, tabel di desktop dan kartu di mobile.
- **Pemesanan Online**: Formulir 3 langkah (Data Pelanggan, Pilih Layanan, Konfirmasi) dengan progress bar animasi, ringkasan harga real-time, validasi inline Zod, dan nota instan serta tautan WhatsApp.
- **Cek Status Pesanan**: Verifikasi keamanan nomor nota + nomor WhatsApp pelanggan, stepper progres horizontal/vertikal beranimasi, dan fitur unggah bukti transfer langsung jika belum lunas.
- **Kontak**: Alamat, jam operasional per hari, tautan WhatsApp, dan Google Maps embed lazy-loaded.

### 2. Dashboard Admin & Operasional
- **Ringkasan Dashboard**: Kartu statistik (Total Pesanan, Masuk, Diproses, Selesai, Pendapatan Lunas) dengan persentase perubahan dibanding periode sebelumnya, grafik area interaktif Recharts (harian, mingguan, bulanan), dan tabel transaksi terbaru.
- **Manajemen Pesanan**:
  - Nomor nota dibuat unik dan otomatis di server (`LDR-{YYYY}{MM}{DD}-{SEQ:4}`).
  - Estimasi pengerjaan dihitung otomatis dari durasi layanan.
  - Penghapusan aman menggunakan *soft delete* agar data historis tetap utuh.
  - Panel detail geser dari kanan di desktop atau bottom sheet di mobile.
- **Alur Status Laundry**:
  - Stepper interaktif 6 tahap: *Pesanan diterima → Sedang dicuci → Sedang disetrika → Sedang dikemas → Siap diambil → Selesai*.
  - Riwayat perubahan status tercatat rapi (siapa, kapan, status apa).
- **Manajemen Pelanggan**: Pencarian nama/telepon, normalisasi nomor WhatsApp otomatis (`08xx` & `628xx` disatukan), dan riwayat pesanan per pelanggan.
- **Manajemen Layanan**: Tambah/edit harga, satuan (kg/pcs), estimasi pengerjaan; layanan yang pernah dipakai diproteksi agar riwayat pesanan tidak rusak.
- **Manajemen Pembayaran (Transfer Bank Manual)**:
  - Pelanggan mengunggah bukti transfer dari halaman Cek Status.
  - Validasi keamanan *magic bytes* (JPEG, PNG, WEBP) maks 5 MB disimpan di storage privat luar folder `public` dengan UUID acak.
  - Preview bukti transfer dapat diperbesar oleh admin.
  - Persetujuan (Status berubah menjadi Lunas) atau Penolakan (wajib menyertakan alasan penolakan).
  - Riwayat verifikasi disimpan di tabel terpisah dan dilindungi database trigger agar bersifat *append-only* (tidak dapat diubah/dihapus).
- **Cetak Nota Kasir**:
  - Format kertas dapat dipilih: Thermal 58 mm, Thermal 80 mm, atau A5/A4.
  - Mendukung `@media print` sehingga sidebar dan navigasi otomatis disembunyikan saat mencetak.
- **Laporan & Export**:
  - Filter rentang tanggal fleksibel (Preset Hari Ini, Minggu Ini, Bulan Ini, atau tanggal khusus).
  - Rekapitulasi pesanan per status dan per jenis layanan.
  - **Export ke Excel (.xlsx)** menggunakan ExcelJS dengan styling profesional.
  - **Export ke PDF** menggunakan `@react-pdf/renderer`.
- **Pengaturan Usaha (Multi-Client Ready)**:
  - Ubah nama usaha, logo, favicon, foto hero, teks profil, kontak, rekening bank, jam operasional, warna brand utama & aksen tanpa menyentuh kode program.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database & ORM**: MySQL + Prisma ORM
- **Autentikasi**: Auth.js / NextAuth v5 dengan Credentials Provider & bcrypt hashing
- **Animasi**: Motion (Framer Motion) dengan `LazyMotion` & `domAnimation`
- **Formulir & Validasi**: React Hook Form + Zod
- **Ikon**: Lucide React
- **Grafik**: Recharts (dynamic client import)
- **Ekspor Dokumen**: ExcelJS (Excel) & `@react-pdf/renderer` (PDF)
- **Notifikasi**: Sonner Toast

---

## 📦 Struktur Folder

```text
├── app/
│   ├── (public)/                 # Halaman publik (beranda, tentang, layanan, harga, pesan, cek-status, kontak)
│   ├── (admin)/admin/            # Dashboard admin (dashboard, pesanan, pembayaran, pelanggan, layanan, laporan, pengaturan)
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Endpoint autentikasi Auth.js
│   │   ├── admin/reports/        # Endpoint export Excel (.xlsx) & PDF
│   │   └── uploads/payment-proof/# Endpoint aman pengunduhan bukti transfer privat
│   ├── login/                    # Halaman login admin
│   ├── layout.tsx                # Root layout & injection tema CSS variable
│   ├── not-found.tsx             # Halaman 404 kustom
│   ├── error.tsx                 # Halaman error boundary
│   ├── sitemap.ts                # Generator sitemap.xml otomatis
│   └── robots.ts                 # Generator robots.txt
├── components/
│   ├── admin/                    # Komponen dashboard, tabel, modal, formulir, preview nota
│   ├── motion/                   # Komponen animasi reusable (SlideIn, CountUp, MotionProvider)
│   ├── public/                   # Komponen publik (Navbar, Footer, Gallery, Lightbox, BookingForm, TrackForm)
│   └── ui/                       # Komponen antarmuka dasar (Button, Field, Input, StatusBadge, Stepper)
├── lib/
│   ├── actions/                  # Server Actions (auth, orders, payments, services, customers, settings)
│   ├── utils/                    # Utilitas format rupiah, telepon, invoice, rate-limit, upload magic-bytes
│   ├── auth.ts & auth.config.ts  # Konfigurasi Auth.js & role guard
│   ├── db.ts                     # Prisma Client singleton
│   ├── orders.ts                 # Logika transaksi pembuatan pesanan & kalkulasi server
│   ├── reports.ts                # Logika kalkulasi laporan & rekapitulasi
│   ├── settings.ts               # Provider pengaturan usaha
│   └── validations/              # Skema Zod
├── prisma/
│   ├── schema.prisma             # Skema database MySQL
│   ├── seed.ts                   # Seed data awal (akun admin, pengaturan, contoh layanan)
│   └── migrations/               # Riwayat migrasi SQL & database triggers
├── storage/
│   └── private-uploads/          # Folder penyimpanan bukti transfer privat (di luar public)
└── proxy.ts                      # Proxy guard rute admin (Next.js 16)
```

---

## ⚙️ Persyaratan Sistem

- **Node.js**: v20.x atau v22+ (rekomendasi LTS)
- **MySQL**: v8.0+ atau MariaDB 10.5+
- **NPM** atau **PNPM**

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Clone & Pasang Dependensi
```bash
git clone <url-repository>
cd laundry
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan nilainya:
```env
# Koneksi Database MySQL
DATABASE_URL="mysql://root:password@localhost:3306/laundry"

# Kunci Rahasia Auth.js (buat dengan: npx auth secret)
AUTH_SECRET="masukkan-rahasia-acak-di-sini"
AUTH_TRUST_HOST=true

# URL publik website
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Folder penyimpanan bukti pembayaran
UPLOAD_DIR="./storage/private-uploads"

# Akun admin awal (seed)
SEED_ADMIN_EMAIL="admin@laundry.local"
SEED_ADMIN_PASSWORD="GantiPassword123!"
```

### 3. Jalankan Migrasi Database & Seed Data Demo
Pastikan server database MySQL Anda sudah aktif dan database `laundry` sudah dibuat:
```sql
CREATE DATABASE laundry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Jalankan migrasi Prisma dan seed data awal:
```bash
npm run db:migrate
npm run db:seed
```

> **Akun Admin Default**:
> - Email: `admin@laundry.local`
> - Password: `GantiPassword123!`
> *(Admin akan diminta mengganti password setelah login pertama).*

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000) untuk website publik dan [http://localhost:3000/login](http://localhost:3000/login) untuk dashboard admin.

---

## 🎨 Panduan Menyesuaikan untuk Klien Baru (White-Label)

Anda dapat menyesuaikan seluruh identitas usaha laundry untuk klien baru **langsung dari Dashboard Admin** tanpa mengubah baris kode:

1. **Masuk ke Admin**: Buka `/login` dan login sebagai admin.
2. **Buka Menu Pengaturan (`/admin/pengaturan`)**:
   - **Nama Usaha & Tagline**: Ubah nama laundry, tagline badge, dan judul hero.
   - **Warna Brand**: Pilih warna utama (*Primary*) dan aksen (*Accent*). Sistem akan otomatis memperbarui CSS Variable `--primary` dan `--accent` di seluruh halaman publik dan dashboard!
   - **Kontak & Lokasi**: Masukkan alamat fisik, nomor WhatsApp, email, dan link embed Google Maps.
   - **Jam Operasional**: Atur jam buka/tutup atau hari libur untuk setiap hari (Senin–Minggu).
   - **Rekening Bank**: Masukkan nama bank, nomor rekening, dan atas nama pemilik untuk pembayaran transfer manual.
   - **Format Nomor Nota**: Sesuaikan format nota, misalnya `LDR-{YYYY}{MM}{DD}-{SEQ:4}`.
   - **Logo & Gambar**: Taruh file gambar di folder `public/brand/` lalu masukkan path-nya (contoh: `/brand/logo.png`, `/brand/hero.jpg`).
3. **Menu Layanan (`/admin/layanan`)**:
   - Tambah layanan kiloan, satuan, dry cleaning, atau cuci kilat lengkap dengan harga dan estimasi jam pengerjaan.

---

## 🔒 Keamanan & Perlindungan Data

1. **Validasi Bukti Pembayaran**: Sistem memeriksa isi file (*magic bytes*) untuk memastikan gambar benar-benar berupa JPG, PNG, atau WEBP, bukan file berbahaya yang hanya berganti ekstensi.
2. **Penyimpanan Privat**: File bukti transfer disimpan di luar direktori `public` (`./storage/private-uploads/`) dan hanya dapat diakses melalui rute terautentikasi `/api/uploads/payment-proof/[filename]`.
3. **Database Trigger Append-Only**: Tabel verifikasi pembayaran (`PaymentVerification`) dilindungi trigger MySQL level database sehingga tidak dapat diubah (*update*) maupun dihapus (*delete*).
4. **Kalkulasi Harga Server-Side**: Harga transaksi dan total tagihan selalu dihitung ulang dari database saat pembuatan maupun pembaruan pesanan di server.
5. **Rate Limiting**: Diterapkan pada pengecekan status, pencarian, pengunggahan file, dan login untuk mencegah penyalahgunaan brute force.

---

## 🌐 Panduan Deployment Produksi (VPS / Cloud Server)

Disarankan menggunakan VPS (Ubuntu/Debian) dengan Node.js dan MySQL terpasang, agar penyimpanan bukti transfer lokal bersifat persisten:

1. **Build Aplikasi**:
   ```bash
   npm run build
   ```
2. **Menjalankan dengan Process Manager (PM2)**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "laundry-app" -- start
   pm2 save
   pm2 startup
   ```
3. **Konfigurasi Reverse Proxy Nginx**:
   ```nginx
   server {
       server_name laundryklien.com;

       client_max_body_size 10M;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. Pasang sertifikat SSL dengan Let's Encrypt: `certbot --nginx -d laundryklien.com`.
