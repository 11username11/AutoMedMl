'use client'

import SearchInput from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { RiRobot2Line } from "react-icons/ri";
import NewCaseBtn from "@/components/ui/new-case-btn";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn, filterBySearch } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button"
import { create } from "zustand";
import Avatar from "@/components/ui/avatar";
import { useChat } from "@/hooks/useChat";
import { CHAT_SIDEBAR_COOKIE_NAME, ICON_SIZE } from "@/lib/constants";
import { Chats } from "@/lib/types/chat";
import { useRouter, useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";

interface chatSidebarState {
  isMinimized: boolean,
  toggleSidebar: () => void,
  openOverride: boolean | undefined,
  setOpenOverride: (openOverride: boolean) => void,
  setIsMinimized: (isMinimized: boolean) => void,
  minimizeChatSidebar: () => void
  maximizeChatSidebar: () => void
}

export const useChatSidebar = create<chatSidebarState>((set) => ({
  isMinimized: false,
  openOverride: undefined,
  setOpenOverride: (openOverride) => set((state) => ({ openOverride })),
  toggleSidebar: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setIsMinimized: (isMinimized) => set({ openOverride: true, isMinimized }),
  minimizeChatSidebar: () => set(() => ({ isMinimized: true })),
  maximizeChatSidebar: () => set(() => ({ isMinimized: false }))
}))

export default function ChatSidebar({ chats, defaultIsMinimized }: { chats: Chats, defaultIsMinimized: boolean }) {
  const router = useRouter()
  const params = useSearchParams()

  const openOverride = useChatSidebar(state => state.openOverride);
  const isMinimized = useChatSidebar(state => state.isMinimized);
  const chatId = useChat((state) => state.chatId) ?? params.get("chat") ?? "main"
  const toggleSidebar = useChatSidebar(state => state.toggleSidebar)
  const setIsMinimized = useChatSidebar(state => state.setIsMinimized)
  const setChatId = useChat((state) => state.setChatId)

  const effectiveMinimized = openOverride === undefined
    ? defaultIsMinimized
    : isMinimized;

  useLayoutEffect(() => {
    const initialChatId = params.get("chat") || "main"
    setChatId(initialChatId)
  }, [])

  const parentRef = useRef<HTMLDivElement>(null)

  const [searchTerm, setSearchTerm] = useState("")

  const filteredChats = useMemo(
    () => filterBySearch(chats, searchTerm, ["name", "surname"]),
    [chats, searchTerm]
  )

  const rowVirtualizer = useVirtualizer({
    count: filteredChats.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
    initialRect: { height: 1200, width: 0 }
  })

  const handleChatChange = (id: string) => {
    setChatId(id)
    router.push(`/?chat=${id}`)
  }

  useEffect(() => {
    setIsMinimized(defaultIsMinimized)
  }, [defaultIsMinimized])

  useEffect(() => {
    document.cookie = `${CHAT_SIDEBAR_COOKIE_NAME}=${isMinimized};path=/;max-age=${60 * 60 * 24 * 7}`
  }, [isMinimized])

  return (
    <div
      data-minimized={effectiveMinimized}
      className={"flex flex-col gap-3 w-96 shrink-0 duration-200 overflow-hidden group data-[minimized=true]:w-[calc(var(--chat-sidebar-width-icon)+(--spacing(5.5*2)))]"}
      style={{ "--chat-sidebar-width-icon": ICON_SIZE } as React.CSSProperties}
    >
      <div className="flex gap-2 items-center w-full">
        <NewCaseBtn
          variant="outline"
          className="w-full group-data-[minimized=true]:h-9 group-data-[minimized=true]:px-0 group-data-[minimized=true]:gap-0 group-data-[minimized=true]:min-w-4"
        />
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="h-10 w-10 group-data-[minimized=true]:h-9 group-data-[minimized=true]:w-9 cursor-pointer bg-primary border hover:bg-primary-foreground"
        >
          <PanelLeft size={24} />
        </Button>
      </div>

      <div
        onClick={() => setIsMinimized(false)}
        className="flex flex-col gap-2 w-full border bg-primary rounded-md h-full overflow-hidden duration-200 p-3"
      >
        <div
          onClick={() => handleChatChange("main")}
          data-active={chatId == "main"}
          className="flex gap-2.5 rounded-md whitespace-nowrap hover:bg-primary-foreground/40 duration-200 cursor-pointer p-2.5 items-center box-content data-[active=true]:text-accent-foreground data-[active=true]:bg-secondary">
          <div className="p-2 rounded-full bg-secondary-foreground">
            <RiRobot2Line size={20} />
          </div>
          <div className="group-data-[minimized=true]:opacity-0 whitespace-nowrap max-w-full w-96 duration-200 group-data-[minimized=true]:w-0">
            <div className="font-semibold">AI Consultation</div>
            <div className="text-xs font-light">
              General medical assistance
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 h-full overflow-hidden">
          <div className="text-muted text-xs font-semibold px-1">
            Patients
          </div>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div ref={parentRef} className="overflow-y-auto scrollbar-thin scrollbar-custom group-data-[minimized=true]:overflow-x-hidden group-data-[minimized=true]:scrollbar-hidden w-full">
            <div
              className="w-full"
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const chat = filteredChats[virtualRow.index]
                return (
                  <div
                    key={chat.patient_id}
                    onClick={() => handleChatChange(chat.patient_id)}
                    data-active={chatId == chat.patient_id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      marginBottom: 4,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex gap-2.5 rounded-md whitespace-nowrap hover:bg-primary-foreground/40 transition-colors duration-200 cursor-pointer p-2.5 items-center w-full data-[active=true]:text-accent-foreground data-[active=true]:bg-secondary"
                  >
                    <Avatar
                      className="h-9 w-9 group-data-[minimized=true]:text-xs"
                      letters={chat.name[0] + chat.surname[0]}
                    />
                    <div className="overflow-hidden max-w-full w-96 duration-200 group-data-[minimized=true]:w-0">
                      <div className="font-medium text-[15px] truncate">
                        {chat.name} {chat.surname}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}