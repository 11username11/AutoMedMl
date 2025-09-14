import { Chat, Chats, Message } from "@/lib/types/chat"
import { create } from "zustand"

interface chatState {
  text: string,
  setText: (text: string) => void,
  chatId: string,
  setChatId: (chatId: string) => void,
  chats: Chats,
  messages: Record<string, Message[]>,
  setMessages: (id: string, messages: Message[]) => void,
  addMessage: (id: string, message: Message) => void,
  updateMessage: (id: string, chunk: string) => void
}

export const useChat = create<chatState>((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  chatId: "main",
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
      console.log(updated[updated.length - 1], chunk)
      return { messages: { ...state.messages, [id]: updated } }
    })
}))