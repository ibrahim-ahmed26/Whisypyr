import { authenticateUser } from "@/utils/authenticateUser";
import { NextRequest, NextResponse } from "next/server";
import { leadServiceSchema } from "./schema";
import { fetchLead, buildLeadWhereClause } from "./queries";

export async function getLeadsHandler(request: NextRequest) {
  const profile = await authenticateUser([]);
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  // validate with zod
  const params = leadServiceSchema.parse({
    page,
    pageSize,
  });
  const where = buildLeadWhereClause(profile.id);
  const leads = fetchLead(where, params.pageSize, params.page);
  return NextResponse.json({ data: leads }, { status: 200 });
}
