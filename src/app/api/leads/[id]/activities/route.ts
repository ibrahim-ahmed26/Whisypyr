import { ActivitySchema, ActivityService } from "@/app/services/activites";
import { authenticateUser } from "@/utils/authenticateUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const profile = await authenticateUser([]);
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    // validate with zod
    const validated = ActivitySchema.getByLeadId.parse({
      leadId: id,
      page,
      pageSize,
    });
    const activites = await ActivityService.getByLeadId(validated, {
      id: profile.id,
      role: profile.role,
    });

    // return activities in json format
    return NextResponse.json({ data: activites }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const profile = await authenticateUser([]);
    const body = await request.json();
    const result = await ActivityService.create([
      {
        leadId: id,
        actorId: profile.id,
        type: body.type,
        content: body.content,
      },
    ]);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ data: result.activities[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 },
    );
  }
}
