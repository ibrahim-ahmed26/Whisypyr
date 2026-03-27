import { handleLeadError } from "@/app/services/lead/errors";
import {
  createLeadsHandler,
  getLeadsHandler,
} from "@/app/services/lead/handler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await getLeadsHandler(request);
  } catch (error) {
    return handleLeadError(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    return await createLeadsHandler(request);
  } catch (error) {
    return handleLeadError(error);
  }
}
