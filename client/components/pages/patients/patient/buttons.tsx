'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submit-btn";
import { useEditMode } from "@/hooks/use-edit-mode";
import api from "@/lib/axios";
import { Patient } from "@/lib/types/patient";
import { useMutation } from "@tanstack/react-query";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Buttons({ isPending, patient }: { isPending: boolean, patient: Patient }) {
  const { isEditing, enableEdit, cancelEdit } = useEditMode()

  const router = useRouter()

  const [open, setOpen] = useState(false)

  const closeDialog = () => setOpen(false)

  const { mutateAsync, isPending : isDeleteLoading } = useMutation({
    mutationFn: (patient_id: string) => api.post("/delete_patient", { patient_id }),
    onSuccess: () => {
      router.push("/patients")
    },
  })

  const handleDelete = () => toast.promise(mutateAsync(patient.patient_id), {
    loading: "Deleting the patient...",
    error: "Something went wrong",
    success: "The patient was successfully deleted"
  })

  return (
    <div className="flex gap-4 flex-wrap">
      {isEditing ? (
        <>
          <SubmitButton className="flex-1" isPending={isPending}>
            <Save size={20}></Save>
            Save
          </SubmitButton>
          <Button className="flex-1" onClick={cancelEdit} size={"lg"} variant={"outline"}>
            <X size={20}></X>
            Cancel Edit
          </Button>
        </>
      ) : (
        <Button onClick={enableEdit} size={"lg"} variant={"secondary"}>
          <Edit size={20}></Edit>
          Edit Patient
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"lg"} variant={"destructive"} className="flex-1">
            <Trash2 size={20}></Trash2>
            Delete Patient
          </Button>
        </DialogTrigger>
        <DialogContent className="pb-4">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription className="space-y-4" asChild>
              <div>
                <div>
                  This will permanently delete <span className="font-bold">{patient.name} {patient.surname}</span>'s record. This action cannot be undone.
                </div>

                <div className="ml-auto flex w-fit gap-2">
                  <Button onClick={closeDialog} size={"lg"} variant={"outline"}>Cancel</Button>
                  <SubmitButton isPending={isDeleteLoading} onClick={handleDelete} size={"lg"} variant={"destructive"}>
                    Yes, delete this patient
                  </SubmitButton>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}