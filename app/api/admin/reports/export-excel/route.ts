import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getReportData, parseDateRange } from "@/lib/reports";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDateTime } from "@/lib/utils/format";

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

  const workbook = new ExcelJS.Workbook();
  workbook.creator = s.businessName;
  workbook.created = new Date();

  // Sheet 1: Transaksi
  const sheet = workbook.addWorksheet("Laporan Transaksi");

  // Title
  sheet.addRow([s.businessName.toUpperCase()]);
  sheet.addRow(["LAPORAN TRANSAKSI LAUNDRY"]);
  sheet.addRow([`Periode: ${formatDateTime(start)} s/d ${formatDateTime(end)}`]);
  sheet.addRow([]);

  sheet.getRow(1).font = { size: 14, bold: true, color: { argb: "FF0F766E" } };
  sheet.getRow(2).font = { size: 12, bold: true };
  sheet.getRow(3).font = { italic: true, color: { argb: "FF64748B" } };

  // Headers
  const headerRow = sheet.addRow([
    "No",
    "No. Nota",
    "Tanggal Masuk",
    "Pelanggan",
    "No. WhatsApp",
    "Item Layanan",
    "Total Tagihan (Rp)",
    "Status Laundry",
    "Status Pembayaran",
  ]);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F766E" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  data.orders.forEach((o, idx) => {
    const itemsSummary = o.items.map((i) => `${i.serviceName} (${i.quantity} ${i.unit})`).join("; ");
    const r = sheet.addRow([
      idx + 1,
      o.invoiceNo,
      formatDateTime(o.receivedAt),
      o.customer.name,
      o.customer.phone,
      itemsSummary,
      o.total,
      ORDER_STATUS_LABEL[o.status],
      PAYMENT_STATUS_LABEL[o.payment?.status ?? "UNPAID"],
    ]);

    r.getCell(1).alignment = { horizontal: "center" };
    r.getCell(2).font = { bold: true };
    r.getCell(7).numFmt = "#,##0";
    r.getCell(7).alignment = { horizontal: "right" };
    r.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });
  });

  // Total summary row
  const totalRow = sheet.addRow([
    "TOTAL",
    "",
    "",
    "",
    "",
    `${data.totalOrders} Transaksi`,
    data.totalBilled,
    "",
    `Lunas: Rp ${data.paidRevenue.toLocaleString("id-ID")}`,
  ]);
  totalRow.font = { bold: true };
  totalRow.getCell(7).numFmt = "#,##0";
  totalRow.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
  });

  // Auto column widths
  sheet.columns.forEach((column) => {
    let max = 12;
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = String(cell.value ?? "").length;
      if (len > max) max = Math.min(len + 3, 40);
    });
    column.width = max;
  });

  // Sheet 2: Ringkasan Layanan & Status
  const summarySheet = workbook.addWorksheet("Rekapitulasi");
  summarySheet.addRow(["REKAPITULASI PENDAPATAN & STATUS"]);
  summarySheet.addRow([`Periode: ${formatDateTime(start)} - ${formatDateTime(end)}`]);
  summarySheet.addRow([]);

  summarySheet.addRow(["Indikator", "Nilai"]);
  summarySheet.addRow(["Total Transaksi", data.totalOrders]);
  summarySheet.addRow(["Total Tagihan Keseluruhan (Rp)", data.totalBilled]);
  summarySheet.addRow(["Total Pendapatan Terbayar Lunas (Rp)", data.paidRevenue]);
  summarySheet.addRow([]);

  summarySheet.addRow(["Rekap Status Laundry", "Jumlah Pesanan"]);
  Object.entries(data.statusCounts).forEach(([st, cnt]) => {
    summarySheet.addRow([ORDER_STATUS_LABEL[st as keyof typeof ORDER_STATUS_LABEL], cnt]);
  });
  summarySheet.addRow([]);

  summarySheet.addRow(["Rekapitulasi Layanan", "Satuan", "Total Jumlah", "Subtotal (Rp)"]);
  data.serviceSummary.forEach((sv) => {
    const sr = summarySheet.addRow([sv.name, sv.unit, sv.totalQty, sv.subtotal]);
    sr.getCell(4).numFmt = "#,##0";
  });

  summarySheet.columns.forEach((col) => {
    col.width = 28;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const dateTag = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Laporan-Laundry-${dateTag}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
