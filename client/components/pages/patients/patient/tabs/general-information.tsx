'use client'

import EditableField from "@/components/ui/editable-field";
import { GENDER, STATUS } from "@/lib/constants";
import { Patient } from "@/lib/types/patient";
import { Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GeneralInformation({ patient, isEditing }: { patient: Patient, isEditing: boolean }) {
  const t = useTranslations("PatientPage.tabs.generalInformation")

  return (
    <div className="flex gap-6 flex-wrap lg:flex-nowrap">
      <div className="rounded-md p-4 shadow-sm w-full space-y-6 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <User size={20} className="text-secondary"></User>
          {t(`personalInformation.label`)}
        </div>

        <div className="space-y-4">

          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`personalInformation.fullNameLabel`)}</div>
            {isEditing ? (
              <div className={"flex gap-2"}>
                <EditableField text={patient.name} isEditing={isEditing} name="name"></EditableField>
                <EditableField text={patient.surname} isEditing={isEditing} name="surname"></EditableField>
              </div>
            ) : (
              <div className="text-muted">{patient.name} {patient.surname}</div>
            )}
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`personalInformation.genderLabel`)}</div>
            <EditableField text={t(`personalInformation.gender.${patient.gender}`)} isEditing={isEditing} name="gender" inputType="select" selectItems={GENDER.map((gender) => [gender, t(`personalInformation.gender.${gender}`)])}></EditableField>
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`personalInformation.statusLabel`)}</div>
            <EditableField text={t(`personalInformation.status.${patient.status}`)} isEditing={isEditing} name="status" selectItems={STATUS.map((status) => [status, t(`personalInformation.status.${status}`)])} inputType="select"></EditableField>
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`personalInformation.dateOfBirthLabel`)}</div>
            <EditableField text={patient.date_of_birth} isEditing={isEditing} name="date_of_birth" type="calendar"></EditableField>
          </div>

        </div>
      </div>

      <div className="rounded-md p-4 shadow-sm w-full space-y-6 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <Phone size={20} className="text-secondary"></Phone>
          {t(`contactInformation.label`)}
        </div>

        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`contactInformation.emailLabel`)}</div>
            <EditableField text={patient.email} isEditing={isEditing} name="email"></EditableField>
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">{t(`contactInformation.phoneLabel`)}</div>
            <EditableField text={patient.phone ?? "No phone was provided"} isEditing={isEditing} name="phone"></EditableField>
          </div>
        </div>

      </div>
    </div>
  )
}