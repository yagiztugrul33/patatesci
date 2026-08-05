import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUser, loginUser, logout } from "../../../lib/db";
import { govdeOku } from "../../../lib/govde";

export const dynamic = "force-dynamic";
const COOKIE = "pt_token";

export async function POST(req) {
  const g = await govdeOku(req);
  if (!g.ok) return NextResponse.json({ error: g.hata }, { status: 400 });
  const body = g.body;
  const { action } = body;

  if (action === "cikis") {
    const token = cookies().get(COOKIE)?.value;
    if (token) logout(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  const fn = action === "kayit" ? registerUser : action === "giris" ? loginUser : null;
  if (!fn) return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });

  const r = fn(body);
  if (!r.ok) return NextResponse.json({ error: r.reason }, { status: 422 });

  const res = NextResponse.json({ user: r.user });
  res.cookies.set(COOKIE, r.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
