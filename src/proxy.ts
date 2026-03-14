import { NextRequest } from "next/server";
import { getServerClient } from "./app/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const supabase = await getServerClient();
}
