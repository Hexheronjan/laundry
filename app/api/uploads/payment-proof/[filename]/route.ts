import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readPrivateUpload } from "@/lib/utils/upload";
import { normalizePhone } from "@/lib/utils/phone";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!filename) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 1. Cek sesi admin
  const session = await auth();
  let isAllowed = !!session?.user;

  // 2. Jika bukan admin, cek apakah pelanggan yang sah (via query invoiceNo & phone)
  if (!isAllowed) {
    const searchParams = request.nextUrl.searchParams;
    const invoiceNo = searchParams.get("invoiceNo");
    const phone = searchParams.get("phone");

    if (invoiceNo && phone) {
      const order = await db.order.findFirst({
        where: {
          invoiceNo: invoiceNo.toUpperCase(),
          deletedAt: null,
          customer: { phone: normalizePhone(phone) },
          payment: { proofFile: filename },
        },
      });
      if (order) {
        isAllowed = true;
      }
    }
  }

  if (!isAllowed) {
    return new NextResponse("Tidak diizinkan", { status: 403 });
  }

  const fileData = await readPrivateUpload(filename);
  if (!fileData) {
    return new NextResponse("File tidak ditemukan", { status: 404 });
  }

  return new NextResponse(new Uint8Array(fileData.buffer), {
    status: 200,
    headers: {
      "Content-Type": fileData.mime,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
