import { prisma } from "@/app/lib/prisma";
import { getServerClient } from "@/app/lib/supabase/server";
import AppSidebar from "@/components/appsidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { Providers } from "../Providers";
import { Toaster } from "react-hot-toast";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!profile || !profile.isActive) {
    supabase.auth.signOut();
    redirect("/login");
  }
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar role={profile.role} name={profile.name} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="flex w-full justify-between items-center">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="text-xl font-bold">
                      Welcome Sales {profile.role}!
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-400">
                      {profile.email}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" />
    </Providers>
  );
}
