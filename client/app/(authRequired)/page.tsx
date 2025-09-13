import Chat from "@/components/chat/chat";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { getChats } from "@/lib/data/client/chat";
import { cn } from "@/lib/utils";

export default async function Home() {
  const chats = await getChats()

  return (
    <div className={cn("flex gap-8 p-6 h-full overflow-hidden")}>
      <ChatSidebar chats={chats}></ChatSidebar>

      <Chat></Chat>
    </div>
  );
}
