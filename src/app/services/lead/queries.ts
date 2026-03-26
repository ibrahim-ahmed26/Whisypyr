import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
export function buildLeadWhereClause(profileId: string): Prisma.LeadWhereInput {
  return {
    assignToId: profileId,
  };
}
export async function fetchLead(
  where: Prisma.LeadWhereInput,
  pageSize: number,
  page: number,
) {
  await prisma.lead.findMany({
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });
}
