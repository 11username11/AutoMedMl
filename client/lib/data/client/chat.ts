import { useChat } from "@/hooks/use-chat"
import api, { baseURL } from "@/lib/axios"
import { queryClient } from "@/lib/react-query"
import { Chat, Chats, Message } from "@/lib/types/chat"

export const getChat = async (chat_id = "main") => {
  const chat = await api.get<Chat>(`/chat_history/${chat_id}`)

  return chat.data
}

export const getChats = async () => {
  try {
    const chats = await api.get<Chats>("/patients")

    return chats.data
  } catch (error) {
    return []
  }
}

export const sendMessage = async (message: string) => {
  const response = await api.post("/send_message", message)

  return { ok: response.status !== 200 }
}

export async function streamMessage(chatId: string, text: string) {
  const systemMessageId = crypto.randomUUID();

  const userMessage: Message = {
    id: crypto.randomUUID(),
    sender: "user",
    text,
    timestamp: new Date(),
  }

  useChat.getState().addMessage(chatId, userMessage);

  useChat.getState().addMessage(chatId, {
    id: systemMessageId,
    sender: "system",
    text: "",
    timestamp: new Date(),
  });


  queryClient.setQueryData<Chat>(["chat", chatId], (old) => {
    if (!old) {
      return {
        patient_id: chatId,
        name: "",
        surname: "",
        messages: [userMessage, { ...userMessage, id: systemMessageId, sender: "system", text: "" }],
      };
    }
    return {
      ...old,
      messages: [
        ...old.messages,
        userMessage,
        { id: systemMessageId, sender: "system", text: "", timestamp: new Date() },
      ],
    };
  });

  const response = await fetch(`${baseURL}/send_message`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
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
    useChat.getState().updateMessage(chatId, chunk);
  }

  queryClient.setQueryData<Chat>(["chat", chatId], (old) => {
    if (!old) return old;
   
    return { ...old, messages: useChat.getState().messages[chatId]};
  });
}