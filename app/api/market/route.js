import { NextResponse } from "next/server";
import { getMarket } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ market: getMarket() });
}
