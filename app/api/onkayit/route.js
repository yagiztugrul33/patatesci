import { NextResponse } from "next/server";
import { onkayitEkle, onkayitSayisi } from "../../../lib/onkayitStore";
import { govdeOku } from "../../../lib/govde";
import { hizSiniri, ipAl } from "../../../lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ toplam: await onkayitSayisi() });
  } catch {
    return NextResponse.json(
      { error: "Şu anda ön kayıt sistemine ulaşılamıyor. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }
}

export async function POST(req) {
  // Ön kayıt spam'ine karşı: IP başına dakikada 5 kayıt
  const rl = hizSiniri("onkayit:" + ipAl(req), 5, 60000);
  if (!rl.izin) {
    return NextResponse.json(
      { error: `Çok fazla ön kayıt denemesi. Lütfen ${rl.bekleSaniye} saniye sonra tekrar deneyin.` },
      { status: 429, headers: { "Retry-After": String(rl.bekleSaniye) } }
    );
  }
  const g = await govdeOku(req);
  if (!g.ok) return NextResponse.json({ error: g.hata }, { status: 400 });
  try {
    const r = await onkayitEkle(g.body);
    if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
    return NextResponse.json({ toplam: r.toplam }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Şu anda ön kayıt sistemine ulaşılamıyor. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }
}
