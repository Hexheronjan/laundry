"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { Menu, X, ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/harga", label: "Daftar Harga" },
  { href: "/cek-status", label: "Cek Status" },
  { href: "/kontak", label: "Kontak" },
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
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "glass-nav border-b border-slate-200/80 shadow-soft py-3"
          : "bg-transparent border-b border-transparent py-4"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5" aria-label="Navigasi Utama">
        <Logo name={name} logoUrl={logoUrl} />

        <ul className="hidden items-center gap-1 xl:gap-1.5 lg:flex bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-soft">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200 inline-block",
                    active
                      ? "bg-primary text-white shadow-soft"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/pesan"
            className={buttonClass("primary", "md", "hidden sm:inline-flex shadow-glow whitespace-nowrap")}
          >
            <Sparkles className="size-4 text-cyan-200 animate-pulse" />
            Pesan Antar-Jemput
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-soft hover:bg-slate-50 lg:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={open}
          >
            <Menu className="size-6" strokeWidth={2} />
          </button>
        </div>
      </nav>

      {/* Drawer Menu Mobile */}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <m.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi"
              className="fixed right-0 top-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col bg-white p-6 shadow-lift lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                <Logo name={name} logoUrl={logoUrl} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                  aria-label="Tutup menu"
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </div>

              <ul className="flex flex-col gap-1.5">
                {links.map((l) => {
                  const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "flex min-h-12 items-center justify-between rounded-xl px-4 font-semibold text-base transition-colors",
                          active
                            ? "bg-primary-soft text-primary font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {l.label}
                        <ArrowRight className="size-4 opacity-40" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                <Link
                  href="/pesan"
                  className={buttonClass("primary", "lg", "w-full shadow-glow")}
                >
                  Pesan Sekarang
                </Link>
                <Link
                  href="/kontak"
                  className={buttonClass("outline", "md", "w-full")}
                >
                  <PhoneCall className="size-4" /> Hubungi Kami
                </Link>
              </div>
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
