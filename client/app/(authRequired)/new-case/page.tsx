'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/ui/input-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import SubmitButton from "@/components/ui/submit-btn";

export const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^[A-Za-z]+$/, { message: "Name can only contain letters" }),

  surname: z
    .string()
    .trim()
    .min(2, { message: "Surname must be at least 2 characters long" })
    .regex(/^[A-Za-z]+$/, { message: "Surname can only contain letters" }),

  email: z
    .email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\+?\d{10,15}$/.test(val), {
      message: "Phone number must be 10–15 digits (with optional +)",
    }),

  age: z
    .string()
    .trim()
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 18 && num <= 100
    }, { message: "Age must be a number between 18 and 100" }),

  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),

  medical_history: z.string().optional(),
})

export default function NewCase() {
  const router = useRouter()

  const { mutate, isError, isPending, error, } = useMutation(
    {
      mutationFn: (data: z.infer<typeof FormSchema>) => api.post("/new-case", data),
      onSuccess: () => {
        toast.success("You have created a new patient!")

        router.push("/patients")
      },
    }
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      age: "",
      gender: "female",
      medical_history: ""
    }
  })

  function osSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data)
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    router.back()
  }

  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="p-4">
        <div className="text-3xl font-bold">Create New Patient</div>
        <div className="text-muted">Add a new patient to the system</div>
      </div>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(osSubmit)} className="p-4 bg-primary rounded-md flex flex-col gap-4 w-full">
          <div className="flex gap-4 items-start">
            <div className="space-y-4 flex-1">
              <InputField
                control={form.control}
                name="name"
                label="First Name *"
                type="text"
                placeholder="Enter first name"
              />
              <InputField
                control={form.control}
                name="surname"
                label="Last Name *"
                type="text"
                placeholder="Enter last name"
              />
              <InputField
                control={form.control}
                name="email"
                label="Email *"
                type="email"
                placeholder="Enter email address"
              />
              <InputField
                control={form.control}
                name="phone"
                label="Phone Number *"
                type="text"
                placeholder="Enter phone number"
              />
              <div className="flex gap-4">
                <InputField
                  control={form.control}
                  name="age"
                  label="Age *"
                  type="number"
                  placeholder="Age"
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel>Gender *</FormLabel>
                      <FormControl>
                        <Select defaultValue={"female"} onValueChange={field.onChange}>
                          <SelectTrigger size="large" className="w-full cursor-pointer bg-background">
                            <SelectValue></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>
              </div>
            </div>

            <FormField
              control={form.control}
              name="medical_history"
              render={({ field }) => (
                <FormItem className="flex-1 h-full flex flex-col">
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter relevant medical history, allergies, medications, etc."
                      className="resize-none h-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>
            </FormField>
          </div>

          <Separator></Separator>

          <div className="flex gap-4 text-sm font-semibold ">
            <SubmitButton className="w-auto" isPending={isPending}>
              <div className="flex items-center justify-center gap-2">
                <Save strokeWidth={2.5} size={16}></Save>
                Create Patient
              </div>
            </SubmitButton>
            <button className="p-2 px-6 bg-background border rounded-md cursor-pointer hover:bg-primary-foreground duration-200" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </Form>

    </div>
  )
}