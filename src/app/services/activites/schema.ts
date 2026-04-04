import { ActivityType, LeadStages, LeadStatus } from "@/generated/prisma/enums";
import z from "zod";
const leadStatusSchema = z.enum(LeadStatus);
const leadStageSchema = z.enum(LeadStages);
export const createActivitySchema = z
  .object({
    leadId: z.uuid(),
    actorId: z.uuid(),
    type: z.enum(ActivityType),
    content: z.string().optional(),
    meta: z
      .object({
        to: z.unknown(),
        from: z.unknown(),
      })
      .optional(),
  })
  .superRefine((data) => {
    if (["STATUS_CHANGE", "STAGE_CHANGE"].includes(data.type)) {
      if (!data.meta) {
        throw new Error(`Meta is required for activity type ${data.type}`);
      }
      switch (data.type) {
        case ActivityType.STATUS_CHANGE:
          data.meta.from = leadStatusSchema.parse(data.meta.from);
          data.meta.to = leadStatusSchema.parse(data.meta.to);
          break;
        case ActivityType.STAGE_CHANGE:
          data.meta.from = leadStageSchema.parse(data.meta.from);
          data.meta.to = leadStageSchema.parse(data.meta.to);
          break;
        default:
          break;
      }
    }
  });
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export const getLeadActivitesSchema = z.object({
  leadId: z.uuid(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(10).default(1),
});
export type GetLeadActivitesInput = z.infer<typeof getLeadActivitesSchema>;
