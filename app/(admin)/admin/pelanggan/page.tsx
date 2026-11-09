import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { DEMO_CUSTOMERS, DEMO_ORDERS } from "@/lib/demo-data";
import { PageHeader, Pagination } from "@/components/admin/ui";
import { CustomersManager } from "@/components/admin/CustomersManager";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";
import { normalizePhone } from "@/lib/utils/phone";

export const metadata: Metadata = { title: "Pelanggan" };
const PAGE_SIZE = 12;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page) || 1);
  const digits = q.replace(/\D/g, "");
  const where: Prisma.CustomerWhereInput = q
    ? {
        OR: [
          { name: { contains: q } },
          ...(digits
            ? [{ phone: { contains: normalizePhone(digits) } }, { phone: { contains: digits } }]
            : []),
        ],
      }
    : {};

  let total = 0;
  let rows: Parameters<typeof CustomersManager>[0]["rows"] = [];

  try {
    const [t, c] = await Promise.all([
      db.customer.count({ where }),
      db.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          _count: { select: { orders: { where: { deletedAt: null } } } },
          orders: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 20 },
        },
      }),
    ]);
    if (t > 0) {
      total = t;
      rows = c.map((cust) => ({
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        address: cust.address,
        orderCount: cust._count.orders,
        orders: cust.orders.map((o) => ({
          invoiceNo: o.invoiceNo,
          status: o.status,
          total: o.total,
          at: o.receivedAt.toISOString(),
        })),
      }));
    }
  } catch {
    // Database offline
  }

  if (rows.length === 0) {
    const filtered = DEMO_CUSTOMERS.filter((c) => {
      if (!q) return true;
      const ql = q.toLowerCase();
      return c.name.toLowerCase().includes(ql) || c.phone.includes(digits || q);
    });
    total = filtered.length;
    rows = filtered.map((c) => {
      const custOrders = DEMO_ORDERS.filter((o) => o.customer.id === c.id);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        address: c.address,
        orderCount: custOrders.length,
        orders: custOrders.map((o) => ({
          invoiceNo: o.invoiceNo,
          status: o.status,
          total: o.total,
          at: o.receivedAt.toISOString(),
        })),
      };
    });
  }

  return (
    <>
      <PageHeader title="Pelanggan" description={`${total} pelanggan terdaftar`} />
      <form className="mb-4 flex gap-2" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau nomor WhatsApp"
          aria-label="Cari pelanggan"
          className={`${inputClass} min-w-0 flex-1`}
        />
        <Button type="submit" variant="outline">
          <Search className="size-4" strokeWidth={2} />
          Cari
        </Button>
        {q && (
          <Link
            href="/admin/pelanggan"
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-primary hover:underline"
          >
            Reset
          </Link>
        )}
      </form>
      <CustomersManager rows={rows} />
      <Pagination
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        hrefFor={(p) => `?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`}
      />
    </>
  );
}
