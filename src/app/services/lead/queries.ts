import { prisma } from "@/app/lib/prisma";
import { ActivityType, Prisma } from "@/generated/prisma/client";
import { CreateLeadInput, UpdateLeadInput } from "./schema";
export function buildLeadWhereClause(profileId: string): Prisma.LeadWhereInput {
  return {
    OR: [{ assignToId: profileId }, { assignToId: null }],
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
      orderBy: { createdAt: "desc" },
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
export async function updateLead(leadId: string, data: UpdateLeadInput) {
  return prisma.lead.update({
    where: { id: leadId },
    data,
  });
}
export async function deleteLead(id: string) {
  return prisma.lead.delete({
    where: { id },
  });
}
