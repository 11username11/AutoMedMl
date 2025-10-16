import ChatSidebar from "@/components/pages/chat/chat-sidebar";
import { CHAT_SIDEBAR_COOKIE_NAME } from "@/lib/constants";
import { getPatients } from "@/lib/data/server/patient";
import { cookies } from "next/headers";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const [chats, cookieStore] = await Promise.all([getPatients(), cookies()])
  const defaultIsMinimized = cookieStore.get(CHAT_SIDEBAR_COOKIE_NAME)?.value === "true"

  return (
    <div className="flex  flex-1 gap-8 p-6 overflow-hidden">
      <ChatSidebar chats={chats} defaultIsMinimized={defaultIsMinimized}/>
      {children}
    </div>
  )
}