import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-5 text-center">
      <div>
        <p className="text-8xl font-extrabold tracking-tighter text-primary">404</p>
        <h1 className="mt-4 text-3xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya salah.</p>
        <Link href="/" className={buttonClass("primary", "lg", "mt-8")}>Kembali ke beranda</Link>
      </div>
    </main>
  );
}
