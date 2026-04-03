import { Prisma, Role } from "@/generated/prisma/client";

import z from "zod";
import {
  CreateActivityInput,
  createActivitySchema,
  GetLeadActivitesInput,
} from "./schema";
import { buildActivityContent } from "./helpers";
import { dbCreateActivites, dbGetActivitesByLeadId } from "./db";

export async function createActivity(
  request: CreateActivityInput[],
  tx?: Prisma.TransactionClient,
) {
  const validtedData = z.array(createActivitySchema).safeParse(request);
  if (!validtedData.success) {
    return {
      success: false as const,
      error: validtedData.error.flatten().fieldErrors,
    };
  }
  const activiesToCreate = validtedData.data.map((activity) => ({
    leadId: activity.leadId,
    actorId: activity.actorId,
    type: activity.type,
    content: buildActivityContent(
      activity.type,
      activity.meta,
      activity.content,
    ),
  }));
  const createdActivites = await dbCreateActivites(activiesToCreate, tx);
  return {
    success: true as const,
    activities: createdActivites,
  };
}
export async function getActivitesByLeadId(
  request: GetLeadActivitesInput,
  userSnapShot: { id: string; role: Role },
) {
  // if the user is an agent, they should only see the activities related to the leads assigned to them
  const where: Prisma.ActivityWhereInput = {
    leadId: request.leadId,
  };
  if (userSnapShot.role === Role.AGENT) {
    where.lead = {
      assignToId: userSnapShot.id,
    };
  }
  const result = await dbGetActivitesByLeadId(where, {
    page: request.page,
    pageSize: request.pageSize,
  });
  return result;
}
