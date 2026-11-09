import Image from "next/image";
import { Droplets, Sparkles, Shirt } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Gambar milik client bila ada; jika belum, placeholder bergradien elegan. */
export function PhotoOrPlaceholder({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("group relative overflow-hidden bg-slate-100", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-80" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative grid place-items-center overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-700 text-white shadow-soft",
        className
      )}
    >
      <div className="absolute -left-12 -top-12 size-48 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-16 -right-12 size-64 rounded-full bg-cyan-400/20 blur-2xl" />
      <Droplets className="size-20 text-white/30 animate-pulse" strokeWidth={1.25} aria-hidden />
      <Shirt className="absolute bottom-6 left-6 size-10 text-white/35" strokeWidth={1.5} aria-hidden />
      <Sparkles className="absolute right-8 top-8 size-8 text-amber-300/60" strokeWidth={1.5} aria-hidden />
    </div>
  );
}
