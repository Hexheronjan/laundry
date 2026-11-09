import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata: Metadata = { title: "Layanan" };

export default async function ServicesAdminPage() {
  let services: Awaited<ReturnType<typeof db.service.findMany<{ include: { _count: { select: { items: true } } } }>>> = [];
  try {
    services = await db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { items: true } } },
    });
  } catch {
    // Database offline
  }
  return (
    <>
      <PageHeader title="Layanan" description="Atur harga, satuan, dan estimasi pengerjaan. Perubahan langsung tampil di website." />
      <ServicesManager rows={services.map((s) => ({ id: s.id, name: s.name, description: s.description, price: s.price, unit: s.unit, estimatedHours: s.estimatedHours, isActive: s.isActive, used: s._count.items }))} />
    </>
  );
}
