'use client'

import { getChat } from "@/lib/data/client/chat";
import { useQuery } from "@tanstack/react-query";
import { RiRobot2Line } from "react-icons/ri";
import Avatar from "@/components/ui/avatar";
import { useAuthStore } from "@/providers/AuthProvider";
import { formatToHHMM, scrollDown } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { Chat } from "@/lib/types/chat";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatWindowSkeleton from "./skeletons/chat-window-skeleton";
import { useSearchParams } from "next/navigation";

export default function ChatWindow() {
  const params = useSearchParams()

  const user = useAuthStore((state) => state.user)
  const setMessages = useChat((state) => state.setMessages)
  const messages = useChat((state) => state.messages)
  const chatId = params.get("chat") || "main"

  const containerRef = useRef<HTMLDivElement>(null)

  const [showSkeleton, setShowSkeleton] = useState(true);

  const { data: chat, isLoading, isError, error } = useQuery<Chat>({
    queryKey: ["chat", chatId],
    queryFn: () => getChat(chatId || "main"),
    staleTime: Infinity
  });

  useLayoutEffect(() => {
    if (!chat) return;

    setMessages(chatId, chat.messages);
  }, [chat, chatId]);

  useLayoutEffect(() => {
    scrollDown(containerRef, "instant")
  }, [messages])

  useLayoutEffect(() => {
    setShowSkeleton(true)

    if (!isLoading) {
      const timeout = setTimeout(() => setShowSkeleton(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <div className="flex relative h-full overflow-hidden">
      {showSkeleton && (
        <div className={`absolute inset-0 transition-opacity bg-background duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
          <ChatWindowSkeleton rows={6} />
        </div>
      )}
      <div ref={containerRef} className="flex flex-col gap-4 h-full rounded-md overflow-y-auto pb-4 pr-4">
        <div className="flex flex-col items-start gap-4">
          {
            !isLoading && user &&  (messages[chatId] || []).map((message, index) => (
              <div key={new Date(message.timestamp).getTime() + index} data-sender={message.sender} className="flex items-start w-9/12 data-[sender=user]:flex-row-reverse data-[sender=user]:ml-auto gap-4">
                {
                  message.sender == "system" ?
                    (
                      <div className="p-2 rounded-full bg-secondary text-accent-foreground">
                        <RiRobot2Line size={20} />
                      </div>
                    ) :
                    (
                      <Avatar letters={user.name[0] + user.surname[0]}></Avatar>
                    )
                }

                <div className="flex flex-col gap-2 text-muted bg-primary-foreground/40 p-3 rounded-md">
                  <div className="text-sm wrap-anywhere">
                    {message.text}
                  </div>
                  <div className="text-xs">{formatToHHMM(new Date(message.timestamp))}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}