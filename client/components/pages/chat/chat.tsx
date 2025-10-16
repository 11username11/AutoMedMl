'use client'

import { useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useChatSidebar } from "./chat-sidebar";
import ChatWindow from "./chat-window";
import { Chat as ChatType } from "@/lib/types/chat";
import { useRouter, useSearchParams } from "next/navigation";
import { getChat, streamMessage } from "@/lib/data/client/chat";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/use-chat";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { scrollDown } from "@/lib/utils";

export default function Chat() {
  const params = useSearchParams()
  const router = useRouter()

  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  const minimizeChatSidebar = useChatSidebar((state) => state.minimizeChatSidebar);
  const chatId = useChat((state) => state.chatId) ?? params.get("chat") ?? "main"
  const setChatId = useChat((state) => state.setChatId)
  const isStreaming = useChat((state) => state.isStreaming)
  const setIsStreaming = useChat((state) => state.setIsStreaming)
  const setMessages = useChat((state) => state.setMessages)
  const setIsLoading = useChat((state) => state.setIsLoading)

  const [text, setText] = useState("");

  const { data: chat, isLoading, isError } = useQuery<ChatType>({
    queryKey: ["chat", chatId],
    queryFn: () => getChat(chatId || "main"),
    staleTime: Infinity,
    retry: false
  });
  console.log({isLoading, isError})
  useEffect(() => {
    if (!chat || !chatId) return;

    setMessages(chatId, chat.messages);

    requestAnimationFrame(() => scrollDown(containerRef, "instant"))
  }, [chat, chatId]);

  const handleSend = async () => {
    const userMessage = text.trim();
    if (!userMessage) return;

    setIsStreaming(true)
    setText("")

    await streamMessage(chatId, userMessage)

    setIsStreaming(false)
  };

  useEffect(() => {
    if (isStreaming) {
      scrollDown(containerRef, "instant")
    } else
      textareaRef.current?.focus()
  }, [isStreaming])

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    setChatId("main")
    router.push(`/?chat=${"main"}`)
  }

  if (isError) return (
    <div onClick={minimizeChatSidebar} className="w-full flex max-h-full flex-col overflow-hidden">

      <div className="relative flex flex-col h-full overflow-hidden items-center justify-center bg-primary gap-4 border rounded-md">
        <MessageCircle size={48}></MessageCircle>
        <div className="text-2xl font-bold">Chat doesn't exist</div>
        <Button onClick={handleBack} size={"lg"} variant={"secondary"}>Back to main chat</Button>
      </div>
    </div >
  )

  return (
    <div onClick={minimizeChatSidebar} className="w-full flex max-h-full flex-col overflow-hidden">
      <div className="text-2xl font-bold mb-2">Medical AI Chat</div>
      <div className="text-muted mb-4">
        Get instant medical information and guidance from our AI assistant
      </div>

      <div className="relative flex flex-col h-full overflow-hidden">
        <ChatWindow ref={containerRef}></ChatWindow>
        <div className="invisible min-h-16 p-2 box-content"></div>
        <div className="absolute bottom-0 flex gap-2 items-end w-full p-2">
          <Textarea
            ref={textareaRef}
            className="bg-primary dark:bg-primary max-h-52 resize-none"
            placeholder="Type your medical question here"
            value={text}
            onKeyDown={handleEnter}
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