import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLead } from "./api";
import toast from "react-hot-toast";

export function useCreateLeads(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead Created Successfully");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
