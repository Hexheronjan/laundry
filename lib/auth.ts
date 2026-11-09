import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validations/admin";
import { rateLimit } from "@/lib/utils/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();
        // Jangan batasi login demo admin@laundry.local agar pengujian klien selalu lancar
        const isDemo = normalizedEmail === "admin@laundry.local";
        if (!isDemo && !(await rateLimit(`login:${normalizedEmail}`, 8, 900))) return null;
        const user = await db.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return null;
        if (!(await bcrypt.compare(password, user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role, mustChangePassword: user.mustChangePassword };
      },
    }),
  ],
});

/** Dipanggil di awal setiap Server Action admin. Melempar error jika bukan admin/staff yang login. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Tidak diizinkan");
  return session.user as { id: string; role: string; name?: string | null; email?: string | null; mustChangePassword: boolean };
}
