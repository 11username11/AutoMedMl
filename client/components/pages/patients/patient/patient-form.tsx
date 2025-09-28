'use client'
import Avatar from "@/components/ui/avatar"
import { Patient } from "@/lib/types/patient"
import { Activity, Clock, Router, User } from "lucide-react"
import StatusBadge from "@/components/ui/status-badge";
import { PatientTabs } from "@/components/pages/patients/patient/patient-tabs";
import Buttons from "@/components/pages/patients/patient/buttons";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema } from "@/lib/schemas/patient";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PatientForm({ patient }: { patient: Patient }) {
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: z.infer<typeof PatientSchema>) => api.post("/update_patient", data),
      onSuccess: (data) => {
        router.refresh()
      },
    }
  )

  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: patient,
  })

  function onSubmit(data: z.infer<typeof PatientSchema>) {
    toast.promise(mutateAsync(data), {
      loading: "Verifying your data",
      error: (error) => "Something went wrong",
      success: (success) => "You have successfully update a patient!"
    })
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="h-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col p-10 gap-8 h-full">

            <div className="flex justify-between">
              <div>
                <div className="text-3xl font-bold">Patient Details</div>
                <div className="text-muted">Comprehensive patient information and records</div>
              </div>

              <Buttons isPending={isPending}></Buttons>
            </div>

            <div className="flex gap-4 p-4 rounded-md bg-primary items-center border">
              <Avatar className="h-full aspect-square w-auto text-2xl" letters={patient.name[0] + patient.surname[0]} />
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-xl font-semibold">{`${patient.name} ${patient.surname}`}</div>
                    <div className="text-muted text-sm">Patient ID: {patient.patient_id}</div>
                  </div>
                  {StatusBadge(patient.status)}
                </div>
                <div className="flex gap-12">
                  <div className="flex gap-2 items-center text-sm">
                    <User className="text-secondary" size={20}></User>
                    {patient.age} years old
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <Clock className="text-secondary" size={20}></Clock>
                    Last visit: {new Date(patient.last_visit).toLocaleDateString()}</div>
                  <div className="flex gap-2 items-center text-sm">
                    <Activity className="text-secondary" size={20}></Activity>
                    {patient.gender}
                  </div>
                </div>
              </div>
            </div>

            <PatientTabs patient={patient}></PatientTabs>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}