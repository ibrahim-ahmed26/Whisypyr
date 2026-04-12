import { verifyQstashSignature } from "@/app/lib/qstash";
import { ReminderSchema, ReminderService } from "@/app/services/reminder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Step 1: Read raw body (needed for signature verification)
    const rawBody = await request.text();

    // Step 2: Verify request is actually from QStash
    const isValid = await verifyQstashSignature(request, rawBody);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Step 3: Validate the payload
    const body = ReminderSchema.qstash.parse(JSON.parse(rawBody));

    // Step 4: Fire the reminder
    const result = await ReminderService.fire(body.reminderId);

    if (result.status === "duplicate") {
      return NextResponse.json({ ok: true, status: "duplicate" });
    }

    if (result.status === "missing") {
      return NextResponse.json({ ok: true, status: "missing" });
    }

    return NextResponse.json({ ok: true, status: "success" });
  } catch (error) {
    console.error("Error firing reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
