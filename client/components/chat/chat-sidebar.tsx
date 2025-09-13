'use client'

import { FiUser } from "react-icons/fi";
import SearchInput from "../ui/search-input";
import { Separator } from "../ui/separator";
import { RiRobot2Line } from "react-icons/ri";
import NewCase from "../ui/new-case-btn";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button"
import { create } from "zustand";
import { Chat } from "@/lib/types/chat";

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

interface chatSidebarState {
  isMinimized: boolean,
  toggleSidebar: () => void,
  setIsMinimized: (isMinimized: boolean) => void,
  minimizeChatSidebar: () => void
  maximizeChatSidebar: () => void
}

export const useChatSidebar = create<chatSidebarState>((set) => ({
  isMinimized: false,
  toggleSidebar: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setIsMinimized: (isMinimized) => set(() => ({ isMinimized })),
  minimizeChatSidebar: () => set(() => ({ isMinimized: true })),
  maximizeChatSidebar: () => set(() => ({ isMinimized: false }))
}))

const ICON_SIZE = "2.25rem"

export default function ChatSidebar({ chats }: { chats: Chat[] }) {
  const isMinimized = useChatSidebar(state => state.isMinimized)
  const toggleSidebar = useChatSidebar(state => state.toggleSidebar)
  const setIsMinimized = useChatSidebar(state => state.setIsMinimized)

  const [searchTerm, setSearchTerm] = useState("")
  const filteredChats = chats.filter((chat) =>
    Object.values(chat).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className={cn("flex flex-col gap-3 h-full w-96 shrink-0 duration-200 overflow-hidden", isMinimized && "w-[calc(var(--chat-sidebar-width-icon)+(--spacing(5.5*2)))]")} style={{ "--chat-sidebar-width-icon": ICON_SIZE } as React.CSSProperties}>

      <div className="flex gap-2 items-center w-full">
        <NewCase data-isminimized={isMinimized} variant="secondary" className="w-full data-[isminimized=true]:h-9 data-[isminimized=true]:px-0 data-[isminimized=true]:gap-0 data-[isminimized=true]:w-9"></NewCase>
        <Button data-isminimized={isMinimized} onClick={toggleSidebar} variant="ghost" size="icon" className="h-10 w-10 data-[isminimized=true]:h-9 data-[isminimized=true]:w-9 cursor-pointer bg-primary border hover:bg-primary-foreground"><PanelLeft></PanelLeft></Button>
      </div>

      <div onClick={() => setIsMinimized(false)} className={cn("flex flex-col gap-2 w-full border bg-primary rounded-md h-full overflow-hidden duration-200 p-3")}>
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
              <div key={chat.chat_id} className={cn("flex gap-2.5 rounded-md whitespace-nowrap hover:bg-primary-foreground/40 duration-200 cursor-pointer p-2.5 items-center box-content")}>
                <div className="bg-primary-foreground rounded-full p-2.5">
                  <FiUser size={16} />
                </div>
                <div className={cn("overflow-hidden max-w-full w-96 duration-200", isMinimized && "w-0")}>
                  <div className="font-medium text-[15px] truncate">
                    {chat.name}
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