import { Chats, Message } from "@/lib/types/chat"
import { create } from "zustand"

interface chatState {
  text: string,
  setText: (text: string) => void,
  chatId: string | undefined,
  setChatId: (chatId: string) => void,
  chats: Chats,
  messages: Record<string, Message[]>,
  setMessages: (id: string, messages: Message[]) => void,
  addMessage: (id: string, message: Message) => void,
  updateMessage: (id: string, chunk: string) => void,
  isStreaming: boolean,
  setIsStreaming: (isStreaming: boolean) => void,
}

export const useChat = create<chatState>((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  chatId: undefined,
  setChatId: (chatId: string) => set({ chatId }),
  chats: [],
  messages: {},
  setMessages: (id: string, messages: Message[]) => set((state) => ({ messages: { ...state.messages, [id]: messages } })),
  addMessage: (id: string, message: Message) => set((state) => ({ messages: { ...state.messages, [id]: [...(state.messages[id] || []), message] } })),
  updateMessage: (id, chunk) =>
    set((state) => {
      const messages = state.messages[id] || []

      if (!messages.length) return state
      const updated = [...messages]
      updated[updated.length - 1].text += chunk

      return { messages: { ...state.messages, [id]: updated } }
    }),
  isStreaming: false,
  setIsStreaming: (isStreaming: boolean) => set({ isStreaming })
}))