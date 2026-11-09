import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seoTitle || `${s.businessName} — ${s.tagline}`;
  const description = s.seoDescription || s.description;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${s.businessName}` },
    description,
    icons: s.faviconUrl ? { icon: s.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: s.businessName,
      title,
      description,
      images: s.heroImageUrl ? [s.heroImageUrl] : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const css = `:root{--primary:${s.primaryColor};--accent:${s.accentColor};}`;
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <MotionProvider>{children}</MotionProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
