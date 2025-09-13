import api from "@/lib/axios"
import { Chat } from "@/lib/types/chat"

export const getChat = async (chat_id = "main") => {
  const chat = await api.get<Chat>(`/chat_history/${chat_id}`)

  return chat.data
}

export const getChats = async () => {
  try {
    const chats = await api.get<Chat[]>("/patients")
    console.log(chats)
    return chats.data
  } catch (error) {
    return []
  }
}

export const sendMessage = async (message: string) => {
  const response = await api.post("/send_message", message)

  return { ok: response.status !== 200 }
}