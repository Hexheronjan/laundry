import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";
import { getSettings } from "@/lib/settings";
import { DAYS } from "@/lib/utils/format";

const EN_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.businessName,
    description: s.description,
    url: siteUrl,
    image: s.heroImageUrl ?? undefined,
    telephone: s.whatsapp || undefined,
    email: s.email || undefined,
    address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "ID" },
    openingHoursSpecification: DAYS.filter((d) => s.openingHours[d.key] && !s.openingHours[d.key].closed).map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: EN_DAYS[DAYS.findIndex((x) => x.key === d.key)],
      opens: s.openingHours[d.key].open,
      closes: s.openingHours[d.key].close,
    })),
  };
  return (
    <>
      <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Lewati ke konten
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Navbar name={s.businessName} logoUrl={s.logoUrl} />
      <main id="konten">{children}</main>
      <Footer s={s} />
      <WhatsAppFab phone={s.whatsapp} name={s.businessName} />
    </>
  );
}
