import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLead } from "./api";
import toast from "react-hot-toast";
import { UpdateLeadInput } from "./schema";

export function useUpdateLeads() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead Updated Successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
