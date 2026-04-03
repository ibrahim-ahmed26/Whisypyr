import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postActivity } from "../api";
import { ActivityType } from "@/generated/prisma/enums";
import toast from "react-hot-toast";

export function useAddNote(leadId: string, page: number, pageSize: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content?: string) =>
      // Implementation for adding a note to a lead
      postActivity(leadId, ActivityType.NOTE, content),
    onSuccess: () => {
      // Invalidate or refetch queries related to the lead's activities if needed
      queryClient.invalidateQueries({
        queryKey: ["activities", leadId, page, pageSize],
      });
      toast.success("Note added successfully");
    },
    onError: () => {
      toast.error("Failed to add note");
    },
  });
}
