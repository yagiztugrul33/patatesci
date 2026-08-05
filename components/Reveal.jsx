"use client";
// Kaydırmayla bölümlerin yumuşakça görünmesi.
// Varsayılan durum GÖRÜNÜR'dür; gizleme sınıfı yalnızca JS çalışınca eklenir,
// böylece JS kapalıyken içerik kaybolmaz.
//
// PERFORMANS: her örnek kendi IntersectionObserver'ını kurunca 16 ayrı gözlemci
// oluşuyordu. Artık TEK paylaşımlı gözlemci var (ana iş parçacığı yükü düşer).
import { useEffect, useRef } from "react";

let gozlemci = null;

function gozlemciAl() {
  if (gozlemci) return gozlemci;
  gozlemci = new IntersectionObserver(
    (girisler) => {
      for (const g of girisler) {
        if (g.isIntersecting) {
          g.target.classList.add("in");
          gozlemci.unobserve(g.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  return gozlemci;
}

export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("pre");
    const io = gozlemciAl();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <div ref={ref} className={"reveal " + className} style={delay ? { transitionDelay: delay + "ms" } : undefined}>
      {children}
    </div>
  );
}
