export async function getActivites(
  leadId: string,
  page: number,
  pageSize: number,
) {
  const response = await fetch(
    `/api/leads/${leadId}/activities?page=${page}&pageSize=${pageSize}`,
  );
  if (!response.ok) throw new Error("Failed To Fetch Activities");
  return response.json();
}
