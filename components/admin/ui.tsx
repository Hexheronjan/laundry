import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
          {title}
        </h1>
        {description && <p className="mt-1 text-xs sm:text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-soft">
      <span className="grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary shadow-soft">
        <Inbox className="size-8" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="mt-4 font-bold text-base text-slate-900">{title}</p>
      {text && <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Pagination dari server: link berbasis query string */
export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (p: number) => string;
}) {
  if (totalPages <= 1) return null;
  const cls =
    "grid size-11 place-items-center rounded-xl border border-line bg-white text-slate-700 hover:bg-slate-50 shadow-soft transition";

  return (
    <nav aria-label="Navigasi Halaman" className="mt-6 flex items-center justify-between text-xs sm:text-sm">
      <span className="text-muted font-medium">
        Halaman <b className="text-slate-900">{page}</b> dari <b className="text-slate-900">{totalPages}</b>
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={cls} aria-label="Halaman sebelumnya">
            <ChevronLeft className="size-4" strokeWidth={2} />
          </Link>
        ) : (
          <span className={cn(cls, "opacity-40 cursor-not-allowed")}>
            <ChevronLeft className="size-4" strokeWidth={2} />
          </span>
        )}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className={cls} aria-label="Halaman berikutnya">
            <ChevronRight className="size-4" strokeWidth={2} />
          </Link>
        ) : (
          <span className={cn(cls, "opacity-40 cursor-not-allowed")}>
            <ChevronRight className="size-4" strokeWidth={2} />
          </span>
        )}
      </div>
    </nav>
  );
}

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-3xl border border-line bg-white p-6 shadow-soft", className)} {...p} />
);
