'use client'

import Avatar from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import EditableField from "@/components/ui/editable-field"
import { Form } from "@/components/ui/form"
import SubmitButton from "@/components/ui/submit-btn"
import { useEditMode } from "@/hooks/use-edit-mode"
import api, { ApiError, ApiResponse } from "@/lib/axios"
import { useAuthStore } from "@/providers/AuthProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { isEqual } from "lodash-es"
import { Calendar, Edit, Mail, Save, Trash2, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import DangerZone from "@/components/pages/account/danger-zone"

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.email("Invalid email")
})

export default function Account() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user!)

  const { isEditing, enableEdit, cancelEdit } = useEditMode()

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: z.infer<typeof UserSchema>) => api.post("/change_user", data),
      onSuccess: (data) => {
        router.refresh()
      },
    }
  )

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: user,
  })

  function onSubmit(data: z.infer<typeof UserSchema>) {
    if (isEqual(user, data))
      toast.success("No changes made")
    else
      toast.promise(mutateAsync(data), {
        loading: "Verifying your data",
        error: (error: ApiError) => error.response?.data.detail ?? "Something went wrong",
        success: (success: ApiResponse) => success.data.message ?? "Your data updated successfully"
      })

    cancelEdit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-auto">
        <div className="flex flex-col p-10 space-y-4">
          <div className="flex justify-between flex-col gap-4 lg:flex-row lg:gap-24 lg:items-center">
            <div>
              <div className="text-3xl font-bold">Account Settings</div>
              <div className="text-muted">Manage your personal information and account preferences</div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <SubmitButton isPending={isPending}>
                    <Save size={20}></Save>
                    Save
                  </SubmitButton>
                  <Button onClick={cancelEdit} size={"lg"} variant={"outline"}>
                    <X size={20}></X>
                    Cancel Edit
                  </Button>
                </>
              ) : (
                <Button onClick={enableEdit} size={"lg"} variant={"secondary"}>
                  <Edit size={20}></Edit>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-center flex-col p-6 rounded-md gap-4 items-center bg-gradient-card shadow-sm">
              <Avatar className="w-24 h-24 text-2xl" letters={user.name[0] + user.surname[0]}></Avatar>
              <div className="font-semibold text-lg">{user.name} {user.surname}</div>
              <div className="text-muted flex items-center gap-2 text-sm">
                <Calendar size={16}></Calendar>
                Member since {new Date(user.registration_date).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="rounded-md p-4 space-y-6 bg-gradient-card shadow-sm">

            <div className="flex gap-2 items-center text-xl font-semibold">
              <User size={20} className="text-secondary"></User>
              Personal Information
            </div>

            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <div className="font-semibold">Full Name</div>
                {isEditing ? (
                  <div className={"flex gap-2"}>
                    <EditableField text={user.name} isEditing={isEditing} name="name"></EditableField>
                    <EditableField text={user.surname} isEditing={isEditing} name="surname"></EditableField>
                  </div>
                ) : (
                  <div className="text-muted">{user.name} {user.surname}</div>
                )}
              </div>

              <div className="text-sm space-y-1">
                <div className="font-semibold flex gap-2 items-center"><Mail size={16}></Mail> Email</div>
                {isEditing ? (
                  <div className={"flex gap-2"}>
                    <EditableField text={user.email} isEditing={isEditing} name="email"></EditableField>
                  </div>
                ) : (
                  <div className="text-muted">{user.email}</div>
                )}
              </div>
            </div>

          </div>

          <DangerZone></DangerZone>
        </div>
      </form>
    </Form>
  )
}