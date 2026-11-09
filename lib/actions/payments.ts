"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";
import { normalizePhone } from "@/lib/utils/phone";
import { deletePrivateUpload, savePrivateUpload } from "@/lib/utils/upload";

type R = { ok: true; message?: string } | { ok: false; error: string };

/**
 * Pelanggan mengunggah bukti transfer dari halaman Cek Status.
 */
export async function uploadPaymentProof(formData: FormData): Promise<R> {
  const invoiceNo = (formData.get("invoiceNo") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const file = formData.get("file") as File | null;

  if (!invoiceNo || !phone || !file || file.size === 0) {
    return { ok: false, error: "Data atau file bukti pembayaran tidak lengkap." };
  }

  const ip = await getClientIp();
  if (!(await rateLimit(`upload:${ip}`, 6, 600))) {
    return { ok: false, error: "Terlalu banyak percobaan unggah. Harap tunggu beberapa menit." };
  }

  const settings = await db.setting.findUnique({ where: { id: 1 } });
  if (!settings?.enableProofUpload) {
    return { ok: false, error: "Fitur upload bukti transfer sedang dinonaktifkan." };
  }

  const order = await db.order.findFirst({
    where: {
      invoiceNo: invoiceNo.toUpperCase(),
      deletedAt: null,
      customer: { phone: normalizePhone(phone) },
    },
    include: { payment: true },
  });

  if (!order || !order.payment) {
    return { ok: false, error: "Pesanan tidak ditemukan atau tidak memiliki tagihan." };
  }

  if (order.payment.status === "PAID") {
    return { ok: false, error: "Pesanan ini sudah lunas." };
  }

  let savedFile: { filename: string; mime: string };
  try {
    savedFile = await savePrivateUpload(file);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal mengunggah file." };
  }

  // Jika sebelumnya ada file lama, hapus
  if (order.payment.proofFile) {
    await deletePrivateUpload(order.payment.proofFile);
  }

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: order.payment!.id },
      data: {
        proofFile: savedFile.filename,
        status: "PENDING_VERIFICATION",
        rejectReason: null,
      },
    });

    await tx.paymentHistory.create({
      data: {
        paymentId: order.payment!.id,
        status: "PENDING_VERIFICATION",
        note: "Bukti transfer diunggah oleh pelanggan",
        proofFile: savedFile.filename,
      },
    });
  });

  revalidatePath("/cek-status");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Bukti transfer berhasil dikirim. Menunggu verifikasi admin." };
}

/**
 * Admin menyetujui pembayaran.
 * Status pembayaran berubah menjadi Lunas.
 * Verifikasi dicatat di tabel PaymentVerification (immutable).
 */
export async function approvePayment(paymentId: string, note?: string): Promise<R> {
  const admin = await requireAdmin();

  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });

  if (!payment) {
    return { ok: false, error: "Data pembayaran tidak ditemukan." };
  }
  if (payment.status === "PAID") {
    return { ok: true, message: "Pembayaran sudah lunas." };
  }

  const now = new Date();
  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: now,
        rejectReason: null,
      },
    });

    await tx.paymentVerification.create({
      data: {
        paymentId,
        adminId: admin.id,
        result: "APPROVED",
        note: note?.trim() || "Pembayaran diverifikasi dan disetujui",
      },
    });

    await tx.paymentHistory.create({
      data: {
        paymentId,
        status: "PAID",
        note: note?.trim() || "Disetujui admin",
      },
    });
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/cek-status");
  return { ok: true, message: "Pembayaran berhasil disetujui dan berstatus LUNAS." };
}

/**
 * Admin menolak pembayaran. Penolakan WAJIB disertai alasan.
 */
export async function rejectPayment(paymentId: string, reason: string): Promise<R> {
  const admin = await requireAdmin();

  const trimmedReason = reason?.trim();
  if (!trimmedReason) {
    return { ok: false, error: "Penolakan wajib disertai alasan." };
  }

  const payment = await db.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    return { ok: false, error: "Data pembayaran tidak ditemukan." };
  }

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "REJECTED",
        rejectReason: trimmedReason,
      },
    });

    await tx.paymentVerification.create({
      data: {
        paymentId,
        adminId: admin.id,
        result: "REJECTED",
        note: trimmedReason,
      },
    });

    await tx.paymentHistory.create({
      data: {
        paymentId,
        status: "REJECTED",
        note: `Ditolak admin: ${trimmedReason}`,
      },
    });
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/cek-status");
  return { ok: true, message: "Pembayaran telah ditolak." };
}
