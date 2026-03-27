import { AuthenticationError } from "@/utils/authenticateUser";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleLeadError(error: unknown) {
  console.error("Lead Error:", error); // 👈 add this
  if (error instanceof AuthenticationError) {
    NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  if (error instanceof ZodError) {
    NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
  }
  return NextResponse.json({ error: "internal Server Error" }, { status: 500 });
}
