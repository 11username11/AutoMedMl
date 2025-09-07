'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputField } from "@/components/ui/input-field"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { RegisterSchema } from "@/lib/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import Link from "next/link"
import z from "zod"

export default function Login() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
      name: "",
      surname: "",
      verification: undefined
    }
  })

  function osSubmit(data: z.infer<typeof RegisterSchema>) {
    console.log(data)
  }

  return (
    <div className="flex justify-center p-6 h-full">
      <div className="flex flex-col items-center gap-8 justify-center  max-w-md w-full p-6 ">
        <div className="flex flex-col gap-2 rounded-md w-full">
          <div className="font-medium">Create your account</div>
          <div className="text-muted text-sm">Already have an account? <Link href={"/login"} className="text-foreground hover:underline">Sign In</Link></div>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(osSubmit)} className="flex flex-col gap-4 mt-3">
              <div className="flex gap-4">
                <InputField
                  control={form.control}
                  name="name"
                  label="First name"
                  type="text"
                  placeholder="John"
                  className="p-3 shadow-none h-12"
                />
                <InputField
                  control={form.control}
                  name="surname"
                  label="Password"
                  type="text"
                  placeholder="Doe"
                  className="p-3 shadow-none h-12"
                />
              </div>

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

              <InputField
                control={form.control}
                name="code"
                label="Invitation code"
                type="text"
                placeholder="Enter code"
                className="p-3 shadow-none h-12"
              />

              <FormField
                control={form.control}
                name={"verification"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identify verification</FormLabel>
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
                        <DropzoneEmptyState />
                        <DropzoneContent />
                      </Dropzone>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />


              <button className="flex items-center justify-center gap-2 font-semibold text-sm h-12 p-2 px-4 w-full bg-secondary text-accent-foreground rounded-sm cursor-pointer hover:bg-secondary-foreground duration-200">
                Sign Up
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div >
  )
}