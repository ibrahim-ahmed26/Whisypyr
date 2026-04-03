import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postActivity } from "../api";
import { ActivityType } from "@/generated/prisma/enums";
import toast from "react-hot-toast";

export function useLogCall(leadId: string, page: number, pageSize: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content?: string) =>
      postActivity(leadId, ActivityType.CALL_ATTEMPT, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities", leadId, page, pageSize],
      });
      toast.success("Call logged successfully");
    },
    onError: () => {
      toast.error("Failed to log call");
    },
  });
}
