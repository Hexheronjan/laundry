import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/admin/ui";
import { PasswordForm, SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Pengaturan" description="Sesuaikan website untuk usaha Anda tanpa mengubah kode." />
      <div className="space-y-6">
        <SettingsForm
          defaults={{
            businessName: s.businessName, tagline: s.tagline, heroTitle: s.heroTitle, description: s.description, aboutText: s.aboutText ?? "",
            address: s.address, whatsapp: s.whatsapp, email: s.email, mapsEmbedUrl: s.mapsEmbedUrl ?? "",
            bankName: s.bankName, bankAccountName: s.bankAccountName, bankAccountNumber: s.bankAccountNumber,
            primaryColor: s.primaryColor, accentColor: s.accentColor, invoiceFormat: s.invoiceFormat,
            seoTitle: s.seoTitle, seoDescription: s.seoDescription, foundedYear: s.foundedYear ?? "",
            enableDelivery: s.enableDelivery, enablePickup: s.enablePickup, enableProofUpload: s.enableProofUpload,
            openingHours: s.openingHours, logoUrl: s.logoUrl ?? "", faviconUrl: s.faviconUrl ?? "", heroImageUrl: s.heroImageUrl ?? "",
            galleryText: s.galleryUrls.join("\n"),
          }}
        />
        <PasswordForm />
      </div>
    </>
  );
}
