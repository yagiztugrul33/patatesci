"use client";
// Sayfadaki tüm kaydırma efektleri (reveal + parallax + sayaç) için TEK
// istemci bileşeni. Bölümler saf sunucu HTML'i olarak kalır; data-* öznitelikleri
// üzerinden yürütülür.
//
// PERFORMANS: eskiden her bölüm Reveal/Parallax istemci bileşenine sarılıyordu;
// bölüm içeriği hem HTML'e hem RSC (Flight) yüküne çift yazılıyor, 16+ hidrasyon
// kökü oluşuyordu (mobil TBT'nin ana kaynağı). Tek bileşen + data-* düzeni bu
// çift maliyeti kaldırır. Görsel davranış birebir aynıdır; JS kapalıyken içerik
// görünür kalır (gizleme sınıfı yalnız JS çalışınca eklenir).
import { useEffect } from "react";

export default function ScrollFx() {
  useEffect(() => {
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ioVar = typeof IntersectionObserver !== "undefined";
    const temizlik = [];

    // ---- Reveal: .reveal öğeleri görünüme girince .in alır ----
    if (ioVar) {
      const revealler = document.querySelectorAll(".reveal");
      if (revealler.length) {
        const io = new IntersectionObserver(
          (girisler) => {
            for (const g of girisler) {
              if (g.isIntersecting) {
                g.target.classList.add("in");
                io.unobserve(g.target);
              }
            }
          },
          { threshold: 0.12 }
        );
        for (const el of revealler) {
          el.classList.add("pre");
          io.observe(el);
        }
        temizlik.push(() => io.disconnect());
      }
    }

    // ---- Sayaç: [data-sayac] görünüme girince 0'dan hedefe sayar ----
    if (ioVar && !azHareket) {
      const sayaclar = document.querySelectorAll("[data-sayac]");
      if (sayaclar.length) {
        const sio = new IntersectionObserver(
          (girisler) => {
            for (const g of girisler) {
              if (!g.isIntersecting) continue;
              const el = g.target;
              sio.unobserve(el);
              const hedef = parseInt(el.getAttribute("data-sayac"), 10) || 0;
              const onek = el.getAttribute("data-onek") || "";
              const sonek = el.getAttribute("data-sonek") || "";
              const sure = 1300;
              const t0 = performance.now();
              const adim = (t) => {
                const k = Math.min(1, (t - t0) / sure);
                const eased = 1 - Math.pow(1 - k, 3); // ease-out
                el.textContent = onek + Math.round(hedef * eased).toLocaleString("tr-TR") + sonek;
                if (k < 1) requestAnimationFrame(adim);
              };
              requestAnimationFrame(adim);
            }
          },
          { threshold: 0.4 }
        );
        for (const el of sayaclar) sio.observe(el);
        temizlik.push(() => sio.disconnect());
      }
    }

    // ---- Parallax: [data-parallax] hafif scroll kayması (±12px, yalnız transform) ----
    if (!azHareket) {
      const kayitlar = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
        el,
        guc: parseFloat(el.getAttribute("data-parallax")) || 12,
        gorunur: false,
      }));
      if (kayitlar.length && ioVar) {
        let bekliyor = false;
        const uygula = () => {
          bekliyor = false;
          const vh = window.innerHeight || 1;
          for (const k of kayitlar) {
            if (!k.gorunur) continue;
            const r = k.el.getBoundingClientRect();
            const oran = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
            k.el.style.transform = `translateY(${(-oran * k.guc).toFixed(1)}px)`;
          }
        };
        const planla = () => {
          if (!bekliyor) {
            bekliyor = true;
            requestAnimationFrame(uygula);
          }
        };
        window.addEventListener("scroll", planla, { passive: true });
        const pio = new IntersectionObserver(
          (girisler) => {
            for (const g of girisler) {
              const k = kayitlar.find((x) => x.el === g.target);
              if (k) k.gorunur = g.isIntersecting;
            }
            planla();
          },
          { rootMargin: "100px" }
        );
        for (const k of kayitlar) pio.observe(k.el);
        temizlik.push(() => {
          window.removeEventListener("scroll", planla);
          pio.disconnect();
        });
      }
    }

    return () => temizlik.forEach((f) => f());
  }, []);

  return null;
}
