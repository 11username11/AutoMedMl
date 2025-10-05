'use client'

import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectTrigger, SelectLabel } from "@/components/ui/select";
import { LuPalette, LuShield } from "react-icons/lu";
import { GoSignOut } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import LogoutButton from "@/components/ui/logout-btn";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import SubmitButton from "@/components/ui/submit-btn";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Settigs() {
  const { setTheme, theme } = useTheme()
  const [open, setOpen] = useState(false)

  const closeDialog = () => setOpen(false)

  const handleThemeChange = (value: string) => setTheme(value)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => api.get("/delete_account"),
    onSuccess: () => {
      window.location.reload()
    },
    onError: () => {
      toast.error("Something went wrong")
    }
  })

  const handleDelete = () => mutateAsync()

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

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild >
                  <Button size={"lg"} variant={"destructive"}>
                    <Trash2 size={20} />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="pb-4">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="space-y-4" asChild>
                      <div>
                        <div>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All medical analyses and results</li>
                            <li>Patient records and associations</li>
                            <li>Account settings and preferences</li>
                            <li>Chat history and conversations</li>
                          </ul>
                        </div>

                        <div className="ml-auto flex w-fit gap-2">
                          <Button onClick={closeDialog} size={"lg"} variant={"outline"}>Cancel</Button>
                          <SubmitButton isPending={isPending} onClick={handleDelete} size={"lg"} variant={"destructive"}>
                            Yes, delete my account
                          </SubmitButton>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
