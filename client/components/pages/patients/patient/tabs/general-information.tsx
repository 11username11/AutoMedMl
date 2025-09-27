import { Patient } from "@/lib/types/patient";
import { Phone, User } from "lucide-react";

export default function GeneralInformation({ patient }: { patient: Patient }) {
  return (
    <div className="flex gap-6">
      <div className="rounded-md p-4 border w-full space-y-6 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <User size={20} className="text-secondary"></User>
          Personal Information
        </div>

        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold">Full Name</div>
            <div className="text-muted">{patient.name} {patient.surname}</div>
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">Gender</div>
            <div className="text-muted">{patient.gender}</div>
          </div>
          
        </div>
      </div>

      <div className="rounded-md p-4 border w-full space-y-6 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <Phone size={20} className="text-secondary"></Phone>
          Contact Information
        </div>

        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold">Email</div>
            <div className="text-muted">{patient.email}</div>
          </div>

          <div className="text-sm space-y-1">
            <div className="font-semibold">Phone</div>
            <div className="text-muted">{patient.phone ?? "No phone was provided"}</div>
          </div>
        </div>

      </div>
    </div>
  )
}