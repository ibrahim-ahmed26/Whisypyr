import { prisma } from "@/app/lib/prisma";
import { ActivityType, Prisma } from "@/generated/prisma/client";
import { CreateLeadInput } from "./schema";
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
  const [leads, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.lead.count({ where }),
  ]);
  return { leads, total };
}
export async function createLead(data: CreateLeadInput, profileId: string) {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        assignTo: data.assignToId
          ? { connect: { id: data.assignToId } }
          : undefined,
      },
    });
    await tx.activity.create({
      data: {
        leadId: lead.id,
        actorId: profileId,
        type: ActivityType.LEAD_CREATED,
      },
    });
    return lead;
  });
}
