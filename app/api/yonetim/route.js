import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { onkayitListesi } from "../../../lib/onkayitStore";
import { onboardingListe, onboardingKarar, tumSiparisler } from "../../../lib/db";
import { govdeOku } from "../../../lib/govde";
import { hizSiniri, ipAl } from "../../../lib/rateLimit";

export const dynamic = "force-dynamic";

// Yönetim API'si — oturum sistemine DOKUNMADAN ayrı anahtar katmanı:
// YONETIM_ANAHTAR env değişkeni tanımlı değilse uç 503 döner (kapalı kasadır);
// tanımlıysa yalnız doğru x-yonetim-anahtar başlığıyla erişilir. Anahtar
// karşılaştırması zamanlama-güvenlidir. Kaba kuvvete karşı IP başına sıkı
// hız sınırı uygulanır. Sır repoya yazılmaz; operatör Vercel env'e girer.

function anahtarDogru(req) {
  const beklenen = process.env.YONETIM_ANAHTAR || "";
  const gelen = req.headers.get("x-yonetim-anahtar") || "";
  if (!beklenen) return { kapali: true };
  const a = Buffer.from(beklenen);
  const b = Buffer.from(gelen);
  if (a.length !== b.length) return { kapali: false, ok: false };
  return { kapali: false, ok: timingSafeEqual(a, b) };
}

function kapiKontrol(req) {
  const rl = hizSiniri("yonetim:" + ipAl(req), 30, 60000);
  if (!rl.izin) {
    return NextResponse.json(
      { error: `Çok fazla istek. ${rl.bekleSaniye} sn sonra tekrar deneyin.` },
      { status: 429, headers: { "Retry-After": String(rl.bekleSaniye) } }
    );
  }
  const k = anahtarDogru(req);
  if (k.kapali) {
    return NextResponse.json(
      { error: "Yönetim anahtarı tanımlı değil (YONETIM_ANAHTAR env). Panel operatör kurulumunu bekliyor." },
      { status: 503 }
    );
  }
  if (!k.ok) return NextResponse.json({ error: "Geçersiz yönetim anahtarı." }, { status: 401 });
  return null;
}

export async function GET(req) {
  const engel = kapiKontrol(req);
  if (engel) return engel;
  const url = new URL(req.url);
  const bolum = url.searchParams.get("bolum") || "ozet";
  if (bolum === "onkayit") {
    const liste = await onkayitListesi();
    if (url.searchParams.get("format") === "csv") {
      const csv = ["email;rol;bolge;ts", ...liste.map((k) => `${k.email};${k.rol};${(k.bolge || "").replaceAll(";", ",")};${k.ts || ""}`)].join("\n");
      return new NextResponse("﻿" + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=onkayitlar.csv",
        },
      });
    }
    return NextResponse.json({ toplam: liste.length, liste });
  }
  if (bolum === "onboarding") return NextResponse.json({ liste: onboardingListe() });
  if (bolum === "siparisler") return NextResponse.json({ liste: tumSiparisler() });
  const [onkayit, onboarding, siparisler] = [await onkayitListesi(), onboardingListe(), tumSiparisler()];
  return NextResponse.json({
    ozet: {
      onkayit: onkayit.length,
      bekleyenOnboarding: onboarding.filter((b) => b.durum === "dogrulama_bekliyor").length,
      siparis: siparisler.length,
    },
  });
}

export async function POST(req) {
  const engel = kapiKontrol(req);
  if (engel) return engel;
  const g = await govdeOku(req);
  if (!g.ok) return NextResponse.json({ error: g.hata }, { status: 400 });
  const { islem, userId, karar, gerekce } = g.body;
  if (islem === "onboarding-karar") {
    const r = onboardingKarar({ userId, karar, gerekce });
    if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
    return NextResponse.json({ basvuru: r.basvuru });
  }
  return NextResponse.json({ error: "Geçersiz işlem." }, { status: 422 });
}
