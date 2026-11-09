"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import {
  Menu,
  X,
  ArrowRight,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Home,
  Layers,
  Tag,
  Search,
  MapPin,
  Info,
} from "lucide-react";
import { Logo } from "./Logo";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tentang", label: "Tentang Kami", icon: Info },
  { href: "/layanan", label: "Layanan", icon: Layers },
  { href: "/harga", label: "Daftar Harga", icon: Tag },
  { href: "/cek-status", label: "Cek Status", icon: Search },
  { href: "/kontak", label: "Kontak", icon: MapPin },
];

export function Navbar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "glass-nav border-b border-slate-200/80 shadow-soft py-2.5"
            : "bg-white/60 backdrop-blur-md border-b border-slate-200/40 py-3.5"
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"
          aria-label="Navigasi Utama"
        >
          <Logo name={name} logoUrl={logoUrl} />

          {/* Menu Navigasi Desktop — 1 baris rapi dengan whitespace-nowrap */}
          <ul className="hidden items-center gap-0.5 xl:gap-1 lg:flex bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-all duration-200 inline-block",
                      active
                        ? "bg-primary text-white shadow-soft"
                        : "text-slate-600 hover:text-slate-950 hover:bg-white/80"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Tombol Aksi Kanan (Login Staf & Pesan Online) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-teal-600/25 bg-teal-50/90 px-3 py-2 text-xs font-extrabold text-teal-800 shadow-2xs transition hover:bg-teal-100 hover:border-teal-600/40"
              title="Masuk Otomatis Dashboard Staf & Admin"
            >
              <ShieldCheck className="size-4 text-teal-600 shrink-0" />
              <span>Login Staf</span>
            </Link>

            <Link
              href="/pesan"
              className={buttonClass(
                "primary",
                "sm",
                "hidden sm:inline-flex shadow-glow whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm rounded-xl"
              )}
            >
              <Sparkles className="size-4 text-cyan-200 animate-pulse shrink-0" />
              <span>Pesan Online</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs hover:bg-slate-50 lg:hidden cursor-pointer"
              aria-label="Buka menu navigasi"
              aria-expanded={open}
            >
              <Menu className="size-5" strokeWidth={2.2} />
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer Menu Mobile — berada di luar <header> agar position:fixed tidak terpotong backdrop-filter */}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <m.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi Mobile"
              className="fixed right-0 top-0 z-50 flex h-dvh w-[88%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <Logo name={name} logoUrl={logoUrl} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </div>

              <p className="mb-2 px-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Menu Utama
              </p>
              <ul className="flex flex-col gap-1">
                {links.map((l) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  const Icon = l.icon;
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center justify-between rounded-xl px-3.5 font-bold text-sm transition-colors",
                          active
                            ? "bg-primary text-white shadow-soft"
                            : "text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={cn("size-4", active ? "text-white" : "text-teal-600")} />
                          {l.label}
                        </span>
                        <ArrowRight className="size-4 opacity-50" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto space-y-2.5 pt-6 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border-2 border-teal-500/30 bg-teal-50/90 px-4 py-3 text-sm font-extrabold text-teal-900 hover:bg-teal-100 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="size-5 text-teal-600" />
                    <span>Login Staf / Demo Admin</span>
                  </span>
                  <ArrowRight className="size-4 text-teal-700" />
                </Link>

                <Link
                  href="/pesan"
                  onClick={() => setOpen(false)}
                  className={buttonClass("primary", "lg", "w-full shadow-glow text-sm")}
                >
                  <Sparkles className="size-4 text-cyan-200" />
                  Pesan Antar-Jemput Sekarang
                </Link>

                <Link
                  href="/kontak"
                  onClick={() => setOpen(false)}
                  className={buttonClass("outline", "md", "w-full text-sm")}
                >
                  <PhoneCall className="size-4 text-teal-600" /> Lokasi & Kontak Kami
                </Link>
              </div>
            </m.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar Khusus Mobile agar Layanan, Harga, Pesan & Login Staf selalu terlihat 1-Klik */}
      <nav
        aria-label="Navigasi Cepat Mobile"
        className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-lg px-2 py-1.5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-center gap-1">
          {[
            { href: "/", label: "Beranda", icon: Home },
            { href: "/layanan", label: "Layanan", icon: Layers },
            { href: "/pesan", label: "Pesan", icon: Sparkles, primary: true },
            { href: "/harga", label: "Harga", icon: Tag },
            { href: "/login", label: "Login Staf", icon: ShieldCheck },
          ].map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            if (item.primary) {
              return (
                <li key={item.href} className="flex justify-center">
                  <Link
                    href={item.href}
                    className="flex flex-col items-center justify-center -mt-5 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 px-3.5 py-2 text-white shadow-lg shadow-teal-600/30 ring-4 ring-white"
                  >
                    <Icon className="size-5" />
                    <span className="mt-0.5 text-[10px] font-extrabold">{item.label}</span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl py-1 text-[10px] font-bold transition-colors",
                    active ? "text-primary font-extrabold" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("size-4 mb-0.5", active && "text-primary")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
