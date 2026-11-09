import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

export const inputClass =
  "w-full min-h-11 rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:opacity-70 aria-[invalid=true]:border-red-500";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...p} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(inputClass, "py-3 min-h-24", className)} {...p} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, ...p }, ref) {
  return <select ref={ref} className={cn(inputClass, className)} {...p} />;
});

/** Label + pesan error di bawah field. Anak harus menerima id dari render-prop. */
export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (p: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const descId = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": descId })}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
