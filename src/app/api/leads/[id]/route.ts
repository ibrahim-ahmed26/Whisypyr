import { handleLeadError } from "@/app/services/lead/errors";
import { deleteLeads, updateLeads } from "@/app/services/lead/handler";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("Lead ID is required");
    return await updateLeads(request, id);
  } catch (error) {
    return handleLeadError(error);
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("Lead ID is required");
    return await deleteLeads(id);
  } catch (error) {
    return handleLeadError(error);
  }
}

