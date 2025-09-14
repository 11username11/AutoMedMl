import Chat from "@/components/chat/chat";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { getPatients } from "@/lib/data/server/patient";
import { cn } from "@/lib/utils";

export default async function Home() {
  const chats = await getPatients()

  return (
    <div className={cn("flex gap-8 p-6 h-full overflow-hidden")}>
        <ChatSidebar chats={chats}></ChatSidebar>

        <Chat></Chat>
    </div>
  );
}
