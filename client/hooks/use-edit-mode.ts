"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function useEditMode() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isEditing = searchParams.get("mode") === "edit"

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

  return { isEditing, enableEdit, cancelEdit }
}