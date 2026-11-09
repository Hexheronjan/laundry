import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "ghost" | "danger" | "light";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-soft shadow-teal-700/25 btn-shine",
  outline: "border border-slate-200 bg-white/95 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-soft",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-soft",
  light: "bg-white text-teal-800 hover:bg-slate-50 shadow-lift btn-shine font-bold",
};
const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-xs rounded-xl",
  md: "min-h-11 px-5 text-sm rounded-xl",
  lg: "min-h-12 px-7 text-base rounded-2xl",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra?: string) =>
  cn(
    "group inline-flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer",
    variants[variant],
    sizes[size],
    extra,
  );

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} disabled={disabled || loading} aria-busy={loading} className={buttonClass(variant, size, className)} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />}
      {children}
    </button>
  );
});
