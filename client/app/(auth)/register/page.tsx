'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputField } from "@/components/ui/input-field"
import { Dropzone, DropzoneContent, DropzoneEmptyState, renderBytes } from "@/components/ui/shadcn-io/dropzone"
import { RegisterSchema } from "@/lib/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import z from "zod"
import api, { ApiError, ApiResponse } from "@/lib/axios"
import SubmitButton from "@/components/ui/submit-btn"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Check, UploadIcon } from "lucide-react"

interface RegistrationResponse extends ApiResponse {
  verify: boolean
}

export default function Login() {
  const t = useTranslations("AuthPages.register.form")

  const router = useRouter()

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: FormData) => api.post<RegistrationResponse>("/registration", data),
      onSuccess: async (response) => {
        if (response.data.verify) {
          window.location.reload()
        }
        else {
          router.push("/login?isVerifying=true")
        }
      }
    }
  )

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      code: "",
      verification: []
    }
  })

  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("surname", data.surname)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("code", data.code)
    formData.append("doc", data.verification[0])

    toast.promise(mutateAsync(formData), {
      loading: t("submit.loading"),
      error: (error: ApiError) => error.response?.data.detail ?? t("submit.error"),
      success: t("submit.success")
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-md w-full">
      <div className="font-medium">{t("header.title")}</div>
      <div className="text-muted text-sm">{t("header.description")}</div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-3">
          <div className="flex gap-4 items-start">
            <InputField
              name="name"
              label={t("firstName.label")}
              type="text"
              placeholder={t("firstName.placeholder")}
              className="p-3 shadow-none h-12"
            />
            <InputField
              name="surname"
              label={t("lastName.label")}
              type="text"
              placeholder={t("lastName.placeholder")}
              className="p-3 shadow-none h-12"
            />
          </div>

          <InputField
            name="email"
            label={t("email.label")}
            type="email"
            placeholder={t("email.placeholder")}
            className="p-3 shadow-none h-12"
          />

          <InputField
            name="password"
            label={t("password.label")}
            type="password"
            placeholder={t("password.placeholder")}
            className="p-3 shadow-none h-12"
          />

          <InputField
            name="code"
            label={t("code.label")}
            type="text"
            placeholder={t("code.placeholder")}
            className="p-3 shadow-none h-12"
          />

          <FormField
            control={form.control}
            name={"verification"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dropzone.label")}</FormLabel>
                <FormControl>
                  <Dropzone
                    accept={{ 'image/*': [] }}
                    maxFiles={1}
                    multiple={false}
                    maxSize={1024 * 1024 * 10}
                    onDrop={field.onChange}
                    onError={console.error}
                    src={field.value}
                  >
                    <DropzoneEmptyState>
                      <div className='flex flex-col gap-2 items-center justify-center'>
                        <div className="flex items-center justify-center rounded-md text-muted-foreground">
                          <UploadIcon size={24} />
                        </div>
                        <div className="w-full truncate text-wrap text-secondary text-xs">
                          Upload file or drag and drop
                        </div>
                        <div className="text-wrap text-muted font-light text-xs">
                          {t.rich("dropzone.description", {
                            types: "PNG, JPEG",
                            size: "10.00 MB"
                          })}
                        </div>
                      </div>
                    </DropzoneEmptyState>
                    <DropzoneContent>
                      <div className="flex flex-col gap-3.5 items-center justify-center">
                        {field.value.length > 0 && (
                          <div className="space-y-0.5 text-sm text-primary dark:text-foreground">
                            <div className="font-semibold">{field.value[0].name}</div>
                          </div>
                        )}
                        <div onClick={(e) => {
                          e.stopPropagation()
                          field.onChange([])
                        }} className="border rounded-sm p-2 px-3 bg-background/70 backdrop-blur-xs hover:bg-accent hover:brightness-90 duration-200">{t("dropzone.buttons.remove")}</div>
                      </div>
                    </DropzoneContent>
                  </Dropzone>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />


          <SubmitButton isPending={isPending}>
            Sign Up
          </SubmitButton>
        </form>
      </Form>
      <div className="text-muted text-sm text-center mt-2">
        Already have an account? <Link href={"/login"} className="text-foreground underline">Sign In</Link>
      </div>
    </div>
  )
}