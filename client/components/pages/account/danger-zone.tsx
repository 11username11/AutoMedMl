import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submit-btn";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";

export default function DangerZone() {

  const [open, setOpen] = useState(false)

  const closeDialog = () => setOpen(false)

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
    <div className="rounded-md p-4 space-y-6 shadow-sm bg-gradient-card">
      <div>
        <div className="text-2xl font-semibold text-destructive">Danger Zone</div>
        <div className="text-muted text-sm font-light">Irreversible and destructive actions</div>
      </div>

      <div className="flex justify-between sm:flex-row flex-col sm:gap-8 gap-4 bg-destructive/5 border border-destructive/20 p-4 rounded-md">
        <div>
          <div className="text-destructive">Delete Account</div>
          <div className="text-sm text-muted font-light">Once you delete your account, there is no going back. Please be certain.</div>
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
  )
}