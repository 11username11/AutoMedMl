'use client'

import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-btn";
import { useEditMode } from "@/hooks/use-edit-mode";
import { Edit, Save, Trash2, X } from "lucide-react";

export default function Buttons({ isPending }: { isPending: boolean }) {
  const { isEditing, enableEdit, cancelEdit } = useEditMode()

  return (
    <div className="space-x-4">
      {isEditing ? (
        <>
          <SubmitButton isPending={isPending} onClick={enableEdit}>
            <Save size={20}></Save>
            Save
          </SubmitButton>
          <Button type="button" onClick={cancelEdit} size={"lg"} variant={"outline"}>
            <X size={20}></X>
            Cancel Edit
          </Button>
        </>
      ) : (
        <Button type="button" onClick={enableEdit} size={"lg"} variant={"secondary"}>
          <Edit size={20}></Edit>
          Edit Patient
        </Button>
      )}

      <Button type="button" size={"lg"} variant={"destructive"}>
        <Trash2 size={20}></Trash2>
        Delete Patient
      </Button>
    </div>
  )
}