"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shirt,
  ShoppingBag,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/public/Logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/pembayaran", label: "Pembayaran", icon: CreditCard },
  { href: "/admin/pelanggan", label: "Pelanggan", icon: Users },
  { href: "/admin/layanan", label: "Layanan", icon: Shirt },
  { href: "/admin/laporan", label: "Laporan", icon: FileText },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1.5">
      {nav.map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              onClick={onNavigate}
              title={collapsed ? n.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-bold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-soft shadow-teal-700/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                collapsed && "justify-center px-0"
              )}
            >
              <n.icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              {!collapsed && <span>{n.label}</span>}
              {collapsed && <span className="sr-only">{n.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminShell({
  children,
  name,
  businessName,
  logoUrl,
  newOrders,
  pendingPayments = 0,
  mustChangePassword,
}: {
  children: React.ReactNode;
  name: string;
  businessName: string;
  logoUrl: string | null;
  newOrders: number;
  pendingPayments?: number;
  mustChangePassword: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setDrawer(false);
  }

  return (
    <div className="min-h-dvh bg-slate-50/80">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-white p-3.5 transition-[width] duration-300 lg:flex shadow-soft",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div className={cn("mb-6 flex h-14 items-center border-b border-line pb-3", collapsed ? "justify-center" : "px-2")}>
          {collapsed ? (
            <Logo name="" logoUrl={logoUrl} className="[&>div]:hidden" />
          ) : (
            <Logo name={businessName} logoUrl={logoUrl} className="[&_span.text-xl]:text-lg" />
          )}
        </div>

        <nav aria-label="Menu Admin" className="flex-1">
          <NavList collapsed={collapsed} />
        </nav>

        <div className="mt-auto space-y-2 pt-4 border-t border-line">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Buka Website Publik" : undefined}
            className={cn(
              "flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition",
              collapsed && "justify-center px-0"
            )}
          >
            <ExternalLink className="size-4 shrink-0 text-teal-600" />
            {!collapsed && <span>Buka Website</span>}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Perluas sidebar" : "Lipat sidebar"}
            className="flex w-full min-h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-muted hover:bg-slate-100 transition"
          >
            {collapsed ? (
              <ChevronsRight className="size-4" strokeWidth={2} />
            ) : (
              <>
                <ChevronsLeft className="size-4" strokeWidth={2} />
                <span>Lipat Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {drawer && (
          <>
            <m.div
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawer(false)}
              aria-hidden
            />
            <m.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu Admin"
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white p-5 shadow-lift lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <Logo name={businessName} logoUrl={logoUrl} className="[&_span.text-xl]:text-base" />
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Tutup menu"
                  className="grid size-10 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </div>

              <NavList onNavigate={() => setDrawer(false)} />

              <div className="mt-auto pt-6 border-t border-line space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-slate-50 px-4 text-xs font-bold text-slate-800"
                >
                  <ExternalLink className="size-4 text-teal-600" /> Buka Website Publik
                </Link>
              </div>
            </m.aside>
          </>
        )}
      </AnimatePresence>

      {/* Konten Utama */}
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-soft">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Buka menu navigasi"
              className="grid size-11 place-items-center rounded-xl border border-line bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="size-5" strokeWidth={2} />
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-muted">Selamat Bekerja,</p>
              <p className="font-extrabold text-sm text-slate-900 leading-none">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={
                pendingPayments > 0
                  ? "/admin/pembayaran?status=PENDING_VERIFICATION"
                  : "/admin/pesanan?status=RECEIVED"
              }
              aria-label={`Notifikasi: ${newOrders + pendingPayments} item baru`}
              title={
                pendingPayments > 0
                  ? `${pendingPayments} pembayaran menunggu verifikasi`
                  : `${newOrders} pesanan baru`
              }
              className="relative grid size-11 place-items-center rounded-xl border border-line bg-white text-slate-700 hover:bg-slate-50 transition"
            >
              <Bell className="size-5" strokeWidth={2} />
              {newOrders + pendingPayments > 0 && (
                <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white shadow-soft">
                  {newOrders + pendingPayments > 99 ? "99+" : newOrders + pendingPayments}
                </span>
              )}
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Keluar dari akun admin"
                title="Keluar"
                className="grid size-11 place-items-center rounded-xl border border-line bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
              >
                <LogOut className="size-5" strokeWidth={2} />
              </button>
            </form>
          </div>
        </header>

        {mustChangePassword && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-900 sm:px-6 flex items-center justify-between">
            <span>
              Perhatian: Anda masih menggunakan password awal demo. Demi keamanan data usaha, segera perbarui password Anda.
            </span>
            <Link href="/admin/pengaturan#akun" className="font-bold underline ml-3 shrink-0">
              Ganti Password
            </Link>
          </div>
        )}

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
