"use client";

import { useEffect, useRef, useState } from "react";

/** Peta dimuat lazy: iframe baru dibuat saat kontainer mendekati viewport. */
export function LazyMap({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-slate-100 md:aspect-auto md:h-full md:min-h-80">
      {show ? <iframe src={src} title={title} className="size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="skeleton size-full rounded-none" />}
    </div>
  );
}
