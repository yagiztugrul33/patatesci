"use client";
// Çok hafif scroll parallax (±12px, yalnızca transform; reduced-motion'da kapalı).
import { useEffect, useRef } from "react";

export default function Parallax({ children, className = "", guc = 12 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let bekliyor = false;
    const uygula = () => {
      bekliyor = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (r.bottom < 0 || r.top > vh) return;
      const oran = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
      el.style.transform = `translateY(${(-oran * guc).toFixed(1)}px)`;
    };
    const onScroll = () => {
      if (!bekliyor) { bekliyor = true; requestAnimationFrame(uygula); }
    };
    uygula();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [guc]);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
