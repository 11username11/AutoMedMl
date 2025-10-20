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
import { useTranslations } from "next-intl";

export default function PatientForm({ patient }: { patient: Patient }) {
  const t = useTranslations("PatientPage")
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
    console.log(patient, {patient_id: patient.patient_id,
      ...data})
    if (isEqual(patient, {
      patient_id: patient.patient_id,
      ...data
    }))
      toast.success(t("actions.submit.noChanges"))
    else
      toast.promise(mutateAsync(data), {
        loading: t("actions.submit.loading"),
        error: t("actions.submit.error"),
        success: t("actions.submit.success")
      })

    cancelEdit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col p-10 gap-4 h-full">

          <div className="flex justify-between flex-col gap-4 lg:flex-row">
            <div>
              <div className="text-3xl font-bold">{t("title")}</div>
              <div className="text-muted">{t("description")}</div>
            </div>

            <Buttons patient={patient} isPending={isPending}></Buttons>
          </div>

          <div className="flex gap-4 p-4 rounded-md bg-primary items-center shadow-sm ">
            <Avatar className="h-full aspect-square w-auto text-2xl" letters={patient.name[0] + patient.surname[0]} />
            <div className="flex flex-col gap-4 w-full overflow-hidden">
              <div className="flex justify-between overflow-hidden items-start lg:flex-row flex-col gap-4">
                <div className="space-y-1 overflow-hidden w-full">
                  <div className="text-xl font-semibold">{`${patient.name} ${patient.surname}`}</div>
                  <div className="text-muted text-sm text-nowrap overflow-hidden text-ellipsis">
                    {t("id", { id: patient.patient_id })}
                  </div>
                </div>
                {<StatusBadge statusKey={patient.status} status={t(`status.${patient.status}`)} />}
              </div>
              <div className="flex gap-12">
                <div className="flex gap-2 items-center text-sm">
                  <User className="text-secondary" size={20}></User>
                  {t("age", {
                    age: differenceInYears(new Date(), parse(patient.date_of_birth, "dd.MM.yyyy", new Date()))
                  })}
                </div>
                <div className="flex gap-2 items-center text-sm">
                  <Activity className="text-secondary" size={20}></Activity>
                  {t(`gender.${ patient.gender}`)}
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