import { NextResponse } from "next/server";
import { onkayitEkle, onkayitSayisi } from "../../../lib/onkayitStore";

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
  try {
    const body = await req.json();
    const r = await onkayitEkle(body);
    if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
    return NextResponse.json({ toplam: r.toplam }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Şu anda ön kayıt sistemine ulaşılamıyor. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }
}
