"use client";
// Kaydırmayla bölümlerin yumuşakça görünmesi (IntersectionObserver, hafif).
import { useEffect, useRef } from "react";

export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
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
