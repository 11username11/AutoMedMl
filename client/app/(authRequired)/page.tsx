import ChatSidebar from "@/components/pages/chat/chat-sidebar";
import Chat from "@/components/pages/chat/chat";
import { getPatients } from "@/lib/data/server/patient";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { CHAT_SIDEBAR_COOKIE_NAME } from "@/lib/constants";
import { chatExists } from "@/lib/data/server/chat";
import { notFound } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<{ chat: string }> }) {
  const { chat } = (await searchParams)

  const [chats, cookieStore, initialChat] = await Promise.all([getPatients(), cookies(), chatExists(chat)])
  const defaultIsMinimized = cookieStore.get(CHAT_SIDEBAR_COOKIE_NAME)?.value === "true"

  if (!initialChat) notFound()

  return (
    <div className={cn("flex flex-1 gap-8 p-6 overflow-hidden")}>
      <ChatSidebar chats={chats} defaultIsMinimized={defaultIsMinimized}></ChatSidebar>

      <Chat></Chat>
    </div>
  );
}
