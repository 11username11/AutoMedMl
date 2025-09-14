import  { baseURL } from "@/lib/axios";
import { Chats } from "@/lib/types/chat";
import { Model } from "@/lib/types/model";
import { cookies } from "next/headers";

export const getModels = async () => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/models`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return [];
    }

    const data: Model[] = await response.json();

    return data
  } catch (error) {
    return []
  }
}