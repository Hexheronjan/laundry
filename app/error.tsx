"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[60dvh] place-items-center px-5 text-center">
      <div>
        <h1 className="text-3xl font-extrabold">Terjadi kesalahan</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">Maaf, ada masalah saat memuat halaman ini. Silakan coba lagi.</p>
        <Button onClick={reset} size="lg" className="mt-8"><RotateCw className="size-4" strokeWidth={2} />Coba lagi</Button>
      </div>
    </main>
  );
}
