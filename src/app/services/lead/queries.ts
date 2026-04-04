import { prisma } from "@/app/lib/prisma";
import { ActivityType, Prisma, Role } from "@/generated/prisma/client";
import { CreateLeadInput, UpdateLeadInput } from "./schema";
import { ActivityService } from "../activites";
import { buildLeadChangeActivities } from "./helpers";
export function buildLeadWhereClause(profileId: string): Prisma.LeadWhereInput {
  if (Role.ADMIN || Role.MANAGER) {
    return {}; // return all leads for admin and manager
  }
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
export async function updateLead(
  leadId: string,
  data: UpdateLeadInput,
  actorId: string,
) {
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) throw new Error("Lead not found");

  const activities = buildLeadChangeActivities({
    leadId,
    actorId,
    existingLead,
    newLead: data,
  });

  return prisma.$transaction(async (tx) => {
    const updatedLead = await tx.lead.update({
      where: { id: leadId },
      data,
    });

    const activitiesCreated = await ActivityService.create(activities, tx);
    if (!activitiesCreated.success)
      throw new Error("Failed to create activities");

    return updatedLead;
  });
}
export async function deleteLead(id: string) {
  // why transaction? we need to delete the activities related to the lead as well, and we want to make sure that both operations succeed or fail together
  return prisma.$transaction(async (tx) => {
    await tx.activity.deleteMany({
      where: { leadId: id },
    });
    return tx.lead.delete({
      where: { id },
    });
  });
}
