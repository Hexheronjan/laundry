"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/admin";

export async function loginAction(raw: { email: string; password: string; callbackUrl?: string }): Promise<{ error: string } | undefined> {
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: "Email atau password tidak valid." };

  let target = "/admin";
  if (raw.callbackUrl) {
    try {
      if (raw.callbackUrl.startsWith("/")) {
        target = raw.callbackUrl;
      } else {
        const u = new URL(raw.callbackUrl);
        target = u.pathname + u.search;
      }
    } catch {
      target = "/admin";
    }
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: target });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Email atau password salah, atau terlalu banyak percobaan." };
    throw e; // redirect
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
