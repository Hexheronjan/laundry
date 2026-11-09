import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { HoursList } from "./HoursList";
import { LazyMap } from "./LazyMap";
import type { AppSettings } from "@/lib/settings";
import { waLink, formatPhoneDisplay } from "@/lib/utils/phone";

export function Footer({ s }: { s: AppSettings }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Kolom 1: Profil */}
        <div className="space-y-4">
          <Logo name={s.businessName} logoUrl={s.logoUrl} light />
          <p className="text-xs text-slate-400 leading-relaxed">
            {s.description || "Standar baru perawatan pakaian modern higienis 1 mesin 1 pelanggan dengan detergen eco-friendly dan setrika uap presisi."}
          </p>
          <div className="pt-2 space-y-2 text-xs">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />
              <span>{s.address}</span>
            </p>
            {s.whatsapp && (
              <p>
                <a
                  href={waLink(s.whatsapp)}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
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
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
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
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white tracking-wide uppercase">
            <Clock className="size-4 text-teal-400" />
            Jam Operasional
          </h2>
          <HoursList hours={s.openingHours} className="text-xs text-slate-400 divide-y divide-slate-800/60" />
        </div>

        {/* Kolom 3: Navigasi Cepat */}
        <nav aria-label="Tautan navigasi footer">
          <h2 className="mb-4 text-sm font-bold text-white tracking-wide uppercase">
            Tautan Cepat
          </h2>
          <ul className="space-y-2.5 text-xs">
            {[
              ["/layanan", "Layanan Laundry"],
              ["/harga", "Daftar Tarif & Biaya"],
              ["/pesan", "Pesan Antar-Jemput"],
              ["/cek-status", "Cek Status Pesanan"],
              ["/tentang", "Tentang Prajalinks"],
              ["/kontak", "Lokasi Outlet & Bantuan"],
              ["/login", "Portal Staf & Admin"],
            ].map(([h, l]) => (
              <li key={h}>
                <Link
                  href={h}
                  className="inline-flex min-h-6 items-center text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 4: Lokasi Outlet Peta */}
        <div>
          <h2 className="mb-4 text-sm font-bold text-white tracking-wide uppercase">
            Lokasi Outlet
          </h2>
          {s.mapsEmbedUrl ? (
            <div className="h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
              <LazyMap src={s.mapsEmbedUrl} title={`Lokasi ${s.businessName}`} />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Kunjungi Outlet Kami</p>
              <p className="mt-1 leading-relaxed">{s.address}</p>
              <div className="mt-3 flex items-center gap-1.5 text-teal-400 font-bold">
                <ShieldCheck className="size-4" /> Parkir Luas & Aman
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} <b className="text-slate-300">{s.businessName} Laundry</b>. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
