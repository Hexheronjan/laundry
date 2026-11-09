import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ShieldCheck, ExternalLink } from "lucide-react";
import { Logo } from "./Logo";
import { HoursList } from "./HoursList";
import { LazyMap } from "./LazyMap";
import type { AppSettings } from "@/lib/settings";
import { waLink, formatPhoneDisplay } from "@/lib/utils/phone";

export function Footer({ s }: { s: AppSettings }) {
  const mapUrl =
    s.mapsEmbedUrl && s.mapsEmbedUrl.trim().length > 0
      ? s.mapsEmbedUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(s.address || "Jakarta")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pb-20 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Kolom 1: Profil */}
        <div className="space-y-4">
          <Logo name={s.businessName} logoUrl={s.logoUrl} light />
          <p className="text-xs text-slate-400 leading-relaxed">
            {s.description ||
              "Standar baru perawatan pakaian modern higienis 1 mesin 1 pelanggan dengan detergen eco-friendly dan setrika uap presisi."}
          </p>
          <div className="pt-2 space-y-2.5 text-xs">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />
              <span className="text-slate-300">{s.address}</span>
            </p>
            {s.whatsapp && (
              <p>
                <a
                  href={waLink(s.whatsapp)}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="size-4 shrink-0 text-teal-400" />
                  <span>WhatsApp: {formatPhoneDisplay(s.whatsapp)}</span>
                </a>
              </p>
            )}
            {s.email && (
              <p>
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="size-4 shrink-0 text-teal-400" />
                  <span>{s.email}</span>
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Kolom 2: Jam Operasional */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white tracking-wide uppercase">
            <Clock className="size-4 text-teal-400" />
            Jam Operasional
          </h2>
          <HoursList
            hours={s.openingHours}
            className="text-xs text-slate-300 divide-y divide-slate-800/70"
          />
        </div>

        {/* Kolom 3: Navigasi Cepat */}
        <nav aria-label="Tautan navigasi footer">
          <h2 className="mb-4 text-sm font-extrabold text-white tracking-wide uppercase">
            Navigasi & Layanan
          </h2>
          <ul className="space-y-2.5 text-xs">
            {[
              ["/", "Beranda Utama"],
              ["/layanan", "Katalog Layanan Laundry"],
              ["/harga", "Daftar Tarif & Biaya"],
              ["/pesan", "Pesan Antar-Jemput Online"],
              ["/cek-status", "Cek Status & Nota Pesanan"],
              ["/tentang", "Tentang Prajalinks"],
              ["/kontak", "Lokasi Outlet & Kontak"],
            ].map(([h, l]) => (
              <li key={h}>
                <Link
                  href={h}
                  className="inline-flex min-h-6 items-center text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 text-xs font-extrabold text-teal-300 hover:bg-teal-500/20 transition"
            >
              <ShieldCheck className="size-4 text-teal-400" />
              Login Staf / Portal Admin →
            </Link>
          </div>
        </nav>

        {/* Kolom 4: Lokasi Outlet Peta */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
              Peta Lokasi
            </h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${s.businessName} ${s.address}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 hover:underline"
            >
              Buka Maps <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <LazyMap src={mapUrl} title={`Lokasi ${s.businessName}`} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()}{" "}
          <b className="text-white">{s.businessName} Laundry &amp; Care</b>. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
