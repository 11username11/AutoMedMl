import { cookies } from "next/headers";
import { cache } from 'react';
import { User } from "@/lib/types/user";
import api from "../../axios";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();

  try {
    const response = await api.get(`/user_info`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (response.status != 200) {
      return null;
    }

    const data = await response.data;

    return data
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

