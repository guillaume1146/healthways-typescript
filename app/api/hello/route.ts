import { NextResponse } from "next/server";

// app/api/hello/route.ts
export async function GET() {
  return NextResponse.json({ message: "Hello World" })
}