'use client'

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/ui/input-field"
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import SubmitButton from "@/components/ui/submit-btn";
import { GENDER, STATUS } from "@/lib/constants";
import { PatientSchema } from "@/lib/schemas/patient";
import { useTranslations } from "next-intl";
import { isFieldRequired } from "@/lib/utils";

export default function NewCase() {
  const t = useTranslations("AddPatientPage")

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
      gender: "female",
      status: "active treatment",
      medical_history: ""
    }
  })

  function onSubmit(data: z.infer<typeof PatientSchema>) {
    toast.promise(mutateAsync(data), {
      loading: t("form.submit.loading"),
      error: t("form.submit.error"),
      success: t("form.submit.success")
    })
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    router.back()
  }

  return (
    <div className="flex flex-col p-10 gap-8">
      <div>
        <div className="text-3xl font-bold">{t("title")}</div>
        <div className="text-muted">{t("description")}</div>
      </div>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-md flex flex-col gap-4 w-full">
          <div className="flex gap-4 lg:items-start lg:flex-row flex-col w-full">
            <div className="space-y-4 flex-1">
              <InputField
                name={"name"}
                label={t("form.firstNameLabel")}
                type="text"
                placeholder="Enter first name"
                isRequired={isFieldRequired(PatientSchema, "name")}
              />

              <InputField
                name="surname"
                label={t("form.lastNameLabel")}
                type="text"
                placeholder="Enter last name"
                isRequired={isFieldRequired(PatientSchema, "surname")}
              />

              <InputField
                name="email"
                label={t("form.emailLabel")}
                type="email"
                placeholder="Enter email address"
                isRequired={isFieldRequired(PatientSchema, "email")}
              />

              <InputField
                name="phone"
                label={t("form.phoneLabel")}
                type="text"
                placeholder="Enter phone number"
                isRequired={isFieldRequired(PatientSchema, "phone")}
              />

              <div className="flex gap-4 items-start flex-wrap">
                <InputField
                  name="date_of_birth"
                  label={t("form.dateOfBirthLabel")}
                  placeholder="DD.MM.YYYY"
                  inputType="calendar"
                  formItemClassName="min-w-fit"
                  isRequired={isFieldRequired(PatientSchema, "date_of_birth")}
                />

                <InputField
                  name="gender"
                  label={t("form.genderLabel")}
                  inputType="select"
                  className="w-full cursor-pointer bg-primary"
                  formItemClassName="flex-1"
                  selectItems={GENDER.map((gender) => [gender, t(`form.gender.${gender}`)])}
                  isRequired={isFieldRequired(PatientSchema, "gender")}>
                </InputField>

                <InputField
                  name="status"
                  label={t("form.statusLabel")}
                  inputType="select"
                  className="w-full cursor-pointer bg-primary"
                  formItemClassName="flex-1"
                  selectItems={STATUS.map((status) => [status, t(`form.status.${status}`)])}
                  isRequired={isFieldRequired(PatientSchema, "status")}>
                </InputField>
              </div>
            </div>

            <InputField
              name="medical_history"
              label={t("form.medicalHistoryLabel")}
              inputType="textarea"
              placeholder="Enter relevant medical history, allergies, medications, etc."
              className="resize-none w-full bg-primary h-60"
              formItemClassName="flex flex-col"
              isRequired={isFieldRequired(PatientSchema, "medical_history")}>
            </InputField>

          </div>

          <div className="flex gap-4 text-sm font-semibold ">
            <SubmitButton className="w-auto" isPending={isPending}>
              <div className="flex items-center justify-center gap-2">
                <Save strokeWidth={2.5} size={16}></Save>
                {t("form.submitButton")}
              </div>
            </SubmitButton>
            <button className="h-10 px-6 bg-primary border rounded-md cursor-pointer hover:bg-primary-foreground duration-200" onClick={handleCancel}>{t("form.cancelButton")}</button>
          </div>
        </form>
      </Form>

    </div>
  )
}