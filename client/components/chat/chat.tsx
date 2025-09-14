'use client'

import { useState } from "react";
import { LuSend } from "react-icons/lu";
import { useChatSidebar } from "./chat-sidebar";
import ChatWindow from "./chat-window";
import { type Chat } from "@/lib/types/chat";
import { Textarea } from "../ui/textarea";
import { useSearchParams } from "next/navigation";
import { streamMessage } from "@/lib/data/client/chat";

export default function Chat() {
  const params = useSearchParams()

  const minimizeChatSidebar = useChatSidebar((state) => state.minimizeChatSidebar);
  const chatId = params.get("chat") || "main"

  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async () => {
    const userMessage = text.trim();
    if (!userMessage) return;

    setIsStreaming(true)
    setText("")

    await streamMessage(chatId, userMessage)

    setIsStreaming(false)
  };

  return (
    <div className="relative w-full flex flex-col h-full">
      <div className="text-2xl font-bold mb-2">Medical AI Chat</div>
      <div className="text-muted mb-4">
        Get instant medical information and guidance from our AI assistant
      </div>

      <div onClick={minimizeChatSidebar} className="flex flex-col h-full overflow-hidden">
        <ChatWindow></ChatWindow>

        <div className="flex gap-2 mb-2 items-end">
          <Textarea
            className="bg-primary"
            placeholder="Type your medical question here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isStreaming}></Textarea>
          <button
            onClick={handleSend}
            disabled={isStreaming || !text.trim()}
            className="flex items-center justify-center shrink-0 h-10 w-10 p-2 rounded-md bg-secondary text-accent-foreground hover:bg-secondary-foreground cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-default disabled:hover:bg-secondary"
          >
            <LuSend size={18} />
          </button>
        </div>
      </div>
      <div className="text-center text-xs text-muted">
        This AI assistant provides general information only. Always consult
        healthcare professionals for medical advice.
      </div>
    </div>
  );
}