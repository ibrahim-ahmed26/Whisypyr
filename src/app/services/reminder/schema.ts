import { ReminderStatus } from "@/generated/prisma/enums";
import { z } from "zod";
export const createReminderServiceSchema = z.object({
  title: z.string().min(1),
  note: z.string().optional(),
  leadId: z.uuid().optional(),
  status: z.enum(ReminderStatus),
  dueAt: z.coerce.date().refine((date) => {
    return (
      date.getTime() > new Date().getTime() &&
      date.getTime() < new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime() // this for the free Qstash time to store notification
    );
  }),

  assignedToId: z.uuid().optional(),
});
export const qstashReminderDueSchema = z.object({
  reminderId: z.uuid(),
});
export type QstashReminderDueSchema = z.infer<typeof qstashReminderDueSchema>;
export type CreateReminderInput = z.infer<typeof createReminderServiceSchema>;
