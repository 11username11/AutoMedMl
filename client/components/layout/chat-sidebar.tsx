'use client'

import { FiUser } from "react-icons/fi";
import SearchInput from "../ui/search-input";
import { Separator } from "../ui/separator";
import { RiRobot2Line } from "react-icons/ri";
import NewCase from "../ui/new-case-btn";
import { useState } from "react";
import { cn } from "@/lib/utils";
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

const mockChats = [
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John1 Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation, Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
];

const ICON_SIZE = "2.25rem"

export default function ChatSidebar({ isMinimized }: { isMinimized: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredChats = mockChats.filter((chat) =>
    Object.values(chat).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (

    <div className={cn("flex flex-col gap-3 h-full w-96 shrink-0 duration-200 overflow-hidden", isMinimized && "w-[calc(var(--chat-sidebar-width-icon)+(--spacing(5.5*2)))]")} style={{ "--chat-sidebar-width-icon": ICON_SIZE } as React.CSSProperties}>
      <div className="font-semibold">Chats</div>

      <NewCase variant="secondary" isMinimized={isMinimized}></NewCase>

      <div className={cn("flex flex-col gap-2 w-full border bg-primary rounded-md h-full overflow-hidden duration-200 p-3")}>
        <div className={cn("flex gap-3 text-accent-foreground bg-secondary overflow-hidden p-2.5 rounded-md items-center box-content")}>
          <div className="p-2 rounded-full bg-secondary-foreground">
            <RiRobot2Line size={20} />
          </div>
          <div className={cn("whitespace-nowrap max-w-full w-96 duration-200", isMinimized && "w-0")}>
            <div className="font-semibold">AI Consultation</div>
            <div className="text-xs font-light">
              General medical assistance
            </div>
          </div>
        </div>

        <Separator></Separator>

        <div className="flex flex-col gap-2 h-full overflow-hidden">
            <div className="text-muted text-xs font-semibold px-1">
              Patients
            </div>
          <SearchInput
            isMinimized={isMinimized}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></SearchInput>

          <div className={cn("flex flex-col gap-2 overflow-y-auto scrollbar-thin", isMinimized ? "overflow-x-hidden scrollbar-hidden" : "pr-2")}>
            {filteredChats.map((chat, index) => (
              <div key={chat.patientName + index} className={cn("flex gap-2.5 rounded-md whitespace-nowrap hover:bg-primary-foreground/40 duration-200 cursor-pointer p-2.5 items-center box-content")}>
                <div className="bg-primary-foreground rounded-full p-2.5">
                  <FiUser size={16} />
                </div>
                <div className={cn("overflow-hidden max-w-full w-96 duration-200", isMinimized && "w-0")}>
                  <div className="font-medium text-[15px] truncate">
                    {chat.patientName}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}