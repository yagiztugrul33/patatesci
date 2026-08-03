"use client";
// Görünüme girince 0'dan hedefe sayan rakam (rakamlar şeridi için).
// Genişlik baştan rezerve edilir — layout shift (CLS) oluşturmaz.
import { useEffect, useRef, useState } from "react";

function bicimle(n) {
  return n.toLocaleString("tr-TR");
}

export default function Sayac({ hedef, onek = "", sonek = "", sure = 1300 }) {
  const ref = useRef(null);
  const [deger, setDeger] = useState(0);
  const sonMetin = onek + bicimle(hedef) + sonek;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (azHareket || typeof IntersectionObserver === "undefined") { setDeger(hedef); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const adim = (t) => {
        const k = Math.min(1, (t - t0) / sure);
        const eased = 1 - Math.pow(1 - k, 3); // ease-out
        setDeger(Math.round(hedef * eased));
        if (k < 1) requestAnimationFrame(adim);
      };
      requestAnimationFrame(adim);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [hedef, sure]);

  return (
    <b ref={ref} className="num" style={{ display: "inline-block", minWidth: sonMetin.length * 0.62 + "em" }}>
      {onek}{bicimle(deger)}{sonek}
    </b>
  );
}
