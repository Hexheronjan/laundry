import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getReportData, parseDateRange } from "@/lib/reports";
import { formatDateTime } from "@/lib/utils/format";
import { ReportPdfDocument } from "@/components/admin/ReportPdfDocument";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Tidak diizinkan", { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const preset = searchParams.get("preset") ?? undefined;
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  const { start, end } = parseDateRange(preset, from, to);
  const [s, data] = await Promise.all([getSettings(), getReportData(start, end)]);

  const element = React.createElement(ReportPdfDocument, {
    businessName: s.businessName,
    startDate: formatDateTime(start),
    endDate: formatDateTime(end),
    totalOrders: data.totalOrders,
    paidRevenue: data.paidRevenue,
    totalBilled: data.totalBilled,
    orders: data.orders.map((o) => ({
      invoiceNo: o.invoiceNo,
      customerName: o.customer.name,
      receivedAt: o.receivedAt.toISOString(),
      status: o.status,
      paymentStatus: o.payment?.status ?? "UNPAID",
      total: o.total,
    })),
  });

  const buffer = await renderToBuffer(element as never);
  const dateTag = new Date().toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Laporan-Laundry-${dateTag}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
