'use client'

import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectTrigger, SelectLabel } from "@/components/ui/select";
import { LuPalette, LuShield } from "react-icons/lu";
import { GoSignOut } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { FaRegTrashCan } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { logout } from "@/lib/data/client/user";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/ui/logout-btn";

export default function Settigs() {
  const router = useRouter();
  const { setTheme, theme } = useTheme()

  const handleThemeChange = (value: string) => setTheme(value)

  return (
    <div className="flex flex-col items-center gap-8 p-6 h-full w-full">
      <div className="flex flex-col gap-8">
        <div>
          <div className="text-3xl font-bold">Settings</div>
          <div className="text-muted">Manage your account preferences and application settings</div>
        </div>

        <div className="bg-primary border p-4 rounded-md">
          <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <LuPalette size={24} />
                Appearance
              </div>
              <div className="text-muted text-sm">Customize the look and fell of the application</div>
            </div>

            <div className="flex flex-col gap-1 mt-auto">
              <div className="font-semibold text-sm">Theme</div>
              <Select defaultValue={theme || "system"} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full cursor-pointer bg-background">
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Themes</SelectLabel>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-primary border p-4 rounded-md">
          <div className="flex gap-1 items-center">
            <div><LuShield size={20} /></div>
            <div className="text-xl font-semibold">Account Actions</div>
          </div>
          <div className="text-muted text-sm">Manage your account and security settings</div>

          <div className="flex flex-col gap-3 mt-3">
            <div className="flex justify-between items-center p-3 bg-background rounded-md">
              <div>
                <div className="font-semibold">Log Out</div>
                <div className="text-sm text-muted">Log out of your account on this device</div>
              </div>
              <LogoutButton>
                <div className="flex items-center justify-center text-sm py-2 font-semibold gap-2 px-3 border bg-primary rounded-md cursor-pointer hover:bg-primary-foreground duration-200">
                  <GoSignOut strokeWidth={1} />
                  Log Out
                </div>
              </LogoutButton>
            </div>

            <Separator></Separator>

            <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-md flex items-center justify-between gap-8">
              <div>
                <div className="text-destructive font-semibold">Delete Account</div>
                <div className="text-sm text-muted">Permanently delete your account and all associated data</div>
              </div>

              <div className="flex items-center gap-2 font-semibold text-accent-foreground text-sm p-2 bg-destructive/80 rounded-md hover:bg-destructive duration-200 cursor-pointer">
                <FaRegTrashCan />
                Delete Account
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
