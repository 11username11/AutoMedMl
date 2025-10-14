import { baseURL } from "@/lib/axios";
import {  Chats } from "@/lib/types/chat";
import { cookies } from "next/headers";

export const chatExists = async (chat_id = "main") => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/chat_history/${chat_id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return false;
    }

    return true
  } catch (error) {
    return false
  }
}

export const getChats = async () => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/patients`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return [];
    }

    const data: Chats = await response.json();

    return data
  } catch (error) {
    return []
  }
}