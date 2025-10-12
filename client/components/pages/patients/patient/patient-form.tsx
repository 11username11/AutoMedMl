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
import api, { ApiError, ApiResponse } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { differenceInYears, parse } from "date-fns";
import { isEqual } from "lodash-es"
import { useEditMode } from "@/hooks/use-edit-mode";

export default function PatientForm({ patient }: { patient: Patient }) {
  const router = useRouter()

  const { cancelEdit } = useEditMode()

  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: z.infer<typeof PatientSchema>) => api.post("/update_patient", {
        patient_id: patient.patient_id,
        ...data
      }),
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
    if (isEqual(patient, {
      patient_id: patient.patient_id,
      ...data
    }))
      toast.success("No changes made")
    else
      toast.promise(mutateAsync(data), {
        loading: "Verifying your data",
        error: (error: ApiError) => error.response?.data.detail ?? "Something went wrong",
        success: (success: ApiResponse) => success.data.message ?? "You have update a patient!"
      })

    cancelEdit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col p-10 gap-4 h-full">

          <div className="flex justify-between flex-col gap-4 lg:flex-row">
            <div>
              <div className="text-3xl font-bold">Patient Details</div>
              <div className="text-muted">Comprehensive patient information and records</div>
            </div>

            <Buttons patient={patient} isPending={isPending}></Buttons>
          </div>

          <div className="flex gap-4 p-4 rounded-md bg-primary items-center shadow-sm ">
            <Avatar className="h-full aspect-square w-auto text-2xl" letters={patient.name[0] + patient.surname[0]} />
            <div className="flex flex-col gap-4 w-full overflow-hidden">
              <div className="flex justify-between overflow-hidden items-start lg:flex-row flex-col gap-4">
                <div className="space-y-1 overflow-hidden w-full">
                  <div className="text-xl font-semibold">{`${patient.name} ${patient.surname}`}</div>
                  <div className="text-muted text-sm text-nowrap overflow-hidden text-ellipsis">Patient ID: {patient.patient_id}</div>
                </div>
                {<StatusBadge status={patient.status} />}
              </div>
              <div className="flex gap-12">
                <div className="flex gap-2 items-center text-sm">
                  <User className="text-secondary" size={20}></User>
                  {differenceInYears(new Date(), parse(patient.date_of_birth, "dd.MM.yyyy", new Date()))} years old
                </div>
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
  )
}