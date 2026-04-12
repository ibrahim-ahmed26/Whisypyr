import { leadIdParamsSchema } from "@/app/services/lead/schema";
import { ReminderSchema, ReminderService } from "@/app/services/reminder";
import { authenticateUser } from "@/utils/authenticateUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await authenticateUser([]);
    const { id } = leadIdParamsSchema.parse(await params);
    const body = ReminderSchema.create.parse(await request.json());

    const reminder = await ReminderService.create(
      { ...body, leadId: id },
      { id: profile.id, role: profile.role },
    );

    return NextResponse.json(
      { success: true, data: reminder },
      { status: 201 },
    );
  } catch (error) {
    return error;
  }
}
