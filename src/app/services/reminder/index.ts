import { createReminderServiceSchema, qstashReminderDueSchema } from "./schema";
import { createReminder, fireReminder } from "./service";

export type { CreateReminderInput } from "./schema";

export const ReminderService = {
  create: createReminder,
  fire: fireReminder,
} as const;

export const ReminderSchema = {
  create: createReminderServiceSchema,
  qstash: qstashReminderDueSchema,
} as const;
