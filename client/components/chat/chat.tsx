'use client'

import { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useChatSidebar } from "./chat-sidebar";
import { baseURL } from "@/lib/axios";
import { useAuthStore } from "@/providers/AuthProvider";
import ChatWindow from "./chat-window";
import { Message, type Chat } from "@/lib/types/chat";
import { Textarea } from "../ui/textarea";
import { useChat } from "@/hooks/useChat";

export default function Chat() {
  const minimizeChatSidebar = useChatSidebar((state) => state.minimizeChatSidebar);
  const addMessage = useChat((state) => state.addMessage)
  const updateMessage = useChat((state) => state.updateMessage)
  const chatId = useChat((state) => state.chatId)

  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const appendMessage = (sender: Message["sender"]) => {
    const id = crypto.randomUUID();
    const message: Message = {
      id,
      text: sender === "user" ? text : "",
      sender,
      timestamp: new Date(),
    };

    addMessage(message)

    return id
  }

  const handleSend = async () => {
    const userMessage = text.trim();
    if (!userMessage) return;

    appendMessage("user")
    const id = appendMessage("system")

    setText("");

    setIsStreaming(true)

    try {
      const response = await fetch(`${baseURL}/send_message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId || "main",
          text: userMessage,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk)

        updateMessage(id, (message) => ({
          text: message.text + chunk
        }))
      }

      reader.releaseLock();
    } catch (error) {
      console.error("Streaming error:", error);
    }

    setIsStreaming(false)
  };

  return (
    <div className="relative w-full flex flex-col h-full">
      <div className="text-2xl font-bold mb-2">Medical AI Chat</div>
      <div className="text-muted mb-4">
        Get instant medical information and guidance from our AI assistant
      </div>

      <ChatWindow chatId={chatId}></ChatWindow>

      <div className="flex gap-2 mb-2 items-end">
        <Textarea
          className="bg-primary"
          placeholder="Type your medical question here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={minimizeChatSidebar}
          disabled={isStreaming}></Textarea>
        <button
          onClick={handleSend}
          disabled={isStreaming || !text.trim()}
          className="flex items-center justify-center shrink-0 h-10 w-10 p-2 rounded-md bg-secondary text-accent-foreground hover:bg-secondary-foreground cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-default disabled:hover:bg-secondary"
        >
          <LuSend size={18} />
        </button>
      </div>
      <div className="text-center text-xs text-muted">
        This AI assistant provides general information only. Always consult
        healthcare professionals for medical advice.
      </div>
    </div>
  );
}