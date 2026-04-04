import { ActivityType } from "@/generated/prisma/enums";

export function buildActivityContent(
  activityType: ActivityType,
  meta: { from: unknown; to: unknown } | undefined,
  content?: string,
) {
  switch (activityType) {
    case ActivityType.STATUS_CHANGE:
      return `Status changed from ${meta?.from} to ${meta?.to}`;
    case ActivityType.STAGE_CHANGE:
      return `Stage changed from ${meta?.from} to ${meta?.to}`;
    case ActivityType.ASSIGNMENT_CHANGE:
      if (meta?.from && meta?.to) {
        return `Assignment changed from ${meta.from} to ${meta.to}`;
      }
      return content ?? null; // Fallback to content if meta is not properly provided
    case ActivityType.NOTE:
    case ActivityType.CALL_ATTEMPT:
      return content || null;
    default:
      return null;
  }
}
