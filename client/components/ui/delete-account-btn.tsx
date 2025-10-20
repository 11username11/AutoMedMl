'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submit-btn";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DeleteAccountBtn({ children = "Delete Account" }: { children?: React.ReactNode }) {
  const t = useTranslations("global.modals.deleteAccount")

  const [open, setOpen] = useState(false)
  const router = useRouter()

  const closeDialog = () => setOpen(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => api.get("/delete_account"),
    onSuccess: () => {
      router.refresh()
    },
  })

  const handleDelete = () => toast.promise(mutateAsync, {
    loading: t("submit.loading"),
    success: t("submit.success"),
    error: t("submit.error")
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button size={"lg"} variant={"destructive"}>
          <Trash2 size={20} />
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-4">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="space-y-4" asChild>
            <div>
              <div>
                {t.rich("description", {
                  ul: (children) => <ul className="list-disc list-inside mt-2 space-y-1">{children}</ul>,
                  li: (children) => <li>{children}</li>
                })}
              </div>

              <div className="ml-auto flex w-fit gap-2">
                <Button onClick={closeDialog} size={"lg"} variant={"outline"}>{t("buttons.cancel")}</Button>
                <SubmitButton isPending={isPending} onClick={handleDelete} size={"lg"} variant={"destructive"}>
                  {t("buttons.submit")}
                </SubmitButton>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}