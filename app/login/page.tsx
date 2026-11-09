import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Logo } from "@/components/public/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Masuk Admin & Staf", robots: { index: false } };

export default async function LoginPage() {
  if ((await auth())?.user) redirect("/admin");
  const s = await getSettings();

  return (
    <main className="relative grid min-h-dvh place-items-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 px-5 py-12 overflow-hidden">
      {/* Glow decorative circles */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 size-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 size-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <Logo name={s.businessName} logoUrl={s.logoUrl} />
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <ShieldCheck className="size-3.5" /> Portal Operasional Internal
          </div>
          <h1 className="mt-3 text-2xl font-black text-slate-900">Masuk ke Dashboard</h1>
          <p className="mt-1 text-xs text-muted">
            Khusus staf dan pengelola operasional laundry {s.businessName}.
          </p>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-100" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
