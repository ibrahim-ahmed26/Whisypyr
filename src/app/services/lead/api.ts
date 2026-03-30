import { CreateLeadInput, UpdateLeadInput } from "./schema";

export async function getLeads(page: number, pageSize: number) {
  const response = await fetch(`/api/leads/?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error("Failed To Fetch Leads");
  return response.json();
}
export async function createLead(data: CreateLeadInput) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("OOPS Failed to Create Lead");
  return response.json();
}
export async function updateLead(id: string, data: UpdateLeadInput) {
  const response = await fetch(`/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("OOPS Failed to Update Lead");
  return response.json();
}
export async function deleteLead(id: string) {
  const response = await fetch(`/api/leads/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("OOPS Failed to Delete Lead");
  return response.json();
}
