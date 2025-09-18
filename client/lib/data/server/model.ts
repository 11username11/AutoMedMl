import { baseURL } from "@/lib/axios";
import { AnalysisModel } from "@/lib/types/model";
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

    const data: AnalysisModel[] = await response.json();

    return data
  } catch (error) {
    return []
  }
}

export const getModel = async (modelName : string) => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${baseURL}/model/${modelName}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    if (!response.ok) {
      return undefined;
    }

    const data: AnalysisModel = await response.json();

    return data
  } catch (error) {
    return undefined
  }
}