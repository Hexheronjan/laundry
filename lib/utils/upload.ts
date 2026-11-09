import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type AllowedMime = "image/jpeg" | "image/png" | "image/webp";

function getUploadDir() {
  return path.join(process.cwd(), "storage", "private-uploads");
}

/**
 * Validasi magic bytes (isi file sebenarnya) bukan hanya ekstensi.
 */
export function detectMimeType(buffer: Buffer): { mime: AllowedMime; ext: "jpg" | "png" | "webp" } | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }

  // WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }

  return null;
}

/**
 * Simpan file bukti transfer dengan nama UUID acak ke folder privat.
 */
export async function savePrivateUpload(file: File): Promise<{ filename: string; mime: AllowedMime }> {
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran file maksimal 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const detected = detectMimeType(buffer);
  if (!detected) {
    throw new Error("Format file tidak didukung. Harap unggah gambar format JPG, PNG, atau WEBP.");
  }

  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${detected.ext}`;
  const targetPath = path.join(process.cwd(), "storage", "private-uploads", filename);

  await fs.writeFile(targetPath, buffer);
  return { filename, mime: detected.mime };
}

/**
 * Membaca file bukti transfer dari folder privat.
 */
export async function readPrivateUpload(filename: string): Promise<{ buffer: Buffer; mime: AllowedMime } | null> {
  const safeFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "storage", "private-uploads", safeFilename);

  try {
    const buffer = await fs.readFile(filePath);
    const detected = detectMimeType(buffer);
    if (!detected) return null;
    return { buffer, mime: detected.mime };
  } catch {
    return null;
  }
}

/**
 * Hapus file lama jika pelanggan mengunggah ulang.
 */
export async function deletePrivateUpload(filename: string): Promise<void> {
  const safeFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "storage", "private-uploads", safeFilename);
  try {
    await fs.unlink(filePath);
  } catch {
    // Abaikan jika file tidak ditemukan
  }
}
