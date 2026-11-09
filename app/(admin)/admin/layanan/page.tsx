import type { Metadata } from "next";
import { db } from "@/lib/db";
import { DEFAULT_SERVICES } from "@/lib/settings";
import { PageHeader } from "@/components/admin/ui";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata: Metadata = { title: "Layanan" };

export default async function ServicesAdminPage() {
  let rows: Parameters<typeof ServicesManager>[0]["rows"] = [];
  try {
    const services = await db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { items: true } } },
    });
    if (services.length > 0) {
      rows = services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        unit: s.unit,
        estimatedHours: s.estimatedHours,
        isActive: s.isActive,
        used: s._count.items,
      }));
    }
  } catch {
    // Database offline
  }

  if (rows.length === 0) {
    rows = DEFAULT_SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price,
      unit: s.unit,
      estimatedHours: s.estimatedHours,
      isActive: s.isActive,
      used: 2,
    }));
  }

  return (
    <>
      <PageHeader
        title="Layanan"
        description="Atur harga, satuan, dan estimasi pengerjaan. Perubahan langsung tampil di website."
      />
      <ServicesManager rows={rows} />
    </>
  );
}
