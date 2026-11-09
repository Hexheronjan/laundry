import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Prisma, PaymentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { PageHeader, Pagination } from "@/components/admin/ui";
import { PaymentsManager } from "@/components/admin/PaymentsManager";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export const metadata: Metadata = { title: "Manajemen Pembayaran" };
const PAGE_SIZE = 10;

const VALID_STATUSES: PaymentStatus[] = ["PENDING_VERIFICATION", "UNPAID", "PAID", "REJECTED"];

export default async function PaymentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const statusParam = sp.status as PaymentStatus | undefined;
  const status = VALID_STATUSES.includes(statusParam as PaymentStatus) ? statusParam : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.PaymentWhereInput = {
    order: {
      deletedAt: null,
      ...(q && {
        OR: [
          { invoiceNo: { contains: q } },
          { customer: { name: { contains: q } } },
          { customer: { phone: { contains: q.replace(/\D/g, "") || "~" } } },
        ],
      }),
    },
    ...(status && { status }),
  };

  let total = 0;
  let pendingCount = 0;
  let rows: Parameters<typeof PaymentsManager>[0]["rows"] = [];

  try {
    const [t, pc, p] = await Promise.all([
      db.payment.count({ where }),
      db.payment.count({ where: { status: "PENDING_VERIFICATION", order: { deletedAt: null } } }),
      db.payment.findMany({
        where,
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          order: { include: { customer: true } },
          verifications: {
            orderBy: { createdAt: "desc" },
            include: { admin: { select: { name: true } } },
          },
        },
      }),
    ]);
    if (t > 0) {
      total = t;
      pendingCount = pc;
      rows = p.map((pay) => ({
        id: pay.id,
        orderId: pay.orderId,
        invoiceNo: pay.order.invoiceNo,
        customerName: pay.order.customer.name,
        customerPhone: pay.order.customer.phone,
        amount: pay.amount,
        status: pay.status,
        proofFile: pay.proofFile,
        rejectReason: pay.rejectReason,
        paidAt: pay.paidAt?.toISOString() ?? null,
        createdAt: pay.createdAt.toISOString(),
        verifications: pay.verifications.map((v) => ({
          id: v.id,
          adminName: v.admin.name,
          result: v.result,
          note: v.note,
          createdAt: v.createdAt.toISOString(),
        })),
      }));
    }
  } catch {
    // Database offline
  }

  if (rows.length === 0) {
    const filtered = DEMO_ORDERS.filter((o) => {
      if (status && o.payment.status !== status) return false;
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
    pendingCount = DEMO_ORDERS.filter((o) => o.payment.status === "PENDING_VERIFICATION").length;
    rows = filtered.map((o) => ({
      id: o.payment.id,
      orderId: o.id,
      invoiceNo: o.invoiceNo,
      customerName: o.customer.name,
      customerPhone: o.customer.phone,
      amount: o.payment.amount,
      status: o.payment.status,
      proofFile: o.payment.proofFile,
      rejectReason: o.payment.rejectReason,
      paidAt: o.payment.paidAt?.toISOString() ?? null,
      createdAt: o.payment.createdAt.toISOString(),
      verifications: [],
    }));
  }

  const hrefFor = (p: number) =>
    `?${new URLSearchParams({
      ...(q && { q }),
      ...(status && { status }),
      page: String(p),
    })}`;

  return (
    <>
      <PageHeader
        title="Manajemen Pembayaran"
        description={`${total} pembayaran terdaftar · ${pendingCount} menunggu verifikasi`}
      />

      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nota, pelanggan, atau WhatsApp"
          aria-label="Cari pembayaran"
          className={`${inputClass} min-w-0 flex-1 basis-60`}
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          aria-label="Filter status pembayaran"
          className={`${inputClass} w-auto`}
        >
          <option value="">Semua Status</option>
          <option value="PENDING_VERIFICATION">Menunggu Verifikasi</option>
          <option value="UNPAID">Menunggu Pembayaran</option>
          <option value="PAID">Lunas</option>
          <option value="REJECTED">Ditolak</option>
        </select>
        <Button type="submit" variant="outline">
          <Search className="size-4" strokeWidth={2} /> Cari
        </Button>
        {(q || status) && (
          <Link
            href="/admin/pembayaran"
            className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-primary hover:underline"
          >
            Reset
          </Link>
        )}
      </form>

      <PaymentsManager rows={rows} />

      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} hrefFor={hrefFor} />
    </>
  );
}
