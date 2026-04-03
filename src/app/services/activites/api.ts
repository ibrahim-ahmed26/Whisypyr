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
export async function postActivity(
  leadId: string,
  type: string,
  content?: string,
) {
  const response = await fetch(`/api/leads/${leadId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, content }),
  });
  if (!response.ok) throw new Error("Failed To Create Activity");
  return response.json();
}
