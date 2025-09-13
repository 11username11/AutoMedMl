export interface Message{
  id: string,
  sender: "system" | "user",
  text: string,
  timestamp: Date
}

export interface Chat{
  chat_id: string,
  name: string,
  messages: Message[]
}