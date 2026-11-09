import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Logo({
  name,
  logoUrl,
  className,
  light,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
  light?: boolean;
}) {
  const isPraja = name.toLowerCase().includes("prajalinks");

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 font-extrabold tracking-tight transition duration-200",
        light ? "text-white" : "text-slate-900",
        className
      )}
      aria-label={`${name || "Prajalinks"} — Beranda`}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={name}
          width={40}
          height={40}
          className="size-10 rounded-xl object-contain shadow-soft"
        />
      ) : (
        <span className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 text-white shadow-soft shadow-teal-700/20 group-hover:scale-105 transition-transform duration-300">
          <span className="font-sans font-black text-xl leading-none tracking-tighter">P</span>
          <Sparkles className="absolute -top-1 -right-1 size-3.5 text-amber-300 animate-pulse" strokeWidth={2.5} />
        </span>
      )}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight leading-none">
          {isPraja ? (
            <>
              Praja<span className="text-primary font-black">links</span>
            </>
          ) : (
            name || "Prajalinks"
          )}
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-75 mt-0.5">
          Laundry & Care
        </span>
      </div>
    </Link>
  );
}
