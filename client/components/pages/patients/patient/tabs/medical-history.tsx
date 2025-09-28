import EditableField from "@/components/ui/editable-field";
import { Patient } from "@/lib/types/patient";
import { FileText, Heart, Stethoscope, User } from "lucide-react";

export default function MedicalHistory({ patient, isEditing }: { patient: Patient, isEditing: boolean }) {
  return (
    <div className="space-y-6">
      <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <FileText size={20} className="text-secondary"></FileText>
          Medical History
        </div>

        <div className="text-muted text-sm">
          <EditableField text={patient?.medical_history} isEditing={isEditing} name="medical_history" type="textarea"></EditableField>
        </div>

      </div>

      <div className="flex gap-6">
        <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

          <div className="flex gap-2 items-center text-xl font-semibold">
            <Heart size={20} className="text-secondary"></Heart>
            Allergies
          </div>

          <div className="text-muted text-sm">
            <EditableField text={patient?.medical_history} isEditing={isEditing} name="allergies" type="textarea"></EditableField>
          </div>

        </div>

        <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

          <div className="flex gap-2 items-center text-xl font-semibold">
            <Stethoscope size={20} className="text-secondary"></Stethoscope>
            Current Medications
          </div>

          <div className="text-muted text-sm">
            <EditableField text={patient?.medical_history} isEditing={isEditing} name="medications" type="textarea"></EditableField>
          </div>

        </div>
      </div>
    </div>
  )
}