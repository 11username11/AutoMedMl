import { Patient } from "@/lib/types/patient";
import { FileText, Heart, Stethoscope, User } from "lucide-react";

export default function MedicalHistory({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-6">
      <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <FileText size={20} className="text-secondary"></FileText>
          Medical History
        </div>

        <div className="text-muted text-sm">
          {patient?.medical_history ?? "-"}
        </div>

      </div>

      <div className="flex gap-6">
        <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

          <div className="flex gap-2 items-center text-xl font-semibold">
            <Heart size={20} className="text-secondary"></Heart>
            Allergies
          </div>

          <div className="text-muted text-sm">
            {patient?.medical_history ?? "-"}
          </div>

        </div>

        <div className="rounded-md p-4 border w-full space-y-4 bg-primary">

          <div className="flex gap-2 items-center text-xl font-semibold">
            <Stethoscope size={20} className="text-secondary"></Stethoscope>
            Current Medications
          </div>

          <div className="text-muted text-sm">
            {patient?.medical_history ?? "-"}
          </div>

        </div>
      </div>
    </div>
  )
}