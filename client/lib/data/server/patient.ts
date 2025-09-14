import { baseURL } from "@/lib/axios";
import { Patient } from "@/lib/types/patient";
import { cookies } from "next/headers";

export const getPatients = async () => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/patients`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return [];
    }

    const data : Patient[] = await response.json();

    return data
  } catch (error) {
    return []
  }
}