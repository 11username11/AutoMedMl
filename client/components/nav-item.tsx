'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from "./ui/sidebar";

export default function NavItem({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href} className={`flex gap-3 px-3 p-1.5 items-center hover:text-secondary hover:bg-primary-foreground rounded-sm duration-200 ${isActive ? "text-accent-foreground! bg-secondary!" : "text-muted-foreground"}`}>
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>

  )
}