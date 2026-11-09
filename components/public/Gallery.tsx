"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { m } from "motion/react";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export function Gallery({ urls }: { urls: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {urls.map((u, i) => (
          <m.button
            key={u}
            type="button"
            onClick={() => setActive(u)}
            aria-label={`Perbesar foto ${i + 1}`}
            className="relative aspect-square overflow-hidden rounded-2xl border border-line focus-visible:outline-2 focus-visible:outline-primary"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
          >
            <Image src={u} alt={`Foto tempat laundry ${i + 1}`} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
          </m.button>
        ))}
      </div>
      <Lightbox src={active} onClose={() => setActive(null)} />
    </>
  );
}
