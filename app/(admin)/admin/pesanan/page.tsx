import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { DEFAULT_SERVICES } from "@/lib/settings";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { PageHeader, Pagination } from "@/components/admin/ui";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Pesanan" };
const PAGE_SIZE = 10;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const status = ORDER_STATUSES.find((s) => s === sp.status);
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.OrderWhereInput = {
    deletedAt: null,
    ...(status && { status }),
    ...(q && {
      OR: [
        { invoiceNo: { contains: q } },
        { customer: { name: { contains: q } } },
        { customer: { phone: { contains: q.replace(/\D/g, "") || "~" } } },
      ],
    }),
  };

  let total = 0;
  let rows: Parameters<typeof OrdersManager>[0]["rows"] = [];
  let serviceOpts = DEFAULT_SERVICES.map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    unit: s.unit,
    isActive: s.isActive,
  }));

  try {
    const [t, o, s] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          customer: true,
          items: true,
          payment: true,
          history: { orderBy: { createdAt: "asc" }, include: { user: { select: { name: true } } } },
        },
      }),
      db.service.findMany({
        where: { deletedAt: null },
        orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }],
      }),
    ]);
    if (s.length > 0) {
      serviceOpts = s.map((sv) => ({
        id: sv.id,
        name: sv.name,
        price: sv.price,
        unit: sv.unit,
        isActive: sv.isActive,
      }));
    }
    if (t > 0) {
      total = t;
      rows = o.map((ord) => ({
        id: ord.id,
        invoiceNo: ord.invoiceNo,
        status: ord.status,
        fulfillment: ord.fulfillment,
        address: ord.address,
        notes: ord.notes,
        total: ord.total,
        receivedAt: ord.receivedAt.toISOString(),
        estimatedDoneAt: ord.estimatedDoneAt.toISOString(),
        source: ord.source,
        customerName: ord.customer.name,
        phone: ord.customer.phone,
        paymentStatus: ord.payment?.status ?? null,
        items: ord.items.map((i) => ({
          serviceId: i.serviceId,
          name: i.serviceName,
          unit: i.unit,
          quantity: i.quantity.toString(),
          unitPrice: i.unitPrice,
          subtotal: i.subtotal,
        })),
        history: ord.history.map((h) => ({
          status: h.status,
          at: h.createdAt.toISOString(),
          by: h.user?.name ?? null,
        })),
      }));
    }
  } catch {
    // Database offline
  }

  if (rows.length === 0) {
    const filtered = DEMO_ORDERS.filter((o) => {
      if (status && o.status !== status) return false;
      if (q) {
        const ql = q.toLowerCase();
        return (
          o.invoiceNo.toLowerCase().includes(ql) ||
          o.customer.name.toLowerCase().includes(ql) ||
          o.customer.phone.includes(q)
        );
      }
      return true;
    });
    total = filtered.length;
    rows = filtered.map((o) => ({
      id: o.id,
      invoiceNo: o.invoiceNo,
      status: o.status,
      fulfillment: o.fulfillment,
      address: o.address,
      notes: o.notes,
      total: o.total,
      receivedAt: o.receivedAt.toISOString(),
      estimatedDoneAt: o.estimatedDoneAt.toISOString(),
      source: o.source,
      customerName: o.customer.name,
      phone: o.customer.phone,
      paymentStatus: o.payment.status,
      items: o.items.map((i) => ({
        serviceId: i.serviceId,
        name: i.serviceName,
        unit: i.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })),
      history: o.history.map((h) => ({
        status: h.status,
        at: h.createdAt.toISOString(),
        by: h.by,
      })),
    }));
  }

  const hrefFor = (p: number) =>
    `?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(p) })}`;

  return (
    <>
      <PageHeader title="Pesanan" description={`${total} pesanan terdaftar`} />
      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nota, nama, atau nomor WhatsApp"
          aria-label="Cari pesanan"
          className={`${inputClass} min-w-0 flex-1 basis-60`}
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          aria-label="Filter status"
          className={`${inputClass} w-auto`}
        >
          <option value="">Semua status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          <Search className="size-4" strokeWidth={2} />
          Cari
        </Button>
        {(q || status) && (
          <Link
            href="/admin/pesanan"
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-primary hover:underline"
          >
            Reset
          </Link>
        )}
      </form>
      <OrdersManager services={serviceOpts} rows={rows} />
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} hrefFor={hrefFor} />
    </>
  );
}
