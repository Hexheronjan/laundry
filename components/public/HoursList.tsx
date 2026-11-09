import { DAYS, type OpeningHours } from "@/lib/utils/format";

export function HoursList({ hours, className }: { hours: OpeningHours; className?: string }) {
  return (
    <dl className={className}>
      {DAYS.map((d) => {
        const h = hours[d.key];
        return (
          <div key={d.key} className="flex justify-between gap-4 py-1 text-sm">
            <dt>{d.label}</dt>
            <dd className="tabular-nums">{!h || h.closed ? "Tutup" : `${h.open} – ${h.close}`}</dd>
          </div>
        );
      })}
    </dl>
  );
}
