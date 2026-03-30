import { LeadStages, LeadStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const leadServiceSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(10).default(1),
});
export type ListLeadsParams = z.infer<typeof leadServiceSchema>;
export const createLeadServiceSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(8).max(15),
  email: z.email(),
  assignToId: z.string().optional(),
  note: z.string().optional(),
});
export type CreateLeadInput = z.infer<typeof createLeadServiceSchema>;
export const updateLeadServiceSchema = z.object({
  name: z.string().min(1).optional(),
  phoneNumber: z.string().min(8).max(15).optional(),
  email: z.email().optional(),
  note: z.string().optional(),
  status: z.enum(LeadStatus).optional(),
  stage: z.enum(LeadStages).optional(),
  assignToId: z.string().optional(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadServiceSchema>;
