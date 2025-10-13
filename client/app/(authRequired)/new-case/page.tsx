'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/ui/input-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import SubmitButton from "@/components/ui/submit-btn";
import { GENDER, STATUS } from "@/lib/constants";
import { PatientSchema } from "@/lib/schemas/patient";

export default function NewCase() {
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: z.infer<typeof PatientSchema>) => api.post("/add_patient", data),
      onSuccess: (data) => {
        router.push("/patients")
      },
    }
  )

  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "Female",
      status: "Active Treatment",
      medical_history: ""
    }
  })

  function onSubmit(data: z.infer<typeof PatientSchema>) {
    toast.promise(mutateAsync(data), {
      loading: "Verifying your data",
      error: (error) => "Something went wrong",
      success: (success) => "You have created a new patient!"
    })
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    router.back()
  }

  return (
    <div className="flex flex-col p-10 gap-8">
      <div>
        <div className="text-3xl font-bold">Create New Patient</div>
        <div className="text-muted">Add a new patient to the system</div>
      </div>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-md flex flex-col gap-4 w-full">
          <div className="flex gap-4 lg:items-start lg:flex-row flex-col w-full">
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

              <div className="flex gap-4 items-start flex-wrap">
                <InputField
                  control={form.control}
                  name="date_of_birth"
                  label="Date of birth *"
                  placeholder="DD.MM.YYYY"
                  inputType="calendar"
                  formItemClassName="min-w-fit"
                />

                <InputField
                  control={form.control}
                  name="gender"
                  label="Gender *"
                  inputType="select"
                  className="w-full cursor-pointer bg-primary"
                  formItemClassName="flex-1"
                  selectItems={[...GENDER]}>
                </InputField>

                <InputField
                  control={form.control}
                  name="status"
                  label="Status *"
                  inputType="select"
                  className="w-full cursor-pointer bg-primary"
                  formItemClassName="flex-1"
                  selectItems={[...STATUS]}>
                </InputField>
              </div>
            </div>

            <InputField
              control={form.control}
              name="medical_history"
              label="Medical History"
              inputType="textarea"
              placeholder="Enter relevant medical history, allergies, medications, etc."
              className="resize-none h-full bg-primary min-h-80"
              formItemClassName="flex-1 h-full flex flex-col">
            </InputField>

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