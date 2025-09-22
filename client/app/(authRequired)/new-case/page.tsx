'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/ui/input-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import SubmitButton from "@/components/ui/submit-btn";
import { GENDER, STATUS } from "@/lib/constants";

export const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^\p{L}+$/u, { message: "Name can only contain letters" }),

  surname: z
    .string()
    .trim()
    .min(2, { message: "Surname must be at least 2 characters long" })
    .regex(/^\p{L}+$/u, { message: "Surname can only contain letters" }),

  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address",
    }),

  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .optional()
    .refine(
      (val) => !val || /^\+?\d{10,15}$/.test(val),
      { message: "Phone number must be 10–15 digits (with optional +)" }
    ),

  age: z
    .string()
    .trim()
    .min(1, { message: "Age is required" })
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 150
    }, { message: "Age must be a number between 0 and 150" }),

  gender: z.enum(GENDER, {
    message: "Please select a gender",

  }),
  status: z.enum(STATUS, {
    message: "Please select a status",
  }),

  medical_history: z.string().optional(),
})

export default function NewCase() {
  const router = useRouter()

  const { mutateAsync, isError, isPending, error, } = useMutation(
    {
      mutationFn: (data: z.infer<typeof FormSchema>) => api.post("/add_patient", data),
      onSuccess: (data) => {
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
      gender: "Female",
      status: "Active Treatment",
      medical_history: ""
    }
  })

  function osSubmit(data: z.infer<typeof FormSchema>) {
    mutateAsync(data)
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
        <form onSubmit={form.handleSubmit(osSubmit)} className="p-4 rounded-md flex flex-col gap-4 w-full">
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
                label="Email"
                type="email"
                placeholder="Enter email address"
              />

              <InputField
                control={form.control}
                name="phone"
                label="Phone Number"
                type="text"
                placeholder="Enter phone number"
              />

              <div className="flex gap-4 items-start">
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
                        <Select defaultValue={GENDER[0]} onValueChange={field.onChange}>
                          <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                            <SelectValue ></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {GENDER.map((gender) => <SelectItem key={gender} value={gender}>{gender}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel>Status *</FormLabel>
                      <FormControl>
                        <Select defaultValue={STATUS[0]} onValueChange={field.onChange}>
                          <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                            <SelectValue></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {STATUS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
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
                      className="resize-none h-full bg-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>
            </FormField>
          </div>

          <div className="flex gap-4 text-sm font-semibold ">
            <SubmitButton className="w-auto" isPending={isPending}>
              <div className="flex items-center justify-center gap-2">
                <Save strokeWidth={2.5} size={16}></Save>
                Create Patient
              </div>
            </SubmitButton>
            <button className="h-10 px-6 bg-primary border rounded-md cursor-pointer hover:bg-primary-foreground duration-200" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </Form>

    </div>
  )
}