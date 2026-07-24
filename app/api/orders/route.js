import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByToken, getOrders, updateOrder } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  return NextResponse.json({ orders: getOrders(user.id), user });
}

export async function POST(req) {
  const user = getUserByToken(cookies().get("pt_token")?.value);
  if (!user) return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekmektedir." }, { status: 401 });
  const { id, aksiyon } = await req.json();
  const r = updateOrder(id, aksiyon);
  if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });
  return NextResponse.json({ order: r.order });
}
