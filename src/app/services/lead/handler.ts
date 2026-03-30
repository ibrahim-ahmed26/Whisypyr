import { authenticateUser } from "@/utils/authenticateUser";
import { NextRequest, NextResponse } from "next/server";
import {
  createLeadServiceSchema,
  leadServiceSchema,
  updateLeadServiceSchema,
} from "./schema";
import {
  fetchLead,
  buildLeadWhereClause,
  createLead,
  updateLead,
  deleteLead,
} from "./queries";
import { Role } from "@/generated/prisma/enums";

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
  const { leads, total } = await fetchLead(where, params.pageSize, params.page);
  return NextResponse.json({ data: leads, total }, { status: 200 });
}
export async function createLeadsHandler(request: NextRequest) {
  // authentication
  const profile = await authenticateUser([Role.ADMIN, Role.MANAGER]);
  const body = await request.json();
  //valdiate with zod
  const data = createLeadServiceSchema.parse(body);
  const lead = await createLead(data, profile.id);
  return NextResponse.json({ data: lead }, { status: 201 });
}
export async function updateLeads(request: NextRequest, id: string) {
  await authenticateUser([Role.ADMIN, Role.MANAGER]);
  const body = await request.json();
  const data = updateLeadServiceSchema.parse(body);
  const lead = await updateLead(id, data);
  return NextResponse.json({ data: lead }, { status: 200 });
}
export async function deleteLeads(id: string, request: NextRequest) {
  await authenticateUser([Role.ADMIN, Role.MANAGER]);
  await deleteLead(id);
  return NextResponse.json({ message: "Lead Deleted" }, { status: 200 });
}
