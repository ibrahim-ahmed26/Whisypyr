export async function getLeads(page: number, pageSize: number) {
  const response = await fetch(`/api/leads/?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error("Failed To Fetch Leads");
  return response.json();
}
