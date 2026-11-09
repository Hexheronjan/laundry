"use client";

import { useEffect, useRef, useState } from "react";

/** Peta dimuat lazy dan mengisi penuh ruang kontainer tanpa menyisakan area kosong di bawah. */
export function LazyMap({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const finalSrc =
    src && src.trim().length > 0
      ? src
      : "https://maps.google.com/maps?q=Jl.%20Jend.%20Sudirman%20Jakarta%20Pusat&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div
      ref={ref}
      className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl border border-line bg-slate-100"
    >
      {show ? (
        <iframe
          src={finalSrc}
          title={title}
          className="block h-full min-h-[280px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="skeleton h-full min-h-[280px] w-full rounded-none" />
      )}
    </div>
  );
}
