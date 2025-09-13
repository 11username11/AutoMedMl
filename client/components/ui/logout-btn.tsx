import { logout } from "@/lib/data/client/user";
import React from "react";

export default function LogoutButton({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    const ok = await logout();

    if (ok) window.location.reload()
  };

  return <div onClick={handleLogout}>{children}</div>
}