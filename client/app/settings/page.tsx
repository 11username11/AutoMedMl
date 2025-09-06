import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectTrigger, SelectLabel } from "@/components/ui/select";
import { LuPalette, LuShield } from "react-icons/lu";
import { MdLanguage } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { FaRegTrashCan } from "react-icons/fa6";

export default function Settigs() {
  return (
    <div className="flex flex-col items-center gap-8 p-6 h-full w-full">
      <div className="flex flex-col gap-8">
        <div>
          <div className="text-3xl font-bold">Settings</div>
          <div className="text-muted">Manage your account preferences and application settings</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary border border-border p-4 rounded-md">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <MdLanguage size={24} />
                  Language & Region
                </div>
                <div className="text-muted text-sm">Choose your preferred language and regional settings</div>
              </div>

              <div className="flex flex-col gap-1 mt-auto">
                <div className="font-semibold text-sm">Language</div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full cursor-pointer bg-background">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-primary border border-border p-4 rounded-md">
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
                <Select defaultValue="light">
                  <SelectTrigger className="w-full cursor-pointer bg-background">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Themes</SelectLabel>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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
                <div className="font-semibold">Sign Out</div>
                <div className="text-sm text-muted">Sign out of your account on this device</div>
              </div>
              <div className="flex items-center justify-center text-sm py-2 font-semibold gap-2 px-3 border bg-primary rounded-md cursor-pointer hover:bg-primary-foreground duration-200">
                <GoSignOut />
                Sign Out
              </div>
            </div>

            <Separator></Separator>

            <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-md flex items-center justify-between">
              <div>
                <div className="text-destructive font-semibold">Delete Account</div>
                <div className="text-sm text-muted">Permanently delete your account and all associated data</div>
              </div>

              <div className="flex items-center gap-2 text-primary text-sm p-2 bg-destructive/80 rounded-md hover:bg-destructive duration-200 cursor-pointer">
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
