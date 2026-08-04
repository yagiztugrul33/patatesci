import { NextResponse } from "next/server";
import { nakliyeHesapla } from "../../../lib/ceza.mjs";
import km from "../../../lib/km-ankara.json";
import { read } from "../../../lib/db";

export const dynamic = "force-dynamic";

function mesafeBul(origin, destination) {
  if (origin === destination) return km.ayniIlceKm;
  const d = km.mesafeler[origin]?.[destination];
  if (d !== undefined) return d;
  const ters = km.mesafeler[destination]?.[origin];
  return ters !== undefined ? ters : null;
}

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const origin = p.get("origin");
  const destination = p.get("destination");
  const ton = parseFloat(p.get("ton"));
  const gelAl = p.get("gelal") === "1";

  if (!origin || !destination || isNaN(ton) || ton <= 0) {
    return NextResponse.json({ error: "origin, destination ve ton (sayısal) zorunludur." }, { status: 422 });
  }
  const mesafe = mesafeBul(origin, destination);
  if (mesafe === null) {
    return NextResponse.json(
      { error: `Km tablosunda bulunamadı: ${origin} → ${destination}. Ankara pilot bölgeleri: ${Object.keys(km.mesafeler).join(", ")} ve merkez ilçeler.` },
      { status: 422 }
    );
  }
  const ayarlar = read().ayarlar || {};
  const sonuc = nakliyeHesapla({ km: mesafe, ton, tlKm: ayarlar.tlKm ?? 11.7, sabit: ayarlar.sabitYukleme ?? 750, gelAl });
  return NextResponse.json({ origin, destination, ton, ...sonuc, odeyen: gelAl ? "—" : "alıcı (varsayılan)" });
}
