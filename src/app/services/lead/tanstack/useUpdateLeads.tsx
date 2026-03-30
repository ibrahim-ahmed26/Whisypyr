import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { updateLead } from "../api";
import { UpdateLeadInput } from "../schema";
import toast from "react-hot-toast";

export function useUpdateLeads() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: UpdateLeadInput; id: string }) =>
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
