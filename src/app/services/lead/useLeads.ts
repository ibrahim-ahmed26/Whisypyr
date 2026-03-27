import { useQuery } from "@tanstack/react-query";
import { getLeads } from "./api";

export function useLeads(pageSize: number, page: number) {
  return useQuery({
    queryKey: ["leads", page, pageSize],
    queryFn: () => getLeads(page, pageSize),
  });
}
