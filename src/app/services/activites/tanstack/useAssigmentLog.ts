import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postActivity } from "../api";
import { ActivityType } from "@/generated/prisma/enums";
import toast from "react-hot-toast";

export function useAssigmentLog(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
    }: {
      content: string;
      from: unknown;
      to: unknown;
    }) =>
      // Implementation for logging an assignment change for a lead
      postActivity(leadId, ActivityType.ASSIGNMENT_CHANGE, content), //
    onSuccess: () => {
      // Invalidate or refetch queries related to the lead's activities if needed
      queryClient.invalidateQueries({
        queryKey: ["activities", leadId],
      });
      toast.success("Assignment change logged successfully");
    },
    onError: () => {
      toast.error("Failed to log assignment change");
    },
  });
}
