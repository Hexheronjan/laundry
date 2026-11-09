import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default async function proxy(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth as any)(request);
}

export const config = { matcher: ["/admin/:path*"] };
