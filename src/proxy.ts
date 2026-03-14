import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "./app/lib/supabase/server";
import { URL } from "url";

export async function middleware(request: NextRequest) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/crm", "/crm/:path*"], // make sure only runs this middle ware on these routes
};
