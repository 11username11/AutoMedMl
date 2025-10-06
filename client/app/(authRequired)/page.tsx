import ChatSidebar from "@/components/pages/chat/chat-sidebar";
import Chat from "@/components/pages/chat/chat";
import { getPatients } from "@/lib/data/server/patient";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { CHAT_SIDEBAR_COOKIE_NAME } from "@/lib/constants";

export default async function Home() {
  const [chats, cookieStore] = await Promise.all([getPatients(), cookies()])
  const defaultIsMinimized = cookieStore.get(CHAT_SIDEBAR_COOKIE_NAME)?.value === "true"

  return (
    <div className={cn("flex flex-1 gap-8 p-6 overflow-hidden")}>
      <ChatSidebar chats={chats} defaultIsMinimized={defaultIsMinimized}></ChatSidebar>

      <Chat></Chat>
    </div>
  );
}
