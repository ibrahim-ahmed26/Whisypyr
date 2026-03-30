import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useDeleteLeads() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/leads/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/leads");
      toast.success("Lead Deleted Successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
