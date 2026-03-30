import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeleteLeads() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/leads/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      router.push("/leads");
    },
    onError: (err: Error) => {
      console.error("Failed to delete lead:", err);
    },
  });
}
