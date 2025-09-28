'use client'

import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-btn";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Buttons({ isPending }: { isPending: boolean }) {
  const router = useRouter()

  const searchParams = useSearchParams()

  const isEditing = searchParams.get("mode") == "edit"

  const enableEdit = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("mode", "edit")
    router.replace(`?${params.toString()}`)
  }

  const cancelEdit = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("mode")
    router.replace(`?${params.toString()}`)
  }

  return (
    <div className="space-x-4">
      {isEditing ? (
        <>
          <SubmitButton isPending={isPending} onClick={enableEdit}>
            <Save size={20}></Save>
            Save
          </SubmitButton>
          <Button type="button" onClick={cancelEdit} className="box-content" size={"lg"} variant={"outline"}>
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