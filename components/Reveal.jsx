"use client";
// Kaydırmayla bölümlerin yumuşakça görünmesi (IntersectionObserver, hafif).
// Varsayılan durum GÖRÜNÜR'dür; gizleme sınıfı yalnızca JS çalışınca eklenir.
// Böylece JS kapalıyken veya gözlemci hiç tetiklenmezse içerik kaybolmaz.
import { useEffect, useRef } from "react";

export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("pre");
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"reveal " + className} style={delay ? { transitionDelay: delay + "ms" } : undefined}>
      {children}
    </div>
  );
}
