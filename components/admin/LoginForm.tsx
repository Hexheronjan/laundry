"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { loginSchema } from "@/lib/validations/admin";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Sparkles, Zap, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import type { z } from "zod";

const DEMO_EMAIL = "admin@laundry.local";
const DEMO_PASSWORD = "GantiPassword123!";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(v: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    const r = await loginAction({ ...v, callbackUrl });
    if (r?.error) {
      setError(r.error);
      setLoading(false);
    }
  }

  // 1-Klik Masuk Otomatis untuk demo klien / staf
  async function handleAutoLogin() {
    setError(null);
    setAutoLoading(true);
    setValue("email", DEMO_EMAIL, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });

    const r = await loginAction({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      callbackUrl,
    });

    if (r?.error) {
      setError(r.error);
      setAutoLoading(false);
    }
  }

  // Isi form tanpa langsung submit
  function handleFillCredentials() {
    setValue("email", DEMO_EMAIL, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
  }

  return (
    <div className="space-y-6">
      {/* Kartu Akses Cepat Demo Klien / Staf */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-teal-500/40 bg-gradient-to-br from-teal-50 via-emerald-50/60 to-cyan-50/50 p-5 shadow-lg shadow-teal-900/5">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-800">
            <Sparkles className="size-4 text-teal-600 animate-pulse" />
            Akses Cepat Demo Klien
          </div>
          <span className="rounded-full bg-teal-600/10 px-2.5 py-0.5 text-[11px] font-bold text-teal-700">
            1-Klik Langsung Masuk
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-700">
          Ingin langsung mengecek operasional, daftar pesanan, kasir, dan laporan?
          Klik tombol di bawah untuk <strong>masuk otomatis</strong> tanpa harus mengetik password:
        </p>

        <button
          type="button"
          onClick={handleAutoLogin}
          disabled={loading || autoLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-700/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {autoLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Membuka Dashboard Demo...
            </>
          ) : (
            <>
              <Zap className="size-4 text-amber-300 fill-amber-300" />
              <span>Masuk Otomatis Demo Staf & Admin</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-teal-200/60 pt-2.5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-teal-600" />
            Akun: <code className="font-mono font-semibold text-slate-800">{DEMO_EMAIL}</code>
          </span>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="font-semibold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
          >
            Isi ke form ↓
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Atau Masuk Manual
        </span>
      </div>

      {/* Form Login Manual */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          {(p) => (
            <Input
              {...p}
              type="email"
              autoComplete="username"
              placeholder="nama@laundry.local"
              {...register("email")}
            />
          )}
        </Field>

        <Field label="Password" error={errors.password?.message}>
          {(p) => (
            <Input
              {...p}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              {...register("password")}
            />
          )}
        </Field>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={autoLoading}
          className="w-full"
          size="lg"
        >
          Masuk Manual
        </Button>
      </form>
    </div>
  );
}
