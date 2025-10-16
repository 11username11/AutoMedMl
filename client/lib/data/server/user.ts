import { cookies } from "next/headers";
import { cache } from 'react';
import { User } from "@/lib/types/user";
import { baseURL } from "../../axios";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/user_info`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

