import Avatar from "@/components/ui/avatar";
import { getPatient } from "@/lib/data/server/patient";

export default async function Details({ params }: { params: Promise<{ patientId: string }> }) {
  const patientId = (await params).patientId
  const patient = await getPatient(patientId)

  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="p-4">
        <div className="text-3xl font-bold">Patient Details</div>
        <div className="text-muted">Comprehensive patient information and records</div>
      </div>

      <div>
        <Avatar letters={`${patient?.name } ${patient?.surname}`}></Avatar>
      </div>
    </div>
  )
}