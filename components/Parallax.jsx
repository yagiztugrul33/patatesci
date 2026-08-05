"use client";
// Çok hafif scroll parallax (±12px, yalnızca transform; reduced-motion'da kapalı).
//
// PERFORMANS: her örnek kendi scroll dinleyicisini kurunca 7 ayrı dinleyici
// oluşuyor ve ana iş parçacığı bloke oluyordu (TBT). Artık TEK paylaşımlı
// dinleyici var; elemanlar bir kümede tutulur. Ayrıca yalnız görünür durumdaki
// elemanlar hesaplanır (IntersectionObserver ile işaretlenir).
import { useEffect, useRef } from "react";

const kayitlar = new Set();
let kuruldu = false;
let bekliyor = false;
let gozlemci = null;

function hepsiniUygula() {
  bekliyor = false;
  const vh = window.innerHeight || 1;
  for (const k of kayitlar) {
    if (!k.gorunur) continue;
    const r = k.el.getBoundingClientRect();
    const oran = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
    k.el.style.transform = `translateY(${(-oran * k.guc).toFixed(1)}px)`;
  }
}

function planla() {
  if (!bekliyor) {
    bekliyor = true;
    requestAnimationFrame(hepsiniUygula);
  }
}

function kur() {
  if (kuruldu) return;
  kuruldu = true;
  window.addEventListener("scroll", planla, { passive: true });
  gozlemci = new IntersectionObserver((girisler) => {
    for (const g of girisler) {
      const k = [...kayitlar].find((x) => x.el === g.target);
      if (k) k.gorunur = g.isIntersecting;
    }
    planla();
  }, { rootMargin: "100px" });
}

export default function Parallax({ children, className = "", guc = 12 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    kur();
    const kayit = { el, guc, gorunur: false };
    kayitlar.add(kayit);
    gozlemci.observe(el);
    return () => {
      gozlemci.unobserve(el);
      kayitlar.delete(kayit);
    };
  }, [guc]);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
