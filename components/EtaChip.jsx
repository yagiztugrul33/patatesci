"use client";
// Canlı takip mockup'ında azalan varış süresi rozeti (18 → 17 → 16 dk, döngü).
import { useEffect, useState } from "react";

const DEGERLER = [18, 17, 16];

export default function EtaChip() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % DEGERLER.length), 2600);
    return () => clearInterval(t);
  }, []);
  return <span className="eta-chip num">{DEGERLER[i]} dk</span>;
}
