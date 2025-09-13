import { Chat, Message } from "@/lib/types/chat"
import { create } from "zustand"

interface chatState {
  text: string,
  setText: (text: string) => void,
  chatId: string,
  setChatId: (chatId: string) => void,
  chats: Chat[],
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  addMessage: (message: Message) => void,
  updateMessage: (id: string, partial: Partial<Message> | ((prev: Message) => Partial<Message>)) => void
}

export const useChat = create<chatState>((set) => ({
  text: "",
  setText: (text: string) => set({ text }),
  chatId: "main",
  setChatId: (chatId: string) => set({ chatId }),
  chats: [],
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, partial) =>
    set((state) => ({
      messages: state.messages.map((message) => {
        if (message.id !== id) return message;
        const patch = typeof partial === 'function' ? partial(message) : partial;
        return { ...message, ...patch };
      }),
    }))
}))