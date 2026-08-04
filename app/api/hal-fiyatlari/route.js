import { NextResponse } from "next/server";
import { halFiyatlariGetir } from "../../../lib/halFiyat";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const zorlaFallback = new URL(req.url).searchParams.get("fallback") === "1";
  try {
    const veri = await halFiyatlariGetir({ zorlaFallback });
    return NextResponse.json(veri);
  } catch {
    return NextResponse.json(
      { error: "Hal fiyat referansına şu anda ulaşılamıyor." },
      { status: 503 }
    );
  }
}
