import { handleLeadError } from "@/app/services/lead/errors";
import { getLeadsHandler } from "@/app/services/lead/handler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // autenticate user
  try {
    await getLeadsHandler(request);
  } catch (error) {
    return handleLeadError(error);
  }
}
