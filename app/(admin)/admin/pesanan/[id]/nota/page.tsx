import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { PrintReceipt } from "@/components/admin/PrintReceipt";

export const metadata: Metadata = { title: "Cetak Nota" };

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [s, order] = await Promise.all([
    getSettings(),
    db.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        customer: true,
        items: true,
        payment: true,
      },
    }),
  ]);

  if (!order) notFound();

  return (
    <PrintReceipt
      settings={{
        businessName: s.businessName,
        tagline: s.tagline,
        address: s.address,
        whatsapp: s.whatsapp,
      }}
      order={{
        id: order.id,
        invoiceNo: order.invoiceNo,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        customerAddress: order.address || order.customer.address,
        fulfillment: order.fulfillment,
        receivedAt: order.receivedAt.toISOString(),
        estimatedDoneAt: order.estimatedDoneAt.toISOString(),
        total: order.total,
        status: order.status,
        notes: order.notes,
        paymentStatus: order.payment?.status ?? "UNPAID",
        items: order.items.map((i) => ({
          serviceName: i.serviceName,
          unit: i.unit,
          unitPrice: i.unitPrice,
          quantity: i.quantity.toString(),
          subtotal: i.subtotal,
        })),
      }}
    />
  );
}
