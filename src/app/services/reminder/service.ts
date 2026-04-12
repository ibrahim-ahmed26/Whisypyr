import { prisma } from "@/app/lib/prisma";
import { CreateReminderInput } from "./schema";
import { dbCreateReminder, dbGetReminderById, dbUpdateReminderQstashMessageId, dbUpdateReminderStatus } from "./db";
import { qstash, reminderCallbackUrl } from "@/app/lib/qstash";
import { redis } from "@/app/lib/redis";
interface UserSnapshot {
  id: string;
  role: string;
}
export const createReminder = async (
  request: CreateReminderInput,
  userSnapshot: UserSnapshot,
) => {
  const assignedToId = request.assignedToId ?? userSnapshot.id;
  return await prisma.$transaction(async (tx) => {
    // step 1: create reminder in db
    const reminder = await dbCreateReminder({ ...request, assignedToId }, tx);
    // step 2: schedule qstash message
    const qstashMessage = await qstash.publishJSON({
      url: reminderCallbackUrl,
      body: { remiderId: reminder.id },
      notBefore: Math.floor(reminder.dueAt.getTime() / 1000),
    });
    // step 3 Save Qstash message Id back
    await dbUpdateReminderQstashMessageId(
      reminder.id,
      qstashMessage.messageId,
      tx,
    );
    return reminder;
  });
};
export const fireReminder = async (reminderId: string) => {
  // Step 1: Idempotency check
  const idempotencyKey = `reminder:fired:${reminderId}`;
  const alreadyProcessed = await redis.get(idempotencyKey);
  if (alreadyProcessed) return { status: "duplicate" as const };

  // Step 2: Fetch the reminder
  const reminder = await dbGetReminderById(reminderId);
  if (!reminder) {
    await redis.set(idempotencyKey, "missing");
    await redis.expire(idempotencyKey, 60 * 60 * 24);
    return { status: "missing" as const };
  }

  // Step 3: Set idempotency key BEFORE processing
  await redis.set(idempotencyKey, "processed");
  await redis.expire(idempotencyKey, 60 * 60 * 24); // 24 hours

  // Step 4: Mark as FIRED in a transaction
  await prisma.$transaction(async (tx) => {
    await dbUpdateReminderStatus(reminderId, "FIRED", tx);
  });

  return { status: "success" as const, reminder };
};
