/** Normalisasi nomor WhatsApp Indonesia: 08xx / +628xx / 628xx / 8xx → 628xx. */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (digits.startsWith("8")) digits = "62" + digits;
  return digits;
}

export function isValidPhone(input: string): boolean {
  const p = normalizePhone(input);
  return /^628\d{7,12}$/.test(p);
}

export function waLink(phone: string, text?: string): string {
  const n = normalizePhone(phone);
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Tampilan nomor telepon yang rapi: 6285151951806 → +62 851-5195-1806 */
export function formatPhoneDisplay(phone: string): string {
  const n = normalizePhone(phone);
  if (n.startsWith("62") && n.length >= 11) {
    const part1 = n.slice(2, 5);
    const part2 = n.slice(5, 9);
    const part3 = n.slice(9);
    return `+62 ${part1}-${part2}-${part3}`;
  }
  return phone;
}
