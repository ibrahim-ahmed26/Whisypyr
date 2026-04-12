import { prisma } from "@/app/lib/prisma";
import { CreateReminderInput } from "./schema";
import { Prisma, ReminderStatus } from "@/generated/prisma/client";

export const dbCreateReminder = async (
  data: CreateReminderInput,
  tx: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  const reminder = await client.reminder.create({
    data: {
      title: data.title,
      note: data.note,
      dueAt: data.dueAt,
      lead: { connect: { id: data.leadId } },
      status: data.status,
      assignedTo: { connect: { id: data.assignedToId } },
    },
  });
  return reminder;
};
export const dbUpdateReminderQstashMessageId = async (
  reminderId: string,
  qstashMessageId: string,
  tx: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  const reminder = await client.reminder.update({
    where: { id: reminderId },
    data: { qstashMessageId },
  });
  return reminder;
};
export const dbGetReminderById = async (reminderId: string) => {
  const client = prisma;
  const reminder = await client.reminder.findUnique({
    where: { id: reminderId },
    include: {
      lead: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, role: true } },
    },
  });
  return reminder;
};
export const dbUpdateReminderStatus = async (
  reminderId: string,
  status: ReminderStatus,
  tx: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  const reminder = await client.reminder.update({
    where: { id: reminderId },
    data: {
      status,
      firedAt: status === ReminderStatus.FIRED ? new Date() : null,
    },
  });
  return reminder;
};
