"use client";

import { useState } from "react";
import { ActivityType } from "@/generated/prisma/enums";
import { formatDistanceToNow, format } from "date-fns";
import {
  PlusCircle,
  Pencil,
  Phone,
  CheckCircle,
  ArrowRight,
  User,
  Bell,
  Paperclip,
  Brain,
  PhoneCall,
  StickyNote,
} from "lucide-react";
import { useActivites } from "@/app/services/activites/tanstack/useActivites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CallLogDialog } from "./CallLogDialog";
import { NoteDialog } from "./NoteDialog";

const activityIcons: Record<
  ActivityType,
  React.ComponentType<{ className?: string }>
> = {
  [ActivityType.LEAD_CREATED]: PlusCircle,
  [ActivityType.NOTE]: Pencil,
  [ActivityType.CALL_ATTEMPT]: Phone,
  [ActivityType.STATUS_CHANGE]: CheckCircle,
  [ActivityType.STAGE_CHANGE]: ArrowRight,
  [ActivityType.ASSIGNMENT_CHANGE]: User,
  [ActivityType.REMINDER_CREATED]: Bell,
  [ActivityType.ATTACHMENT_ADDED]: Paperclip,
  [ActivityType.AI_LEAD_BRIEF_GENERATED]: Brain,
  [ActivityType.AI_FOLLOWUP_DRAFT_GENERATED]: Brain,
};

const activityLabels: Record<ActivityType, string> = {
  [ActivityType.LEAD_CREATED]: "Lead created",
  [ActivityType.NOTE]: "Note added",
  [ActivityType.CALL_ATTEMPT]: "Call logged",
  [ActivityType.STATUS_CHANGE]: "Status changed",
  [ActivityType.STAGE_CHANGE]: "Stage changed",
  [ActivityType.ASSIGNMENT_CHANGE]: "Assignment changed",
  [ActivityType.REMINDER_CREATED]: "Reminder created",
  [ActivityType.ATTACHMENT_ADDED]: "Attachment added",
  [ActivityType.AI_LEAD_BRIEF_GENERATED]: "AI Lead Brief",
  [ActivityType.AI_FOLLOWUP_DRAFT_GENERATED]: "AI Followup Draft",
};

const activityIconColors: Record<ActivityType, string> = {
  [ActivityType.LEAD_CREATED]: "bg-emerald-50 text-emerald-600",
  [ActivityType.NOTE]: "bg-amber-50 text-amber-500",
  [ActivityType.CALL_ATTEMPT]: "bg-blue-50 text-blue-500",
  [ActivityType.STATUS_CHANGE]: "bg-violet-50 text-violet-500",
  [ActivityType.STAGE_CHANGE]: "bg-green-50 text-green-500",
  [ActivityType.ASSIGNMENT_CHANGE]: "bg-pink-50 text-pink-500",
  [ActivityType.REMINDER_CREATED]: "bg-orange-50 text-orange-500",
  [ActivityType.ATTACHMENT_ADDED]: "bg-slate-50 text-slate-500",
  [ActivityType.AI_LEAD_BRIEF_GENERATED]: "bg-purple-50 text-purple-500",
  [ActivityType.AI_FOLLOWUP_DRAFT_GENERATED]: "bg-purple-50 text-purple-500",
};

type Activity = {
  type: ActivityType;
  id: string;
  actor?: { name: string };
  content?: string;
  createdAt: string;
  metadata?: Record<string, string>;
};
const NOW = Date.now();
export function Timeline({ leadId }: { leadId: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const { data, isLoading, isError } = useActivites(leadId, page, pageSize);

  if (isLoading)
    return <p className="text-sm text-muted-foreground mt-6">Loading...</p>;
  if (isError)
    return (
      <p className="text-sm text-red-400 mt-6">Failed to load activities</p>
    );

  const activities: Activity[] = data?.data?.activities ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => setCallLogOpen(true)}
        >
          <PhoneCall className="h-3.5 w-3.5" />
          Log Call
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
          onClick={() => setNoteOpen(true)}
        >
          <StickyNote className="h-3.5 w-3.5" />
          Add Note
        </Button>
      </div>
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activities yet.</p>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, idx) => {
            const Icon = activityIcons[activity.type];
            const label = activityLabels[activity.type];
            const iconColor = activityIconColors[activity.type];
            const isLast = idx === activities.length - 1;

            const isOlderThanAWeek =
              NOW - new Date(activity.createdAt).getTime() >
              7 * 24 * 60 * 60 * 1000;
            const timeDisplay = isOlderThanAWeek
              ? format(new Date(activity.createdAt), "MMM d, yyyy")
              : formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                });

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      iconColor,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-border my-1 min-h-5" />
                  )}
                </div>

                <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {label}
                        {activity.actor && (
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            by {activity.actor.name}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                      {timeDisplay}
                    </span>
                  </div>

                  {activity.content && (
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {activity.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <CallLogDialog
        open={callLogOpen}
        onOpenChange={setCallLogOpen}
        leadId={leadId}
        page={page}
        pageSize={pageSize}
      />
      <NoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        leadId={leadId}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}
