'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { InputField } from "@/components/ui/input-field"
import { LoginSchema } from "@/lib/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import z from "zod"

export default function Login() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  function osSubmit(data: z.infer<typeof LoginSchema>) {
    console.log(data)
  }

  return (
    <div className="flex justify-center p-6 h-full">
      <div className="flex flex-col items-center justify-center gap-8  max-w-md w-full p-6 ">
        <div className="flex flex-col gap-2 rounded-md w-full">
          <div className="font-medium">Welcome back</div>
          <div className="text-muted text-sm">Don't have an account? <Link href={"/register"} className="text-foreground hover:underline">Sign Up</Link></div>
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
                <button className="text-secondary-foreground hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>
              <button className="flex items-center justify-center gap-2 font-semibold text-sm h-12 p-2 px-4 w-full bg-secondary text-accent-foreground rounded-sm cursor-pointer hover:bg-secondary-foreground duration-200">
                Sign In
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div >
  )
}