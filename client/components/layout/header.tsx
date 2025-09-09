'use client'

import { FaChevronDown } from "react-icons/fa6";
import { SidebarTrigger } from "../ui/sidebar";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/providers/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { logout } from "@/lib/data/client/user";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((store) => store.user)

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) router.refresh();
  };

  return (
    <div className="flex py-2 px-6 items-center w-full border-b border-b-sidebar-border bg-sidebar">

      {user ? (
        <>
          <SidebarTrigger className="cursor-pointer [&>svg]:size-5 p-5"></SidebarTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer ml-auto hover:bg-primary-foreground rounded-sm px-2.5 py-1.5 duration-200">
                <div className="rounded-full flex items-center justify-center text-accent-foreground bg-secondary-foreground w-10 h-10">
                  {user.name[0] + user.surname[0]}
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user.email}
                  </div>
                </div>
                <FaChevronDown className="text-muted-foreground text-xs" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full flex items-center justify-center text-accent-foreground bg-secondary-foreground w-10 h-10">
                      {user.name[0] + user.surname[0]}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex gap-2 font-semibold text-sm ml-auto">
          <Link href={"/login"} className="flex gap-2 items-center group cursor-pointer p-2 px-3 hover:bg-primary-foreground rounded-md duration-200">
            <LogIn className="group-hover:translate-x-0.5 duration-200 will-change-transform" size={18} />
            Login
          </Link>
          <Link href={"/register"} className="flex items-center gap-2 p-2 px-3 bg-secondary text-accent-foreground hover:bg-secondary-foreground duration-200 rounded-sm">
            <UserPlus size={18}></UserPlus>
            Register
          </Link>
        </div >
      )}
    </div >
  )
}