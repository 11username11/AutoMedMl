import api from "@/lib/axios";
import { User } from "@/lib/types/user";
import { getAuthStore } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";
import { cache } from "react";
import toast from "react-hot-toast";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const response = await api.get(`/user_info`);

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

export const logout = async () => {
  try {
    await api.get("/logout");

    toast.success("You are logged out!")
    getAuthStore().getState().clearUser();

    return true
  }
  catch (error) {
    toast.error("Failed to log out!")
    return false
  }
}