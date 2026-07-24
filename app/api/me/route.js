import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByToken } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get("pt_token")?.value;
  const user = getUserByToken(token);
  return NextResponse.json({ user });
}
