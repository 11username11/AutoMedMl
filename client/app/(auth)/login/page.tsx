'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { InputField } from "@/components/ui/input-field"
import { LoginSchema } from "@/lib/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import z from "zod"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import SubmitButton from "@/components/ui/submit-btn"
import { AxiosError, AxiosResponse } from "axios"
import api from "@/lib/axios"
import { useSearchParams } from "next/navigation"

export default function Login() {
  const params = useSearchParams()
  const isVerifying = params.get("isVerifying")

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: async (data: z.infer<typeof LoginSchema>) => {
        return api.post<{ detail: string }>("/login", data)
      },
      onSuccess: async () => {
        window.location.reload()
      },
    }
  )

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  })

  function osSubmit(data: z.infer<typeof LoginSchema>) {
    toast.promise(mutateAsync(data), {
      loading: "Verifying your data",
      error: (error: AxiosError<{ detail: string }>) => error?.response?.data.detail || "Something went wrong",
      success: (success: AxiosResponse<{ detail: string }>) => success.data.detail || "You are logged in"
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-md w-full">
      <div className="space-y-1">
        <div className="font-medium text-lg">Welcome back</div>
        <div className="text-muted text-sm">Enter your credentials to access your account</div>
      </div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(osSubmit)} className="flex flex-col gap-4 mt-3">
          <div className="flex gap-4 items-start">
            <div className="space-y-4 flex-1">
              <InputField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="doctor@hospital.com"
                className="p-3 shadow-none h-12"
              />
              <InputField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                className="p-3 shadow-none h-12"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => {
                return (
                  <FormItem
                    className="flex flex-row items-center gap-2"
                  >
                    <FormControl>
                      <Checkbox />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
            <div className="text-secondary hover:underline cursor-pointer">
              Forgot password?
            </div>
          </div>
          <SubmitButton isPending={isPending}>Sign In</SubmitButton>
        </form>
      </Form>
      <div className="text-muted text-sm text-center mt-2">
        Don't have an account? <Link href={"/register"} className="text-foreground underline underline-offset-2">Sign Up</Link>
      </div>
      {isVerifying && (
        <div className="text-center text-sm" suppressHydrationWarning={true}>
          <div>We are veryfing your account</div>
          <div>It can take a while</div>
        </div>
      )}
    </div>
  )
}