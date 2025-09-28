import { getPatient } from "@/lib/data/server/patient"
import { Patient } from "@/lib/types/patient"
import PatientForm from "@/components/pages/patients/patient/patient-form";

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
  return <PatientForm patient={patient}></PatientForm>
}