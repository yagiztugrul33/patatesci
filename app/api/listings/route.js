import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getListings, addListing, getUserByToken } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const urun = new URL(req.url).searchParams.get("urun") || undefined;
  return NextResponse.json({ listings: getListings(urun) });
}

export async function POST(req) {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "İlan vermek için lütfen giriş yapın." }, { status: 401 });
  if (user.rol !== "satici")
    return NextResponse.json({ error: "İlan vermek için satıcı hesabı gerekli." }, { status: 403 });
  const body = await req.json();
  // ton bazlı model: stokTon esas; eski istemcilerden gelen stok (kg) da kabul edilir
  if (!body.urun || !body.fiyat || (!body.stokTon && !body.stok)) {
    return NextResponse.json({ error: "Ürün, fiyat ve stok (ton) zorunlu." }, { status: 400 });
  }
  const tip = body.tip || user.tip;
  if ((tip === "toptanci" || tip === "manav") && !body.kunye) {
    return NextResponse.json({ error: "Toptancı/manav için künye no zorunlu." }, { status: 400 });
  }
  const listing = addListing({ ...body, tip, satici: user.ad, saticiId: user.id });
  return NextResponse.json({ listing }, { status: 201 });
}
