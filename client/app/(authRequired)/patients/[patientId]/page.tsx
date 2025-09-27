import Avatar from "@/components/ui/avatar"
import { getPatient } from "@/lib/data/server/patient"
import { Patient } from "@/lib/types/patient"
import { Activity, Clock, User } from "lucide-react"
import StatusBadge from "@/components/ui/status-badge";
import { PatientTabs } from "@/components/pages/patients/patient/patient-tabs";

const patient: Patient = {
  "patient_id": "68d5cceed8fd7cf0527b6347",
  "name": "Vladyslav",
  "surname": "Verbovetskyi",
  "email": "me@g.com",
  "phone": "+48793894949",
  "last_visit": "2025-09-26T01:14:54.004Z",
  "status": "Recovered",
  "gender": "Female",
  "age": 34
}

export default async function PatientPage({ params }: { params: Promise<{ patientId: Patient["patient_id"] }> }) {
  const patientId = (await params).patientId
  // const patient = await getPatient(patientId)
  return (
    <div className="flex flex-col p-10 gap-8">

      <div className="">
        <div className="text-3xl font-bold">Patient Details</div>
        <div className="text-muted">Comprehensive patient information and records</div>
      </div>

      <div className="flex gap-4 p-4 rounded-md bg-primary items-center border">
        <Avatar className="h-full aspect-square w-auto text-2xl" letters={patient.name[0] + patient.surname[0]}></Avatar>
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
  )
}