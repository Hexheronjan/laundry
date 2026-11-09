import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const s = await getSettings();

  let newOrders = 0;
  let pendingPayments = 0;
  let mustChange = false;

  try {
    const [no, pp, user] = await Promise.all([
      db.order.count({ where: { status: "RECEIVED", deletedAt: null } }),
      db.payment.count({ where: { status: "PENDING_VERIFICATION", order: { deletedAt: null } } }),
      db.user.findUnique({ where: { id: session.user.id }, select: { mustChangePassword: true } }),
    ]);
    newOrders = no;
    pendingPayments = pp;
    mustChange = user?.mustChangePassword ?? false;
  } catch {
    // Fallback jika database belum terhubung
  }

  return (
    <AdminShell
      name={session.user.name ?? "Admin"}
      businessName={s.businessName}
      logoUrl={s.logoUrl}
      newOrders={newOrders}
      pendingPayments={pendingPayments}
      mustChangePassword={mustChange}
    >
      {children}
    </AdminShell>
  );
}
