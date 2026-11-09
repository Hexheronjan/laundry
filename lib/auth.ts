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
        const isDemoAccount =
          normalizedEmail === "admin@laundry.local" && password === "GantiPassword123!";

        try {
          if (!isDemoAccount) {
            const allowed = await rateLimit(`login:${normalizedEmail}`, 8, 900);
            if (!allowed) return null;
          }

          const user = await db.user.findUnique({ where: { email: normalizedEmail } });
          if (user) {
            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) return null;
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              mustChangePassword: user.mustChangePassword,
            };
          }
        } catch {
          // Database tidak terjangkau (misalnya pada demo serverless Vercel tanpa DB)
        }

        // Fallback untuk akun Demo Staf / Admin agar bisa selalu masuk di lingkungan demo
        if (isDemoAccount) {
          return {
            id: "demo-admin-prajalinks",
            name: "Prajalinks Staf & Admin",
            email: "admin@laundry.local",
            role: "ADMIN",
            mustChangePassword: false,
          };
        }

        return null;
      },
    }),
  ],
});

/** Dipanggil di awal setiap Server Action admin. Melempar error jika bukan admin/staff yang login. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Tidak diizinkan");
  return session.user as {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    mustChangePassword: boolean;
  };
}
