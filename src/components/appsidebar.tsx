import {
  BriefcaseBusiness,
  Calendar,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Role } from "@/generated/prisma/enums";
import Link from "next/link";
import { AppSidebarFooter } from "./appsidebar-footer";
export default function AppSidebar({ role }: { role: Role }) {
  const mainMenuItems = [
    { name: "dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
    { name: "leads", href: "/leads", icon: <BriefcaseBusiness /> },
    { name: "reminders", href: "/reminders", icon: <Calendar /> },
  ];
  const adminMenuItems = [{ name: "Users", href: "/Users", icon: <User /> }];
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h4 className="text-xl font-bold">CRM Pro</h4>
        <p className="text-sm text-gray-400 -mt-2.5">{role}</p>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <h5 className="text-gray-400">Main Menu</h5>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className="cursor-pointer"
                  size="default"
                >
                  <Link href={item.href}>
                    {item.icon}
                    <p className="capitalize">{item.name}</p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {role === "ADMIN" && (
          <SidebarGroup>
            <SidebarMenu>
              <h5 className="text-gray-400">Administration</h5>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild className="cursor-pointer">
                    <Link href={item.href}>
                      {item.icon}
                      <p className="capitalize">{item.name}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
