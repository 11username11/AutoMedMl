'use client'

import { FaChevronDown } from "react-icons/fa6";
import { SidebarTrigger } from "../ui/sidebar";
import { LogIn, LogOut, User as UserIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import LogoutButton from "../ui/logout-btn";
import { User } from "@/lib/types/user";
import Avatar from "../ui/avatar";

export default function Header({ user }: { user: User | null }) {
  return (
    <div className="flex py-2 px-6 items-center w-full border-b border-b-sidebar-border bg-sidebar sticky top-0 z-10">
      {user ? (
        <>
          <SidebarTrigger className="cursor-pointer p-4"></SidebarTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="group flex items-center gap-2 cursor-pointer ml-auto hover:bg-primary-foreground rounded-sm px-2.5 py-1.5 duration-200">
                <Avatar letters={user.name[0] + user.surname[0]}></Avatar>

                <div>
                  <div className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user.email}
                  </div>
                </div>
                <FaChevronDown className="text-muted-foreground text-xs group-data-[state=open]:rotate-180 duration-200" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)]" align="end">
              <DropdownMenuGroup>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <Avatar letters={user.name[0] + user.surname[0]}></Avatar>

                    <div>
                      <div className="text-sm font-semibold text-foreground whitespace-nowrap">
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
                    <UserIcon className="h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </LogoutButton>
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