import Image from "next/image";
import { FiMessageSquare } from "react-icons/fi";
import NavItem from "../ui/nav-item";
import { LuSettings, LuUsers } from "react-icons/lu";
import { PiPulseBold } from "react-icons/pi";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export default function LayoutSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center px-0 mt-4">
        <SidebarGroup className="group-data-[state=collapsed]:px-3.5 transition-[padding] duration-100">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="box-content px-0! bg-transparent! h-fit overflow-visible group-data-[collapsible=icon]:size-10!" asChild>
                <Link href={"/"} className="flex items-center gap-3 ">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                    <Image
                      src={"/logo.svg"}
                      width={40}
                      height={40}
                      alt="logo"
                      className="block"
                    />
                  </div>

                  <div className="overflow-hidden whitespace-nowrap transition-[width,opacity] duration-100">
                    <div className="text-xl font-bold leading-none">
                      AutoMedMl
                    </div>
                    <div className="text-xs text-muted-foreground leading-none">
                      AI-powered analysis
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="mt-10">
        <SidebarGroup className="flex flex-col gap-2.5 group-data-[collapsible=icon]:gap-0 duration-200">
          <SidebarGroupLabel className="text-muted-foreground px-3 font-semibold text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1 font-semibold">
            <SidebarMenu>
              <NavItem href={"/"}>
                <FiMessageSquare strokeWidth={2} size={16} /> Chat
              </NavItem>
              <NavItem href={"/patients"}>
                <LuUsers strokeWidth={2} size={16} /> Patients
              </NavItem>
              <NavItem href={"/analysis"}>
                <PiPulseBold strokeWidth={3} size={16} /> Analysis
              </NavItem>
              <NavItem href={"/settings"}>
                <LuSettings strokeWidth={2} size={16} /> Settings
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}