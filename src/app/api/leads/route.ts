import { prisma } from "@/app/lib/prisma";
import { leadServiceSchema } from "@/app/services/lead/schema";
import { Prisma } from "@/generated/prisma/client";
import {
  authenticateUser,
  AuthenticationError,
} from "@/utils/authenticateUser";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  // autenticate user
  try {
    const profile = await authenticateUser([]);
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    // validate with zod
    const params = leadServiceSchema.parse({
      page,
      pageSize,
    });
    // fetch Leads

    // where condition
    const where: Prisma.LeadWhereInput = {
      assignToId: profile.id,
    };
    const leads = await prisma.lead.findMany({
      where,
      take: params.pageSize,
      skip: (params.page - 1) * params.pageSize,
    });
    return NextResponse.json({ data: leads }, { status: 200 });
  } catch (error) {
    // 1- if the error from the authentication user
    if (error instanceof AuthenticationError) {
      NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof ZodError) {
      NextResponse.json(
        { error: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "internal Server Error" },
      { status: 500 },
    );
  }
}
