// app/api/test/route.js
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    success: true,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req) {
  const body = await req.json();

  return NextResponse.json({
    message: "You sent a POST request!",
    data: body,
    success: true,
  });
}
