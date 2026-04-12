import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReminder } from "../api";
import toast from "react-hot-toast";

export function useReminders(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      note?: string;
      dueAt: Date;
      assignedToId?: string;
    }) => postReminder(leadId, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reminders", leadId] });
      toast.success("Reminder Created Succesfully");
    },
    onError() {
      toast.error("OOPS Something Went Wrong With Reminder");
    },
  });
}
