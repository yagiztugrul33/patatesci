import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByToken, getOrders, updateOrder } from "../../../lib/db";
import { govdeOku } from "../../../lib/govde";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  return NextResponse.json({ orders: getOrders(user.id), user });
}

export async function POST(req) {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  const g = await govdeOku(req);
  if (!g.ok) return NextResponse.json({ error: g.hata }, { status: 400 });
  const { id, aksiyon, gelenTon, gercekKat, gercekAsansor } = g.body;
  const r = updateOrder(id, aksiyon, { userId: user.id, gelenTon, gercekKat, gercekAsansor });
  if (!r.ok) return NextResponse.json({ error: r.reason }, { status: r.yetkisiz ? 403 : 422 });
  return NextResponse.json({ order: r.order });
}
