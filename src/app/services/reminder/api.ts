export async function postReminder(
  leadId: string,
  data: {
    title: string;
    note?: string;
    dueAt: Date;
    assignedToId?: string;
  },
) {
  const response = await fetch(`/api/leads/${leadId}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create reminder");
  return response.json();
}
