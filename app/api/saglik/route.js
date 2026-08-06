import { NextResponse } from "next/server";
import { read } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Sağlık ucu (uptime izleme için): sır ve kişisel veri İÇERMEZ.
// Operatör UptimeRobot/BetterStack gibi ücretsiz bir izleyiciyi bu uca bağlar.
export async function GET() {
  const baslangic = Date.now();
  let dbOkunuyor = false;
  let halYasSaat = null;
  try {
    const db = read();
    dbOkunuyor = true;
    if (db.halCache?.ts) halYasSaat = +(((Date.now() - db.halCache.ts) / 3600000).toFixed(1));
  } catch {
    dbOkunuyor = false;
  }
  const saglikli = dbOkunuyor;
  return NextResponse.json(
    {
      durum: saglikli ? "saglikli" : "sorunlu",
      surum: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "yerel",
      zaman: new Date().toISOString(),
      db: dbOkunuyor ? "okunuyor" : "OKUNAMIYOR",
      halOnbellekYasSaat: halYasSaat,
      yanitMs: Date.now() - baslangic,
    },
    { status: saglikli ? 200 : 503 }
  );
}
