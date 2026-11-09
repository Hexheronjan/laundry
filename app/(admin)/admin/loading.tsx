export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat">
      <div className="skeleton h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      <div className="skeleton h-72 rounded-2xl" />
    </div>
  );
}
