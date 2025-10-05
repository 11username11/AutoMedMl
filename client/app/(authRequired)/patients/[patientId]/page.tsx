import { getPatient } from "@/lib/data/server/patient"
import { Patient } from "@/lib/types/patient"
import PatientForm from "@/components/pages/patients/patient/patient-form";
import { notFound } from "next/navigation";

export default async function PatientPage({ params }: { params: Promise<{ patientId: Patient["patient_id"] }> }) {
  const patientId = (await params).patientId
  const patient = await getPatient(patientId)

  if (!patient) notFound()

  return <PatientForm patient={patient}></PatientForm>
}