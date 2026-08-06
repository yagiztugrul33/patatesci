import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByToken, onboardingBasvur, onboardingDurum } from "../../../lib/db";
import { govdeOku } from "../../../lib/govde";
import { hizSiniri, ipAl } from "../../../lib/rateLimit";

export const dynamic = "force-dynamic";

// Satıcı onboarding: künye/ÇKS/sertifika beyanı → platform doğrulaması kuyruğu.
// DEMO: belge yükleme yerine numara beyanı alınır; gerçek dosya yükleme ve
// HKS eşleşmesi Faz 2'de bağlanır.

export async function GET() {
  const user = getUserByToken((await cookies()).get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  return NextResponse.json(onboardingDurum(user.id));
}

export async function POST(req) {
  const rl = hizSiniri("onboarding:" + ipAl(req), 5, 60000);
  if (!rl.izin) {
    return NextResponse.json(
      { error: `Çok fazla deneme. Lütfen ${rl.bekleSaniye} saniye sonra tekrar deneyin.` },
      { status: 429, headers: { "Retry-After": String(rl.bekleSaniye) } }
    );
  }
  const user = getUserByToken((await cookies()).get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  const g = await govdeOku(req);
  if (!g.ok) return NextResponse.json({ error: g.hata }, { status: 400 });
  const { kunyeNo, cksNo, bolge, sertifikalar } = g.body;
  const r = onboardingBasvur({ userId: user.id, kunyeNo, cksNo, bolge, sertifikalar });
  if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
  return NextResponse.json({ basvuru: r.basvuru }, { status: 201 });
}
