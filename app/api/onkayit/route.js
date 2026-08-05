import { NextResponse } from "next/server";
import { onkayitEkle, onkayitSayisi } from "../../../lib/onkayitStore";
import { govdeOku } from "../../../lib/govde";

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
