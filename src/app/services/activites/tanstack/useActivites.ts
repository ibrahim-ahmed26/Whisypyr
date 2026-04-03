import { useQuery } from "@tanstack/react-query";
import { getActivites } from "../api";

export function useActivites(leadId: string, page: number, pageSize: number) {
  return useQuery({
    queryKey: ["activities", leadId, page, pageSize],
    queryFn: () => getActivites(leadId, page, pageSize),
  });
}
