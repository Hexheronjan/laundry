import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { PrintReceipt } from "@/components/admin/PrintReceipt";

export const metadata: Metadata = { title: "Cetak Nota" };

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await getSettings();

  let orderData: Parameters<typeof PrintReceipt>[0]["order"] | null = null;

  try {
    const order = await db.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        customer: true,
        items: true,
        payment: true,
      },
    });
    if (order) {
      orderData = {
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
      };
    }
  } catch {
    // Database offline
  }

  if (!orderData) {
    const demo = DEMO_ORDERS.find((o) => o.id === id) ?? DEMO_ORDERS[0];
    if (!demo) notFound();
    orderData = {
      id: demo.id,
      invoiceNo: demo.invoiceNo,
      customerName: demo.customer.name,
      customerPhone: demo.customer.phone,
      customerAddress: demo.address || demo.customer.address,
      fulfillment: demo.fulfillment,
      receivedAt: demo.receivedAt.toISOString(),
      estimatedDoneAt: demo.estimatedDoneAt.toISOString(),
      total: demo.total,
      status: demo.status,
      notes: demo.notes,
      paymentStatus: demo.payment.status,
      items: demo.items.map((i) => ({
        serviceName: i.serviceName,
        unit: i.unit,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
    };
  }

  return (
    <PrintReceipt
      settings={{
        businessName: s.businessName,
        tagline: s.tagline,
        address: s.address,
        whatsapp: s.whatsapp,
      }}
      order={orderData}
    />
  );
}
