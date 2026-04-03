import { getLeadActivitesSchema } from "./schema";
import { createActivity, getActivitesByLeadId } from "./service";

export const ActivityService = {
  create: createActivity,
  getByLeadId: getActivitesByLeadId,
} as const;

export const ActivitySchema = {
  getByLeadId: getLeadActivitesSchema,
} as const;

export type { CreateActivityInput } from "./schema";
