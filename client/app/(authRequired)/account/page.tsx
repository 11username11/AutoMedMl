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
import { Calendar, Edit, Key, Mail, Save, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import DangerZone from "@/components/pages/account/danger-zone"
import { format, isValid } from "date-fns"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { UserSchema } from "@/lib/schemas/account"

export default function Account() {
  const t = useTranslations("AccountPage")

  const router = useRouter()
  const user = useAuthStore((state) => state.user!)

  const { isEditing, enableEdit, cancelEdit } = useEditMode()

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      ...user,
      password: ""
    },
  })

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: z.infer<typeof UserSchema>) => api.post("/change_user", data),
      onSuccess: (data) => {
        router.refresh()
        form.resetField('password')
      },
    }
  )

  function onSubmit(data: z.infer<typeof UserSchema>) {
    const currentData = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: ""
    }

    if (isEqual(currentData, data))
      toast.success(t("form.submit.noChanges"))
    else
      toast.promise(mutateAsync(data), {
        loading: t("form.submit.loading"),
        error: (error: ApiError) => error.response?.data.detail ?? t("form.submit.error"),
        success: (success: ApiResponse) => success.data.message ?? t("form.submit.success")
      })

    cancelEdit()
  }

  useEffect(() => {
    form.reset()
  }, [isEditing])

  const registrationDate = new Date(user.registration_date)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-auto">
        <div className="flex flex-col p-10 space-y-4">
          <div className="flex justify-between flex-col gap-4 lg:flex-row lg:gap-24 lg:items-center">
            <div>
              <div className="text-3xl font-bold">{t("title")}</div>
              <div className="text-muted">{t("description")}</div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <SubmitButton isPending={isPending}>
                    <Save size={20}></Save>
                    {t("buttons.save")}
                  </SubmitButton>
                  <Button onClick={cancelEdit} size={"lg"} variant={"outline"}>
                    <X size={20}></X>
                    {t("buttons.cancel")}
                  </Button>
                </>
              ) : (
                <Button onClick={enableEdit} size={"lg"} variant={"secondary"}>
                  <Edit size={20}></Edit>
                  {t("buttons.edit")}
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-center flex-col p-6 rounded-md gap-4 items-center bg-primary border shadow-sm">
              <Avatar className="w-24 h-24 text-2xl" letters={user.name[0] + user.surname[0]}></Avatar>
              <div className="font-semibold text-lg">{user.name} {user.surname}</div>
              {isValid(registrationDate) && (
                <div className="text-muted flex items-center gap-2 text-sm">
                  <Calendar size={16}></Calendar>
                  <div>
                    {t("memberSince")} <span className="font-semibold"> {format(registrationDate, "dd.MM.yyyy")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md p-4 space-y-6 bg-primary border shadow-sm">

            <div className="flex gap-2 items-center text-xl font-semibold">
              <User size={20} className="text-secondary"></User>
              {t("form.title")}
            </div>

            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <div className="font-semibold">
                  {t("form.fullName.label")}
                </div>
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
                <div className="font-semibold flex gap-2 items-center">
                  <Mail size={16}></Mail>
                  {t("form.email.label")}
                </div>
                <EditableField text={user.email} isEditing={isEditing} name="email"></EditableField>
              </div>

              <div className="text-sm space-y-1">
                <div className="font-semibold flex gap-2 items-center">
                  <Key size={16}></Key>
                  {t("form.password.label")}
                </div>
                <EditableField text={"••••••••"} isEditing={isEditing} type="password" name="password"></EditableField>
              </div>
            </div>

          </div>

          <DangerZone></DangerZone>
        </div>
      </form>
    </Form>
  )
}