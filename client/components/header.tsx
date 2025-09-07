import { FaChevronDown } from "react-icons/fa6";
import { SidebarTrigger } from "./ui/sidebar";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const user = undefined

  return (
    <div className="flex py-2 px-6 items-center w-full border-b border-b-sidebar-border bg-sidebar">
      <SidebarTrigger className="cursor-pointer mr-auto"></SidebarTrigger>

      {user ? (
        <div className="flex items-center gap-2 cursor-pointer hover:bg-primary-foreground rounded-sm px-2.5 py-1.5 duration-200">
          <div className="rounded-full flex items-center justify-center text-accent-foreground bg-secondary-foreground w-10 h-10">
            DS
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">
              Dr. Smith
            </div>
            <div className="text-muted-foreground text-xs">
              dr.smith@medical.com
            </div>
          </div>
          <FaChevronDown className="text-muted-foreground text-xs" />
        </div>
      ) : (
        <div className="flex gap-2 font-semibold text-sm">
          <Link href={"/login"} className="flex gap-2 items-center group cursor-pointer p-2 px-3 hover:bg-primary-foreground rounded-md duration-200">
            <LogIn className="group-hover:translate-x-0.5 duration-200 will-change-transform" size={18} />
            Login
          </Link>
          <Link href={"/register"} className="flex items-center gap-2 p-2 px-3 bg-secondary text-accent-foreground rounded-sm">
            <UserPlus size={18}></UserPlus>
            Register
          </Link>
        </div >
      )}
    </div >
  )
}