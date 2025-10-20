'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submit-btn";
import { useEditMode } from "@/hooks/use-edit-mode";
import api from "@/lib/axios";
import { Patient } from "@/lib/types/patient";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Edit, Save, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Buttons({ isPending, patient }: { isPending: boolean, patient: Patient }) {
  const t = useTranslations("PatientPage")

  const { isEditing, enableEdit, cancelEdit } = useEditMode()

  const router = useRouter()

  const [open, setOpen] = useState(false)

  const closeDialog = () => setOpen(false)

  const { mutateAsync, isPending: isDeleteLoading } = useMutation({
    mutationFn: (patient_id: string) => api.post("/delete_patient", { patient_id }),
    onSuccess: () => {
      router.push("/patients")
    },
  })

  const handleDelete = () => toast.promise(mutateAsync(patient.patient_id), {
    loading: t("actions.delete.loading"),
    error: t("actions.delete.error"),
    success: t("actions.delete.success")
  })

  return (
    <div className="flex gap-4 flex-wrap">
      {isEditing ? (
        <>
          <SubmitButton className="flex-1" isPending={isPending}>
            <Save size={20}></Save>
            {t("buttons.save")}
          </SubmitButton>
          <Button className="flex-1" onClick={cancelEdit} size={"lg"} variant={"outline"}>
            <X size={20}></X>
            {t("buttons.cancel")}
          </Button>
        </>
      ) : (
        <Button onClick={enableEdit} className="flex-1" size={"lg"} variant={"secondary"}>
          <Edit size={20}></Edit>
          {t("buttons.edit")}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"lg"} variant={"destructive"} className="flex-1">
            <Trash2 size={20}></Trash2>
            {t("buttons.delete")}
          </Button>
        </DialogTrigger>
        <DialogContent className="pb-4">
          <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" />{t("confirmModal.title")}</DialogTitle>
          <DialogDescription className="space-y-4" asChild>
            <div>
              <div className="whitespace-pre-line">
                {t.rich("confirmModal.description", {
                  strong: (children) => <span className="font-semibold text-destructive">{children}</span>,
                  underline: (children) => <span className="underline">{children}</span>,
                  name: `${patient.name} ${patient.surname}`
                })}
              </div>

              <div className="ml-auto flex w-fit gap-2">
                <Button onClick={closeDialog} size={"lg"} variant={"outline"}>{t("confirmModal.cancelButton")}</Button>
                <SubmitButton isPending={isDeleteLoading} onClick={handleDelete} size={"lg"} variant={"destructive"}>
                  {t("confirmModal.confirmButton")}
                </SubmitButton>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

    </div>
  )
}