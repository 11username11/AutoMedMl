export interface Message {
  id: string,
  sender: "system" | "user",
  text: string,
  timestamp: Date
}

export interface ChatBase {
  patient_id: string;
  surname: string;
  name: string;
}

export type Chats = ChatBase[];

export interface Chat extends ChatBase {
  messages: Message[];
}