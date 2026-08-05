import { NextResponse } from "next/server";
import { halFiyatlariGetir } from "../../../lib/halFiyat";
import { KATEGORILER } from "../../../lib/taksonomi.mjs";
import borsaRef from "../../../lib/borsa-referans.json";
import testOzeti from "../../../tests/sonuclar.json";
import guvenlik from "../../../docs/guvenlik-ozet.json";

export const dynamic = "force-dynamic";

// Dış denetçi ucu (KAPI 3): tüm değerler CANLI veriden veya gerçek koşum
// çıktısından gelir — sahte sabit değer yasak.
export async function GET() {
  let hal = null;
  try { hal = await halFiyatlariGetir(); } catch { hal = null; }
  const gruplar = new Set((hal?.katalog || []).map((k) => k.grup));
  return NextResponse.json({
    commitSHA: process.env.VERCEL_GIT_COMMIT_SHA || "lokal-gelistirme",
    buildZamani: process.env.VERCEL_GIT_COMMIT_SHA ? "Vercel deploy (SHA anındaki build)" : new Date().toISOString(),
    testOzeti,
    katalogSayilari: {
      kategori: KATEGORILER.length,
      urun: gruplar.size + borsaRef.urunler.length,
      cesit: (hal?.katalog?.length || 0) + borsaRef.urunler.reduce((s, u) => s + u.cesitler.length, 0),
      halCesit: hal?.katalog?.length || 0,
      borsaUrun: borsaRef.urunler.length,
    },
    sonHalGuncelleme: { tarih: hal?.tarih || null, guncelleme: hal?.guncelleme || null, canli: hal?.canli ?? false },
    guvenlik,
  });
}
