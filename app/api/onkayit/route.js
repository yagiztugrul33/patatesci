import { NextResponse } from "next/server";
import { addOnkayit, getOnkayitSayisi } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ toplam: getOnkayitSayisi() });
}

export async function POST(req) {
  const body = await req.json();
  const r = addOnkayit(body);
  if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
  return NextResponse.json({ toplam: r.toplam }, { status: 201 });
}
