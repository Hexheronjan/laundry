import { cn } from "@/lib/utils/cn";

const tones = {
  yellow: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-800",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-slate-100 text-slate-700",
};

export function StatusBadge({ tone = "gray", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export const orderTone = (s: string) => (s === "DONE" ? "green" : s === "RECEIVED" ? "yellow" : "blue") as keyof typeof tones;
export const paymentTone = (s: string) => ({ UNPAID: "yellow", PENDING_VERIFICATION: "yellow", PAID: "green", REJECTED: "red" }[s] ?? "gray") as keyof typeof tones;
