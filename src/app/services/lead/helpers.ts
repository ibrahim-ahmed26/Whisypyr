import { ActivityType } from "@/generated/prisma/enums";
import { CreateActivityInput } from "../activites";
import { UpdateLeadInput } from "./schema";
import { Lead } from "@/generated/prisma/client";

export function buildLeadChangeActivities({
  leadId,
  actorId,
  existingLead,
  newLead,
}: {
  leadId: string;
  actorId: string;
  existingLead: Lead;
  newLead: UpdateLeadInput;
}) {
  const activities: CreateActivityInput[] = [];

  if (newLead.status && newLead.status !== existingLead.status) {
    activities.push({
      leadId,
      actorId,
      type: ActivityType.STATUS_CHANGE,
      meta: { from: existingLead.status, to: newLead.status },
    });
  }

  if (newLead.stage && newLead.stage !== existingLead.stage) {
    activities.push({
      leadId,
      actorId,
      type: ActivityType.STAGE_CHANGE,
      meta: { from: existingLead.stage, to: newLead.stage },
    });
  }

  return activities;
}
