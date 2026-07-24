import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOffers, addOffer, getUserByToken } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const urun = new URL(req.url).searchParams.get("urun") || undefined;
  return NextResponse.json({ offers: getOffers(urun) });
}

export async function POST(req) {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Teklif vermek için lütfen giriş yapın." }, { status: 401 });
  const body = await req.json();
  // satış teklifi sadece satıcı hesabından, alış teklifi sadece alıcıdan
  if (body.yon === "sat" && user.rol !== "satici")
    return NextResponse.json({ error: "Satış teklifi için satıcı hesabı gerekli." }, { status: 403 });
  if (body.yon === "al" && user.rol !== "alici")
    return NextResponse.json({ error: "Alış teklifi için alıcı hesabı gerekli." }, { status: 403 });
  const res = addOffer({ ...body, kim: user.ad, userId: user.id });
  if (!res.ok) return NextResponse.json({ error: res.reason }, { status: 422 });
  return NextResponse.json({ offer: res.offer, eslesme: res.eslesme }, { status: 201 });
}
