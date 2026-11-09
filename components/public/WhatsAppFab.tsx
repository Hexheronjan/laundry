import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils/phone";

export function WhatsAppFab({ phone, name }: { phone: string; name: string }) {
  if (!phone) return null;
  return (
    <aside aria-label="Bantuan WhatsApp Cepat">
      <a
        href={waLink(phone, `Halo ${name}, saya ingin konsultasi atau pesan laundry.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Langsung"
        className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-white shadow-lift shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:bottom-7 md:right-7 md:px-5 md:py-3.5"
      >
        <span className="relative flex size-6 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
          <MessageCircle className="relative size-6" strokeWidth={2.2} aria-hidden />
        </span>
        <span className="hidden font-bold text-sm tracking-wide md:inline">
          Chat WhatsApp
        </span>
      </a>
    </aside>
  );
}
