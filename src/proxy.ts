import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "./app/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/crm") && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (data.user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/crm";
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request });
}
export const config = {
  matcher: ["/crm", "/crm/:path*,/login"], // make sure only runs this middle ware on these routes
};
